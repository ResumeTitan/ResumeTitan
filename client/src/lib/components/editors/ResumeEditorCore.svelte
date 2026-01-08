<script lang="ts">
    /**
     * ResumeEditorCore
     *
     * Reusable resume editor component that can be used in both
     * solo editing (/resume/[id]) and collaborative (/workshop/[id]) modes.
     */
    import { createEventDispatcher } from 'svelte';
    import type {
        ResumeType,
        WorkType,
        EducationType,
        VolunteerType,
        ProjectType,
        CertificateType,
        PublicationType,
        AwardType,
        SkillType,
        InterestType,
        LanguageType,
        ReferenceType
    } from '$types';
    import { RESUME_THEMES, RESUME_FONTS, RESUME_SECTIONS } from '$config';

    import Tabs from '$components/ui/Tabs.svelte';
    import ResumeContainer from '$components/resume/ResumeContainer.svelte';
    import FormField from '$components/forms/FormField.svelte';
    import FormArea from '$components/forms/FormArea.svelte';
    import FormDropdown from '$components/forms/FormDropdown.svelte';

    import WorkForm from './WorkForm.svelte';
    import EducationForm from './EducationForm.svelte';
    import ProjectForm from './ProjectForm.svelte';
    import CertificateForm from './CertificateForm.svelte';
    import PublicationForm from './PublicationForm.svelte';
    import AwardForm from './AwardForm.svelte';
    import SkillForm from './SkillForm.svelte';
    import InterestForm from './InterestForm.svelte';
    import LanguageForm from './LanguageForm.svelte';
    import ReferenceForm from './ReferenceForm.svelte';
    import VolunteerForm from './VolunteerForm.svelte';
    import DesignTokensEditor from './DesignTokensEditor.svelte';

    import type { DesignTokens } from '$lib/types/designTokens';
    import { mergeWithDefaults } from '$lib/config/designTokenDefaults';

    // Props
    export let resume: ResumeType;
    export let readonly = false;
    export let showPreview = true;
    export let showEditor = true;
    export let previewPosition: 'right' | 'bottom' = 'right';

    // Internal state
    let activeTab = 'action';
    let resumeContainerElement: HTMLElement | null = null;

    // Editor state for modals
    let editingWork: WorkType | null = null;
    let editingEducation: EducationType | null = null;
    let editingVolunteer: VolunteerType | null = null;
    let editingProject: ProjectType | null = null;
    let editingCertificate: CertificateType | null = null;
    let editingPublication: PublicationType | null = null;
    let editingAward: AwardType | null = null;
    let editingSkill: SkillType | null = null;
    let editingInterest: InterestType | null = null;
    let editingLanguage: LanguageType | null = null;
    let editingReference: ReferenceType | null = null;

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

    function addProject() {
        if (readonly) return;
        editingProject = {
            id: Date.now(),
            name: '',
            description: '',
            highlights: [''],
            keywords: [''],
            startDate: '',
            endDate: '',
            endDateCurrent: false,
            url: '',
            roles: [''],
            entity: '',
            type: '',
        };
    }

    function addVolunteer() {
        if (readonly) return;
        editingVolunteer = {
            id: Date.now(),
            organization: '',
            position: '',
            url: '',
            startDate: '',
            endDate: '',
            endDateCurrent: false,
            highlights: [''],
        };
    }

    function addCertificate() {
        if (readonly) return;
        editingCertificate = {
            name: '',
            date: '',
            issuer: '',
            url: '',
        };
    }

    function addPublication() {
        if (readonly) return;
        editingPublication = {
            name: '',
            publisher: '',
            releaseDate: '',
            url: '',
            summary: '',
        };
    }

    function addAward() {
        if (readonly) return;
        editingAward = {
            title: '',
            date: '',
            awarder: '',
            summary: '',
        };
    }

    function addSkill() {
        if (readonly) return;
        editingSkill = {
            name: '',
            level: '',
            keywords: [''],
        };
    }

    function addInterest() {
        if (readonly) return;
        editingInterest = {
            name: '',
            keywords: [''],
        };
    }

    function addLanguage() {
        if (readonly) return;
        editingLanguage = {
            language: '',
            fluency: '',
        };
    }

    function addReference() {
        if (readonly) return;
        editingReference = {
            name: '',
            reference: '',
        };
    }

    function saveWork(event: CustomEvent<WorkType>) {
        if (readonly) return;
        const work = event.detail;
        const existingIndex = resume.work.findIndex(w => w.id === work.id);
        if (existingIndex >= 0) {
            resume.work[existingIndex] = work;
        } else {
            resume.work = [...resume.work, work];
        }
        editingWork = null;
        dispatch('change', { field: 'work', value: resume.work });
    }

    function deleteWork() {
        if (readonly || !editingWork) return;
        resume.work = resume.work.filter(w => w.id !== editingWork.id);
        editingWork = null;
        dispatch('change', { field: 'work', value: resume.work });
    }

    function saveEducation(event: CustomEvent<EducationType>) {
        if (readonly) return;
        const education = event.detail;
        const existingIndex = resume.education.findIndex(e => e.id === education.id);
        if (existingIndex >= 0) {
            resume.education[existingIndex] = education;
        } else {
            resume.education = [...resume.education, education];
        }
        editingEducation = null;
        dispatch('change', { field: 'education', value: resume.education });
    }

    function deleteEducation() {
        if (readonly || !editingEducation) return;
        resume.education = resume.education.filter(e => e.id !== editingEducation.id);
        editingEducation = null;
        dispatch('change', { field: 'education', value: resume.education });
    }

    function saveProject(event: CustomEvent<ProjectType>) {
        if (readonly) return;
        const project = event.detail;
        const existingIndex = resume.projects.findIndex(p => p.id === project.id);
        if (existingIndex >= 0) {
            resume.projects[existingIndex] = project;
        } else {
            resume.projects = [...resume.projects, project];
        }
        editingProject = null;
        dispatch('change', { field: 'projects', value: resume.projects });
    }

    function deleteProject() {
        if (readonly || !editingProject) return;
        resume.projects = resume.projects.filter(p => p.id !== editingProject.id);
        editingProject = null;
        dispatch('change', { field: 'projects', value: resume.projects });
    }

    function saveVolunteer(event: CustomEvent<VolunteerType>) {
        if (readonly) return;
        const volunteer = event.detail;
        const existingIndex = resume.volunteer.findIndex(v => v.id === volunteer.id);
        if (existingIndex >= 0) {
            resume.volunteer[existingIndex] = volunteer;
        } else {
            resume.volunteer = [...resume.volunteer, volunteer];
        }
        editingVolunteer = null;
        dispatch('change', { field: 'volunteer', value: resume.volunteer });
    }

    function deleteVolunteer() {
        if (readonly || !editingVolunteer) return;
        resume.volunteer = resume.volunteer.filter(v => v.id !== editingVolunteer.id);
        editingVolunteer = null;
        dispatch('change', { field: 'volunteer', value: resume.volunteer });
    }

    function saveCertificate(event: CustomEvent<CertificateType>) {
        if (readonly) return;
        const certificate = event.detail;
        const existingIndex = resume.certificates.findIndex(c => c.name === certificate.name);
        if (existingIndex >= 0) {
            resume.certificates[existingIndex] = certificate;
        } else {
            resume.certificates = [...resume.certificates, certificate];
        }
        editingCertificate = null;
        dispatch('change', { field: 'certificates', value: resume.certificates });
    }

    function deleteCertificate() {
        if (readonly || !editingCertificate) return;
        resume.certificates = resume.certificates.filter(c => c.name !== editingCertificate.name);
        editingCertificate = null;
        dispatch('change', { field: 'certificates', value: resume.certificates });
    }

    function savePublication(event: CustomEvent<PublicationType>) {
        if (readonly) return;
        const publication = event.detail;
        const existingIndex = resume.publications.findIndex(p => p.name === publication.name);
        if (existingIndex >= 0) {
            resume.publications[existingIndex] = publication;
        } else {
            resume.publications = [...resume.publications, publication];
        }
        editingPublication = null;
        dispatch('change', { field: 'publications', value: resume.publications });
    }

    function deletePublication() {
        if (readonly || !editingPublication) return;
        resume.publications = resume.publications.filter(p => p.name !== editingPublication.name);
        editingPublication = null;
        dispatch('change', { field: 'publications', value: resume.publications });
    }

    function saveAward(event: CustomEvent<AwardType>) {
        if (readonly) return;
        const award = event.detail;
        const existingIndex = resume.awards.findIndex(a => a.title === award.title);
        if (existingIndex >= 0) {
            resume.awards[existingIndex] = award;
        } else {
            resume.awards = [...resume.awards, award];
        }
        editingAward = null;
        dispatch('change', { field: 'awards', value: resume.awards });
    }

    function deleteAward() {
        if (readonly || !editingAward) return;
        resume.awards = resume.awards.filter(a => a.title !== editingAward.title);
        editingAward = null;
        dispatch('change', { field: 'awards', value: resume.awards });
    }

    function saveSkill(event: CustomEvent<SkillType>) {
        if (readonly) return;
        const skill = event.detail;
        const existingIndex = resume.skills.findIndex(s => s.name === skill.name);
        if (existingIndex >= 0) {
            resume.skills[existingIndex] = skill;
        } else {
            resume.skills = [...resume.skills, skill];
        }
        editingSkill = null;
        dispatch('change', { field: 'skills', value: resume.skills });
    }

    function deleteSkill() {
        if (readonly || !editingSkill) return;
        resume.skills = resume.skills.filter(s => s.name !== editingSkill.name);
        editingSkill = null;
        dispatch('change', { field: 'skills', value: resume.skills });
    }

    function saveInterest(event: CustomEvent<InterestType>) {
        if (readonly) return;
        const interest = event.detail;
        const existingIndex = resume.interests.findIndex(i => i.name === interest.name);
        if (existingIndex >= 0) {
            resume.interests[existingIndex] = interest;
        } else {
            resume.interests = [...resume.interests, interest];
        }
        editingInterest = null;
        dispatch('change', { field: 'interests', value: resume.interests });
    }

    function deleteInterest() {
        if (readonly || !editingInterest) return;
        resume.interests = resume.interests.filter(i => i.name !== editingInterest.name);
        editingInterest = null;
        dispatch('change', { field: 'interests', value: resume.interests });
    }

    function saveLanguage(event: CustomEvent<LanguageType>) {
        if (readonly) return;
        const language = event.detail;
        const existingIndex = resume.languages.findIndex(l => l.language === language.language);
        if (existingIndex >= 0) {
            resume.languages[existingIndex] = language;
        } else {
            resume.languages = [...resume.languages, language];
        }
        editingLanguage = null;
        dispatch('change', { field: 'languages', value: resume.languages });
    }

    function deleteLanguage() {
        if (readonly || !editingLanguage) return;
        resume.languages = resume.languages.filter(l => l.language !== editingLanguage.language);
        editingLanguage = null;
        dispatch('change', { field: 'languages', value: resume.languages });
    }

    function saveReference(event: CustomEvent<ReferenceType>) {
        if (readonly) return;
        const reference = event.detail;
        const existingIndex = resume.references.findIndex(r => r.name === reference.name);
        if (existingIndex >= 0) {
            resume.references[existingIndex] = reference;
        } else {
            resume.references = [...resume.references, reference];
        }
        editingReference = null;
        dispatch('change', { field: 'references', value: resume.references });
    }

    function deleteReference() {
        if (readonly || !editingReference) return;
        resume.references = resume.references.filter(r => r.name !== editingReference.name);
        editingReference = null;
        dispatch('change', { field: 'references', value: resume.references });
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

    function handleDesignTokensChange(tokens: DesignTokens) {
        if (readonly) return;
        resume = { ...resume, designTokens: tokens };
        dispatch('change', { field: 'designTokens', value: tokens });
    }

    // Initialize design tokens with defaults if not present
    $: if (resume && !resume.designTokens) {
        resume = { ...resume, designTokens: mergeWithDefaults(undefined) };
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
                    {#if resume.sections.includes('Work')}
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
                                        <div class="list-item" on:click={() => (editingWork = job)}>
                                            <span class="font-medium">{job.position || 'New Position'}</span>
                                            <span class="text-gray-500 ml-2">{job.name || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No work experience added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Education -->
                    {#if resume.sections.includes('Education')}
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
                                        <div class="list-item" on:click={() => (editingEducation = edu)}>
                                            <span class="font-medium">{edu.institution || 'New School'}</span>
                                            <span class="text-gray-500 ml-2">{edu.studyType || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No education added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Projects -->
                    {#if resume.sections.includes('Projects')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Projects</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addProject}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.projects && resume.projects.length > 0}
                                    {#each resume.projects as project (project.id)}
                                        <div class="list-item" on:click={() => (editingProject = project)}>
                                            <span class="font-medium">{project.name || 'New Project'}</span>
                                            <span class="text-gray-500 ml-2">{project.type || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No projects added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Volunteer -->
                    {#if resume.sections.includes('Volunteer')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Volunteer Experience</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addVolunteer}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.volunteer && resume.volunteer.length > 0}
                                    {#each resume.volunteer as vol (vol.id)}
                                        <div class="list-item" on:click={() => (editingVolunteer = vol)}>
                                            <span class="font-medium">{vol.position || 'New Position'}</span>
                                            <span class="text-gray-500 ml-2">{vol.organization || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No volunteer experience added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Skills -->
                    {#if resume.sections.includes('Skills')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Skills</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addSkill}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.skills && resume.skills.length > 0}
                                    {#each resume.skills as skill (skill.name)}
                                        <div class="list-item" on:click={() => (editingSkill = skill)}>
                                            <span class="font-medium">{skill.name || 'New Skill'}</span>
                                            <span class="text-gray-500 ml-2">{skill.level || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No skills added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Certificates -->
                    {#if resume.sections.includes('Certificates')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Certificates</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addCertificate}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.certificates && resume.certificates.length > 0}
                                    {#each resume.certificates as cert (cert.name)}
                                        <div class="list-item" on:click={() => (editingCertificate = cert)}>
                                            <span class="font-medium">{cert.name || 'New Certificate'}</span>
                                            <span class="text-gray-500 ml-2">{cert.issuer || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No certificates added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Awards -->
                    {#if resume.sections.includes('Awards')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Awards</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addAward}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.awards && resume.awards.length > 0}
                                    {#each resume.awards as award (award.title)}
                                        <div class="list-item" on:click={() => (editingAward = award)}>
                                            <span class="font-medium">{award.title || 'New Award'}</span>
                                            <span class="text-gray-500 ml-2">{award.awarder || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No awards added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Publications -->
                    {#if resume.sections.includes('Publications')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Publications</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addPublication}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.publications && resume.publications.length > 0}
                                    {#each resume.publications as pub (pub.name)}
                                        <div class="list-item" on:click={() => (editingPublication = pub)}>
                                            <span class="font-medium">{pub.name || 'New Publication'}</span>
                                            <span class="text-gray-500 ml-2">{pub.publisher || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No publications added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Languages -->
                    {#if resume.sections.includes('Languages')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Languages</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addLanguage}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.languages && resume.languages.length > 0}
                                    {#each resume.languages as lang (lang.language)}
                                        <div class="list-item" on:click={() => (editingLanguage = lang)}>
                                            <span class="font-medium">{lang.language || 'New Language'}</span>
                                            <span class="text-gray-500 ml-2">{lang.fluency || ''}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No languages added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- Interests -->
                    {#if resume.sections.includes('Interests')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>Interests</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addInterest}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.interests && resume.interests.length > 0}
                                    {#each resume.interests as interest (interest.name)}
                                        <div class="list-item" on:click={() => (editingInterest = interest)}>
                                            <span class="font-medium">{interest.name || 'New Interest'}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No interests added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <!-- References -->
                    {#if resume.sections.includes('References')}
                        <div class="section-box">
                            <div class="section-header with-action">
                                <span>References</span>
                                {#if !readonly}
                                    <button class="header-btn" on:click={addReference}>+ Add</button>
                                {/if}
                            </div>
                            <div class="list-content">
                                {#if resume.references && resume.references.length > 0}
                                    {#each resume.references as ref (ref.name)}
                                        <div class="list-item" on:click={() => (editingReference = ref)}>
                                            <span class="font-medium">{ref.name || 'New Reference'}</span>
                                        </div>
                                    {/each}
                                {:else}
                                    <p class="empty-text">No references added yet.</p>
                                {/if}
                            </div>
                        </div>
                    {/if}
                {:else if currentTab === 'customize'}
                    <!-- Theme Selection -->
                    <div class="section-box">
                        <div class="section-header">Template</div>
                        <div class="section-content">
                            <FormDropdown
                                id="theme"
                                label="Resume Theme"
                                value={resume.theme}
                                options={[...RESUME_THEMES]}
                                disabled={readonly}
                                on:change={e => handleThemeChange(e.detail)}
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

                    <!-- Design Tokens Editor -->
                    <div class="section-box">
                        <div class="section-header">Advanced Design Controls</div>
                        <div class="section-content">
                            {#if resume.designTokens}
                                <DesignTokensEditor
                                    tokens={resume.designTokens}
                                    containerElement={resumeContainerElement}
                                    {readonly}
                                    on:change={e => handleDesignTokensChange(e.detail)}
                                />
                            {/if}
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
                <div class="preview-box">
                    <ResumeContainer
                        {resume}
                        autoScale={true}
                        bind:containerElement={resumeContainerElement}
                    />
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Modal Forms -->
{#if editingWork}
    <WorkForm
        work={editingWork}
        disabled={readonly}
        on:save={saveWork}
        on:cancel={() => (editingWork = null)}
        on:delete={deleteWork}
    />
{/if}

{#if editingEducation}
    <EducationForm
        education={editingEducation}
        disabled={readonly}
        on:save={saveEducation}
        on:cancel={() => (editingEducation = null)}
        on:delete={deleteEducation}
    />
{/if}

{#if editingProject}
    <ProjectForm
        project={editingProject}
        disabled={readonly}
        on:save={saveProject}
        on:cancel={() => (editingProject = null)}
        on:delete={deleteProject}
    />
{/if}

{#if editingVolunteer}
    <VolunteerForm
        volunteer={editingVolunteer}
        disabled={readonly}
        on:save={saveVolunteer}
        on:cancel={() => (editingVolunteer = null)}
        on:delete={deleteVolunteer}
    />
{/if}

{#if editingCertificate}
    <CertificateForm
        certificate={editingCertificate}
        disabled={readonly}
        on:save={saveCertificate}
        on:cancel={() => (editingCertificate = null)}
        on:delete={deleteCertificate}
    />
{/if}

{#if editingPublication}
    <PublicationForm
        publication={editingPublication}
        disabled={readonly}
        on:save={savePublication}
        on:cancel={() => (editingPublication = null)}
        on:delete={deletePublication}
    />
{/if}

{#if editingAward}
    <AwardForm
        award={editingAward}
        disabled={readonly}
        on:save={saveAward}
        on:cancel={() => (editingAward = null)}
        on:delete={deleteAward}
    />
{/if}

{#if editingSkill}
    <SkillForm
        skill={editingSkill}
        disabled={readonly}
        on:save={saveSkill}
        on:cancel={() => (editingSkill = null)}
        on:delete={deleteSkill}
    />
{/if}

{#if editingInterest}
    <InterestForm
        interest={editingInterest}
        disabled={readonly}
        on:save={saveInterest}
        on:cancel={() => (editingInterest = null)}
        on:delete={deleteInterest}
    />
{/if}

{#if editingLanguage}
    <LanguageForm
        language={editingLanguage}
        disabled={readonly}
        on:save={saveLanguage}
        on:cancel={() => (editingLanguage = null)}
        on:delete={deleteLanguage}
    />
{/if}

{#if editingReference}
    <ReferenceForm
        reference={editingReference}
        disabled={readonly}
        on:save={saveReference}
        on:cancel={() => (editingReference = null)}
        on:delete={deleteReference}
    />
{/if}

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
        overflow: auto;
        max-height: calc(100vh - 8rem);
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
