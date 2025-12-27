<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { toMonthInputValue } from '$utils';

    export let id: string;
    export let label = '';
    export let value = '';
    export let required = false;
    export let disabled = false;
    export let error = '';

    const dispatch = createEventDispatcher<{ change: string }>();

    // Convert to month input format for display
    $: displayValue = toMonthInputValue(value);

    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        // Month input gives YYYY-MM, convert to full date
        const newValue = target.value ? `${target.value}-01` : '';
        value = newValue;
        dispatch('change', newValue);
    }
</script>

<div class="w-full">
    {#if label}
        <label for={id} class="form-label-text block mb-2">
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </label>
    {/if}

    <input
        {id}
        type="month"
        value={displayValue}
        {required}
        {disabled}
        class="form-style {error ? 'border-red-500' : ''}"
        on:change={handleChange}
        on:focus
        on:blur
        {...$$restProps}
    />

    {#if error}
        <p class="mt-1 text-sm text-red-500">{error}</p>
    {/if}

    <!-- Slot for additional content like "Current" checkbox -->
    <slot />
</div>
