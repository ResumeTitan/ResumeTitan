<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string = '';
	export let label = '';
	export let title = ''; // Alias for label
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let rows = 4;
	export let error = '';
	export let maxLength: number | undefined = undefined;
	export let onChange: ((event: Event) => void) | undefined = undefined;

	const dispatch = createEventDispatcher<{ change: string; input: string }>();

	// Use title as label if label not provided
	$: displayLabel = label || title;

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		dispatch('input', value);
		if (onChange) {
			onChange(event);
		}
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		dispatch('change', target.value);
	}

	$: charCount = value?.length || 0;
	$: showCount = maxLength !== undefined;
</script>

<div class="w-full">
	{#if displayLabel}
		<label for={id} class="form-label-text block mb-2">
			{displayLabel}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<textarea
		{id}
		{rows}
		{value}
		{placeholder}
		{required}
		{disabled}
		maxlength={maxLength}
		class="form-style resize-y {error ? 'border-red-500' : ''}"
		on:input={handleInput}
		on:change={handleChange}
		on:focus
		on:blur
		{...$$restProps}
	></textarea>

	<div class="flex justify-between mt-1">
		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{:else}
			<span></span>
		{/if}

		{#if showCount}
			<p class="text-sm text-gray-500">
				{charCount}{maxLength ? `/${maxLength}` : ''}
			</p>
		{/if}
	</div>
</div>
