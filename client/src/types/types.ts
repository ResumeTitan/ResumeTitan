export interface ISchoolType {
  name: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  content: string[];
}

export interface IWorkType {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  content: string[];
}

export interface IProfileType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
}

export interface IResumeType {
  profile: IProfileType;
  schools: ISchoolType[];
  works: IWorkType[];
}