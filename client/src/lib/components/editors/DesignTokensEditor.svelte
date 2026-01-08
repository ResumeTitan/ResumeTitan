<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { DesignTokens } from '$lib/types/designTokens';
	import { DEFAULT_DESIGN_TOKENS, mergeWithDefaults, applyATSMode, removeATSMode } from '$lib/config/designTokenDefaults';
	import FormDropdown from '$lib/components/forms/FormDropdown.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fitToPage, measureContentFit, measureOverflow } from '$lib/utils/fitToPage';

	export let tokens: DesignTokens;
	export let containerElement: HTMLElement | null = null;
	export let readonly = false;

	const dispatch = createEventDispatcher<{
		change: DesignTokens;
		fitToPage: { targetPages: 1 | 2 };
	}>();

	let activeSection: 'layout' | 'text' | 'spacing' | 'style' | 'formatting' | 'tools' = 'layout';
	let fittingInProgress = false;
	let fittingStatus = '';
	let previousTokensBeforeATS: DesignTokens | undefined;

	// Initialize with defaults if needed
	$: if (!tokens) {
		tokens = { ...DEFAULT_DESIGN_TOKENS };
	}

	function updateTokens(newTokens: Partial<DesignTokens>) {
		tokens = mergeWithDefaults({ ...tokens, ...newTokens });
		dispatch('change', tokens);
	}

	function updatePage(updates: Partial<DesignTokens['page']>) {
		updateTokens({ page: { ...tokens.page, ...updates } });
	}

	function updateText(updates: Partial<DesignTokens['text']>) {
		updateTokens({ text: { ...tokens.text, ...updates } });
	}

	function updateSpacing(updates: Partial<DesignTokens['spacing']>) {
		updateTokens({ spacing: { ...tokens.spacing, ...updates } });
	}

	function updateStyle(updates: Partial<DesignTokens['style']>) {
		updateTokens({ style: { ...tokens.style, ...updates } });
	}

	function updateFormatting(updates: Partial<DesignTokens['formatting']>) {
		updateTokens({ formatting: { ...tokens.formatting, ...updates } });
	}

	function updateAccessibility(updates: Partial<DesignTokens['accessibility']>) {
		updateTokens({ accessibility: { ...tokens.accessibility, ...updates } });
	}

	function resetToDefaults() {
		if (confirm('Reset all design settings to defaults?')) {
			tokens = { ...DEFAULT_DESIGN_TOKENS };
			dispatch('change', tokens);
		}
	}

	function toggleATSMode() {
		if (!tokens.accessibility.atsMode) {
			// Entering ATS mode - save current tokens
			previousTokensBeforeATS = { ...tokens };
			tokens = applyATSMode(tokens);
		} else {
			// Exiting ATS mode - restore previous tokens
			tokens = removeATSMode(tokens, previousTokensBeforeATS);
			previousTokensBeforeATS = undefined;
		}
		dispatch('change', tokens);
	}

	async function handleFitToPage(targetPages: 1 | 2) {
		if (!containerElement) {
			alert('Preview container not available. Please ensure the resume preview is visible.');
			return;
		}

		fittingInProgress = true;
		fittingStatus = 'Analyzing content...';

		try {
			const result = await fitToPage(tokens, containerElement, {
				targetPages,
				maxIterations: 25,
				onProgress: (step) => {
					fittingStatus = step;
				}
			});

			if (result.success) {
				tokens = result.finalTokens;
				dispatch('change', tokens);
				fittingStatus = `Success! Fit to ${targetPages} page${targetPages > 1 ? 's' : ''} in ${result.stepsTaken.length} steps.`;
				setTimeout(() => {
					fittingStatus = '';
					fittingInProgress = false;
				}, 3000);
			} else {
				fittingStatus = `Unable to fit content to ${targetPages} page${targetPages > 1 ? 's' : ''}. Consider removing content or using ${targetPages + 1} pages.`;
				tokens = result.finalTokens;
				dispatch('change', tokens);
				setTimeout(() => {
					fittingStatus = '';
					fittingInProgress = false;
				}, 5000);
			}
		} catch (error) {
			console.error('Fit-to-page error:', error);
			fittingStatus = 'Error occurred while fitting content.';
			setTimeout(() => {
				fittingStatus = '';
				fittingInProgress = false;
			}, 3000);
		}
	}
</script>

