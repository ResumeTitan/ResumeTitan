<script lang="ts">
    /**
     * ResumeEditorCore
     *
     * Reusable resume editor component that can be used in both
     * solo editing (/resume/[id]) and collaborative (/workshop/[id]) modes.
     */
    import { createEventDispatcher } from 'svelte';
    import type { ResumeType, WorkType, EducationType, VolunteerType, ProjectType } from '$types';
    import { RESUME_THEMES, RESUME_FONTS, RESUME_SECTIONS } from '$config';

    import Tabs from '$components/ui/Tabs.svelte';
    import ResumeContainer from '$components/resume/ResumeContainer.svelte';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import FormDropdown from '$components/forms/FormDropdown.svelte';

    // Props
    export let resume: ResumeType;
    export let readonly = false;
    export let showPreview = true;
    export let showEditor = true;
    export let previewPosition: 'right' | 'bottom' = 'right';

    // Internal state
    let activeTab = 'action';

    // Editor state for modals
    let editingWork: WorkType | null = null;
    let editingEducation: EducationType | null = null;
    let editingVolunteer: VolunteerType | null = null;
    let editingProject: ProjectType | null = null;

    const dispatch = createEventDispatcher<{
        change: { field: string; value: any; path?: string[] };
        save: ResumeType;
    }>();

    const tabs = [
        { id: 'action', label: 'Edit' },
        { id: 'customize', label: 'Customize' },
    ];

    function normalizeThemeValue(theme: string): string {
        const match = RESUME_THEMES.find(option => option.value === theme || option.label === theme);
        return match ? match.value : theme;
    }

    $: if (resume?.theme) {
        const normalizedTheme = normalizeThemeValue(resume.theme);
        if (normalizedTheme !== resume.theme) {
            resume = { ...resume, theme: normalizedTheme as ResumeType['theme'] };
        }
    }

    function handleBasicsChange(field: string, value: string) {
        if (readonly) return;
        resume = {
            ...resume,
            basics: { ...resume.basics, [field]: value },
        };
        dispatch('change', { field, value, path: ['basics', field] });
    }

    function handleLocationChange(field: string, value: string) {
        if (readonly) return;
        resume = {
            ...resume,
            basics: {
                ...resume.basics,
                location: { ...resume.basics.location, [field]: value },
            },
        };
        dispatch('change', { field, value, path: ['basics', 'location', field] });
    }

    function addWork() {
        if (readonly) return;
        editingWork = {
            id: Date.now(),
            name: '',
            position: '',
            website: '',
            startDate: '',
            endDate: '',
            endDateCurrent: false,
            summary: '',
            highlights: [''],
        };
    }

    function addEducation() {
        if (readonly) return;
        editingEducation = {
            id: Date.now(),
            institution: '',
            area: '',
            studyType: '',
            startDate: '',
            endDate: '',
            endDateCurrent: false,
            score: '',
            courses: [],
            highlights: [''],
        };
    }

    function handleThemeChange(theme: string) {
        if (readonly) return;
        resume = { ...resume, theme: theme as ResumeType['theme'] };
        dispatch('change', { field: 'theme', value: theme });
    }

    function handleFontChange(font: string) {
        if (readonly) return;
        resume = { ...resume, font: font as ResumeType['font'] };
        dispatch('change', { field: 'font', value: font });
    }

    function handleSectionToggle(sectionValue: string, checked: boolean) {
        if (readonly) return;
        if (checked) {
            resume.sections = [...resume.sections, sectionValue];
        } else {
            resume.sections = resume.sections.filter(s => s !== sectionValue);
        }
        dispatch('change', { field: 'sections', value: resume.sections });
    }
</script>

