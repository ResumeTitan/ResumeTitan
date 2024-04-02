import React, { useState } from 'react';
import '../index.css';

interface Props {
  description: string;
  descriptionUsed: boolean;
  onUpdateJobDescription: (jobDescription: string) => void;
  isJobDescriptionUsed: (isJobDescriptionUsed: boolean) => void;
}

const CustomizeTab: React.FC<Props> = ({description, descriptionUsed, onUpdateJobDescription, isJobDescriptionUsed}) => {
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
    <div className="form-section p-2">
      <div>
        <input 
          id="jobDescription"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
          onChange={handleJobDescriptionChecked}
          checked={isJobDescriptionChecked}
        />
        <label htmlFor="jobDescription" className="ml-2 text-sm font-medium text-gray-300">Target resume to job description</label>
        <div className="font-bold">
          Job Title
          <input
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
  );
};

export default CustomizeTab;
