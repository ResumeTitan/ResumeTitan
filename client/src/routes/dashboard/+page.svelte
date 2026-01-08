<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { resumeApi, coverLetterApi, interviewApi, workshopApi } from '$api';
    import { authStore, isAuthenticated } from '$stores';
    import type { ResumeType, CoverLetterType, InterviewType, WorkshopType } from '$types';
    import Button from '$components/ui/Button.svelte';
    import Spinner from '$components/ui/Spinner.svelte';
    import ResumeContainer from '$lib/components/resume/ResumeContainer.svelte';

    let resumes: ResumeType[] = [];
    let coverLetters: CoverLetterType[] = [];
    let interviews: InterviewType[] = [];
    let ownedWorkshops: WorkshopType[] = [];
    let sharedWorkshops: WorkshopType[] = [];
    let loading = true;
    let error = '';
    let hasAttemptedLoad = false;

    onMount(async () => {
        if (!$isAuthenticated) {
            authStore.openAuthModal();
            return;
        }

        await loadData();
    });

    // Watch for authentication changes and load data when user logs in
    // Only trigger once per authentication session
    $: if ($isAuthenticated && !hasAttemptedLoad) {
        loadData();
    }

    async function loadData() {
        if (hasAttemptedLoad && !error) return; // Prevent re-triggering unless retrying after error

        loading = true;
        error = '';
        hasAttemptedLoad = true;

        try {
            const [resumeRes, coverLetterRes, interviewRes, workshopRes] = await Promise.all([
                resumeApi.getByUser($authStore.userId),
                coverLetterApi.getAll(),
                interviewApi.getAll(),
                workshopApi.getAll(),
            ]);

            resumes = resumeRes.resumes || [];
            coverLetters = coverLetterRes.coverLetters || [];
            interviews = interviewRes.interviews || [];
            ownedWorkshops = workshopRes.owned || [];
            sharedWorkshops = workshopRes.shared || [];
            error = '';
        } catch (e: any) {
            console.error('Dashboard load error:', e);
            if (e?.message?.includes('fetch') || e?.code === 'TIMEOUT' || e?.name === 'TypeError') {
                error = 'Unable to connect to the server. Please check your connection and try again.';
            } else {
                error = e?.message || 'Failed to load your data. Please try again.';
            }
        } finally {
            loading = false;
        }
    }

    async function createNewResume() {
        try {
            const newResume = await resumeApi.create({});
            goto(`/resume/${newResume._id}`);
        } catch (e) {
            error = 'Failed to create resume. Please try again.';
        }
    }

    function editResume(id: string) {
        goto(`/resume/${id}`);
    }

    async function deleteResume(id: string) {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await resumeApi.delete(id);
            resumes = resumes.filter(r => r._id !== id);
        } catch (e) {
            error = 'Failed to delete resume. Please try again.';
        }
    }

    async function deleteWorkshop(id: string) {
        if (!confirm('Are you sure you want to delete this workshop?')) return;

        try {
            await workshopApi.delete(id);
            ownedWorkshops = ownedWorkshops.filter(w => w._id !== id);
        } catch (e) {
            error = 'Failed to delete workshop. Please try again.';
        }
    }

    $: totalWorkshops = ownedWorkshops.length + sharedWorkshops.length;
</script>

<svelte:head>
    <title>Dashboard - ResumeTitan</title>
</svelte:head>

<div class="page-container">
    <div class="page-header max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

        {#if loading}
            <div class="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        {:else if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
            </div>
        {:else}
            <!-- My Workshops Section -->
            <section class="dashboard-container">
                <div class="dashboard-header flex justify-between items-center">
                    <span>My Resumes ({ownedWorkshops.length})</span>
                    <a href="/workshop">
                        <Button size="sm">+ New Resume</Button>
                    </a>
                </div>

                <div class="p-4">
                    {#if ownedWorkshops.length === 0}
                        <div class="text-center py-8">
                            <p class="text-gray-500 mb-4">No workshops yet.</p>
                            <a href="/workshop">
                                <Button>Start Workshop</Button>
                            </a>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each ownedWorkshops as workshop (workshop._id)}
                                <a href="/workshop/{workshop._id}" class="block">
                                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <div class="flex items-start justify-between">
                                            <h3 class="font-medium truncate flex-1">{workshop.name || 'Untitled Workshop'}</h3>
                                            {#if workshop.shareEnabled}
                                                <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                    Shared
                                                </span>
                                            {/if}
                                        </div>
                                        <p class="text-sm text-gray-500 mt-1">
                                            {workshop.comments?.length || 0} comments
                                        </p>
                                        <p class="text-sm text-gray-400">
                                            {workshop.participants?.length || 1} participant{workshop.participants?.length !== 1 ? 's' : ''}
                                        </p>
                                        <button
                                            class="mt-2 text-xs text-red-500 hover:text-red-700"
                                            on:click|preventDefault|stopPropagation={() => deleteWorkshop(workshop._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Cover Letters Section -->
            <section class="dashboard-container">
                <div class="dashboard-header flex justify-between items-center">
                    <span>Cover Letters ({coverLetters.length})</span>
                    <a href="/cover-letter">
                        <Button size="sm">+ New Cover Letter</Button>
                    </a>
                </div>

                <div class="p-4">
                    {#if coverLetters.length === 0}
                        <div class="text-center py-8">
                            <p class="text-gray-500 mb-4">No cover letters yet.</p>
                            <a href="/cover-letter">
                                <Button>Create Cover Letter</Button>
                            </a>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each coverLetters as letter (letter._id)}
                                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 class="font-medium truncate">{letter.name || 'Untitled'}</h3>
                                    <p class="text-sm text-gray-500">{letter.company || 'No company'}</p>
                                    <p class="text-sm text-gray-400">{letter.jobTitle || 'No position'}</p>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Interviews Section -->
            <section class="dashboard-container">
                <div class="dashboard-header flex justify-between items-center">
                    <span>Interview Prep ({interviews.length})</span>
                    <a href="/interview">
                        <Button size="sm">+ New Interview</Button>
                    </a>
                </div>

                <div class="p-4">
                    {#if interviews.length === 0}
                        <div class="text-center py-8">
                            <p class="text-gray-500 mb-4">No interview prep sessions yet.</p>
                            <a href="/interview">
                                <Button>Start Interview Prep</Button>
                            </a>
                        </div>
                    {:else}
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each interviews as interview (interview._id)}
                                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 class="font-medium truncate">{interview.jobTitle || 'Untitled'}</h3>
                                    <p class="text-sm text-gray-500">
                                        {interview.questions?.length || 0} questions
                                    </p>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Shared With Me Section -->
            {#if sharedWorkshops.length > 0}
                <section class="dashboard-container">
                    <div class="dashboard-header flex justify-between items-center bg-blue-700">
                        <span>Shared With Me ({sharedWorkshops.length})</span>
                    </div>

                    <div class="p-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each sharedWorkshops as workshop (workshop._id)}
                                <a href="/workshop/{workshop._id}" class="block">
                                    <div
                                        class="border-2 border-blue-200 bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <h3 class="font-medium truncate">{workshop.name || 'Untitled Workshop'}</h3>
                                        <p class="text-sm text-blue-600 mt-1">
                                            Shared by {workshop.ownerName || 'Unknown'}
                                        </p>
                                        <p class="text-sm text-gray-500 mt-1">
                                            {workshop.comments?.length || 0} comments
                                        </p>
                                        <p class="text-sm text-gray-400">
                                            {workshop.participants?.length || 1} participant{workshop.participants?.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    </div>
                </section>
            {/if}
        {/if}
    </div>
</div>
