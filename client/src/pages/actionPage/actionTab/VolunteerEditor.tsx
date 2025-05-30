import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs from 'dayjs';
import StatePicker from 'components/StatePicker';
import { FormContainer } from 'components/Form/styled';
import DateInput from 'components/Form/DateInput';
import { VolunteerType } from 'types/types';
import api from 'api/actions';
import 'styles/index.css';

interface VolunteerEditorProps {
  editingVolunteer: VolunteerType;
  onSave: (volunteer: VolunteerType) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

const VolunteerEditor: React.FC<VolunteerEditorProps> = ({ editingVolunteer, onSave, onDelete, onCancel }) => {
  const [volunteerForm, setVolunteerForm] = useState(editingVolunteer);
  const [aiLoading, setAiLoading] = useState(false);
  const [endDateChecked, setEndDateChecked] = useState(editingVolunteer.endDateCurrent || false);
  const [aiAssistant, setAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [brainstormInput, setBrainstormInput] = useState('');
  const [placeholder, setPlaceholder] = useState('Tell me about your role...');
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);

  const placeholders = [
    'Tell me about your role...',
    'What skills did you develop?',
    'What impact did you make?',
    'What accomplishments are you proud of?',
    'What challenges did you overcome?'
  ];

  useEffect(() => {
    if (aiAssistant) {
      const interval = setInterval(() => {
        setIsPlaceholderActive(true);
        setTimeout(() => {
          setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
          setIsPlaceholderActive(false);
        }, 300);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [aiAssistant]);

  const handleSaveVolunteer = () => {
    if (endDateChecked) {
      volunteerForm.endDate = "";
    }
    onSave(volunteerForm);
  }

  const handleDeleteVolunteer = () => {
    onDelete(volunteerForm.id || -1);
  }

  const handleCancel = () => {
    onCancel();
  }

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setVolunteerForm({ ...volunteerForm, [id]: value });
  }

  const handleVolunteerHighlightsChange = (highlights: string, index: number) => {
    const newForm = { ...volunteerForm };
    newForm.highlights[index] = highlights;
    setVolunteerForm(newForm);
  }

  const handleHighlightsDelete = (index: number) => {
    const newForm = { ...volunteerForm };
    newForm.highlights.splice(index, 1);
    setVolunteerForm(newForm);
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setVolunteerForm({ ...volunteerForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleHighlightAdd = () => {
    if (!volunteerForm.highlights) {
      setVolunteerForm({ ...volunteerForm, highlights: [""] });
    } else {
      setVolunteerForm({ ...volunteerForm, highlights: [...volunteerForm.highlights, ""] });
    }
  }

  const handleAiCall = async (userInput: string | null = null) => {
    setAiLoading(true);
    try {
      const volunteerResponse = await api.post("/resume/volunteer", { 
        volunteer: volunteerForm,
        userInput: userInput,
        operationType: userInput ? 'brainstorm' : 'generate'
      });
      setVolunteerForm({ ...volunteerForm, highlights: volunteerResponse.data.response.highlights });
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const handleAiAssistCall = async () => {
    setAiLoading(true);
    try {
      const volunteerResponse = await api.post("/resume/volunteer", { 
        volunteer: volunteerForm,
        userInput: aiAssistantMsg,
        operationType: 'edit'
      });
      setVolunteerForm(prev => ({ ...prev, highlights: volunteerResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const showAiAssistant = (show: boolean) => {
    setAiAssistant(show);
    if (!show) {
      setAiAssistantMsg('');
    }
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="py-4">
        <label htmlFor={"position"} className="form-label-text">Position</label>
        <input 
          type="text"
          id={"position"}
          className="form-style" 
          placeholder="Enter volunteer position..."
          onChange={handleVolunteerChange}
          value={volunteerForm.position || ''}
          required />
      </div>
      <div className="my-6">
        <label htmlFor={"organization"} className="form-label-text">Organization</label>
        <input 
          type="text"
          id={"organization"}
          className="form-style"
          placeholder="Enter organization name..."
          value={volunteerForm.organization || ''}
          onChange={handleVolunteerChange}
          required 
        />
      </div> 

      <FormContainer >
        <DateInput 
          title='Start Date' 
          value={volunteerForm.startDate} 
          onChange={(event) => {
            setVolunteerForm({...volunteerForm, startDate: event.target.value });
          }} 
        />
        <DateInput 
          title='End Date' 
          value={volunteerForm.endDate}
          onChange={(event) => {
            setVolunteerForm({...volunteerForm, endDate: event.target.value });
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

      <div className="m-2">
        <div className="left-right-spacing my-2">
          <div className="flex items-center">
            <label htmlFor={"volunteerHighlights"} className="form-label-text">Highlights</label>
          </div>
          
          <div className="phone-screen-stack">
            <button
              className="green-button order-last xs:order-first p-2 my-1"
              onClick={() => setShowBrainstorm(true)}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>Write with AI</span>
              </div>
            </button>
            <button
              className="green-button order-first xs:order-last p-2 my-1"
              onClick={handleHighlightAdd}
            >
              Add
            </button>
            <button
              className="green-button order-first xs:order-last p-2 my-1"
              onClick={() => showAiAssistant(true)}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>AI Assistant</span>
              </div>
            </button>
          </div>
        </div>

        {volunteerForm.highlights ? volunteerForm.highlights.map((item, index) => (
          <div className="left-right-spacing" key={index}>
            <div className="w-full pr-2 py-1">
              <textarea 
                id={"volunteerHighlights"}
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Enter highlights from volunteer work..."
                value={item}
                onChange={(e) => handleVolunteerHighlightsChange(e.target.value, index)}
                required 
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleHighlightsDelete(index)}
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
                className="form-style flex-wrap h-24 lg:h-16 text-black"
                placeholder="Click Add or Write with AI to start adding highlights..."
                disabled
              />
            </div>
          </div>
        )}

        {aiAssistant && (
          <>
            <div className="border-t border-gray-700 my-4"></div>
            <div className="left-right-spacing">
              <div className="w-full pr-2 py-1">
                <textarea
                  className={`form-style flex-wrap h-24 lg:h-16 ${isPlaceholderActive ? 'placeholder-roll-down' : 'placeholder-roll-up'}`}
                  placeholder={placeholder}
                  value={aiAssistantMsg}
                  onChange={(e) => setAiAssistantMsg(e.target.value)}
                />
              </div>
              <div className="phone-screen-stack">
                <button
                  className="green-button order-last xs:order-first p-2 my-1"
                  onClick={handleAiAssistCall}
                >
                  <div>
                    <AutoAwesomeIcon className="pr-2"/>
                    <span>Write with AI</span>
                  </div>
                </button>
                <button
                  className="green-button order-first xs:order-last p-2 my-1"
                  onClick={() => showAiAssistant(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="left-right-spacing">
        <button
          disabled={!volunteerForm.id}
          className={"secondary-action-button"}
          onClick={handleDeleteVolunteer}
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
          onClick={handleSaveVolunteer}
        >
          {"Save"}
        </button>
      </div>

      {showBrainstorm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Brainstorm for AI</h2>
            <p className="mb-2 text-sm text-gray-600">Enter your ideas, skills, or accomplishments to help the AI write your bullet points. Separate items with a comma.</p>
            <p className="mb-2 text-sm text-red-600 font-semibold">Warning: This will overwrite your existing highlights.</p>
            <textarea
              className="form-style w-full h-24 mb-4"
              placeholder="E.g. Organized events, Fundraised for charity, Mentored volunteers"
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
    </div>
  );
}

export default VolunteerEditor;
