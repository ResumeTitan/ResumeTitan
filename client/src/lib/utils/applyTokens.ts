/**
 * Apply Design Tokens to Resume Container
 *
 * Maps design token values to CSS variables on the resume root container.
 * Templates consume these CSS variables for consistent, template-agnostic styling.
 */

import type { DesignTokens } from '$lib/types/designTokens';
import { CSS_VARS, ATS_MODE_CLASS } from '$lib/types/designTokens';
import {
	getMarginValues,
	getColumnRatio,
	getGutterValue,
	getSpacingValue,
	getBulletIndent,
	LETTER_SPACING_PRESETS
} from '$lib/config/designTokenDefaults';

/**
 * Apply design tokens as CSS custom properties to a container element
 * @param element - The resume container DOM element
 * @param tokens - Design tokens configuration
 */
export function applyTokens(element: HTMLElement, tokens: DesignTokens): void {
	if (!element) return;

	const style = element.style;

	// ========================================================================
	// PAGE LAYOUT
	// ========================================================================

	const margins = getMarginValues(tokens.page.marginPreset);
	style.setProperty(CSS_VARS.PAGE_MARGIN_X, `${margins.x}px`);
	style.setProperty(CSS_VARS.PAGE_MARGIN_Y, `${margins.y}px`);

	style.setProperty(CSS_VARS.PAGE_COLUMNS, `${tokens.page.columns}`);

	if (tokens.page.columns === 2) {
		const ratio = getColumnRatio(tokens.page.columnRatioPreset);
		style.setProperty(CSS_VARS.COLUMN_RATIO, `${ratio.left}% ${ratio.right}%`);

		const gutter = getGutterValue(tokens.page.gutterPreset);
		style.setProperty(CSS_VARS.COLUMN_GUTTER, `${gutter}px`);
	}

	// ========================================================================
	// TYPOGRAPHY
	// ========================================================================

	style.setProperty(CSS_VARS.FONT_BODY_SIZE, `${tokens.text.baseSizePt}pt`);
	style.setProperty(CSS_VARS.LINE_HEIGHT, `${tokens.text.lineHeight}`);
	style.setProperty(CSS_VARS.HEADING_SCALE, `${tokens.text.headingScale}`);
	style.setProperty(CSS_VARS.BODY_WEIGHT, `${tokens.text.bodyWeight}`);
	style.setProperty(CSS_VARS.HEADING_WEIGHT, `${tokens.text.headingWeight}`);

	const letterSpacing = LETTER_SPACING_PRESETS[tokens.text.headingLetterSpacing];
	style.setProperty(CSS_VARS.HEADING_LETTER_SPACING, letterSpacing);

	// ========================================================================
	// SPACING
	// ========================================================================

	const sectionGap = getSpacingValue(tokens.spacing.sectionGap, 'section');
	style.setProperty(CSS_VARS.SECTION_GAP, `${sectionGap}px`);

	const itemGap = getSpacingValue(tokens.spacing.itemGap, 'item');
	style.setProperty(CSS_VARS.ITEM_GAP, `${itemGap}px`);

	const bulletGap = getSpacingValue(tokens.spacing.bulletGap, 'bullet');
	style.setProperty(CSS_VARS.BULLET_GAP, `${bulletGap}px`);

	const bulletIndent = getBulletIndent(tokens.spacing.bulletIndentPreset);
	style.setProperty(CSS_VARS.BULLET_INDENT, `${bulletIndent}px`);

	// ========================================================================
	// STYLE / COLORS
	// ========================================================================

	style.setProperty(CSS_VARS.ACCENT_COLOR, tokens.style.accentColor);
	style.setProperty(CSS_VARS.TEXT_COLOR, tokens.style.textColor);

	const linkDecoration = tokens.style.linkStyle === 'UNDERLINE' ? 'underline' : 'none';
	style.setProperty(CSS_VARS.LINK_DECORATION, linkDecoration);

	// ========================================================================
	// FORMATTING
	// ========================================================================

	// Bullet character mapping
	const bulletCharMap = {
		DOT: '•',
		DASH: '–',
		NONE: ''
	};
	const bulletChar = bulletCharMap[tokens.formatting.bulletStyle];
	style.setProperty(CSS_VARS.BULLET_CHAR, `"${bulletChar}"`);

	style.setProperty(CSS_VARS.DATE_LAYOUT, tokens.formatting.dateLayout.toLowerCase());
	style.setProperty(CSS_VARS.HEADER_LAYOUT, tokens.formatting.headerLayout.toLowerCase());
	style.setProperty(CSS_VARS.CONTACT_SEPARATOR, tokens.formatting.contactSeparator.toLowerCase());
	style.setProperty(CSS_VARS.SKILLS_LAYOUT, tokens.formatting.skillsLayout.toLowerCase());
	style.setProperty(CSS_VARS.SKILLS_COLUMNS, `${tokens.formatting.skillsColumns}`);

	// ========================================================================
	// ATS MODE CLASS
	// ========================================================================

	if (tokens.accessibility.atsMode) {
		element.classList.add(ATS_MODE_CLASS);
	} else {
		element.classList.remove(ATS_MODE_CLASS);
	}

	// Add data attributes for conditional template behavior
	element.dataset.atsMode = String(tokens.accessibility.atsMode);
	element.dataset.disableIcons = String(tokens.accessibility.disableIcons);
	element.dataset.disableBackgrounds = String(tokens.accessibility.disableBackgrounds);
}

/**
 * Remove all design token CSS variables from an element
 * @param element - The resume container DOM element
 */
export function clearTokens(element: HTMLElement): void {
	if (!element) return;

	const style = element.style;

	// Remove all custom properties
	Object.values(CSS_VARS).forEach((varName) => {
		style.removeProperty(varName);
	});

	// Remove ATS mode class
	element.classList.remove(ATS_MODE_CLASS);

	// Remove data attributes
	delete element.dataset.atsMode;
	delete element.dataset.disableIcons;
	delete element.dataset.disableBackgrounds;
}

/**
 * Get computed token values from an element (for debugging/inspection)
 * @param element - The resume container DOM element
 * @returns Object with computed CSS variable values
 */
export function getAppliedTokens(element: HTMLElement): Record<string, string> {
	if (!element) return {};

	const computed = window.getComputedStyle(element);
	const result: Record<string, string> = {};

	Object.entries(CSS_VARS).forEach(([key, varName]) => {
		const value = computed.getPropertyValue(varName);
		if (value) {
			result[key] = value.trim();
		}
	});

	return result;
}
