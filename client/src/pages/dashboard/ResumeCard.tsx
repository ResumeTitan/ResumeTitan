import React from 'react';
import ResumeContainer from '../../templates/ResumeContainer';
import HarvardResume from '../../templates/layouts/harvard/Harvard';
import { IProfileType, ISchoolType, IWorkType } from '../../types/types';

interface ResumeCardProps {
  personalInfo: IProfileType;
  schools: ISchoolType[];
  jobs: IWorkType[];
  skills: string[];
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  personalInfo,
  schools,
  jobs,
  skills,
}) => {
  return (
    <div className="mx-4 border border-2 border-black">
      <ResumeContainer>
        <HarvardResume personalInfo={personalInfo} schools={schools} jobs={jobs} skills={skills}/>
      </ResumeContainer>
    </div>
  );
};

export default ResumeCard;
