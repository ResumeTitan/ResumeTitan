<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ResumeType } from '$types';
    import { formatDateFull } from '$utils';

    export let resume: ResumeType;

    const dispatch = createEventDispatcher<{
        edit: string;
        delete: string;
    }>();

    $: displayName = resume.name || 'Untitled Resume';
    $: ownerName = resume.basics?.name || 'No name';
</script>

<div class="group relative bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Preview Area -->
    <div class="aspect-[210/297] bg-gray-50 p-4 overflow-hidden">
        <div class="transform scale-[0.25] origin-top-left w-[400%] h-[400%]">
            <!-- Simplified preview -->
            <div class="bg-white p-8 text-black">
                <h2 class="text-2xl font-bold mb-2">{ownerName}</h2>
                {#if resume.basics?.label}
                    <p class="text-gray-600">{resume.basics.label}</p>
                {/if}
                {#if resume.basics?.email}
                    <p class="text-sm text-gray-500 mt-2">{resume.basics.email}</p>
                {/if}

                {#if resume.work && resume.work.length > 0}
                    <div class="mt-4">
                        <h3 class="font-bold border-b border-gray-300 pb-1 mb-2">Experience</h3>
                        {#each resume.work.slice(0, 2) as job}
                            <p class="text-sm">{job.position} at {job.name}</p>
                        {/each}
                    </div>
                {/if}

                {#if resume.education && resume.education.length > 0}
                    <div class="mt-4">
                        <h3 class="font-bold border-b border-gray-300 pb-1 mb-2">Education</h3>
                        {#each resume.education.slice(0, 2) as edu}
                            <p class="text-sm">{edu.studyType} - {edu.institution}</p>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Info Bar -->
    <div class="p-4 border-t border-gray-200">
        <h3 class="font-medium text-gray-900 truncate">{displayName}</h3>
        <p class="text-sm text-gray-500">Theme: {resume.theme}</p>
    </div>

    <!-- Hover Actions -->
    <button
        type="button"
        class="dashboard-edit-button w-10 h-10 top-2 right-14"
        on:click={() => dispatch('edit', resume._id)}
        aria-label="Edit resume"
    >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    </button>

    <button
        type="button"
        class="dashboard-delete-button w-10 h-10 top-2 right-2"
        on:click={() => dispatch('delete', resume._id)}
        aria-label="Delete resume"
    >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    </button>
</div>
