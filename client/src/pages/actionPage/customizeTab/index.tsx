import React, { useState } from 'react';
import ThemeSelector from './themeSelector';
import FontSelector from './fontSelector';
import SectionList from './SectionList';
import 'styles/index.css';
import { ResumeType } from 'types/types';
import api from 'api/actions';

interface Props {
  resume: ResumeType;
  description: string;
  descriptionUsed: boolean;
  onUpdateJobDescription: (jobDescription: string) => void;
  isJobDescriptionUsed: (isJobDescriptionUsed: boolean) => void;
  onChangeTheme: (theme: string) => void;
  onChangeFont: (font: string) => void;
  onUpdateSections: (sections: string[]) => void;
}

const CustomizeTab: React.FC<Props> = ({
  resume,
  description, 
  descriptionUsed,
  onUpdateJobDescription, 
  isJobDescriptionUsed, 
  onChangeTheme,
  onChangeFont,
  onUpdateSections
}) => {
  const [isJobDescriptionChecked, setIsJobDescriptionChecked] = useState(descriptionUsed);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState(description);

  // Performance Analyzer state
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<number|null>(null);
  const [atsFeedback, setAtsFeedback] = useState('');
  const [atsPositive, setAtsPositive] = useState('');
  const [atsError, setAtsError] = useState('');

  const handleAtsAnalyze = async () => {
    setAtsLoading(true);
    setAtsError('');
    setAtsScore(null);
    setAtsFeedback('');
    setAtsPositive('');
    try {
      const response = await api.post('/resume/ats-analyze', { resume });
      setAtsScore(response.data.score);
      setAtsFeedback(response.data.improvement || '');
      setAtsPositive(response.data.positive || '');
    } catch (err: any) {
      setAtsError('Failed to analyze resume. Please try again.');
    } finally {
      setAtsLoading(false);
    }
  };

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
      <ThemeSelector 
        resume={resume}
        themes={[
          {id: "professional", label: "Professional"}, 
          {id: "one-page", label: "One Page"},
          {id: "macchiato", label: "Macchiato"},
          {id: "student-classic", label: "Student Classic"},
          {id: "academic-modern", label: "Academic Modern"},
        ]}
        selectedTheme={resume.theme}
        onSelect={onChangeTheme}
      />
    </div>
    <div className="form-container font-bold">
      <div className="form-text-main">{"Font"}</div>
      <FontSelector 
        resume={resume}
        fonts={[
          {id: "times-new-roman", label: "Times New Roman", preview: '"Times New Roman", Times, serif'},
          {id: "arial", label: "Arial", preview: 'Arial, Helvetica, sans-serif'},
          {id: "georgia", label: "Georgia", preview: 'Georgia, serif'},
          {id: "calibri", label: "Calibri", preview: 'Calibri, sans-serif'},
          {id: "cambria", label: "Cambria", preview: 'Cambria, serif'},
          {id: "sans-serif", label: "Sans Serif", preview: 'sans-serif'},
        ]}
        selectedFont={resume.font || "times-new-roman"}
        onSelect={onChangeFont}
      />
    </div>

    {/* Performance Analyzer Section */}
    <div className="form-container font-bold mt-6">
      <div className="form-text-main">Performance Analyzer</div>
      <div className="p-4 flex flex-col gap-4">
        <button
          className="primary-action-button w-fit"
          onClick={handleAtsAnalyze}
          disabled={atsLoading}
        >
          {atsLoading ? 'Analyzing...' : 'Start Analysis'}
        </button>
        {atsError && <div className="text-red-600 font-normal">{atsError}</div>}
        {atsScore !== null && (
          <div className="mt-2">
            <div className="text-lg font-bold">ATS Score: <span className="text-blue-700">{atsScore}%</span></div>
            {atsPositive && <div className="text-green-700 mt-2">What’s Good: {atsPositive}</div>}
            {atsFeedback && <div className="text-yellow-700 mt-2">How to Improve: {atsFeedback}</div>}
          </div>
        )}
      </div>
    </div>
    {/* <div className="form-container">
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
    </div> */}
    </>
  );
};

export default CustomizeTab;
