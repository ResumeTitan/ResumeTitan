import React from 'react';
import { SectionWrapper } from './SectionWrapper';

import "../scenes/resumePage/index.css";

export const Skills = ({ skills }) => {
  console.log(skills);
  return (
    <SectionWrapper title="Skills">
      <ul className="leading-5 grid grid-cols-3 gap-4">
      {skills.map((skill, index) => (
        <li key={index} className="flex items-center">
          <span className="h-1 w-1 rounded-full bg-black mr-2"></span>
          {skill}
        </li>
      ))}
      </ul>
    </SectionWrapper>
  );
};