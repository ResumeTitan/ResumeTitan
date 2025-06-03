import React, { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StatePicker from 'components/StatePicker';
import api from 'api/actions';
import AIAssistant from 'components/AIAssistant';
import 'styles/index.css';
import { FormContainer } from 'components/Form/styled';
import DateInput from 'components/Form/DateInput';

const suggestions = [
  "Check the spelling and grammar of the second highlight",
  "Revise the top two highlights to make them more concise and impactful",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Remove any vague or non-specific terms from the third highlight",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Reorder the highlights to ensure the most impressive achievements are listed first",
  "Shorten the second highlight while retaining its key points to improve readability"
];

function JobEditor({ editingJob, onSave, onDelete, onCancel }) {
  const [jobForm, setJobForm] = useState(editingJob);
  const [aiLoading, setAiLoading] = useState(false);
  const [endDateChecked, setEndDateChecked] = useState(editingJob.endDateCurrent || false);
  const [aiAssistant, showAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [placeholder, setPlaceholder] = useState("Ensure that all highlights follow a consistent format and tone");
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [brainstormInput, setBrainstormInput] = useState('');

  React.useEffect(() => {
    setJobForm(editingJob);
    setEndDateChecked(editingJob.endDateCurrent || false);
  }, [editingJob]);

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
      }, 5000); // Change placeholder every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [aiAssistant]);

  const handleSaveJob = () => {
    if (endDateChecked) {
      jobForm.endDate = "";
    }
    onSave(jobForm);
    setJobForm({});
  }

  const handleDeleteJob = () => {
    onDelete(jobForm.id || -1);
    setJobForm({});
  }

  const handleCancel = () => {
    onCancel();
    setJobForm({});
  }

  const handleJobChange = (e) => {
    const { id, value } = e.target;
    setJobForm({ ...jobForm, [id]: value });
  }

  const handleJobHighlightsChange = (highlights, index) => {
    const newForm = { ...jobForm };
    newForm.highlights[index] = highlights;
    setJobForm(newForm);
  }

  const handleStateChange = (state) => {
    setJobForm({ ...jobForm, state: state });
  }

  const handleHighlightsDelete = (index) => {
    const newForm = { ...jobForm };
    newForm.highlights.splice(index, 1);
    setJobForm(newForm);
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setJobForm({ ...jobForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleHighlightAdd = () => {
    if (!jobForm.highlights) {
      setJobForm({ ...jobForm, highlights: [""] });
    } else {
      setJobForm({ ...jobForm, highlights: [...jobForm.highlights, ""] });
    }
  }

  /**
   * @function handleAiCall
   */
  const handleAiCall = async (userInput = null) => {
    setAiLoading(true);
    try {
      const jobResponse = await api.post("/resume/work", { 
        job: jobForm,
        userInput: userInput,
        operationType: userInput ? 'brainstorm' : 'generate'
      });
      setJobForm(prev => ({ ...prev, highlights: jobResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const handleAiAssistCall = async () => {
    setAiLoading(true);
    try {
      const jobResponse = await api.post("/resume/work", { 
        job: jobForm,
        userInput: aiAssistantMsg,
        operationType: 'edit'
      });
      setJobForm(prev => ({ ...prev, highlights: jobResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="py-4">
        <label htmlFor={"position"} className="form-label-text">Job Title</label>
        <input 
          type="text"
          id={"position"}
          className="form-style" 
          placeholder="Enter job title..."
          onChange={handleJobChange}
          value={jobForm.position || ''}
          required />
      </div>
      <div className="my-6">
        <label htmlFor={"name"} className="form-label-text">Employer/Organization</label>
        <input 
          type="text"
          id={"name"}
          className="form-style"
          placeholder="Enter name of employer..."
          value={jobForm.name || ''}
          onChange={handleJobChange}
          required 
        />
      </div> 
      <div className="mb-6 left-right-spacing phone-screen-stack">
        <div className="w-full">
        <label htmlFor={"city"} className="form-label-text">City</label>
        <input 
          type="text"
          id={"city"}
          className="form-style"
          placeholder="Enter city..."
          value={jobForm.city || ''}
          onChange={handleJobChange}
          required />
        </div>
        <div className="w-full">
        <label htmlFor={"state"} className="form-label-text">State</label>
        <StatePicker onChange={handleStateChange} initState={jobForm.state || ""}/>
        </div>
      </div>

      <FormContainer>
        <DateInput 
          title='Start Date' 
          value={jobForm.startDate} 
          onChange={(event) => {
            const newDate = event.target.value;
            setJobForm(prev => ({
              ...prev,
              startDate: newDate
            }));
          }} 
        />
        <DateInput 
          title='End Date' 
          value={jobForm.endDate}
          onChange={(event) => {
            const newDate = event.target.value;
            setJobForm(prev => ({
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

      <div className="">
        <div className="my-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center">
              <label htmlFor={"jobHighlights"} className="form-label-text">Highlights</label>
            </div>
            
            <div className="left-right-spacing">
              <button
                className="primary-action-button"
                onClick={() => showAiAssistant(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>AI Assistant</span>
                </div>
              </button>
              <button
                className="primary-action-button"
                onClick={() => setShowBrainstorm(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>Write with AI</span>
                </div>
              </button>
              <button
                className="primary-action-button"
                onClick={handleHighlightAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        {aiAssistant && (
          <AIAssistant
            placeholder={placeholder}
            isPlaceholderActive={isPlaceholderActive}
            aiAssistantMsg={aiAssistantMsg}
            onMessageChange={setAiAssistantMsg}
            onSubmit={handleAiAssistCall}
            onClose={() => showAiAssistant(false)}
              loading={aiLoading}
            />
        )}

        {jobForm.highlights ? jobForm.highlights.map((item, index) => (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                type="text"
                id={"jobHighlights"}
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Enter highlights from work..."
                value={item}
                onChange={(e) => handleJobHighlightsChange(e.target.value, index)}
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
        )) : (
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
      </div>

      <div className="left-right-spacing">
        <button
          disabled={!jobForm.id}
          className={"secondary-action-button"}
          onClick={handleDeleteJob}
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
          onClick={handleSaveJob}
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
              placeholder="E.g. Led a team, Improved efficiency, Managed budgets"
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

export default JobEditor;
