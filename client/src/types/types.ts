import React from 'react';

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
  id: number;
  name: string;
  position: string;
  website: string;
  startDate: string;
  endDate: string;
  endDateCurrent: boolean;
  summary: string;
  highlights: string[];
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
  startDate: string;
  endDate: string;
  endDateCurrent: boolean;
  highlights: string[];
  url: string;
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

// ResumeTypeProps for components
export interface ResumeTypeProps {
  resume: ResumeType;
}

export interface IconDataType {
  label: string;
  icon: React.ReactElement;
}

export interface CoverLetterType {
  letter: string;
  name: string;
  date: Date;
  city: string;
  state: string;
  jobTitle: string;
  jobDescription: string;
  company: string;

  _id: string;
  resumeId: string;
}