<div class="editor-wrapper" class:with-preview={showPreview && showEditor && previewPosition === 'right'}>
    <!-- Editor Panel -->
    {#if showEditor}
        <div class="editor-panel">
            <Tabs {tabs} bind:activeTab on:change={e => (activeTab = e.detail)} let:activeTab={currentTab} variant="underline">
                {#if currentTab === 'action'}
                    <!-- Personal Info -->
                    <div class="section-box">
                        <div class="section-header">Personal Information</div>
                        <div class="section-content">
                            <div class="field-group">
                                <FormField
                                    id="name"
                                    label="Full Name"
                                    value={resume.basics.name}
                                    placeholder="John Doe"
                                    disabled={readonly}
                                    on:input={e => handleBasicsChange('name', e.detail)}
                                />
                            </div>
                            <div class="field-group">
                                <FormField
                                    id="label"
                                    label="Professional Title"
                                    value={resume.basics.label}
                                    placeholder="Software Engineer"
                                    disabled={readonly}
                                    on:input={e => handleBasicsChange('label', e.detail)}
                                />
                            </div>
                            <div class="field-group">
                                <FormField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={resume.basics.email}
                                    placeholder="john@example.com"
                                    disabled={readonly}
                                    on:input={e => handleBasicsChange('email', e.detail)}
                                />
                            </div>
                            <div class="field-group">
                                <FormField
                                    id="phone"
                                    label="Phone"
                                    type="tel"
                                    value={resume.basics.phone}
                                    placeholder="(555) 123-4567"
                                    disabled={readonly}
                                    on:input={e => handleBasicsChange('phone', e.detail)}
                                />
                            </div>
                            <div class="field-row">
                                <div class="field-group">
                                    <FormField
                                        id="city"
                                        label="City"
                                        value={resume.basics.location.city}
                                        placeholder="New York"
                                        disabled={readonly}
                                        on:input={e => handleLocationChange('city', e.detail)}
                                    />
                                </div>
                                <div class="field-group">
                                    <FormField
                                        id="region"
                                        label="State"
                                        value={resume.basics.location.region}
                                        placeholder="NY"
                                        disabled={readonly}
                                        on:input={e => handleLocationChange('region', e.detail)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div class="section-box">
                        <div class="section-header">Summary</div>
                        <div class="section-content">
                            <FormArea
                                id="summary"
                                value={resume.basics.summary}
                                placeholder="Write a brief professional summary..."
                                disabled={readonly}
                                on:input={e => handleBasicsChange('summary', e.detail)}
                            />
                        </div>
                    </div>

                    <!-- Work Experience -->
                    <div class="section-box">
                        <div class="section-header with-action">
                            <span>Work Experience</span>
                            {#if !readonly}
                                <button class="header-btn" on:click={addWork}>+ Add</button>
                            {/if}
                        </div>
                        <div class="list-content">
                            {#if resume.work && resume.work.length > 0}
                                {#each resume.work as job (job.id)}
                                    <div class="list-item">
                                        <span class="font-medium">{job.position || 'New Position'}</span>
                                        <span class="text-gray-500 ml-2">{job.name || ''}</span>
                                    </div>
                                {/each}
                            {:else}
                                <p class="empty-text">No work experience added yet.</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Education -->
                    <div class="section-box">
                        <div class="section-header with-action">
                            <span>Education</span>
                            {#if !readonly}
                                <button class="header-btn" on:click={addEducation}>+ Add</button>
                            {/if}
                        </div>
                        <div class="list-content">
                            {#if resume.education && resume.education.length > 0}
                                {#each resume.education as edu (edu.id)}
                                    <div class="list-item">
                                        <span class="font-medium">{edu.institution || 'New School'}</span>
                                        <span class="text-gray-500 ml-2">{edu.studyType || ''}</span>
                                    </div>
                                {/each}
                            {:else}
                                <p class="empty-text">No education added yet.</p>
                            {/if}
                        </div>
                    </div>
                {:else if currentTab === 'customize'}
                    <!-- Font Selection -->
                    <div class="section-box">
                        <div class="section-header">Font</div>
                        <div class="section-content">
                            <FormDropdown
                                id="font"
                                label="Font Family"
                                value={resume.font}
                                options={[...RESUME_FONTS]}
                                disabled={readonly}
                                on:change={e => handleFontChange(e.detail)}
                            />
                        </div>
                    </div>

                    <!-- Sections -->
                    <div class="section-box">
                        <div class="section-header">Visible Sections</div>
                        <div class="section-content">
                            <div class="checkbox-grid">
                                {#each RESUME_SECTIONS as section}
                                    <label class="checkbox-row">
                                        <input
                                            type="checkbox"
                                            checked={resume.sections.includes(section.value)}
                                            disabled={section.required || readonly}
                                            on:change={e => handleSectionToggle(section.value, e.currentTarget.checked)}
                                        />
                                        <span>{section.label}</span>
                                        {#if section.required}
                                            <span class="required-label">(Required)</span>
                                        {/if}
                                    </label>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            </Tabs>
        </div>
    {/if}

    <!-- Preview Panel -->
    {#if showPreview}
        <div class="preview-panel" class:full-width={!showEditor || previewPosition === 'bottom'}>
            <div class="preview-wrapper">
                <h3 class="preview-header">Preview</h3>
                <div class="preview-box">
                    <ResumeContainer {resume} autoScale={true} />
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .editor-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .editor-wrapper.with-preview {
        flex-direction: row;
    }

    .editor-panel {
        flex: 1;
        min-width: 0;
    }

    .with-preview .editor-panel {
        width: 50%;
    }

    /* Section boxes with green headers */
    .section-box {
        border: 2px solid #000;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        background: #fff;
        overflow: hidden;
    }

    .section-header {
        background: #115e59;
        color: #fff;
        font-weight: 700;
        font-size: 1.25rem;
        padding: 1rem 1.5rem;
        border-bottom: 2px solid #000;
    }

    .section-header.with-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-btn {
        background: transparent;
        color: #fff;
        border: 2px solid #fff;
        padding: 0.375rem 1rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .header-btn:hover {
        background: #fff;
        color: #115e59;
    }

    .section-content {
        padding: 1.5rem;
    }

    .list-content {
        background: #fff;
    }

    .list-item {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #000;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .list-item:hover {
        background: #f3f4f6;
    }

    .list-item:last-child {
        border-bottom: none;
    }

    .empty-text {
        color: #6b7280;
        text-align: center;
        padding: 1.5rem;
    }

    /* Field spacing */
    .field-group {
        margin-bottom: 1.25rem;
    }

    .field-group:last-child {
        margin-bottom: 0;
    }

    .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    /* Checkbox grid */
    .checkbox-grid {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .checkbox-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .checkbox-row input[type='checkbox'] {
        width: 1.125rem;
        height: 1.125rem;
        accent-color: #115e59;
    }

    .required-label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-left: 0.25rem;
    }

    /* Preview panel */
    .preview-panel {
        width: 50%;
        position: sticky;
        top: 1rem;
        align-self: flex-start;
    }

    .preview-panel.full-width {
        width: 100%;
        position: static;
    }

    .preview-wrapper {
        background: #f3f4f6;
        border-radius: 0.5rem;
        padding: 1rem;
    }

    .preview-header {
        font-size: 1.125rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: #374151;
    }

    .preview-box {
        background: #fff;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-radius: 0.375rem;
        overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .editor-wrapper.with-preview {
            flex-direction: column;
        }

        .with-preview .editor-panel,
        .preview-panel {
            width: 100%;
        }

        .preview-panel {
            position: static;
        }
    }
</style>
