import React from 'react';
import ResumeContainer from 'templates/ResumeContainer';
import { IResumeType } from '../../types/types';

interface ResumeCardProps {
  resume: IResumeType
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  return (
    <div>
      <ResumeContainer resume={{
          _id: '', // ID does not matter for display
          basics: resume.basics,
          work: resume.work,
          education: resume.education,
          skills: resume.skills,
          summary: resume.basics.summary,
        }}
        theme={resume.theme || 'onepage'} 
      />
      <div>

      </div>
    </div>
  );
};

export default ResumeCard;
