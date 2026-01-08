/**
 * Resume Types (Server)
 *
 * TypeScript interfaces for resume data structures used by the API.
 * These follow the JSON Resume schema with extensions for our application.
 */

// Define the types for each section of the resume
export interface BasicsType {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
        address: string;
        postalCode: string;
        city: string;
        countryCode: string;
        region: string;
    };
    profiles: {
        network: string;
        username: string;
        url: string;
    }[];
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
    name: string;
    position: string;
    website: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
}

export interface ProjectType {
    name: string;
    description: string;
    highlights: string[];
    keywords: string[];
    startDate: string;
    endDate: string;
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

// Define the overall resume type
export interface ResumeType {
    basics?: BasicsType;
    education?: EducationType[];
    work?: WorkType[];
    projects?: ProjectType[];
    certificates?: CertificateType[];
    publications?: PublicationType[];
    awards?: AwardType[];
    skills?: SkillType[];
    interests?: InterestType[];
    languages?: LanguageType[];
    references?: ReferenceType[];
    volunteer?: VolunteerType[];

    _id?: string;
    name?: string;
    theme?: string;
    font?: string;
    sections?: string[];
}

/** Props interface for components that receive a resume. */
export interface ResumeTypeProps {
    resume: ResumeType;
}
