/**
 * Editor Configurations
 *
 * Configuration objects for the unified GenericEditor component.
 * Replaces 4 duplicate editor components with a single configurable editor.
 */

import type { EditorConfig } from '$types';
import { AI_SUGGESTIONS, VOLUNTEER_PLACEHOLDERS } from './constants';

export const JOB_EDITOR_CONFIG: EditorConfig = {
    entityType: 'job',
    title: 'Work Experience',
    apiEndpoint: '/resume/work',
    fields: [
        {
            id: 'position',
            label: 'Job Title',
            type: 'text',
            placeholder: 'Enter job title...',
            required: true,
        },
        {
            id: 'name',
            label: 'Employer/Organization',
            type: 'text',
            placeholder: 'Enter name of employer...',
            required: true,
        },
        {
            id: 'city',
            label: 'City',
            type: 'text',
            placeholder: 'Enter city...',
        },
        {
            id: 'state',
            label: 'State',
            type: 'state',
        },
    ],
    dateConfig: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        currentField: 'endDateCurrent',
        currentLabel: 'I currently work here',
    },
    highlightsLabel: 'Highlights',
    highlightsPlaceholder: 'Enter highlights from work...',
    brainstormPlaceholder: 'E.g. Led a team, Improved efficiency, Managed budgets',
    aiSuggestions: AI_SUGGESTIONS,
};

export const SCHOOL_EDITOR_CONFIG: EditorConfig = {
    entityType: 'school',
    title: 'Education',
    apiEndpoint: '/resume/education',
    fields: [
        {
            id: 'institution',
            label: 'School',
            type: 'text',
            placeholder: 'Enter school name...',
            required: true,
        },
        {
            id: 'area',
            label: 'Major/Area of Study',
            type: 'text',
            placeholder: 'Enter major or area of study...',
            required: true,
        },
        {
            id: 'studyType',
            label: 'Degree',
            type: 'degree',
        },
        {
            id: 'score',
            label: 'GPA (Optional)',
            type: 'text',
            placeholder: 'Enter GPA...',
        },
    ],
    dateConfig: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        currentField: 'endDateCurrent',
        currentLabel: 'I currently attend here',
    },
    highlightsLabel: 'Highlights',
    highlightsPlaceholder: 'Enter highlights from school...',
    brainstormPlaceholder: 'E.g. Led a club, Won a scholarship, Volunteered for events',
    aiSuggestions: AI_SUGGESTIONS,
};

export const VOLUNTEER_EDITOR_CONFIG: EditorConfig = {
    entityType: 'volunteer',
    title: 'Volunteer Experience',
    apiEndpoint: '/resume/volunteer',
    fields: [
        {
            id: 'organization',
            label: 'Organization',
            type: 'text',
            placeholder: 'Enter organization name...',
            required: true,
        },
        {
            id: 'position',
            label: 'Role/Position',
            type: 'text',
            placeholder: 'Enter your role...',
            required: true,
        },
        {
            id: 'url',
            label: 'Website (Optional)',
            type: 'url',
            placeholder: 'https://...',
        },
    ],
    dateConfig: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        currentField: 'endDateCurrent',
        currentLabel: 'I currently volunteer here',
    },
    highlightsLabel: 'Highlights',
    highlightsPlaceholder: VOLUNTEER_PLACEHOLDERS[0],
    brainstormPlaceholder: 'E.g. Organized events, Mentored youth, Raised funds',
    aiSuggestions: AI_SUGGESTIONS,
};

export const PROJECT_EDITOR_CONFIG: EditorConfig = {
    entityType: 'project',
    title: 'Project',
    apiEndpoint: '/resume/project',
    fields: [
        {
            id: 'name',
            label: 'Project Name',
            type: 'text',
            placeholder: 'Enter project name...',
            required: true,
        },
        {
            id: 'url',
            label: 'Project URL (Optional)',
            type: 'url',
            placeholder: 'https://...',
        },
    ],
    dateConfig: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        currentField: 'endDateCurrent',
        currentLabel: 'This is an ongoing project',
    },
    highlightsLabel: 'Description & Highlights',
    highlightsPlaceholder: 'Describe what you built and the impact...',
    brainstormPlaceholder: 'E.g. Built with React, Improved performance by 50%, Deployed to AWS',
    aiSuggestions: AI_SUGGESTIONS,
};

// Map of entity type to config
export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
    job: JOB_EDITOR_CONFIG,
    school: SCHOOL_EDITOR_CONFIG,
    volunteer: VOLUNTEER_EDITOR_CONFIG,
    project: PROJECT_EDITOR_CONFIG,
};

// Helper to get config by entity type
export function getEditorConfig(entityType: string): EditorConfig | undefined {
    return EDITOR_CONFIGS[entityType];
}
