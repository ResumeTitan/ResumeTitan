import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs, { Dayjs } from 'dayjs';
import StatePicker from 'components/StatePicker';
import { DegreePicker, DegreeType } from 'components/DegreePicker';
import api from 'api/actions';
import { EducationType } from 'types/types';
import 'styles/index.css';
import { FormContainer } from 'components/Form/styled';
import DateInput from 'components/Form/DateInput';

const newEducation = {
  id: -1,
  institution: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  endDateCurrent: false,
  score: '',
  courses: [],
  highlights: []
}

interface SchoolEditorProps {
  editingSchool: EducationType;
  onSave: (school: EducationType) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

const suggestions = [
  "Check the spelling and grammar of the second highlight",
  "Revise the top two highlights to make them more concise and impactful",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Remove any vague or non-specific terms from the third highlight",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Reorder the highlights to ensure the most impressive achievements are listed first",
  "Shorten the second highlight while retaining its key points to improve readability"
];

function SchoolEditor({ editingSchool, onSave, onDelete, onCancel }: SchoolEditorProps) {
  const [schoolForm, setSchoolForm] = useState<EducationType>(editingSchool);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [endDateChecked, setEndDateChecked] = useState<boolean>(editingSchool.endDateCurrent || false);
  const [aiAssistant, showAiAssistant] = useState<boolean>(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>("Ensure that all highlights follow a consistent format and tone");
  const [isPlaceholderActive, setIsPlaceholderActive] = useState<boolean>(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [brainstormInput, setBrainstormInput] = useState('');

  React.useEffect(() => {
    setSchoolForm(editingSchool);
    setEndDateChecked(editingSchool.endDateCurrent || false);
  }, [editingSchool]);

  React.useEffect(() => {
    if (aiAssistant) {
      let index = 0;
      const interval = setInterval(() => {
        setIsPlaceholderActive(false); // Trigger the roll-up animation
        setTimeout(() => {
          setPlaceholder(suggestions[index]); // Change the placeholder text
          setIsPlaceholderActive(true); // Trigger the roll-down animation
          index = (index + 1) % suggestions.length;
        }, 300); // Delay to sync with roll-up animation
      }, 5000); // Change placeholder every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [aiAssistant]);

  const handleSaveSchool = () => {
    if (endDateChecked) {
      schoolForm.endDate = "";
    }
    onSave(schoolForm);
    setSchoolForm(newEducation);
  }

  const handleDeleteSchool = () => {
    onDelete(schoolForm.id || -1);
    setSchoolForm(newEducation);
  }

  const handleCancel = () => {
    onCancel();
    setSchoolForm(newEducation);
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSchoolForm({ ...schoolForm, [id]: value });
  }

  const handleDegreeChange = (degree: string) => {
    setSchoolForm({ ...schoolForm, studyType: degree });
  }

  const handleSchoolHighlightsChange = (highlights: string, index: number) => {
    const newForm = { ...schoolForm };
    if (newForm.highlights) {
      newForm.highlights[index] = highlights;
      setSchoolForm(newForm);
    }
  }

  const handleHighlightDelete = (index: number) => {
    const newForm = { ...schoolForm };
    if (newForm.highlights) {
      newForm.highlights.splice(index, 1);
      setSchoolForm(newForm);
    }
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setSchoolForm({ ...schoolForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleHighlightAdd = () => {
    setSchoolForm(prev => ({
      ...prev,
      highlights: prev.highlights ? [...prev.highlights, ""] : [""]
    }));
  }

  const handleAiCall = async (userInput: string | null = null) => {
    setAiLoading(true);
    try {
      const schoolResponse = await api.post("/resume/education", { 
        education: schoolForm,
        userInput: userInput,
        operationType: userInput ? 'brainstorm' : 'generate'
      });
      setSchoolForm(prev => ({ ...prev, highlights: schoolResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const handleAiAssistCall = async () => {
    setAiLoading(true);
    try {
      const schoolResponse = await api.post("/resume/education", { 
        education: schoolForm,
        userInput: aiAssistantMsg,
        operationType: 'edit'
      });
      setSchoolForm(prev => ({ ...prev, highlights: schoolResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="my-6">
        <label htmlFor={"institution"} className="form-label-text">School</label>
        <input 
          type="text"
          id={"institution"}
          className="form-style"
          placeholder="Enter school name..."
          value={schoolForm.institution || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>
      <div className="my-6">
        <label htmlFor={"area"} className="form-label-text">Major/Area of Study</label>
        <input 
          type="text"
          id={"area"}
          className="form-style"
          placeholder="Enter major or area of study..."
          value={schoolForm.area || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>
      <div className="my-6">
        <label htmlFor={"degree"} className="form-label-text">Degree</label>
        <DegreePicker 
          initialValue={schoolForm.studyType as DegreeType}
          onChange={handleDegreeChange}
        />
      </div>

      <FormContainer>
        <DateInput 
          title='Start Date' 
          value={schoolForm.startDate} 
          onChange={(event) => {
            const newDate = event.target.value;
            setSchoolForm(prev => ({
              ...prev,
              startDate: newDate
            }));
          }} 
        />
        <DateInput 
          title='End Date' 
          value={schoolForm.endDate}
          onChange={(event) => {
            const newDate = event.target.value;
            setSchoolForm(prev => ({
              ...prev,
              endDate: newDate
            }));
          }}
          disabled={endDateChecked}
          className={endDateChecked ? "bg-gray-100 opacity-70 rounded" : ""}
        >
          <div className="mt-2">
            <label htmlFor="endDateCheckbox" className="block text-sm">
              Current
            </label>
            <input
              id="endDateCheckbox"
              type="checkbox"
              checked={endDateChecked}
              onChange={handleEndDateCurrent}
              className="mr-2"
            />
          </div>
        </DateInput>
      </FormContainer>

      <div>
        <div className="left-right-spacing flex my-2">
          <div className="flex items-center">
            <label htmlFor={"schoolHighlights"} className="form-label-text">Highlights</label>
          </div>

          <div className="phone-screen-stack">
            <button
              className="green-button flex items-center justify-center sm:h-12 rounded-lg cursor-pointer"
              onClick={() => showAiAssistant(!aiAssistant)}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>AI Assistant</span>
              </div>
            </button>
            <button
              className="green-button flex items-center justify-center sm:h-12 rounded-lg cursor-pointer"
              onClick={() => setShowBrainstorm(true)}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>Write with AI</span>
              </div>
            </button>
            <button
              className="green-button flex items-center justify-center sm:h-12 rounded-lg cursor-pointer"
              onClick={handleHighlightAdd}
            >
              <span className="p-1">Add</span>
            </button>
          </div>
        </div>
        {schoolForm.highlights ? schoolForm.highlights.map((item, index) => (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                id={"schoolHighlights"}
                className="form-style flex-wrap h-36 md:h-24 lg:h-16"
                placeholder="Enter highlights from school..."
                value={item}
                onChange={(e) => handleSchoolHighlightsChange(e.target.value, index)}
                required 
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleHighlightDelete(index)}
              >
                {"X"}
              </button>
            </div>
          </div>
          )
        ) : (
        <div className="left-right-spacing">
          <div className="w-full pr-2 py-1">
            <textarea 
              className="form-style flex-wrap h-24 lg:h-16"
              placeholder="Click Add or Write with AI to start adding accomplishments/skills..."
              disabled
            />
          </div>
        </div>
        )}

        {aiAssistant && (
        <div className="flex flex-col my-4 animate-fade-in">
          <div className="section-line" />
          <div className="flex-center">
            <div className={`w-full input-placeholder ${isPlaceholderActive ? 'active' : ''}`}>
              <textarea 
                className="form-style flex-grow mr-2"
                placeholder={placeholder}
                value={aiAssistantMsg}
                onChange={(e) => setAiAssistantMsg(e.target.value)}
              />
            </div>
          <button
            className="green-button w-48"
            onClick={handleAiAssistCall}
          >
            Edit with AI
          </button>
          </div>
        </div>
        )}
      </div>

      {showBrainstorm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Brainstorm for AI</h2>
            <p className="mb-2 text-sm text-gray-600">Enter your ideas, skills, or accomplishments to help our AI write your bullet points. Separate items with a comma.</p>
            <p className="mb-2 text-sm text-red-600 font-semibold">Warning: This will overwrite your existing highlights.</p>
            <textarea
              className="form-style w-full h-24 mb-4"
              placeholder="E.g. Led a club, Won a scholarship, Volunteered for events"
              value={brainstormInput}
              onChange={e => setBrainstormInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="secondary-action-button"
                onClick={() => setShowBrainstorm(false)}
              >
                Cancel
              </button>
              <button
                className="primary-action-button"
                onClick={() => {
                  setShowBrainstorm(false);
                  handleAiCall(brainstormInput);
                  setBrainstormInput('');
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          disabled={!schoolForm.id}
          className={"secondary-action-button"}
          onClick={handleDeleteSchool}
        >
          {"Delete"}
        </button>
        <button
          className="secondary-action-button"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="primary-action-button"
          onClick={handleSaveSchool}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default SchoolEditor;
