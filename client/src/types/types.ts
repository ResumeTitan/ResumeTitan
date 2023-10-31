export interface ISchoolType {
  name: string;
  major: string;
  degree: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth: string;
  endDateYear: string;
  content?: string[];
}

export interface IWorkType {
  title: string;
  employer: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth: string;
  endDateYear: string;
  notes?: string;
  content?: string[];
}

export interface IProfileType {
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  url?: string;
}

export interface IResumeType {
  profile: IProfileType;
  schools: ISchoolType[];
  works: IWorkType[];
}