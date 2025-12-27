<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let id: string = '';
    export let label = '';
    export let title = ''; // Alias for label
    export let value = '';
    export let options: Array<{ value: string; label: string }> = [];
    export let required = false;
    export let disabled = false;
    export let error = '';
    export let placeholder = 'Select an option';
    export let onChange: ((event: Event) => void) | undefined = undefined;

    const dispatch = createEventDispatcher<{ change: string }>();

    // Use title as label if label not provided
    $: displayLabel = label || title;

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        value = target.value;
        dispatch('change', value);
        if (onChange) {
            onChange(event);
        }
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

    <select
        {id}
        {value}
        {required}
        {disabled}
        class="form-style {error ? 'border-red-500' : ''}"
        on:change={handleChange}
        on:focus
        on:blur
        {...$$restProps}
    >
        {#if placeholder}
            <option value="" disabled>{placeholder}</option>
        {/if}
        {#each options as option (option.value)}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>

    {#if error}
        <p class="mt-1 text-sm text-red-500">{error}</p>
    {/if}
</div>
