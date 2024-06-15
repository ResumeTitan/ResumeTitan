import React, { useState } from 'react';
import ThemeSelector from './themeSelector';
import HarvardImg from 'assets/harvard.png';
import OnepageImg from 'assets/onepage.png';
import 'styles/index.css';

interface Props {
  description: string;
  descriptionUsed: boolean;
  onUpdateJobDescription: (jobDescription: string) => void;
  isJobDescriptionUsed: (isJobDescriptionUsed: boolean) => void;
  onChangeTheme: (theme: string) => void;
}

const CustomizeTab: React.FC<Props> = ({description, 
  descriptionUsed, 
  onUpdateJobDescription, 
  isJobDescriptionUsed, 
  onChangeTheme
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
    <div className="form-section p-2">
      <div>
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
    <div className="form-section p-2 my-2 font-bold">
      Theme
      <ThemeSelector images={[
        {id: "harvard", url: HarvardImg}, 
        {id: "one-page", url: OnepageImg}
      ]} onSelect={(image) => onChangeTheme(image.id)} />
    </div>
    </>
  );
};

export default CustomizeTab;
