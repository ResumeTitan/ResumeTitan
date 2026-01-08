/**
 * Design Tokens System
 *
 * Template-agnostic resume customization controls that apply consistently
 * across all resume templates without breaking page sizing/scaling or print fidelity.
 */

// ============================================================================
// PAGE LAYOUT TOKENS
// ============================================================================

export type PageSize = 'LETTER' | 'A4';

export type MarginPreset = 'NARROW' | 'NORMAL' | 'WIDE';

export type ColumnCount = 1 | 2;

export type ColumnRatioPreset = '35_65' | '40_60' | '50_50';

export type GutterPreset = 'NARROW' | 'NORMAL' | 'WIDE';

export interface PageTokens {
	size: PageSize;
	marginPreset: MarginPreset;
	columns: ColumnCount;
	columnRatioPreset: ColumnRatioPreset;
	gutterPreset: GutterPreset;
}

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export type FontWeight = 400 | 500 | 600 | 700;

export type LetterSpacing = 'NONE' | 'SMALL';

export interface TextTokens {
	fontFamily: string; // Integrates with existing font system
	baseSizePt: number; // 9-12pt bounded
	lineHeight: number; // 1.05-1.35 bounded
	headingScale: number; // 1.1-1.35 bounded
	bodyWeight: 400 | 500;
	headingWeight: 600 | 700;
	headingLetterSpacing: LetterSpacing;
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

export type SpacingPreset = 'TIGHT' | 'NORMAL' | 'AIRY';

export type BulletIndentPreset = 'SMALL' | 'NORMAL' | 'LARGE';

export interface SpacingTokens {
	sectionGap: SpacingPreset;
	itemGap: SpacingPreset;
	bulletGap: SpacingPreset;
	bulletIndentPreset: BulletIndentPreset;
}

// ============================================================================
// STYLE TOKENS
// ============================================================================

export type LinkStyle = 'UNDERLINE' | 'NO_UNDERLINE';

export type SectionDivider = 'NONE' | 'LINE' | 'UNDERLINE';

export interface StyleTokens {
	accentColor: string; // hex color
	textColor: string; // hex color
	linkStyle: LinkStyle;
	sectionDivider: SectionDivider;
}

// ============================================================================
// FORMATTING TOKENS
// ============================================================================

export type BulletStyle = 'DOT' | 'DASH' | 'NONE';

export type DateLayout = 'RIGHT' | 'INLINE' | 'HIDDEN';

export type HeaderLayout = 'ONE_LINE' | 'TWO_LINE' | 'CENTERED';

export type ContactSeparator = 'PIPE' | 'DOT' | 'NONE';

export type SkillsLayout = 'CHIPS' | 'COMMA' | 'CATEGORIZED';

export interface FormattingTokens {
	bulletStyle: BulletStyle;
	hangingIndent: boolean;
	dateLayout: DateLayout;
	headerLayout: HeaderLayout;
	contactSeparator: ContactSeparator;
	skillsLayout: SkillsLayout;
	skillsColumns: 1 | 2 | 3;
}

// ============================================================================
// ACCESSIBILITY / ATS TOKENS
// ============================================================================

export interface AccessibilityTokens {
	atsMode: boolean;
	disableIcons: boolean;
	disableBackgrounds: boolean;
}

// ============================================================================
// SECTION OVERRIDES
// ============================================================================

export interface SectionOverride {
	visible?: boolean;
	title?: string;
	order?: number;
}

export type SectionOverrides = Record<string, SectionOverride>;

// ============================================================================
// COMPLETE DESIGN TOKENS
// ============================================================================

export interface DesignTokens {
	page: PageTokens;
	text: TextTokens;
	spacing: SpacingTokens;
	style: StyleTokens;
	formatting: FormattingTokens;
	accessibility: AccessibilityTokens;
	sectionOverrides: SectionOverrides;
}

// ============================================================================
// NUMERIC VALUE MAPPINGS
// ============================================================================

export interface MarginValues {
	x: number; // in px
	y: number; // in px
}

export interface ColumnRatioValues {
	left: number; // percentage
	right: number; // percentage
}

export interface SpacingValues {
	px: number;
}

export interface BulletIndentValues {
	px: number;
}

// ============================================================================
// CSS VARIABLE NAMES
// ============================================================================

export const CSS_VARS = {
	// Page
	PAGE_MARGIN_X: '--page-margin-x',
	PAGE_MARGIN_Y: '--page-margin-y',
	PAGE_COLUMNS: '--page-columns',
	COLUMN_RATIO: '--column-ratio',
	COLUMN_GUTTER: '--column-gutter',

	// Text
	FONT_BODY_SIZE: '--font-body-size',
	LINE_HEIGHT: '--line-height',
	HEADING_SCALE: '--heading-scale',
	BODY_WEIGHT: '--body-weight',
	HEADING_WEIGHT: '--heading-weight',
	HEADING_LETTER_SPACING: '--heading-letter-spacing',

	// Spacing
	SECTION_GAP: '--section-gap',
	ITEM_GAP: '--item-gap',
	BULLET_GAP: '--bullet-gap',
	BULLET_INDENT: '--bullet-indent',

	// Style
	ACCENT_COLOR: '--accent-color',
	TEXT_COLOR: '--text-color',
	LINK_DECORATION: '--link-decoration',

	// Formatting
	BULLET_CHAR: '--bullet-char',
	DATE_LAYOUT: '--date-layout',
	HEADER_LAYOUT: '--header-layout',
	CONTACT_SEPARATOR: '--contact-separator',
	SKILLS_LAYOUT: '--skills-layout',
	SKILLS_COLUMNS: '--skills-columns'
} as const;

// ============================================================================
// ATS MODE CLASS
// ============================================================================

export const ATS_MODE_CLASS = 'ats-mode';
