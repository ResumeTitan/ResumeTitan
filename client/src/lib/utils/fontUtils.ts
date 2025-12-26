/**
 * Font Utilities
 *
 * Helper functions for font management in resume templates.
 */

// Font family mappings
const FONT_FAMILIES: Record<string, string> = {
	'times-new-roman': '"Times New Roman", Times, serif',
	arial: 'Arial, Helvetica, sans-serif',
	georgia: 'Georgia, "Times New Roman", Times, serif',
	calibri: 'Calibri, "Segoe UI", Arial, sans-serif',
	cambria: 'Cambria, Georgia, serif',
	'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

/**
 * Get the CSS font-family value for a font key
 * @param fontKey - The font key (e.g., 'times-new-roman', 'arial')
 * @returns CSS font-family string
 */
export function getFontFamily(fontKey: string | undefined): string {
	if (!fontKey) return FONT_FAMILIES['times-new-roman'];
	return FONT_FAMILIES[fontKey] || FONT_FAMILIES['times-new-roman'];
}

/**
 * Get the display name for a font key
 * @param fontKey - The font key
 * @returns Human-readable font name
 */
export function getFontDisplayName(fontKey: string | undefined): string {
	const names: Record<string, string> = {
		'times-new-roman': 'Times New Roman',
		arial: 'Arial',
		georgia: 'Georgia',
		calibri: 'Calibri',
		cambria: 'Cambria',
		'sans-serif': 'Sans Serif'
	};

	return names[fontKey || ''] || 'Times New Roman';
}

/**
 * Check if a font is a serif font
 */
export function isSerifFont(fontKey: string | undefined): boolean {
	const serifFonts = ['times-new-roman', 'georgia', 'cambria'];
	return serifFonts.includes(fontKey || '');
}

/**
 * Get all available fonts as options
 */
export function getFontOptions(): Array<{ value: string; label: string }> {
	return Object.keys(FONT_FAMILIES).map((key) => ({
		value: key,
		label: getFontDisplayName(key)
	}));
}
