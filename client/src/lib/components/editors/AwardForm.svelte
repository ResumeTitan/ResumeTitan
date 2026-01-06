<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { AwardType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import DateInput from '$components/forms/DateInput.svelte';

    export let award: AwardType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: AwardType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', award);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof AwardType, value: any) {
        award = { ...award, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {award.title || 'New Award'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="award-title"
                    label="Award Title"
                    value={award.title}
                    placeholder="Employee of the Year"
                    {disabled}
                    on:input={e => updateField('title', e.detail)}
                />

                <FormField
                    id="award-awarder"
                    label="Awarder"
                    value={award.awarder}
                    placeholder="Organization or Institution"
                    {disabled}
                    on:input={e => updateField('awarder', e.detail)}
                />

                <DateInput
                    id="award-date"
                    label="Date Received"
                    value={award.date}
                    {disabled}
                    on:change={e => updateField('date', e.detail)}
                />

                <FormArea
                    id="award-summary"
                    label="Summary"
                    value={award.summary}
                    placeholder="Brief description of the award..."
                    {disabled}
                    rows={4}
                    on:input={e => updateField('summary', e.detail)}
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
