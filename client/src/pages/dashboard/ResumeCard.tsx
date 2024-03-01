import React from 'react';
import ResumeContainer from '../../templates/ResumeContainer';
import HarvardResume from '../../templates/layouts/harvard/Harvard';
import { IBasicsType, IEducationType, IWorkType } from '../../types/types';

interface ResumeCardProps {
  basics: IBasicsType;
  summary: string;
  education: IEducationType[];
  work: IWorkType[];
  skills: string[];
  theme: string;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  basics,
  education,
  work,
  skills,
  theme,
}) => {
  return (
    <div className="mx-4 border border-2 border-black">
      <ResumeContainer resume={{
      basics: basics,
      jobs: work,
      schools: education,
      skills: skills,
      summary: basics.summary,
    }} theme={theme} />
    </div>
  );
};

export default ResumeCard;
