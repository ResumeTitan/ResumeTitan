import React from 'react';
import ResumeContainer from 'templates/ResumeContainer';
import { IBasicsType, IEducationType, IWorkType } from '../../types/types';

interface ResumeCardProps {
  resume: {
    basics: IBasicsType;
    summary: string;
    education: IEducationType[];
    work: IWorkType[];
    skills: string[];
    theme: string;
  }
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  return (
    <div>
      <ResumeContainer resume={{
          basics: resume.basics,
          work: resume.work,
          education: resume.education,
          skills: resume.skills,
          summary: resume.basics.summary,
        }}
        theme={resume.theme} 
      />
      <div>

      </div>
    </div>
  );
};

export default ResumeCard;
