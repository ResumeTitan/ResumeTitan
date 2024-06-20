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

function JobEditor({ editingJob, onSave, onDelete, onCancel }) {
  const [jobForm, setJobForm] = useState(editingJob);
  const [aiLoading, setAiLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(editingJob.startDate) || new Date());
  const [endDate, setEndDate] = useState(new Date(editingJob.endDate) || new Date());
  const [endDateChecked, setEndDateChecked] = useState(editingJob.endDateCurrent || false);

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

  const handleJobContentChange = (content, index) => {
    const newForm = { ...jobForm };
    newForm.content[index] = content;
    setJobForm(newForm);
  }

  const handleStateChange = (state) => {
    setJobForm({ ...jobForm, state: state });
  }

  const handleContentDelete = (index) => {
    const newForm = { ...jobForm };
    newForm.content.splice(index, 1);
    setJobForm(newForm);
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setJobForm({ ...jobForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleResponsibilityAdd = () => {
    if (!jobForm.content) {
      setJobForm({ ...jobForm, content: [""] });
    } else {
      setJobForm({ ...jobForm, content: [...jobForm.content, ""] });
    }
  }

  /**
   * @function handleAiCall
   */
  const handleAiCall = async () => {
    setAiLoading(true);
    const jobResponse = await api.post("/new/job", { job: jobForm });
    setJobForm({ ...jobForm, content: jobResponse.data.response.responsibilities });
    setAiLoading(false);
  }

  return (
    <div className={`my-6 ${aiLoading ? "animate-pulse" : ""}`}>
      <div>
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
      <div className="mb-6 left-right-spacing">
        <div className="w-full pr-2">
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
        <div className="w-full pl-2">
        <label htmlFor={"state"} className="form-label-text">State</label>
        <StatePicker onChange={handleStateChange} initState={jobForm.state || ""}/>
        </div>
      </div>

      <div className="mb-6 flex justify-between">
        <div className="w-full pr-2">
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
        <div className="w-full pl-2">
        <div className="w-full pr-2">

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
      </div>

      <div className="m-2">
        <div className="left-right-spacing my-2">
          <label htmlFor={"jobContent"} className="form-label-text">Responsibilities</label>
          <div>
            <button
              className="green-button"
              onClick={handleAiCall}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>Write with AI</span>
              </div>
            </button>
            <button
              className="green-button"
              onClick={handleResponsibilityAdd}
            >
              {"Add"}
            </button>
          </div>
        </div>
        {jobForm.content ? jobForm.content.map((item, index) => (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                type="text"
                id={"jobContent"}
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Enter responsibilities or skills..."
                value={item}
                onChange={(e) => handleJobContentChange(e.target.value, index)}
                required 
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleContentDelete(index)}
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
                type="text"
                className="form-style flex-wrap h-24 lg:h-16 text-black"
                placeholder="Click add to start adding responsibilities/skills..."
                disabled
              />
            </div>
          </div>
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
