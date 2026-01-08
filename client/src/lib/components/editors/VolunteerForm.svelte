<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { VolunteerType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import DateInput from '$components/forms/DateInput.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let volunteer: VolunteerType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: VolunteerType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', volunteer);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof VolunteerType, value: any) {
        volunteer = { ...volunteer, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {volunteer.organization || 'New Volunteer Experience'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="volunteer-organization"
                    label="Organization"
                    value={volunteer.organization}
                    placeholder="Habitat for Humanity"
                    {disabled}
                    on:input={e => updateField('organization', e.detail)}
                />

                <FormField
                    id="volunteer-position"
                    label="Position"
                    value={volunteer.position}
                    placeholder="Volunteer Coordinator"
                    {disabled}
                    on:input={e => updateField('position', e.detail)}
                />

                <FormField
                    id="volunteer-url"
                    label="Website"
                    type="url"
                    value={volunteer.url}
                    placeholder="https://www.organization.org"
                    {disabled}
                    on:input={e => updateField('url', e.detail)}
                />

                <div class="form-row">
                    <DateInput
                        id="volunteer-start"
                        label="Start Date"
                        value={volunteer.startDate}
                        {disabled}
                        on:change={e => updateField('startDate', e.detail)}
                    />

                    <DateInput
                        id="volunteer-end"
                        label="End Date"
                        value={volunteer.endDate}
                        {disabled}
                        on:change={e => updateField('endDate', e.detail)}
                    >
                        <label class="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                class="checkbox-input"
                                checked={volunteer.endDateCurrent}
                                {disabled}
                                on:change={e => updateField('endDateCurrent', e.currentTarget.checked)}
                            />
                            <span class="text-sm">Current</span>
                        </label>
                    </DateInput>
                </div>

                <StringArrayInput
                    id="volunteer-highlights"
                    label="Highlights"
                    items={volunteer.highlights}
                    placeholder="Key achievement or contribution..."
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
