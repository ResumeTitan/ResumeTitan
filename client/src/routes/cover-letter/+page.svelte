<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Button from '$components/ui/Button.svelte';
    import Spinner from '$components/ui/Spinner.svelte';
    import Alert from '$components/ui/Alert.svelte';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import FormDropdown from '$components/forms/FormDropdown.svelte';
    import { authStore } from '$stores/auth';
    import { api } from '$lib/api/client';
    import type { CoverLetterType, ResumeType } from '$lib/types';

    let userResumes: ResumeType[] = [];
    let isLoading = false;
    let errorMessage = '';
    let showSaveMessage = false;
    let inputMode: 'manual' | 'link' = 'manual';
    let jobUrl = '';

    let coverLetter: CoverLetterType = {
        _id: '',
        letter: '',
        name: '',
        date: new Date(),
        jobDescription: '',
        jobTitle: '',
        city: '',
        state: '',
        company: '',
        resumeId: '',
    };

    async function loadCoverLetter(id: string) {
        try {
            const response = await api.get<{ coverLetter: CoverLetterType }>(`/cover-letter/${id}`);
            return response.coverLetter;
        } catch {
            console.error('Error loading cover letter');
        }
        return null;
    }

    async function loadResumes(userId: string) {
        try {
            const response = await api.get<{ resumes: ResumeType[] }>(`/resume/user?userId=${userId}`);
            const resumesIn = response.resumes;

            if (resumesIn && resumesIn.length > 0) {
                userResumes = resumesIn;
                return resumesIn[0]._id;
            } else {
                userResumes = [];
                return null;
            }
        } catch {
            console.error('Error loading resumes');
            return null;
        }
    }

    onMount(async () => {
        const user = $authStore.user;
        if (!user) {
            authStore.openAuthModal();
            return;
        }

        let newCoverLetter = { ...coverLetter };

        // Check if editing existing cover letter
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            const loaded = await loadCoverLetter(id);
            if (loaded) {
                newCoverLetter = { ...loaded, _id: id };
            }
        }

        // Set default name and load resumes
        if (newCoverLetter.name === '') {
            newCoverLetter.name = user.fullName || 'Your Name';
        }

        const resumeId = await loadResumes(user.id);
        if (resumeId && !newCoverLetter.resumeId) {
            newCoverLetter.resumeId = resumeId;
        }

        coverLetter = newCoverLetter;
    });

    async function handleGenerateCoverLetter() {
        const user = $authStore.user;
        if (!user) {
            errorMessage = 'User not found';
            return;
        }

        try {
            isLoading = true;
            errorMessage = '';

            const payload: Record<string, unknown> = { clerkId: user.id };
            if (inputMode === 'link') {
                payload.coverLetter = { ...coverLetter, jobUrl, useJobUrl: true };
            } else {
                payload.coverLetter = { ...coverLetter, useJobUrl: false };
            }

            const response = await api.post<{ coverLetter: CoverLetterType }>('/cover-letter', payload);
            coverLetter = response.coverLetter;
        } catch (error: unknown) {
            console.error(error);
            const err = error as { status?: number; code?: string };
            if (inputMode === 'link' && (err.status === 400 || err.code === 'URL_PARSE_ERROR')) {
                errorMessage = 'Failed to load job, please enter manually or try again later';
                inputMode = 'manual';
            } else {
                errorMessage = 'An error occurred while generating cover letter';
            }
        } finally {
            isLoading = false;
        }
    }

    async function handleSaveCoverLetter(exit: boolean) {
        const user = $authStore.user;
        if (!user) {
            errorMessage = 'User not found';
            return;
        }

        try {
            isLoading = true;
            const response = await api.put<{ coverLetter: CoverLetterType }>(`/cover-letter/${coverLetter._id}`, coverLetter);
            coverLetter = response.coverLetter;
            showSaveMessage = true;
            setTimeout(() => (showSaveMessage = false), 2000);

            if (exit) {
                goto('/dashboard');
            }
        } catch {
            console.error('Error saving cover letter');
            errorMessage = 'Failed to save cover letter';
        } finally {
            isLoading = false;
        }
    }

    function handlePrint() {
        window.print();
    }

    function formatDate(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function handleResumeSelect(e: CustomEvent<string>) {
        const selectedResume = userResumes.find(res => res.name === e.detail);
        if (selectedResume) {
            coverLetter.resumeId = selectedResume._id;
        }
    }
</script>

<svelte:head>
    <title>Cover Letter Generator - ResumeTitan</title>
</svelte:head>

<div class="page-container bg-white min-h-screen">
    <div class="flex flex-col lg:flex-row p-4 gap-8">
        <!-- Form Section -->
        <div class="flex-1 w-full">
            <div class="flex justify-center w-full">
                <div class="form-container mt-1 max-w-lg w-full">
                    <div class="form-text-main mb-4">Cover Letter Information</div>

                    <!-- Profile Info Section -->
                    <div class="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
                        <div class="font-bold mb-2">Profile Information</div>
                        <FormField id="name" label="Name" bind:value={coverLetter.name} />
                        <div class="grid grid-cols-2 gap-4">
                            <FormField id="city" label="City" bind:value={coverLetter.city} />
                            <FormField id="state" label="State" bind:value={coverLetter.state} />
                        </div>
                    </div>

                    <!-- AI Input Section -->
                    <div class="mb-6 p-4 rounded bg-white border border-gray-200">
                        <div class="font-bold mb-2">Job Information for AI</div>

                        <!-- Tab buttons -->
                        <div class="flex mb-4 gap-0.5">
                            <button
                                type="button"
                                class="flex-1 py-1.5 rounded-t-lg font-bold text-lg transition-colors {inputMode === 'manual'
                                    ? 'bg-main-green text-white'
                                    : 'bg-gray-200 text-main-green'}"
                                on:click={() => (inputMode = 'manual')}
                            >
                                Job Title/Description
                            </button>
                            <button
                                type="button"
                                class="flex-1 py-1.5 rounded-t-lg font-bold text-lg transition-colors {inputMode === 'link'
                                    ? 'bg-main-green text-white'
                                    : 'bg-gray-200 text-main-green'}"
                                on:click={() => (inputMode = 'link')}
                            >
                                Job URL
                            </button>
                        </div>

                        <!-- Error Message -->
                        {#if errorMessage}
                            <Alert variant="error" dismissible onDismiss={() => (errorMessage = '')}>
                                {errorMessage}
                            </Alert>
                        {/if}

                        {#if inputMode === 'manual'}
                            <FormField id="jobTitle" label="Job Title" bind:value={coverLetter.jobTitle} />
                            <FormField id="company" label="Company" bind:value={coverLetter.company} />
                            <FormArea id="jobDescription" label="Job Description" bind:value={coverLetter.jobDescription} />
                        {:else}
                            <FormField
                                id="jobUrl"
                                label="Job Posting URL"
                                bind:value={jobUrl}
                                placeholder="Paste the job posting link here..."
                            />
                        {/if}

                        {#if userResumes && userResumes.length > 0}
                            <FormDropdown
                                id="resume"
                                label="Select Resume"
                                value={userResumes.find(r => r._id === coverLetter.resumeId)?.name || ''}
                                options={userResumes.map(resume => ({
                                    value: resume.name,
                                    label: resume.name,
                                }))}
                                on:change={handleResumeSelect}
                            />
                        {/if}
                    </div>

                    {#if coverLetter.letter}
                        <FormArea id="letter" label="Cover Letter" bind:value={coverLetter.letter} rows={15} />
                    {/if}

                    <div class="p-4 space-y-3">
                        <Button variant="primary" fullWidth on:click={handleGenerateCoverLetter}>
                            {isLoading ? 'Writing...' : 'Write Cover Letter with AI'}
                        </Button>

                        {#if coverLetter.letter}
                            <Button variant="secondary" fullWidth on:click={handlePrint}>Print / Download PDF</Button>

                            <Button variant="secondary" fullWidth on:click={() => handleSaveCoverLetter(false)}>Save Cover Letter</Button>

                            <Button variant="primary" fullWidth on:click={() => handleSaveCoverLetter(true)}>Save and Exit</Button>
                        {/if}
                    </div>

                    {#if showSaveMessage}
                        <div
                            class="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-6 py-3 rounded text-base whitespace-nowrap animate-fade-in-out border border-dark-green z-50 shadow-lg font-semibold"
                        >
                            Cover Letter Saved!
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Cover Letter Preview -->
        <div class="lg:ml-8 flex items-start justify-center print:ml-0">
            <div
                id="print-root"
                class="cover-letter-container w-[8.5in] max-w-[8.5in] border border-gray-300 shadow-md bg-white p-2.5 print:border-0 print:shadow-none"
            >
                <div class="p-5 font-serif">
                    <p>{coverLetter.name}</p>
                    <p>{`${coverLetter.city || '[City]'}, ${coverLetter.state || '[State]'}`}</p>
                    <p>{formatDate(coverLetter.date)}</p>
                    <br />
                    <p>{coverLetter.jobTitle || '[Job Title]'}</p>
                    <p>{coverLetter.company || '[Company Name]'}</p>
                    <br />
                    {#if coverLetter.letter}
                        {#each coverLetter.letter.split('\n') as paragraph}
                            <p>{paragraph.trim() !== '' ? paragraph : '\u00A0'}</p>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>

    {#if isLoading}
        <Spinner />
    {/if}
</div>

<style>
    @media print {
        :global(body *) {
            display: none !important;
        }
        #print-root,
        #print-root * {
            display: block !important;
            position: static !important;
            width: 100% !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            transform: none !important;
        }
    }
</style>
