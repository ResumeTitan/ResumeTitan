/**
 * Fit-to-Page Helper
 *
 * Intelligently tightens design tokens to fit resume content within a target page count
 * without breaking layout integrity or print fidelity.
 */

import type { DesignTokens, SpacingPreset, MarginPreset } from '$lib/types/designTokens';
import { TEXT_BOUNDS, FIT_TO_PAGE_SEQUENCE } from '$lib/config/designTokenDefaults';
import { clampTextValue } from '$lib/config/designTokenDefaults';

export interface FitToPageOptions {
	targetPages: 1 | 2; // Target page count
	maxIterations?: number; // Safety limit to prevent infinite loops
	onProgress?: (step: string, tokens: DesignTokens) => void; // Progress callback
}

export interface FitToPageResult {
	success: boolean;
	finalTokens: DesignTokens;
	stepsTaken: string[];
	overflow: boolean; // Whether content still overflows after all attempts
}

/**
 * Measure if resume content fits within target page count
 * @param containerElement - The resume container element
 * @param targetPages - Target page count (1 or 2)
 * @returns Whether content fits
 */
export function measureContentFit(containerElement: HTMLElement, targetPages: number): boolean {
	if (!containerElement) return true;

	// LETTER page height in pixels (11 inches at 96 DPI)
	const PAGE_HEIGHT_PX = 1056;
	const targetHeight = PAGE_HEIGHT_PX * targetPages;

	// Get the actual content height
	const contentHeight = containerElement.scrollHeight;

	// Allow 1% tolerance for rounding
	const tolerance = PAGE_HEIGHT_PX * 0.01;

	return contentHeight <= targetHeight + tolerance;
}

/**
 * Get current content overflow amount
 * @param containerElement - The resume container element
 * @param targetPages - Target page count
 * @returns Overflow in pixels (0 if fits)
 */
export function measureOverflow(containerElement: HTMLElement, targetPages: number): number {
	if (!containerElement) return 0;

	const PAGE_HEIGHT_PX = 1056;
	const targetHeight = PAGE_HEIGHT_PX * targetPages;
	const contentHeight = containerElement.scrollHeight;

	return Math.max(0, contentHeight - targetHeight);
}

/**
 * Main fit-to-page algorithm
 * Progressively tightens design tokens until content fits or floors are reached
 */
