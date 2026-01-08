<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { resumeApi } from '$api';
    import { getFontFamily } from '$utils';
    import type { ResumeType } from '$types';
    import Spinner from '$components/ui/Spinner.svelte';
    import Button from '$components/ui/Button.svelte';

    // Template imports
    import ProfessionalResume from '$components/resume/templates/professional/Resume.svelte';
    import MacchiatoResume from '$components/resume/templates/macchiato/Resume.svelte';
    import StrattonResume from '$components/resume/templates/stratton/Resume.svelte';
    import OnepageResume from '$components/resume/templates/onepage/Resume.svelte';
    import StudentClassicResume from '$components/resume/templates/studentClassic/Resume.svelte';
    import AcademicModernResume from '$components/resume/templates/academicModern/Resume.svelte';

    let resume: ResumeType | null = null;
    let loading = true;
    let error = '';

    const templates: Record<string, typeof ProfessionalResume> = {
        professional: ProfessionalResume,
        harvard: ProfessionalResume,
        macchiato: MacchiatoResume,
        stratton: StrattonResume,
        onepage: OnepageResume,
        'student-classic': StudentClassicResume,
        'academic-modern': AcademicModernResume,
    };

    $: resumeId = $page.params.id || '';
    $: CurrentTemplate = resume ? (templates[resume.theme] || ProfessionalResume) : ProfessionalResume;
    $: fontFamily = resume ? getFontFamily(resume.font) : 'inherit';

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

    function closeTab() {
        if (browser) {
            window.close();
        }
    }
</script>

<svelte:head>
    <title>{resume?.basics?.name || 'Resume'} - Print</title>
    <style>
        @page {
            size: letter;
            margin: 0;
        }

        @media print {
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 8.5in;
                height: 11in;
                overflow: visible !important;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</svelte:head>

<!-- Print Controls (hidden when printing) -->
<div class="no-print fixed top-4 right-4 z-50 flex gap-2 bg-white shadow-lg rounded-lg p-2">
    <Button variant="ghost" on:click={closeTab}>Close</Button>
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
    <div class="print-page resume-container theme-{resume.theme}" style="font-family: {fontFamily};">
        <svelte:component this={CurrentTemplate} {resume} />
    </div>
{/if}

<style>
    .print-page {
        width: 8.5in;
        min-height: 11in;
        margin: 0 auto;
        background: white;
        color: black;
        box-sizing: border-box;
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
            padding: 0;
            box-shadow: none;
            width: 100%;
            min-height: auto;
        }
    }
</style>
