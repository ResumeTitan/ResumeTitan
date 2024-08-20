import React from 'react';
import { OnePageResume } from './layouts/onepage';
import ProfessionalResume from './layouts/professional/Resume';
import { ResumeType } from 'types/types';

interface Props {
  resume: ResumeType;
  theme: string;
}

export default function ResumeContainer({ resume, theme } : Props) {
  return (
    <div className="origin-top transition-all duration-300 ease-linear">
      <div className="w-[210mm] h-[296mm] bg-white my-0 mx-auto">
        { theme === "harvard" && (
          <ProfessionalResume resume={ resume }/>
        )}
        { theme === "one-page" && (
          <OnePageResume resume={ resume }/>
        )}
        { theme === "professional" && (
          <ProfessionalResume resume={ resume } />
        )}
        {/* Default */}
        { theme === "" && (
          <ProfessionalResume resume={ resume }/>
        )}
      </div>
    </div>
  );
};
