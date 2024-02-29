import React from 'react';
import HarvardResume from './layouts/harvard/Harvard';
import { IResumeType } from 'types/types';

interface Props {
  resume: IResumeType;
  theme: string;
}

export default function ResumeContainer({ resume, theme } : Props) {

  return (
    <div id={"print-resume"} className="origin-top transition-all duration-300 ease-linear print:!scale-100">
      <div className="w-[210mm] h-[296mm] font-[Times] bg-white my-0 mx-auto">
        { theme === "harvard" && (
          <HarvardResume resume={resume}/>
        )}
        { theme === "even" && (
          <HarvardResume resume={resume}/>
        )}
      </div>
    </div>
  );
};
