<script lang="ts">
	/**
	 * GenericEditor - Unified Editor Component
	 *
	 * This single component replaces 4 duplicate editor components:
	 * - JobEditor.jsx (363 lines)
	 * - SchoolEditor.tsx (381 lines)
	 * - VolunteerEditor.tsx (333 lines)
	 * - ProjectEditor.jsx (340 lines)
	 *
	 * Total reduction: ~1400 lines -> ~200 lines
	 */

	import { createEventDispatcher } from 'svelte';
	import type { EditorConfig, EditorData } from '$types';
	import { moveArrayElement } from '$utils';

	// Components
	import FormField from '$components/forms/FormField.svelte';
	import FormArea from '$components/forms/FormArea.svelte';
	import DateInput from '$components/forms/DateInput.svelte';
	import StatePicker from '$components/forms/StatePicker.svelte';
	import DegreePicker from '$components/forms/DegreePicker.svelte';
	import Button from '$components/ui/Button.svelte';
	import HighlightsList from './HighlightsList.svelte';
	import AIAssistant from './AIAssistant.svelte';
	import BrainstormModal from './BrainstormModal.svelte';

	export let config: EditorConfig;
	export let data: EditorData;
	export let loading = false;

	const dispatch = createEventDispatcher<{
		save: EditorData;
		delete: number;
		cancel: void;
		aiCall: { userInput: string | null; operationType: string };
	}>();

	// Local form state
	let formData = { ...data };
	let endDateChecked = data.endDateCurrent || false;
	let showAiAssistant = false;
	let showBrainstorm = false;
	let aiMessage = '';

	// Reactive highlights array
	$: highlights = (formData.highlights as string[]) || [];

	// Handle field changes
	function handleFieldChange(fieldId: string, value: unknown) {
		formData = { ...formData, [fieldId]: value };
	}

	// Handle date changes
	function handleStartDateChange(value: string) {
		formData = { ...formData, [config.dateConfig.startDateField]: value };
	}

	function handleEndDateChange(value: string) {
		formData = { ...formData, [config.dateConfig.endDateField]: value };
	}

	function handleCurrentCheckbox(checked: boolean) {
		endDateChecked = checked;
		formData = {
			...formData,
			[config.dateConfig.currentField]: checked,
			[config.dateConfig.endDateField]: checked ? '' : formData[config.dateConfig.endDateField]
		};
	}

	// Handle highlights
	function handleHighlightAdd() {
		formData = { ...formData, highlights: [...highlights, ''] };
	}

	function handleHighlightChange(index: number, value: string) {
		const newHighlights = [...highlights];
		newHighlights[index] = value;
		formData = { ...formData, highlights: newHighlights };
	}

	function handleHighlightDelete(index: number) {
		const newHighlights = highlights.filter((_, i) => i !== index);
		formData = { ...formData, highlights: newHighlights };
	}

	function handleHighlightReorder(from: number, to: number) {
		const newHighlights = moveArrayElement(highlights, from, to);
		formData = { ...formData, highlights: newHighlights };
	}

	// Handle AI operations
	function handleAiSubmit(userInput: string) {
		dispatch('aiCall', { userInput, operationType: 'assist' });
		showAiAssistant = false;
		aiMessage = '';
	}

	function handleBrainstormSubmit(userInput: string) {
		dispatch('aiCall', { userInput, operationType: 'brainstorm' });
		showBrainstorm = false;
	}

	// Handle form actions
	function handleSave() {
		dispatch('save', formData);
	}

	function handleDelete() {
		if (formData.id !== undefined) {
			dispatch('delete', formData.id);
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	// Render field based on type
	function getFieldValue(fieldId: string): string {
		return (formData[fieldId] as string) || '';
	}
</script>

<div class="space-y-6" class:animate-pulse={loading}>
	<!-- Dynamic Fields -->
	{#each config.fields as field (field.id)}
		<div>
			{#if field.type === 'text' || field.type === 'url'}
				<FormField
					id={field.id}
					label={field.label}
					type={field.type}
					value={getFieldValue(field.id)}
					placeholder={field.placeholder || ''}
					required={field.required || false}
					disabled={loading || field.disabled}
					on:input={(e) => handleFieldChange(field.id, e.detail)}
				/>
			{:else if field.type === 'textarea'}
				<FormArea
					id={field.id}
					label={field.label}
					value={getFieldValue(field.id)}
					placeholder={field.placeholder || ''}
					required={field.required || false}
					disabled={loading || field.disabled}
					on:input={(e) => handleFieldChange(field.id, e.detail)}
				/>
			{:else if field.type === 'state'}
				<StatePicker
					id={field.id}
					label={field.label}
					value={getFieldValue(field.id)}
					required={field.required || false}
					disabled={loading || field.disabled}
					on:change={(e) => handleFieldChange(field.id, e.detail)}
				/>
			{:else if field.type === 'degree'}
				<DegreePicker
					id={field.id}
					label={field.label}
					value={getFieldValue(field.id)}
					required={field.required || false}
					disabled={loading || field.disabled}
					on:change={(e) => handleFieldChange(field.id, e.detail)}
				/>
			{/if}
		</div>
	{/each}

	<!-- Date Range -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<DateInput
			id="startDate"
			label="Start Date"
			value={getFieldValue(config.dateConfig.startDateField)}
			disabled={loading}
			on:change={(e) => handleStartDateChange(e.detail)}
		/>

		<DateInput
			id="endDate"
			label="End Date"
			value={getFieldValue(config.dateConfig.endDateField)}
			disabled={loading || endDateChecked}
			on:change={(e) => handleEndDateChange(e.detail)}
		>
			<label class="flex items-center mt-2 cursor-pointer">
				<input
					type="checkbox"
					checked={endDateChecked}
					on:change={(e) => handleCurrentCheckbox(e.currentTarget.checked)}
					class="mr-2 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
					disabled={loading}
				/>
				<span class="text-sm text-gray-600">{config.dateConfig.currentLabel}</span>
			</label>
		</DateInput>
	</div>

	<!-- Highlights Section -->
	<HighlightsList
		label={config.highlightsLabel}
		placeholder={config.highlightsPlaceholder}
		{highlights}
		disabled={loading}
		on:add={handleHighlightAdd}
		on:change={(e) => handleHighlightChange(e.detail.index, e.detail.value)}
		on:delete={(e) => handleHighlightDelete(e.detail)}
		on:reorder={(e) => handleHighlightReorder(e.detail.from, e.detail.to)}
		on:aiAssist={() => (showAiAssistant = true)}
		on:brainstorm={() => (showBrainstorm = true)}
	/>

	<!-- AI Assistant Panel -->
	{#if showAiAssistant}
		<AIAssistant
			suggestions={config.aiSuggestions}
			bind:message={aiMessage}
			{loading}
			on:submit={(e) => handleAiSubmit(e.detail)}
			on:close={() => (showAiAssistant = false)}
		/>
	{/if}

	<!-- Brainstorm Modal -->
	<BrainstormModal
		bind:open={showBrainstorm}
		placeholder={config.brainstormPlaceholder}
		{loading}
		on:submit={(e) => handleBrainstormSubmit(e.detail)}
		on:cancel={() => (showBrainstorm = false)}
	/>

	<!-- Action Buttons -->
	<div class="flex flex-wrap justify-between gap-2 pt-4 border-t border-gray-200">
		<Button
			variant="secondary"
			disabled={loading || formData.id === undefined}
			on:click={handleDelete}
		>
			Delete
		</Button>

		<div class="flex gap-2">
			<Button variant="ghost" disabled={loading} on:click={handleCancel}>
				Cancel
			</Button>
			<Button variant="primary" disabled={loading} on:click={handleSave}>
				Save
			</Button>
		</div>
	</div>
</div>
