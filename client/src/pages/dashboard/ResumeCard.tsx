import React from 'react';
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeTypeProps } from '../../types/types';

const ResumeCard: React.FC<ResumeTypeProps> = ({ resume }) => {
  return (
    <div>
      <ResumeContainer resume={resume} />
      <div>
        {resume.name}
      </div>
    </div>
  );
};

export default ResumeCard;
