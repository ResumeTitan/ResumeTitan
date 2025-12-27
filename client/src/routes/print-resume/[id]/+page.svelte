<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { resumeApi } from '$api';
    import type { ResumeType } from '$types';
    import ResumeContainer from '$components/resume/ResumeContainer.svelte';
    import Spinner from '$components/ui/Spinner.svelte';
    import Button from '$components/ui/Button.svelte';

    let resume: ResumeType | null = null;
    let loading = true;
    let error = '';

    $: resumeId = $page.params.id || '';

    onMount(async () => {
        if (resumeId) {
            await loadResume();
        }
    });

    async function loadResume() {
        if (!resumeId) return;
        loading = true;
        try {
            const response = await resumeApi.getById(resumeId);
            resume = response.resume;
        } catch (e) {
            error = 'Failed to load resume.';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function handlePrint() {
        if (browser) {
            window.print();
        }
    }

    function goBack() {
        if (browser) {
            window.history.back();
        }
    }
</script>

<svelte:head>
    <title>{resume?.basics?.name || 'Resume'} - Print</title>
    <style>
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</svelte:head>

<!-- Print Controls (hidden when printing) -->
<div class="no-print fixed top-4 right-4 z-50 flex gap-2 bg-white shadow-lg rounded-lg p-2">
    <Button variant="ghost" on:click={goBack}>Back</Button>
    <Button variant="primary" on:click={handlePrint}>Print / Save as PDF</Button>
</div>

{#if loading}
    <div class="flex items-center justify-center min-h-screen no-print">
        <Spinner size="lg" />
    </div>
{:else if error}
    <div class="flex items-center justify-center min-h-screen no-print">
        <p class="text-red-500">{error}</p>
    </div>
{:else if resume}
    <div class="print-page">
        <ResumeContainer {resume} autoScale={false} scale={1} />
    </div>
{/if}

<style>
    .print-page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
    }

    @media screen {
        .print-page {
            margin: 20px auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    }

    @media print {
        .print-page {
            margin: 0;
            box-shadow: none;
        }
    }
</style>
