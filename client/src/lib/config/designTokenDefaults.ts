/**
 * Design Token Defaults and Preset Mappings
 *
 * Defines default values and numeric mappings for all design token presets.
 * These values ensure safe, bounded customization that preserves layout integrity.
 */

import type {
	DesignTokens,
	MarginPreset,
	MarginValues,
	SpacingPreset,
	SpacingValues,
	BulletIndentPreset,
	BulletIndentValues,
	ColumnRatioPreset,
	ColumnRatioValues,
	GutterPreset,
	LetterSpacing
} from '$lib/types/designTokens';

// ============================================================================
// PAGE MARGIN PRESETS (in px)
// ============================================================================

export const MARGIN_PRESETS: Record<MarginPreset, MarginValues> = {
	NARROW: { x: 36, y: 36 }, // 0.5 inch
	NORMAL: { x: 54, y: 54 }, // 0.75 inch
	WIDE: { x: 72, y: 72 } // 1 inch
};

// ============================================================================
// COLUMN RATIO PRESETS (percentages)
// ============================================================================

export const COLUMN_RATIO_PRESETS: Record<ColumnRatioPreset, ColumnRatioValues> = {
	'35_65': { left: 35, right: 65 },
	'40_60': { left: 40, right: 60 },
	'50_50': { left: 50, right: 50 }
};

// ============================================================================
// GUTTER PRESETS (in px)
// ============================================================================

export const GUTTER_PRESETS: Record<GutterPreset, number> = {
	NARROW: 16, // ~0.22 inch
	NORMAL: 24, // ~0.33 inch
	WIDE: 32 // ~0.44 inch
};

// ============================================================================
// SPACING PRESETS (in px)
// ============================================================================

export const SECTION_GAP_PRESETS: Record<SpacingPreset, SpacingValues> = {
	TIGHT: { px: 12 },
	NORMAL: { px: 16 },
	AIRY: { px: 20 }
};

export const ITEM_GAP_PRESETS: Record<SpacingPreset, SpacingValues> = {
	TIGHT: { px: 6 },
	NORMAL: { px: 8 },
	AIRY: { px: 10 }
};

export const BULLET_GAP_PRESETS: Record<SpacingPreset, SpacingValues> = {
	TIGHT: { px: 2 },
	NORMAL: { px: 3 },
	AIRY: { px: 4 }
};

// ============================================================================
// BULLET INDENT PRESETS (in px)
// ============================================================================

export const BULLET_INDENT_PRESETS: Record<BulletIndentPreset, BulletIndentValues> = {
	SMALL: { px: 16 },
	NORMAL: { px: 20 },
	LARGE: { px: 24 }
};

// ============================================================================
// LETTER SPACING PRESETS
// ============================================================================

export const LETTER_SPACING_PRESETS: Record<LetterSpacing, string> = {
	NONE: '0',
	SMALL: '0.025em'
};

// ============================================================================
// VALIDATION BOUNDS
// ============================================================================

export const TEXT_BOUNDS = {
	BASE_SIZE_PT: { min: 9, max: 12 },
	LINE_HEIGHT: { min: 1.05, max: 1.35 },
	HEADING_SCALE: { min: 1.1, max: 1.35 }
};

// ============================================================================
// DEFAULT DESIGN TOKENS
// ============================================================================

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
	page: {
		size: 'LETTER',
		marginPreset: 'NORMAL',
		columns: 1,
		columnRatioPreset: '40_60',
		gutterPreset: 'NORMAL'
	},
	text: {
		fontFamily: 'times-new-roman', // Will be overridden by Resume.font
		baseSizePt: 10.5,
		lineHeight: 1.15,
		headingScale: 1.2,
		bodyWeight: 400,
		headingWeight: 600,
		headingLetterSpacing: 'NONE'
	},
	spacing: {
		sectionGap: 'NORMAL',
		itemGap: 'NORMAL',
		bulletGap: 'NORMAL',
		bulletIndentPreset: 'NORMAL'
	},
	style: {
		accentColor: '#2563eb', // Blue-600
		textColor: '#1f2937', // Gray-800
		linkStyle: 'NO_UNDERLINE',
		sectionDivider: 'NONE'
	},
	formatting: {
		bulletStyle: 'DOT',
		hangingIndent: true,
		dateLayout: 'RIGHT',
		headerLayout: 'ONE_LINE',
		contactSeparator: 'PIPE',
		skillsLayout: 'CHIPS',
		skillsColumns: 2
	},
	accessibility: {
		atsMode: false,
		disableIcons: false,
		disableBackgrounds: false
	},
	sectionOverrides: {}
};

// ============================================================================
// ATS-FRIENDLY MODE OVERRIDES
// ============================================================================

export const ATS_MODE_OVERRIDES: Partial<DesignTokens> = {
	style: {
		accentColor: '#000000',
		textColor: '#000000',
		linkStyle: 'NO_UNDERLINE',
		sectionDivider: 'NONE'
	},
	accessibility: {
		atsMode: true,
		disableIcons: true,
		disableBackgrounds: true
	},
	formatting: {
		bulletStyle: 'DOT',
		hangingIndent: true,
		dateLayout: 'RIGHT',
		headerLayout: 'ONE_LINE',
		contactSeparator: 'PIPE',
		skillsLayout: 'COMMA',
		skillsColumns: 1
	}
};

