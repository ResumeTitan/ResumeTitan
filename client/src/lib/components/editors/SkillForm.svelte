<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { SkillType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormDropdown from '$components/forms/FormDropdown.svelte';
    import StringArrayInput from '$components/forms/StringArrayInput.svelte';

    export let skill: SkillType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: SkillType;
        cancel: void;
        delete: void;
    }>();

    const skillLevels = [
        { value: '', label: 'Select Level' },
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
        { value: 'Expert', label: 'Expert' },
    ];

    function handleSave() {
        dispatch('save', skill);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof SkillType, value: any) {
        skill = { ...skill, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {skill.name || 'New Skill'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="skill-name"
                    label="Skill Name"
                    value={skill.name}
                    placeholder="Programming Languages"
                    {disabled}
                    on:input={e => updateField('name', e.detail)}
                />

                <FormDropdown
                    id="skill-level"
                    label="Proficiency Level"
                    value={skill.level}
                    options={skillLevels}
                    {disabled}
                    on:change={e => updateField('level', e.detail)}
                />

                <StringArrayInput
                    id="skill-keywords"
                    label="Keywords"
                    items={skill.keywords}
                    placeholder="e.g., JavaScript, Python, React..."
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
