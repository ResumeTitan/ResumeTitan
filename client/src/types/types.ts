import React from 'react';

// TODO remove - Deprecated
export interface IEducationType {
  name: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  endDateCurrent: boolean;
  content?: string[];
}

export interface IWorkType {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  endDateCurrent: boolean;
  notes?: string;
  content?: string[];
}

export interface IBasicsType {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  city?: string;
  url?: string;
  summary?: string;
}

export interface IResumeType {
  _id: string;
  name?: string;
  theme?: string;
  basics: IBasicsType;
  education?: IEducationType[];
  work?: IWorkType[];
  skills?: string[];
  summary?: string;
}

// STOP TODO

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

// Define the overall resume type
export interface ResumeType {
  basics: BasicsType;
  education: EducationType[];
  work: WorkType[];
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
  sections: string[];
}

// ResumeTypeProps for components
export interface ResumeTypeProps {
  resume: ResumeType;
}

export interface IconDataType {
  label: string;
  icon: React.ReactElement;
}
