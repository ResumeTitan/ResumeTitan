<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { EducationType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import DegreePicker from '$components/forms/DegreePicker.svelte';
    import DateInput from '$components/forms/DateInput.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let education: EducationType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: EducationType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', education);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof EducationType, value: any) {
        education = { ...education, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {education.institution || 'New Education'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="education-institution"
                    label="Institution"
                    value={education.institution}
                    placeholder="University of California"
                    {disabled}
                    on:input={e => updateField('institution', e.detail)}
                />

                <FormField
                    id="education-area"
                    label="Area of Study"
                    value={education.area}
                    placeholder="Computer Science"
                    {disabled}
                    on:input={e => updateField('area', e.detail)}
                />

                <DegreePicker
                    id="education-degree"
                    label="Degree Type"
                    value={education.studyType}
                    {disabled}
                    on:change={e => updateField('studyType', e.detail)}
                />

                <div class="form-row">
                    <DateInput
                        id="education-start"
                        label="Start Date"
                        value={education.startDate}
                        {disabled}
                        on:change={e => updateField('startDate', e.detail)}
                    />

                    <DateInput
                        id="education-end"
                        label="End Date"
                        value={education.endDate}
                        {disabled}
                        on:change={e => updateField('endDate', e.detail)}
                    >
                        <label class="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                class="checkbox-input"
                                checked={education.endDateCurrent}
                                {disabled}
                                on:change={e => updateField('endDateCurrent', e.currentTarget.checked)}
                            />
                            <span class="text-sm">Current</span>
                        </label>
                    </DateInput>
                </div>

                <FormField
                    id="education-score"
                    label="GPA / Score"
                    value={education.score}
                    placeholder="3.8"
                    {disabled}
                    on:input={e => updateField('score', e.detail)}
                />

                <StringArrayInput
                    id="education-courses"
                    label="Relevant Courses"
                    items={education.courses}
                    placeholder="Course name..."
                    {disabled}
                    on:change={e => updateField('courses', e.detail)}
                />

                <StringArrayInput
                    id="education-highlights"
                    label="Highlights"
                    items={education.highlights}
                    placeholder="Achievement or honor..."
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
