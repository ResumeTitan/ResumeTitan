<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ProjectType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import DateInput from '$components/forms/DateInput.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let project: ProjectType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: ProjectType;
        cancel: void;
        delete: void;
    }>();

    function handleSave() {
        dispatch('save', project);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof ProjectType, value: any) {
        project = { ...project, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {project.name || 'New Project'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="project-name"
                    label="Project Name"
                    value={project.name}
                    placeholder="Personal Portfolio Website"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormArea
                    id="project-description"
                    label="Description"
                    value={project.description}
                    placeholder="Brief description of the project..."
                    {disabled}
                    rows={3}
                    on:input={e => updateField('description', e.detail)}
                />

                <FormField
                    id="project-url"
                    label="URL"
                    type="url"
                    value={project.url}
                    placeholder="https://github.com/username/project"
                    {disabled}
                    on:input={e => updateField('url', e.detail)}
                />

                <FormField
                    id="project-entity"
                    label="Entity"
                    value={project.entity}
                    placeholder="Company or organization"
                    {disabled}
                    on:input={e => updateField('entity', e.detail)}
                />

                <FormField
                    id="project-type"
                    label="Type"
                    value={project.type}
                    placeholder="e.g., Application, Website, Research"
                    {disabled}
                    on:input={e => updateField('type', e.detail)}
                />

                <div class="form-row">
                    <DateInput
                        id="project-start"
                        label="Start Date"
                        value={project.startDate}
                        {disabled}
                        on:change={e => updateField('startDate', e.detail)}
                    />

                    <DateInput
                        id="project-end"
                        label="End Date"
                        value={project.endDate}
                        {disabled}
                        on:change={e => updateField('endDate', e.detail)}
                    >
                        <label class="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                class="checkbox-input"
                                checked={project.endDateCurrent}
                                {disabled}
                                on:change={e => updateField('endDateCurrent', e.currentTarget.checked)}
                            />
                            <span class="text-sm">Current</span>
                        </label>
                    </DateInput>
                </div>

                <StringArrayInput
                    id="project-highlights"
                    label="Highlights"
                    items={project.highlights}
                    placeholder="Key achievement or feature..."
                    {disabled}
                    on:change={e => updateField('highlights', e.detail)}
                />

                <StringArrayInput
                    id="project-keywords"
                    label="Keywords"
                    items={project.keywords}
                    placeholder="Technology or skill..."
                    {disabled}
                    on:change={e => updateField('keywords', e.detail)}
                />

                <StringArrayInput
                    id="project-roles"
                    label="Roles"
                    items={project.roles}
                    placeholder="Your role in the project..."
                    {disabled}
                    on:change={e => updateField('roles', e.detail)}
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
