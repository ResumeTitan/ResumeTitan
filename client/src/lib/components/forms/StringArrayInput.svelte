<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import FormArea from './FormArea.svelte';

    export let id: string = '';
    export let label = '';
    export let items: string[] = [];
    export let placeholder = 'Add item...';
    export let disabled = false;

    const dispatch = createEventDispatcher<{ change: string[] }>();

    function addItem() {
        if (disabled) return;
        items = [...items, ''];
        dispatch('change', items);
    }

    function removeItem(index: number) {
        if (disabled) return;
        items = items.filter((_, i) => i !== index);
        dispatch('change', items);
    }

    function updateItem(index: number, value: string) {
        if (disabled) return;
        items = items.map((item, i) => (i === index ? value : item));
        dispatch('change', items);
    }
</script>

<div class="w-full">
    {#if label}
        <label for={id} class="form-label-text block mb-2">
            {label}
        </label>
    {/if}

    <div class="space-y-3">
        {#each items as item, i (i)}
            <div class="flex gap-2 items-start">
                <div class="flex-1">
                    <FormArea
                        id="{id}-{i}"
                        value={item}
                        {placeholder}
                        {disabled}
                        rows={2}
                        on:input={e => updateItem(i, e.detail)}
                    />
                </div>
                {#if !disabled}
                    <button
                        type="button"
                        class="btn-remove-content mt-0"
                        on:click={() => removeItem(i)}
                        aria-label="Remove item"
                    >
                        ×
                    </button>
                {/if}
            </div>
        {/each}

        {#if !disabled}
            <button type="button" class="btn-add-small w-full" on:click={addItem}>
                + Add {label || 'Item'}
            </button>
        {/if}
    </div>
</div>
