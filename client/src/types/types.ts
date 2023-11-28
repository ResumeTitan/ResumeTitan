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
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  url?: string;
}

export interface IResumeType {
  schools: ISchoolType[];
  jobs: IWorkType[];
  skills?: string[];
  objective?: string;
}