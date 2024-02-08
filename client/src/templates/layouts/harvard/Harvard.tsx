import React from 'react';
import { PersonalInfo } from './components/PersonalInfo';
import { WorkSection } from './components/WorkSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { Summary } from './components/Summary';
import { IEducationType, IWorkType, IBasicsType } from '../../../types/types';

const sampleData = {
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "image": "",
    "email": "john@johndoe.com",
    "phone": "(912) 555-4321",
    "url": "https://johndoe.com",
    "summary": "A summary of John Doe...",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "https://twitter.com/john"
    }]
  },
}

interface HarvardResumeProps {
  basics: IBasicsType;
  summary: string;
  education: IEducationType[];
  jobs: IWorkType[];
  skills: string[];
}

export default function HarvardResume({ basics, summary, education, jobs, skills }: HarvardResumeProps) {
  const resumeData = sampleData;
  return (
    <div className="p-2 text-black">
      <PersonalInfo
        name={`${basics ? `${basics.firstName} ${basics.lastName}` :  resumeData.basics.name}`}
        label={resumeData.basics.label}
        url={basics?.url}
        email={basics?.email || resumeData.basics.email}
        city={basics?.city || ""}
        phone={basics?.phone || resumeData.basics.phone}
        image={resumeData.basics.image}
      />
      <div className="">
        <div className="pt-1 px-2 w-full">
          <Summary summary={summary}/>
        </div>
        
        <div className="pt-1 px-2 w-full">
          <EducationSection education={education} />
        </div>

        <div className="pt-1 px-2 w-full">
          <WorkSection experience={jobs} />
        </div>

        {skills && skills.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <SkillsSection skills={skills}/>
          </div>
        )}
      </div>
    </div>
  );
};
