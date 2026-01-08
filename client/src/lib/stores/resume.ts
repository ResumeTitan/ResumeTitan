/**
 * Resume Store
 *
 * Manages the current resume being edited.
 * Provides reactive state management for the resume editor.
 */

import { writable, derived } from 'svelte/store';
import type {
    ResumeType,
    BasicsType,
    WorkType,
    EducationType,
    VolunteerType,
    ProjectType,
    SkillType,
    AwardType,
    CertificateType,
    LanguageType,
    ReferenceType,
} from '$types';
import { DEFAULT_RESUME } from '$types';
import type { DesignTokens } from '$lib/types/designTokens';
import { mergeWithDefaults } from '$lib/config/designTokenDefaults';

function createResumeStore() {
    const { subscribe, set, update } = writable<ResumeType>(DEFAULT_RESUME);

    // Track if there are unsaved changes
    const hasChanges = writable(false);

    return {
        subscribe,

        /**
         * Set the entire resume
         */
        set: (resume: ResumeType) => {
            set(resume);
            hasChanges.set(false);
        },

        /**
         * Reset to default empty resume
         */
        reset: () => {
            set(DEFAULT_RESUME);
            hasChanges.set(false);
        },

        /**
         * Update basics section
         */
        updateBasics: (basics: Partial<BasicsType>) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, basics: { ...r.basics, ...basics } };
            }),

        /**
         * Update a specific section array
         */
        updateSection: <K extends keyof ResumeType>(key: K, value: ResumeType[K]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, [key]: value };
            }),

        /**
         * Add a work experience
         */
        addWork: (work: WorkType) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, work: [...r.work, work] };
            }),

        /**
         * Update a work experience
         */
        updateWork: (id: number, work: Partial<WorkType>) =>
            update(r => {
                hasChanges.set(true);
                return {
                    ...r,
                    work: r.work.map(w => (w.id === id ? { ...w, ...work } : w)),
                };
            }),

        /**
         * Remove a work experience
         */
        removeWork: (id: number) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, work: r.work.filter(w => w.id !== id) };
            }),

        /**
         * Add an education entry
         */
        addEducation: (education: EducationType) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, education: [...r.education, education] };
            }),

        /**
         * Update an education entry
         */
        updateEducation: (id: number, education: Partial<EducationType>) =>
            update(r => {
                hasChanges.set(true);
                return {
                    ...r,
                    education: r.education.map(e => (e.id === id ? { ...e, ...education } : e)),
                };
            }),

        /**
         * Remove an education entry
         */
        removeEducation: (id: number) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, education: r.education.filter(e => e.id !== id) };
            }),

        /**
         * Add a volunteer experience
         */
        addVolunteer: (volunteer: VolunteerType) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, volunteer: [...r.volunteer, volunteer] };
            }),

        /**
         * Update a volunteer experience
         */
        updateVolunteer: (id: number, volunteer: Partial<VolunteerType>) =>
            update(r => {
                hasChanges.set(true);
                return {
                    ...r,
                    volunteer: r.volunteer.map(v => (v.id === id ? { ...v, ...volunteer } : v)),
                };
            }),

        /**
         * Remove a volunteer experience
         */
        removeVolunteer: (id: number) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, volunteer: r.volunteer.filter(v => v.id !== id) };
            }),

        /**
         * Add a project
         */
        addProject: (project: ProjectType) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, projects: [...r.projects, project] };
            }),

        /**
         * Update a project
         */
        updateProject: (id: number, project: Partial<ProjectType>) =>
            update(r => {
                hasChanges.set(true);
                return {
                    ...r,
                    projects: r.projects.map(p => (p.id === id ? { ...p, ...project } : p)),
                };
            }),

        /**
         * Remove a project
         */
        removeProject: (id: number) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, projects: r.projects.filter(p => p.id !== id) };
            }),

        /**
         * Update skills
         */
        updateSkills: (skills: SkillType[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, skills };
            }),

        /**
         * Update awards
         */
        updateAwards: (awards: AwardType[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, awards };
            }),

        /**
         * Update certificates
         */
        updateCertificates: (certificates: CertificateType[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, certificates };
            }),

        /**
         * Update languages
         */
        updateLanguages: (languages: LanguageType[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, languages };
            }),

        /**
         * Update references
         */
        updateReferences: (references: ReferenceType[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, references };
            }),

        /**
         * Set theme
         */
        setTheme: (theme: string) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, theme };
            }),

        /**
         * Set font
         */
        setFont: (font: string) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, font };
            }),

        /**
         * Set visible sections
         */
        setSections: (sections: string[]) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, sections };
            }),

        /**
         * Set resume name
         */
        setName: (name: string) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, name };
            }),

        /**
         * Set design tokens (template-agnostic customization)
         */
        setDesignTokens: (designTokens: DesignTokens) =>
            update(r => {
                hasChanges.set(true);
                return { ...r, designTokens };
            }),

        /**
         * Update partial design tokens
         */
        updateDesignTokens: (updates: Partial<DesignTokens>) =>
            update(r => {
                hasChanges.set(true);
                const currentTokens = mergeWithDefaults(r.designTokens);
                const updatedTokens = mergeWithDefaults({ ...currentTokens, ...updates });
                return { ...r, designTokens: updatedTokens };
            }),

        /**
         * Mark changes as saved
         */
        markSaved: () => hasChanges.set(false),

        /**
         * Subscribe to hasChanges
         */
        hasChanges: { subscribe: hasChanges.subscribe },
    };
}

export const resumeStore = createResumeStore();

// Derived stores for convenience
export const resumeBasics = derived(resumeStore, $resume => $resume.basics);
export const resumeWork = derived(resumeStore, $resume => $resume.work);
export const resumeEducation = derived(resumeStore, $resume => $resume.education);
export const resumeSkills = derived(resumeStore, $resume => $resume.skills);
export const resumeProjects = derived(resumeStore, $resume => $resume.projects);
export const resumeVolunteer = derived(resumeStore, $resume => $resume.volunteer);
export const resumeTheme = derived(resumeStore, $resume => $resume.theme);
export const resumeFont = derived(resumeStore, $resume => $resume.font);
export const resumeSections = derived(resumeStore, $resume => $resume.sections);
export const resumeDesignTokens = derived(resumeStore, $resume =>
    mergeWithDefaults($resume.designTokens)
);
