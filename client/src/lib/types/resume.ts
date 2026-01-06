/**
 * Resume Types
 *
 * TypeScript interfaces for resume data structures.
 * Migrated from client/src/types/types.ts
 */

export interface LocationType {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
}

export interface ProfileType {
    network: string;
    username: string;
    url: string;
}

export interface BasicsType {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: LocationType;
    profiles: ProfileType[];
}

export interface EducationType {
    id: number;
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    endDateCurrent: boolean;
    score: string;
    courses: string[];
    highlights: string[];
}

export interface WorkType {
    id: number;
    name: string;
    position: string;
    website: string;
    startDate: string;
    endDate: string;
    endDateCurrent: boolean;
    summary: string;
    highlights: string[];
    city?: string;
    state?: string;
}

export interface VolunteerType {
    id: number;
    organization: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    endDateCurrent: boolean;
    highlights: string[];
}

export interface ProjectType {
    id: number;
    name: string;
    description: string;
    highlights: string[];
    keywords: string[];
    startDate: string;
    endDate: string;
    endDateCurrent: boolean;
    url: string;
    roles: string[];
    entity: string;
    type: string;
}

export interface CertificateType {
    name: string;
    date: string;
    issuer: string;
    url: string;
}

export interface PublicationType {
    name: string;
    publisher: string;
    releaseDate: string;
    url: string;
    summary: string;
}

export interface AwardType {
    title: string;
    date: string;
    awarder: string;
    summary: string;
}

export interface SkillType {
    name: string;
    level: string;
    keywords: string[];
}

export interface InterestType {
    name: string;
    keywords: string[];
}

export interface LanguageType {
    language: string;
    fluency: string;
}

export interface ReferenceType {
    name: string;
    reference: string;
}

export interface ResumeType {
    basics: BasicsType;
    education: EducationType[];
    work: WorkType[];
    volunteer: VolunteerType[];
    projects: ProjectType[];
    certificates: CertificateType[];
    publications: PublicationType[];
    awards: AwardType[];
    skills: SkillType[];
    interests: InterestType[];
    languages: LanguageType[];
    references: ReferenceType[];

    _id: string;
    name: string;
    theme: string;
    font: string;
    sections: string[];
}

export interface ResumeTypeProps {
    resume: ResumeType;
}

// Resume themes available
export type ResumeTheme = 'professional' | 'harvard' | 'macchiato' | 'stratton' | 'onepage' | 'student-classic' | 'academic-modern';

// Available fonts
export type ResumeFont = 'times-new-roman' | 'arial' | 'georgia' | 'calibri' | 'cambria' | 'sans-serif';

// Default resume structure
export const DEFAULT_RESUME: ResumeType = {
    basics: {
        name: '',
        label: '',
        image: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: {
            address: '',
            postalCode: '',
            city: '',
            countryCode: '',
            region: '',
        },
        profiles: [],
    },
    education: [],
    work: [],
    volunteer: [],
    projects: [],
    certificates: [],
    publications: [],
    awards: [],
    skills: [],
    interests: [],
    languages: [],
    references: [],
    _id: '',
    name: 'Untitled Resume',
    theme: 'professional',
    font: 'times-new-roman',
    sections: ['Basics'],
};
