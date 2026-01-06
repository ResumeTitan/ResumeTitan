<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ReferenceType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';

    export let reference: ReferenceType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: ReferenceType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', reference);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof ReferenceType, value: any) {
        reference = { ...reference, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {reference.name || 'New Reference'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="reference-name"
                    label="Name"
                    value={reference.name}
                    placeholder="John Doe"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormArea
                    id="reference-text"
                    label="Reference"
                    value={reference.reference}
                    placeholder="Brief reference or recommendation..."
                    {disabled}
                    rows={4}
                    on:input={e => updateField('reference', e.detail)}
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
