<script lang="ts">
    import { onMount } from 'svelte';
    import type { ResumeType } from '$types';
    import { getFontFamily } from '$utils';
    import { RESUME_CONFIG } from '$config';

    // Template imports
    import ProfessionalResume from './templates/professional/Resume.svelte';
    import MacchiatoResume from './templates/macchiato/Resume.svelte';
    import StrattonResume from './templates/stratton/Resume.svelte';
    import OnepageResume from './templates/onepage/Resume.svelte';
    import StudentClassicResume from './templates/studentClassic/Resume.svelte';
    import AcademicModernResume from './templates/academicModern/Resume.svelte';

    export let resume: ResumeType;
    export let scale = 1;
    export let autoScale = true;

    let containerElement: HTMLDivElement;
    let contentElement: HTMLDivElement;
    let calculatedScale = 1;

    const templates: Record<string, typeof ProfessionalResume> = {
        professional: ProfessionalResume,
        harvard: ProfessionalResume, // Uses same template
        macchiato: MacchiatoResume,
        stratton: StrattonResume,
        onepage: OnepageResume,
        'student-classic': StudentClassicResume,
        'academic-modern': AcademicModernResume,
    };

    $: CurrentTemplate = templates[resume.theme] || ProfessionalResume;
    $: fontFamily = getFontFamily(resume.font);
    $: themeClass = `theme-${resume.theme}`;

    // Calculate scale based on container width
    function calculateScale() {
        if (!autoScale || !containerElement || !contentElement) return;

        const containerWidth = containerElement.clientWidth;
        const pageWidth = RESUME_CONFIG.A4_WIDTH_MM * 3.7795275591; // mm to px (96 dpi)

        const newScale = Math.min(containerWidth / pageWidth, 1);
        calculatedScale = Math.max(newScale, RESUME_CONFIG.MIN_SCALE);
    }

    onMount(() => {
        if (autoScale) {
            calculateScale();

            const resizeObserver = new ResizeObserver(() => {
                calculateScale();
            });

            if (containerElement) {
                resizeObserver.observe(containerElement);
            }

            return () => {
                resizeObserver.disconnect();
            };
        }
    });

    $: effectiveScale = autoScale ? calculatedScale : scale;
</script>

<div bind:this={containerElement} class="resume-container-wrapper w-full flex justify-center overflow-hidden">
    <div
        bind:this={contentElement}
        class="resume-container {themeClass} bg-white shadow-lg"
        style="
			font-family: {fontFamily};
			transform: scale({effectiveScale});
			transform-origin: top center;
			width: {RESUME_CONFIG.A4_WIDTH_MM}mm;
			min-height: {RESUME_CONFIG.A4_HEIGHT_MM}mm;
		"
    >
        <svelte:component this={CurrentTemplate} {resume} />
    </div>
</div>

<style>
    .resume-container {
        background: white;
        color: black;
        line-height: 1.4;
    }

    @media print {
        .resume-container-wrapper {
            overflow: visible;
        }

        .resume-container {
            transform: none !important;
            box-shadow: none !important;
            width: 210mm !important;
            min-height: 297mm !important;
        }
    }
</style>
