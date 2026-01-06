<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { LanguageType } from '$types';
    import FormField from '$components/forms/FormField.svelte';
    import FormDropdown from '$components/forms/FormDropdown.svelte';

    export let language: LanguageType;
    export let disabled = false;

    const dispatch = createEventDispatcher<{
        save: LanguageType;
        cancel: void;
        delete: void;
    }>();

    const fluencyLevels = [
        { value: '', label: 'Select Fluency' },
        { value: 'Elementary', label: 'Elementary' },
        { value: 'Limited Working', label: 'Limited Working' },
        { value: 'Professional Working', label: 'Professional Working' },
        { value: 'Full Professional', label: 'Full Professional' },
        { value: 'Native', label: 'Native or Bilingual' },
    ];

    function handleSave() {
        dispatch('save', language);
    }

    function handleCancel() {
        dispatch('cancel');
    }

    function handleDelete() {
        dispatch('delete');
    }

    function updateField(field: keyof LanguageType, value: any) {
        language = { ...language, [field]: value };
    }
</script>

<div class="layover-container">
    <div class="bg-white rounded-lg border-2 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="form-text-main">
            {language.language || 'New Language'}
        </div>

        <div class="form-content">
            <div class="space-y-5">
                <FormField
                    id="language-name"
                    label="Language"
                    value={language.language}
                    placeholder="Spanish"
                    {disabled}
                    on:input={e => updateField('language', e.detail)}
                />

                <FormDropdown
                    id="language-fluency"
                    label="Fluency Level"
                    value={language.fluency}
                    options={fluencyLevels}
                    {disabled}
                    on:change={e => updateField('fluency', e.detail)}
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