// ============================================================================
// FIT-TO-PAGE TIGHTENING SEQUENCE
// ============================================================================

export interface TighteningStep {
	path: string; // Dot-notation path to token
	values: any[]; // Ordered values from loosest to tightest
	type: 'preset' | 'numeric';
}

export const FIT_TO_PAGE_SEQUENCE: TighteningStep[] = [
	{
		path: 'spacing.sectionGap',
		values: ['AIRY', 'NORMAL', 'TIGHT'],
		type: 'preset'
	},
	{
		path: 'spacing.itemGap',
		values: ['AIRY', 'NORMAL', 'TIGHT'],
		type: 'preset'
	},
	{
		path: 'spacing.bulletGap',
		values: ['AIRY', 'NORMAL', 'TIGHT'],
		type: 'preset'
	},
	{
		path: 'text.baseSizePt',
		values: [], // Decremented by 0.25pt until floor of 9pt
		type: 'numeric'
	},
	{
		path: 'text.lineHeight',
		values: [], // Decremented by 0.02 until floor of 1.05
		type: 'numeric'
	},
	{
		path: 'page.marginPreset',
		values: ['WIDE', 'NORMAL', 'NARROW'],
		type: 'preset'
	}
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get numeric pixel value from spacing preset
 */
export function getSpacingValue(preset: SpacingPreset, type: 'section' | 'item' | 'bullet'): number {
	switch (type) {
		case 'section':
			return SECTION_GAP_PRESETS[preset].px;
		case 'item':
			return ITEM_GAP_PRESETS[preset].px;
		case 'bullet':
			return BULLET_GAP_PRESETS[preset].px;
	}
}

/**
 * Get numeric margin values from preset
 */
export function getMarginValues(preset: MarginPreset): MarginValues {
	return MARGIN_PRESETS[preset];
}

/**
 * Get column ratio percentages from preset
 */
export function getColumnRatio(preset: ColumnRatioPreset): ColumnRatioValues {
	return COLUMN_RATIO_PRESETS[preset];
}

/**
 * Get gutter width from preset
 */
export function getGutterValue(preset: GutterPreset): number {
	return GUTTER_PRESETS[preset];
}

/**
 * Get bullet indent from preset
 */
export function getBulletIndent(preset: BulletIndentPreset): number {
	return BULLET_INDENT_PRESETS[preset].px;
}

/**
 * Validate and clamp numeric text token values
 */
export function clampTextValue(value: number, key: 'baseSizePt' | 'lineHeight' | 'headingScale'): number {
	const bounds = TEXT_BOUNDS[key === 'baseSizePt' ? 'BASE_SIZE_PT' : key === 'lineHeight' ? 'LINE_HEIGHT' : 'HEADING_SCALE'];
	return Math.max(bounds.min, Math.min(bounds.max, value));
}

/**
 * Merge design tokens with defaults (for backwards compatibility)
 */
export function mergeWithDefaults(tokens: Partial<DesignTokens> | undefined): DesignTokens {
	if (!tokens) return { ...DEFAULT_DESIGN_TOKENS };

	return {
		page: { ...DEFAULT_DESIGN_TOKENS.page, ...tokens.page },
		text: { ...DEFAULT_DESIGN_TOKENS.text, ...tokens.text },
		spacing: { ...DEFAULT_DESIGN_TOKENS.spacing, ...tokens.spacing },
		style: { ...DEFAULT_DESIGN_TOKENS.style, ...tokens.style },
		formatting: { ...DEFAULT_DESIGN_TOKENS.formatting, ...tokens.formatting },
		accessibility: { ...DEFAULT_DESIGN_TOKENS.accessibility, ...tokens.accessibility },
		sectionOverrides: { ...DEFAULT_DESIGN_TOKENS.sectionOverrides, ...tokens.sectionOverrides }
	};
}

/**
 * Apply ATS mode to tokens
 */
export function applyATSMode(tokens: DesignTokens): DesignTokens {
	return {
		...tokens,
		style: {
			...tokens.style,
			...ATS_MODE_OVERRIDES.style!
		},
		accessibility: {
			...tokens.accessibility,
			...ATS_MODE_OVERRIDES.accessibility!
		},
		formatting: {
			...tokens.formatting,
			...ATS_MODE_OVERRIDES.formatting!
		}
	};
}

/**
 * Remove ATS mode from tokens (restore previous values if available)
 */
export function removeATSMode(tokens: DesignTokens, previousTokens?: DesignTokens): DesignTokens {
	if (previousTokens) {
		return {
			...tokens,
			style: { ...previousTokens.style },
			accessibility: { ...tokens.accessibility, atsMode: false },
			formatting: { ...previousTokens.formatting }
		};
	}

	// Fallback: restore to defaults
	return {
		...tokens,
		style: { ...DEFAULT_DESIGN_TOKENS.style },
		accessibility: { ...tokens.accessibility, atsMode: false },
		formatting: { ...DEFAULT_DESIGN_TOKENS.formatting }
	};
}
