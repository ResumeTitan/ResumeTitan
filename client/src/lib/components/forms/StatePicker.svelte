<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import FormDropdown from './FormDropdown.svelte';
    import { US_STATES } from '$config';

    export let id = 'state';
    export let label = 'State';
    export let value = '';
    export let required = false;
    export let disabled = false;
    export let error = '';

    const dispatch = createEventDispatcher<{ change: string }>();

    function handleChange(event: CustomEvent<string>) {
        value = event.detail;
        dispatch('change', value);
    }

    // Convert readonly tuple to mutable array
    const stateOptions = [...US_STATES];
</script>

<FormDropdown
    {id}
    {label}
    {value}
    options={stateOptions}
    {required}
    {disabled}
    {error}
    placeholder="Select State"
    on:change={handleChange}
/>
