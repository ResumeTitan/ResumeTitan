<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { WorkType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import DateInput from '$components/forms/DateInput.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let work: WorkType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: WorkType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', work);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof WorkType, value: any) {
        work = { ...work, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {work.position || 'New Position'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="work-position"
                    label="Position"
                    value={work.position}
                    placeholder="Software Engineer"
                    {disabled}
                    on:input={e => updateField('position', e.detail)}
                />

                <FormField
                    id="work-name"
                    label="Company Name"
                    value={work.name}
                    placeholder="Acme Corporation"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormField
                    id="work-website"
                    label="Website"
                    type="url"
                    value={work.website}
                    placeholder="https://www.company.com"
                    {disabled}
                    on:input={e => updateField('website', e.detail)}
                />

                <div class="form-row">
                    <FormField
                        id="work-city"
                        label="City"
                        value={work.city || ''}
                        placeholder="San Francisco"
                        {disabled}
                        on:input={e => updateField('city', e.detail)}
                    />

                    <FormField
                        id="work-state"
                        label="State"
                        value={work.state || ''}
                        placeholder="CA"
                        {disabled}
                        on:input={e => updateField('state', e.detail)}
                    />
                </div>

                <div class="form-row">
                    <DateInput
                        id="work-start"
                        label="Start Date"
                        value={work.startDate}
                        {disabled}
                        on:change={e => updateField('startDate', e.detail)}
                    />

                    <DateInput
                        id="work-end"
                        label="End Date"
                        value={work.endDate}
                        {disabled}
                        on:change={e => updateField('endDate', e.detail)}
                    >
                        <label class="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                class="checkbox-input"
                                checked={work.endDateCurrent}
                                {disabled}
                                on:change={e => updateField('endDateCurrent', e.currentTarget.checked)}
                            />
                            <span class="text-sm">Current</span>
                        </label>
                    </DateInput>
                </div>

                <FormArea
                    id="work-summary"
                    label="Summary"
                    value={work.summary}
                    placeholder="Brief description of the role..."
                    {disabled}
                    rows={3}
                    on:input={e => updateField('summary', e.detail)}
                />

                <StringArrayInput
                    id="work-highlights"
                    label="Highlights"
                    items={work.highlights}
                    placeholder="Key achievement or responsibility..."
                    {disabled}
                    on:change={e => updateField('highlights', e.detail)}
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
