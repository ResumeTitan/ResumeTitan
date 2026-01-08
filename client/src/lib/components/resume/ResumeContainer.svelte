<script lang="ts">
    import { onMount } from 'svelte';
    import type { ResumeType } from '$types';
    import { getFontFamily } from '$utils';
    import { RESUME_CONFIG } from '$config';
    import { applyTokens } from '$lib/utils/applyTokens';
    import { mergeWithDefaults } from '$lib/config/designTokenDefaults';

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
    export let enablePinchZoom = true;

    let containerElement: HTMLDivElement;
    let contentElement: HTMLDivElement;
    let scaleWrapperElement: HTMLDivElement;
    let calculatedScale = 1;

    // Export contentElement for design tokens editor
    export { contentElement as containerElement };
    let baseScale = 1;
    let userZoom = 1;
    let initialPinchDistance = 0;
    let initialUserZoom = 1;

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

    // Apply design tokens as CSS variables
    $: if (contentElement && resume.designTokens) {
        const tokens = mergeWithDefaults(resume.designTokens);
        applyTokens(contentElement, tokens);
    }

    // Calculate base scale based on container width
    function calculateScale() {
        if (!autoScale || !containerElement || !contentElement) return;

        const containerWidth = containerElement.clientWidth;
        const pageWidthPx = RESUME_CONFIG.LETTER_WIDTH_PX;

        const newScale = Math.min(containerWidth / pageWidthPx, 1);
        baseScale = Math.max(newScale, RESUME_CONFIG.MIN_SCALE);
        calculatedScale = baseScale * userZoom;
    }

    function getDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(e: TouchEvent) {
        if (!enablePinchZoom || e.touches.length !== 2) return;

        initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
        initialUserZoom = userZoom;
    }

    function handleTouchMove(e: TouchEvent) {
        if (!enablePinchZoom || e.touches.length !== 2 || initialPinchDistance === 0) return;

        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const pinchRatio = currentDistance / initialPinchDistance;

        const newZoom = initialUserZoom * pinchRatio;
        const maxZoom = RESUME_CONFIG.MAX_SCALE / baseScale;
        const minZoom = RESUME_CONFIG.MIN_SCALE / baseScale;

        userZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        calculatedScale = baseScale * userZoom;
    }

    function handleTouchEnd() {
        initialPinchDistance = 0;
    }

    function resetZoom() {
        userZoom = 1;
        calculatedScale = baseScale * userZoom;
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

    // Track content height for multi-page support
    let contentHeight = 0;
    let numPages = 1;
    let contentResizeObserver: ResizeObserver | null = null;

    $: if (contentElement && !contentResizeObserver) {
        contentResizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                contentHeight = entry.target.scrollHeight;
                numPages = Math.max(1, Math.ceil(contentHeight / RESUME_CONFIG.LETTER_HEIGHT_PX));
            }
        });
        contentResizeObserver.observe(contentElement);
    }

    $: effectiveScale = autoScale ? calculatedScale : scale;
    $: scaledWidth = RESUME_CONFIG.LETTER_WIDTH_PX * effectiveScale;
    // Use actual content height, but ensure at least one page height
    $: displayHeight = Math.max(contentHeight, RESUME_CONFIG.LETTER_HEIGHT_PX);
    $: scaledDisplayHeight = displayHeight * effectiveScale;

    // Generate page break positions
    $: pageBreaks = Array.from({ length: numPages - 1 }, (_, i) => (i + 1) * RESUME_CONFIG.LETTER_HEIGHT_PX);
</script>

<div
    bind:this={containerElement}
    class="resume-container-wrapper"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:dblclick={resetZoom}
    role="img"
    aria-label="Resume preview"
>
    <div
        bind:this={scaleWrapperElement}
        class="resume-scale-wrapper"
        style="height: {scaledDisplayHeight}px; width: {scaledWidth}px;"
    >
        <div
            bind:this={contentElement}
            class="resume-container {themeClass} bg-white shadow-lg"
            style="
                font-family: {fontFamily};
                transform: scale({effectiveScale});
                transform-origin: top left;
                width: {RESUME_CONFIG.LETTER_WIDTH_PX}px;
                min-height: {RESUME_CONFIG.LETTER_HEIGHT_PX}px;
                position: relative;
            "
        >
            <svelte:component this={CurrentTemplate} {resume} />

            <!-- Page break indicators (preview only) -->
            {#each pageBreaks as breakPosition}
                <div
                    class="page-break-indicator print:hidden"
                    style="top: {breakPosition}px;"
                />
            {/each}
        </div>
    </div>
</div>

<style>
    .page-break-indicator {
        position: absolute;
        left: 0;
        right: 0;
        height: 0;
        border-top: 2px dashed #cbd5e0;
        pointer-events: none;
        z-index: 1000;
    }

    .page-break-indicator::before {
        content: 'Page Break';
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background: white;
        padding: 0 8px;
        font-size: 11px;
        color: #718096;
        font-weight: 500;
    }
</style>
