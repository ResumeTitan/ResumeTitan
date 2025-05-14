import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs from 'dayjs';
import StatePicker from 'components/StatePicker';
import api from 'api/actions';
import 'styles/index.css';

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
  const [startDate, setStartDate] = useState(new Date(editingJob.startDate) || new Date());
  const [endDate, setEndDate] = useState(new Date(editingJob.endDate) || new Date());
  const [endDateChecked, setEndDateChecked] = useState(editingJob.endDateCurrent || false);
  const [aiAssistant, showAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [placeholder, setPlaceholder] = useState("Ensure that all highlights follow a consistent format and tone");
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);

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
    jobForm.startDate = startDate.toString();
    if (endDateChecked) {
      jobForm.endDate = "";
    } else {
      jobForm.endDate = endDate.toString();
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
  const handleAiCall = async () => {
    setAiLoading(true);
    try {
      console.log(jobForm.highlights);
      const jobResponse = await api.post("/resume/work", { job: jobForm });
      setJobForm(prev => ({ ...prev, highlights: jobResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const handleAiAssistCall = async () => {
    const newForm = { ...jobForm };

    if (newForm.highlights) {
      newForm.highlights = [...newForm.highlights, aiAssistantMsg];
    } else {
      newForm.highlights = [aiAssistantMsg];
    }
  
    setAiLoading(true);
    try {
      console.log(jobForm.highlights);
      const jobResponse = await api.post("/resume/work", { job: newForm });
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

      <div className="mb-6 justify-between phone-screen-stack">
        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(newValue) => {setStartDate(newValue.toString())}}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="w-full">

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="End Date"
                value={dayjs(endDate)}
                onChange={(newValue) => {setEndDate(newValue.toString())}}
                disabled={endDateChecked}
              />
            </DemoContainer>
          </LocalizationProvider>
          <div className="left-right-spacing">
            <label htmlFor="endDateCheckbox" className="flex items-center">
              <div className="text-xs pr-2">Current</div>
            <input 
              id="endDateCheckbox"
              type="checkbox"
              value=""
              className="bg-gray-700 border-gray-600 w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" 
              onChange={handleEndDateCurrent}
              checked={endDateChecked}
            />
            </label>
          </div>
        </div>
      </div>

      <div className="m-2">
        <div className="left-right-spacing my-2">
          <div className="flex items-center">
            <label htmlFor={"jobHighlights"} className="form-label-text">Highlights</label>
          </div>
          
          <div className="phone-screen-stack">
            <button
              className="green-button order-last xs:order-first p-2 my-1"
              onClick={handleAiCall}
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
        )) : null}

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
          disabled={!jobForm.id}
          className={`${jobForm.id ? "remove-button" : "disabled-button"}`}
          onClick={handleDeleteJob}
        >
          {"Delete"}
        </button>
        <button
          className="remove-button"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="add-button-small"
          onClick={handleSaveJob}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default JobEditor;
