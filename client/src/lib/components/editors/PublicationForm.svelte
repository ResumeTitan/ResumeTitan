<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { PublicationType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import DateInput from '$components/forms/DateInput.svelte';

    export let publication: PublicationType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: PublicationType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', publication);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof PublicationType, value: any) {
        publication = { ...publication, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {publication.name || 'New Publication'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="publication-name"
                    label="Publication Title"
                    value={publication.name}
                    placeholder="Research Paper Title"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormField
                    id="publication-publisher"
                    label="Publisher"
                    value={publication.publisher}
                    placeholder="Journal or Conference Name"
                    {disabled}
                    on:input={e => updateField('publisher', e.detail)}
                />

                <DateInput
                    id="publication-date"
                    label="Release Date"
                    value={publication.releaseDate}
                    {disabled}
                    on:change={e => updateField('releaseDate', e.detail)}
                />

                <FormField
                    id="publication-url"
                    label="URL"
                    type="url"
                    value={publication.url}
                    placeholder="https://doi.org/..."
                    {disabled}
                    on:input={e => updateField('url', e.detail)}
                />

                <FormArea
                    id="publication-summary"
                    label="Summary"
                    value={publication.summary}
                    placeholder="Brief summary of the publication..."
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
