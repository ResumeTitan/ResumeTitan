<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { InterestType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let interest: InterestType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: InterestType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', interest);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof InterestType, value: any) {
        interest = { ...interest, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {interest.name || 'New Interest'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="interest-name"
                    label="Interest Name"
                    value={interest.name}
                    placeholder="Photography"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <StringArrayInput
                    id="interest-keywords"
                    label="Keywords"
                    items={interest.keywords}
                    placeholder="e.g., Landscape, Portrait, Digital..."
                    {disabled}
                    on:change={e => updateField('keywords', e.detail)}
                />
            </div>

            <div class="flex justify-between mt-6">
                <button type="button" class="btn-secondary" on:click={handleDelete}>
                    Delete
                </button>
                <div class="flex gap-2">
                    <button type="button" class="btn-add" on:click={handleCancel}>
                        Cancel
                    </button>
                    <button type="button" class="btn-primary" on:click={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