<div class="design-tokens-editor">
	<!-- Section Navigation -->
	<div class="section-tabs">
		<button
			class="tab {activeSection === 'layout' ? 'active' : ''}"
			on:click={() => (activeSection = 'layout')}
		>
			Layout
		</button>
		<button
			class="tab {activeSection === 'text' ? 'active' : ''}"
			on:click={() => (activeSection = 'text')}
		>
			Text
		</button>
		<button
			class="tab {activeSection === 'spacing' ? 'active' : ''}"
			on:click={() => (activeSection = 'spacing')}
		>
			Spacing
		</button>
		<button
			class="tab {activeSection === 'style' ? 'active' : ''}"
			on:click={() => (activeSection = 'style')}
		>
			Style
		</button>
		<button
			class="tab {activeSection === 'formatting' ? 'active' : ''}"
			on:click={() => (activeSection = 'formatting')}
		>
			Formatting
		</button>
		<button
			class="tab {activeSection === 'tools' ? 'active' : ''}"
			on:click={() => (activeSection = 'tools')}
		>
			Tools
		</button>
	</div>

	<!-- Section Content -->
	<div class="section-content">
		<!-- LAYOUT SECTION -->
		{#if activeSection === 'layout'}
			<div class="control-group">
				<h3>Page Layout</h3>

				<FormDropdown
					label="Page Size"
					value={tokens.page.size}
					options={[
						{ value: 'LETTER', label: 'Letter (8.5" × 11")' },
						{ value: 'A4', label: 'A4 (8.27" × 11.69")' }
					]}
					on:change={(e) => updatePage({ size: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Margins"
					value={tokens.page.marginPreset}
					options={[
						{ value: 'NARROW', label: 'Narrow (0.5")' },
						{ value: 'NORMAL', label: 'Normal (0.75")' },
						{ value: 'WIDE', label: 'Wide (1")' }
					]}
					on:change={(e) => updatePage({ marginPreset: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Columns"
					value={String(tokens.page.columns)}
					options={[
						{ value: '1', label: 'Single Column' },
						{ value: '2', label: 'Two Columns' }
					]}
					on:change={(e) => updatePage({ columns: Number(e.detail) as any })}
					disabled={readonly}
				/>

				{#if tokens.page.columns === 2}
					<FormDropdown
						label="Column Ratio"
						value={tokens.page.columnRatioPreset}
						options={[
							{ value: '35_65', label: '35% / 65%' },
							{ value: '40_60', label: '40% / 60%' },
							{ value: '50_50', label: '50% / 50%' }
						]}
						on:change={(e) => updatePage({ columnRatioPreset: e.detail as any })}
						disabled={readonly}
					/>

					<FormDropdown
						label="Column Gutter"
						value={tokens.page.gutterPreset}
						options={[
							{ value: 'NARROW', label: 'Narrow' },
							{ value: 'NORMAL', label: 'Normal' },
							{ value: 'WIDE', label: 'Wide' }
						]}
						on:change={(e) => updatePage({ gutterPreset: e.detail as any })}
						disabled={readonly}
					/>
				{/if}
			</div>
		{/if}

		<!-- TEXT SECTION -->
		{#if activeSection === 'text'}
			<div class="control-group">
				<h3>Typography</h3>

				<div class="form-field">
					<label for="baseSizePt">Base Font Size (pt)</label>
					<input
						type="number"
						id="baseSizePt"
						min="9"
						max="12"
						step="0.25"
						bind:value={tokens.text.baseSizePt}
						on:change={() => updateText({ baseSizePt: tokens.text.baseSizePt })}
						disabled={readonly}
						class="form-style"
					/>
					<span class="hint">Range: 9–12pt</span>
				</div>

				<div class="form-field">
					<label for="lineHeight">Line Height</label>
					<input
						type="number"
						id="lineHeight"
						min="1.05"
						max="1.35"
						step="0.05"
						bind:value={tokens.text.lineHeight}
						on:change={() => updateText({ lineHeight: tokens.text.lineHeight })}
						disabled={readonly}
						class="form-style"
					/>
					<span class="hint">Range: 1.05–1.35</span>
				</div>

				<div class="form-field">
					<label for="headingScale">Heading Scale</label>
					<input
						type="number"
						id="headingScale"
						min="1.1"
						max="1.35"
						step="0.05"
						bind:value={tokens.text.headingScale}
						on:change={() => updateText({ headingScale: tokens.text.headingScale })}
						disabled={readonly}
						class="form-style"
					/>
					<span class="hint">Range: 1.1–1.35</span>
				</div>

				<FormDropdown
					label="Body Weight"
					value={String(tokens.text.bodyWeight)}
					options={[
						{ value: '400', label: 'Regular (400)' },
						{ value: '500', label: 'Medium (500)' }
					]}
					on:change={(e) => updateText({ bodyWeight: Number(e.detail) as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Heading Weight"
					value={String(tokens.text.headingWeight)}
					options={[
						{ value: '600', label: 'Semi-Bold (600)' },
						{ value: '700', label: 'Bold (700)' }
					]}
					on:change={(e) => updateText({ headingWeight: Number(e.detail) as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Heading Letter Spacing"
					value={tokens.text.headingLetterSpacing}
					options={[
						{ value: 'NONE', label: 'None' },
						{ value: 'SMALL', label: 'Small' }
					]}
					on:change={(e) => updateText({ headingLetterSpacing: e.detail as any })}
					disabled={readonly}
				/>
			</div>
		{/if}

		<!-- SPACING SECTION -->
		{#if activeSection === 'spacing'}
			<div class="control-group">
				<h3>Spacing</h3>

				<FormDropdown
					label="Section Gap"
					value={tokens.spacing.sectionGap}
					options={[
						{ value: 'TIGHT', label: 'Tight' },
						{ value: 'NORMAL', label: 'Normal' },
						{ value: 'AIRY', label: 'Airy' }
					]}
					on:change={(e) => updateSpacing({ sectionGap: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Item Gap"
					value={tokens.spacing.itemGap}
					options={[
						{ value: 'TIGHT', label: 'Tight' },
						{ value: 'NORMAL', label: 'Normal' },
						{ value: 'AIRY', label: 'Airy' }
					]}
					on:change={(e) => updateSpacing({ itemGap: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Bullet Gap"
					value={tokens.spacing.bulletGap}
					options={[
						{ value: 'TIGHT', label: 'Tight' },
						{ value: 'NORMAL', label: 'Normal' },
						{ value: 'AIRY', label: 'Airy' }
					]}
					on:change={(e) => updateSpacing({ bulletGap: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Bullet Indent"
					value={tokens.spacing.bulletIndentPreset}
					options={[
						{ value: 'SMALL', label: 'Small' },
						{ value: 'NORMAL', label: 'Normal' },
						{ value: 'LARGE', label: 'Large' }
					]}
					on:change={(e) => updateSpacing({ bulletIndentPreset: e.detail as any })}
					disabled={readonly}
				/>
			</div>
		{/if}

		<!-- STYLE SECTION -->
		{#if activeSection === 'style'}
			<div class="control-group">
				<h3>Colors & Style</h3>

				<div class="form-field">
					<label for="accentColor">Accent Color</label>
					<div class="color-input-group">
						<input
							type="color"
							id="accentColor"
							bind:value={tokens.style.accentColor}
							on:change={() => updateStyle({ accentColor: tokens.style.accentColor })}
							disabled={readonly}
							class="color-picker"
						/>
						<input
							type="text"
							bind:value={tokens.style.accentColor}
							on:change={() => updateStyle({ accentColor: tokens.style.accentColor })}
							disabled={readonly}
							class="form-style flex-1"
							placeholder="#000000"
						/>
					</div>
				</div>

				<div class="form-field">
					<label for="textColor">Text Color</label>
					<div class="color-input-group">
						<input
							type="color"
							id="textColor"
							bind:value={tokens.style.textColor}
							on:change={() => updateStyle({ textColor: tokens.style.textColor })}
							disabled={readonly}
							class="color-picker"
						/>
						<input
							type="text"
							bind:value={tokens.style.textColor}
							on:change={() => updateStyle({ textColor: tokens.style.textColor })}
							disabled={readonly}
							class="form-style flex-1"
							placeholder="#000000"
						/>
					</div>
				</div>

				<FormDropdown
					label="Link Style"
					value={tokens.style.linkStyle}
					options={[
						{ value: 'UNDERLINE', label: 'Underlined' },
						{ value: 'NO_UNDERLINE', label: 'No Underline' }
					]}
					on:change={(e) => updateStyle({ linkStyle: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Section Divider"
					value={tokens.style.sectionDivider}
					options={[
						{ value: 'NONE', label: 'None' },
						{ value: 'LINE', label: 'Horizontal Line' },
						{ value: 'UNDERLINE', label: 'Title Underline' }
					]}
					on:change={(e) => updateStyle({ sectionDivider: e.detail as any })}
					disabled={readonly}
				/>
			</div>
		{/if}

		<!-- FORMATTING SECTION -->
		{#if activeSection === 'formatting'}
			<div class="control-group">
				<h3>Formatting Options</h3>

				<FormDropdown
					label="Bullet Style"
					value={tokens.formatting.bulletStyle}
					options={[
						{ value: 'DOT', label: '• Dot' },
						{ value: 'DASH', label: '– Dash' },
						{ value: 'NONE', label: 'None' }
					]}
					on:change={(e) => updateFormatting({ bulletStyle: e.detail as any })}
					disabled={readonly}
				/>

				<div class="form-field">
					<label class="checkbox-label">
						<input
							type="checkbox"
							bind:checked={tokens.formatting.hangingIndent}
							on:change={() => updateFormatting({ hangingIndent: tokens.formatting.hangingIndent })}
							disabled={readonly}
						/>
						<span>Hanging Indent (for bullets)</span>
					</label>
				</div>

				<FormDropdown
					label="Date Layout"
					value={tokens.formatting.dateLayout}
					options={[
						{ value: 'RIGHT', label: 'Right-Aligned' },
						{ value: 'INLINE', label: 'Inline with Text' },
						{ value: 'HIDDEN', label: 'Hidden' }
					]}
					on:change={(e) => updateFormatting({ dateLayout: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Header Layout"
					value={tokens.formatting.headerLayout}
					options={[
						{ value: 'ONE_LINE', label: 'One Line' },
						{ value: 'TWO_LINE', label: 'Two Lines' },
						{ value: 'CENTERED', label: 'Centered' }
					]}
					on:change={(e) => updateFormatting({ headerLayout: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Contact Separator"
					value={tokens.formatting.contactSeparator}
					options={[
						{ value: 'PIPE', label: 'Pipe (|)' },
						{ value: 'DOT', label: 'Dot (•)' },
						{ value: 'NONE', label: 'None' }
					]}
					on:change={(e) => updateFormatting({ contactSeparator: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Skills Layout"
					value={tokens.formatting.skillsLayout}
					options={[
						{ value: 'CHIPS', label: 'Chips/Tags' },
						{ value: 'COMMA', label: 'Comma-Separated' },
						{ value: 'CATEGORIZED', label: 'Categorized Lists' }
					]}
					on:change={(e) => updateFormatting({ skillsLayout: e.detail as any })}
					disabled={readonly}
				/>

				<FormDropdown
					label="Skills Columns"
					value={String(tokens.formatting.skillsColumns)}
					options={[
						{ value: '1', label: '1 Column' },
						{ value: '2', label: '2 Columns' },
						{ value: '3', label: '3 Columns' }
					]}
					on:change={(e) => updateFormatting({ skillsColumns: Number(e.detail) as any })}
					disabled={readonly}
				/>
			</div>
		{/if}

		<!-- TOOLS SECTION -->
		{#if activeSection === 'tools'}
			<div class="control-group">
				<h3>Tools & Helpers</h3>

				<div class="tool-section">
					<h4>ATS-Friendly Mode</h4>
					<p class="tool-description">
						Optimizes your resume for Applicant Tracking Systems by using simple formatting,
						black text, and removing decorative elements.
					</p>
					<Button
						variant={tokens.accessibility.atsMode ? 'secondary' : 'primary'}
						on:click={toggleATSMode}
						disabled={readonly}
					>
						{tokens.accessibility.atsMode ? 'Disable ATS Mode' : 'Enable ATS Mode'}
					</Button>
				</div>

				<div class="tool-section">
					<h4>Fit to Page</h4>
					<p class="tool-description">
						Automatically adjusts spacing and font size to fit your resume on a target number of
						pages. Changes are made conservatively within safe bounds.
					</p>
					<div class="fit-buttons">
						<Button
							variant="secondary"
							on:click={() => handleFitToPage(1)}
							disabled={readonly || fittingInProgress}
						>
							Fit to 1 Page
						</Button>
						<Button
							variant="secondary"
							on:click={() => handleFitToPage(2)}
							disabled={readonly || fittingInProgress}
						>
							Fit to 2 Pages
						</Button>
					</div>
					{#if fittingStatus}
						<p class="fitting-status">{fittingStatus}</p>
					{/if}
				</div>

				<div class="tool-section">
					<h4>Reset to Defaults</h4>
					<p class="tool-description">
						Reset all design customizations to default values. This action cannot be undone.
					</p>
					<Button variant="danger" on:click={resetToDefaults} disabled={readonly}>
						Reset All Settings
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.design-tokens-editor {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.section-tabs {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		flex-wrap: wrap;
	}

	.tab {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.tab:hover {
		background: #f3f4f6;
	}

	.tab.active {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.section-content {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.control-group h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #111827;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-field label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	.hint {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.color-input-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.color-picker {
		width: 3rem;
		height: 2.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1.125rem;
		height: 1.125rem;
		cursor: pointer;
	}

	.tool-section {
		padding: 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.tool-section h4 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #111827;
	}

	.tool-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 1rem 0;
		line-height: 1.5;
	}

	.fit-buttons {
		display: flex;
		gap: 0.75rem;
	}

	.fitting-status {
		margin-top: 0.75rem;
		padding: 0.5rem;
		background: #eff6ff;
		border-left: 3px solid #3b82f6;
		font-size: 0.875rem;
		color: #1e40af;
	}
</style>
