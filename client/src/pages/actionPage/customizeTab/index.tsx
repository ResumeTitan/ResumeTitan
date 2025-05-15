import React, { useState } from 'react';
import ThemeSelector from './themeSelector';
import HarvardImg from 'assets/harvard.png';
import OnepageImg from 'assets/onepage.png';
import MacchiatoImg from 'assets/macchiato.png';
import StudentClassicImg from 'assets/macchiato.png'; // TODO: Replace with actual student-classic image
import SectionList from './SectionList';
import 'styles/index.css';
import { ResumeType } from 'types/types';

interface Props {
  resume: ResumeType;
  description: string;
  descriptionUsed: boolean;
  onUpdateJobDescription: (jobDescription: string) => void;
  isJobDescriptionUsed: (isJobDescriptionUsed: boolean) => void;
  onChangeTheme: (theme: string) => void;
  onUpdateSections: (sections: string[]) => void;
}

const CustomizeTab: React.FC<Props> = ({
  resume,
  description, 
  descriptionUsed,
  onUpdateJobDescription, 
  isJobDescriptionUsed, 
  onChangeTheme,
  onUpdateSections
}) => {
  const [isJobDescriptionChecked, setIsJobDescriptionChecked] = useState(descriptionUsed);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState(description);

  const handleJobDescriptionUpdate = (e:  React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    setJobDescription(newDescription);
    onUpdateJobDescription(newDescription);
  }

  const handleJobDescriptionChecked = () => {
    const newChecked = !isJobDescriptionChecked
    setIsJobDescriptionChecked(newChecked);
    isJobDescriptionUsed(newChecked);
  }

  return (
    <>
    <div className="form-container" >
      <div className="form-text-main">{"Section Order"}</div>
        <SectionList sections={resume.sections} saveSections={onUpdateSections}/>
    </div>
    <div className="form-container font-bold">
      <div className="form-text-main">{"Theme"}</div>
      <ThemeSelector images={[
        {id: "professional", url: HarvardImg}, 
        {id: "one-page", url: OnepageImg},
        {id: "macchiato", url: MacchiatoImg},
        {id: "student-classic", url: StudentClassicImg},
      ]} onSelect={(image) => onChangeTheme(image.id)} />
    </div>
    <div className="form-container">
      <div className="form-text-main">{"Job Specific Content"}</div>
      <div className="p-2">
        <input 
          id="jobDescription"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" 
          onChange={handleJobDescriptionChecked}
          checked={isJobDescriptionChecked}
        />
        <label htmlFor="jobTitle" className="ml-2 text-sm font-medium text-gray-300">Target resume to job description</label>
        <div className="font-bold">
          Job Title
          <input
            name="jobTitle"
            className="form-style"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={!isJobDescriptionChecked}
          />          
        </div>
        <div className="font-bold">
          Job Description
          <textarea
            name="jobDescription"
            className="form-style font-medium"
            rows={10}
            value={jobDescription}
            onChange={handleJobDescriptionUpdate}
            disabled={!isJobDescriptionChecked}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default CustomizeTab;
