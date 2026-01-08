<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import FormDropdown from './FormDropdown.svelte';
    import { DEGREE_TYPES } from '$config';

    export let id = 'degree';
    export let label = 'Degree';
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
    const degreeOptions = [...DEGREE_TYPES];
</script>

<FormDropdown
    {id}
    {label}
    {value}
    options={degreeOptions}
    {required}
    {disabled}
    {error}
    placeholder="Select Degree"
    on:change={handleChange}
/>
