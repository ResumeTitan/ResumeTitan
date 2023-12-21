import React from 'react';
import { PersonalInfo } from './components/PersonalInfo';
import { WorkSection } from './components/WorkSection';
import { SchoolSection } from './components/SchoolSection';
import { SkillsSection } from './components/SkillsSection';
import { Summary } from './components/Summary';
import { ISchoolType, IWorkType, IProfileType } from '../../../types/types';

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
  personalInfo: IProfileType;
  summary: string;
  schools: ISchoolType[];
  jobs: IWorkType[];
  skills: string[];
}

export default function HarvardResume({ personalInfo, summary, schools, jobs, skills }: HarvardResumeProps) {
  const resumeData = sampleData;
  return (
    <div className="p-2 text-black">
      <PersonalInfo
        name={`${personalInfo.firstName} ${personalInfo.lastName}`}
        label={resumeData.basics.label}
        url={personalInfo.url}
        email={personalInfo?.email || resumeData.basics.email}
        city={personalInfo.city}
        phone={personalInfo?.phone || resumeData.basics.phone}
        image={resumeData.basics.image}
      />
      <div className="">
        <div className="pt-1 px-2 w-full">
          <Summary summary={summary}/>
        </div>
        
        <div className="pt-1 px-2 w-full">
          <SchoolSection schools={schools} />
        </div>

        <div className="pt-1 px-2 w-full">
          <WorkSection experience={jobs} />
        </div>

        {skills && skills.length > 0 && (
          <div className="pt-1 px-2 w-full">
            <SkillsSection skills={skills}/>
          </div>
        )}

        {/* <div className="basis-[40%] p-3">
          <SectionValidator value={resumeData.basics.objective}>
            <Objective objective={resumeData.basics.objective} />
          </SectionValidator>

          <SectionValidator value={resumeData.skills.languages}>
            <SkillsSection title="Languages" list={resumeData.skills.languages} />
          </SectionValidator>

          <SectionValidator value={resumeData.skills.technologies}>
            <SkillsSection title="Technologies" list={resumeData.skills.technologies} />
          </SectionValidator>

          <SectionValidator value={resumeData.skills.frameworks}>
            <SkillsSection title="Frameworks" list={resumeData.skills.frameworks} />
          </SectionValidator>

          <SectionValidator value={resumeData.skills.tools}>
            <SkillsSection title="Tools" list={resumeData.skills.tools} />
          </SectionValidator>

          <SectionValidator value={resumeData.education}>
            <EducationSection education={resumeData.education} />
          </SectionValidator>

          <SectionValidator value={resumeData.volunteer}>
            <VolunteerSection volunteer={resumeData.volunteer} />
          </SectionValidator>
        </div> */}
      </div>
    </div>
  );
};
