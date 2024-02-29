export interface IEducationType {
  name: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  endDateCurrent: boolean;
  content?: string[];
}

export interface IWorkType {
  title: string;
  employer: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth: string;
  endDateYear: string;
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
  basics: IBasicsType;
  schools?: IEducationType[];
  jobs?: IWorkType[];
  skills?: string[];
  summary?: string;
}