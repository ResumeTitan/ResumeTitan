import React from 'react';
import ResumeContainer from '../../templates/ResumeContainer';
import HarvardResume from '../../templates/layouts/harvard/Harvard';
import { IBasicsType, IEducationType, IWorkType } from '../../types/types';

interface ResumeCardProps {
  basics: IBasicsType;
  summary: string;
  education: IEducationType[];
  jobs: IWorkType[];
  skills: string[];
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  basics,
  summary,
  education,
  jobs,
  skills,
}) => {
  return (
    <div className="mx-4 border border-2 border-black">
      <ResumeContainer>
        <HarvardResume basics={basics} summary={summary} education={education} jobs={jobs} skills={skills}/>
      </ResumeContainer>
    </div>
  );
};

export default ResumeCard;
