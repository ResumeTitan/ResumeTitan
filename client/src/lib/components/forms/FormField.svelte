<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string = '';
	export let label = '';
	export let title = ''; // Alias for label
	export let type: 'text' | 'email' | 'url' | 'tel' | 'password' = 'text';
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let error = '';
	export let onChange: ((event: Event) => void) | undefined = undefined;

	const dispatch = createEventDispatcher<{ change: string; input: string }>();

	// Use title as label if label not provided
	$: displayLabel = label || title;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', value);
		if (onChange) {
			onChange(event);
		}
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('change', target.value);
	}
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

	<input
		{id}
		{type}
		{value}
		{placeholder}
		{required}
		{disabled}
		class="form-style {error ? 'border-red-500' : ''}"
		on:input={handleInput}
		on:change={handleChange}
		on:focus
		on:blur
		{...$$restProps}
	/>

	{#if error}
		<p class="mt-1 text-sm text-red-500">{error}</p>
	{/if}
</div>