export async function fitToPage(
	initialTokens: DesignTokens,
	containerElement: HTMLElement,
	options: FitToPageOptions
): Promise<FitToPageResult> {
	const { targetPages, maxIterations = 20, onProgress } = options;

	let currentTokens = { ...initialTokens };
	const stepsTaken: string[] = [];

	// Check if already fits
	if (measureContentFit(containerElement, targetPages)) {
		return {
			success: true,
			finalTokens: currentTokens,
			stepsTaken: ['Content already fits'],
			overflow: false
		};
	}

	let iteration = 0;

	// Step 1: Tighten spacing presets
	const spacingSteps: Array<{
		path: keyof DesignTokens['spacing'];
		label: string;
	}> = [
		{ path: 'sectionGap', label: 'section gap' },
		{ path: 'itemGap', label: 'item gap' },
		{ path: 'bulletGap', label: 'bullet gap' }
	];

	for (const { path, label } of spacingSteps) {
		if (iteration >= maxIterations) break;

		const currentValue = currentTokens.spacing[path] as SpacingPreset;

		// Try tightening if not already at tightest
		if (currentValue === 'AIRY') {
			currentTokens = {
				...currentTokens,
				spacing: { ...currentTokens.spacing, [path]: 'NORMAL' }
			};
			stepsTaken.push(`Reduced ${label} to NORMAL`);
			onProgress?.(`Reducing ${label}`, currentTokens);

			// Wait for DOM update
			await waitForUpdate();

			if (measureContentFit(containerElement, targetPages)) {
				return {
					success: true,
					finalTokens: currentTokens,
					stepsTaken,
					overflow: false
				};
			}
			iteration++;
		}

		if (currentValue === 'NORMAL' || currentValue === 'AIRY') {
			currentTokens = {
				...currentTokens,
				spacing: { ...currentTokens.spacing, [path]: 'TIGHT' }
			};
			stepsTaken.push(`Reduced ${label} to TIGHT`);
			onProgress?.(`Reducing ${label}`, currentTokens);

			await waitForUpdate();

			if (measureContentFit(containerElement, targetPages)) {
				return {
					success: true,
					finalTokens: currentTokens,
					stepsTaken,
					overflow: false
				};
			}
			iteration++;
		}
	}

	// Step 2: Reduce font size (decrement by 0.25pt until floor of 9pt)
	while (currentTokens.text.baseSizePt > TEXT_BOUNDS.BASE_SIZE_PT.min && iteration < maxIterations) {
		const newSize = Math.max(
			TEXT_BOUNDS.BASE_SIZE_PT.min,
			currentTokens.text.baseSizePt - 0.25
		);

		currentTokens = {
			...currentTokens,
			text: { ...currentTokens.text, baseSizePt: newSize }
		};
		stepsTaken.push(`Reduced font size to ${newSize}pt`);
		onProgress?.('Reducing font size', currentTokens);

		await waitForUpdate();

		if (measureContentFit(containerElement, targetPages)) {
			return {
				success: true,
				finalTokens: currentTokens,
				stepsTaken,
				overflow: false
			};
		}
		iteration++;
	}

	// Step 3: Reduce line height (decrement by 0.02 until floor of 1.05)
	while (currentTokens.text.lineHeight > TEXT_BOUNDS.LINE_HEIGHT.min && iteration < maxIterations) {
		const newLineHeight = Math.max(
			TEXT_BOUNDS.LINE_HEIGHT.min,
			parseFloat((currentTokens.text.lineHeight - 0.02).toFixed(2))
		);

		currentTokens = {
			...currentTokens,
			text: { ...currentTokens.text, lineHeight: newLineHeight }
		};
		stepsTaken.push(`Reduced line height to ${newLineHeight}`);
		onProgress?.('Reducing line height', currentTokens);

		await waitForUpdate();

		if (measureContentFit(containerElement, targetPages)) {
			return {
				success: true,
				finalTokens: currentTokens,
				stepsTaken,
				overflow: false
			};
		}
		iteration++;
	}

	// Step 4: Reduce margins (only if not already at NARROW)
	const marginSequence: MarginPreset[] = ['WIDE', 'NORMAL', 'NARROW'];
	const currentMarginIndex = marginSequence.indexOf(currentTokens.page.marginPreset);

	for (let i = currentMarginIndex + 1; i < marginSequence.length && iteration < maxIterations; i++) {
		const newMargin = marginSequence[i];

		currentTokens = {
			...currentTokens,
			page: { ...currentTokens.page, marginPreset: newMargin }
		};
		stepsTaken.push(`Reduced margins to ${newMargin}`);
		onProgress?.('Reducing margins', currentTokens);

		await waitForUpdate();

		if (measureContentFit(containerElement, targetPages)) {
			return {
				success: true,
				finalTokens: currentTokens,
				stepsTaken,
				overflow: false
			};
		}
		iteration++;
	}

	// All floors reached - content still doesn't fit
	return {
		success: false,
		finalTokens: currentTokens,
		stepsTaken,
		overflow: true
	};
}

/**
 * Wait for DOM to update after token change
 * Uses requestAnimationFrame for reliable rendering
 */
function waitForUpdate(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			// Double RAF for more reliable measurement
			requestAnimationFrame(() => {
				resolve();
			});
		});
	});
}

/**
 * Estimate how many adjustment steps are needed to fit content
 * Useful for progress indicators
 */
export function estimateStepsNeeded(overflowPx: number): number {
	// Rough heuristics based on typical spacing/font changes
	const SECTION_GAP_REDUCTION = 8; // ~8px per step
	const ITEM_GAP_REDUCTION = 4; // ~4px per step
	const FONT_SIZE_REDUCTION = 10; // ~10px per 0.25pt step
	const LINE_HEIGHT_REDUCTION = 15; // ~15px per 0.02 step
	const MARGIN_REDUCTION = 18; // ~18px per margin step

	// Worst case: need to do all reductions
	const maxSteps = 3 + 3 + 3 + 12 + 5 + 2; // spacing + font + lineHeight + margins

	// Estimate based on overflow
	if (overflowPx < 50) return 3;
	if (overflowPx < 100) return 6;
	if (overflowPx < 200) return 10;
	if (overflowPx < 400) return 15;
	return maxSteps;
}
