import React from 'react';
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeType } from '../../types/types';

interface ResumeCardProps {
  resume: ResumeType;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  return (
    <div>
      <ResumeContainer resume={resume} theme={resume.theme || 'onepage'} />
      <div>
        {resume.name}
      </div>
    </div>
  );
};

export default ResumeCard;
