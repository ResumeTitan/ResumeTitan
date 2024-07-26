import React from 'react';
import { PersonalInfo } from './components/PersonalInfo';
import { WorkSection } from './components/WorkSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificatesSection } from './components/CertificatesSection';
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
        {resume.basics.summary && (
          <div className="pt-1 px-2 w-full">
            <Summary summary={resume.basics.summary}/>
          </div>
        )}
        
        {resume.education && resume.education.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <EducationSection education={resume.education} />
          </div>
        )}

        {resume.work && resume.work.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <WorkSection experience={resume.work} />
          </div>
        )}

        {resume.certificates && resume.certificates.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <CertificatesSection certificates={resume.certificates}/>
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
