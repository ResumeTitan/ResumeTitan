import React from 'react';
import { PersonalInfo } from './components/PersonalInfo';
import { WorkSection } from './components/WorkSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { Summary } from './components/Summary';
import { IResumeType } from 'types/types';

interface HarvardResumeProps {
  resume: IResumeType;
}

export default function HarvardResume({ resume }: HarvardResumeProps) {
  return (
    <div className="p-2 text-black">
      <PersonalInfo
        basics={resume.basics}
      />
      <div>
        {resume.summary && (
          <div className="pt-1 px-2 w-full">
            <Summary summary={resume.summary}/>
          </div>
        )}
        
        {resume.schools && resume.schools.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <EducationSection education={resume.schools} />
          </div>
        )}

        {resume.jobs && resume.jobs.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <WorkSection experience={resume.jobs} />
          </div>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <SkillsSection skills={resume.skills}/>
          </div>
        )}
      </div>
    </div>
  );
};
