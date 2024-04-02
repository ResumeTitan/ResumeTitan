import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import '../index.css';

function JobEditor({ editingJob, onSave, onDelete, onCancel }) {
  const [jobForm, setJobForm] = useState(editingJob);
  const [startDate, setStartDate] = useState(new Date(editingJob.startDate) || new Date());
  const [endDate, setEndDate] = useState(new Date(editingJob.endDate) || new Date());
  const [endDateChecked, setEndDateChecked] = useState(editingJob.endDateCurrent || false);

  const handleSaveJob = () => {
    jobForm.startDate = startDate.toString();
    jobForm.endDate = endDate.toString();
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

  return (
    <div className="mt-6">
      <div className="mb-6">
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
      <div className="mb-6">
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
        <input 
          type="text"
          id={"state"}
          className="form-style"
          placeholder="Enter state..."
          value={jobForm.state || ''}
          onChange={handleJobChange}
          required />
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
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" }
                }}
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
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" }
                }}
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
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
              onChange={handleEndDateCurrent}
              checked={endDateChecked}
            />
            </label>
          </div>
        </div>
        </div>
      </div>

      <div className="my-6">
        <label htmlFor={"notes"} className="form-label-text">Notes</label>
        <textarea 
          id={"notes"}
          className="form-style"
          placeholder="Math club, passed organic chemistry, etc."
          value={jobForm.notes || ''}
          onChange={handleJobChange}
          required 
        />
      </div>

      {jobForm.content && (
        <div className="m-2">
          <div className="left-right-spacing my-2">
            <label htmlFor={"jobContent"} className="form-label-text">Content</label>
            <button
              className="green-button p-1 bg-slate-800"
              onClick={() => setJobForm({ ...jobForm, content: [...jobForm.content, ""] })}
            >
              {"Add"}
            </button>
          </div>
          {jobForm.content.map((item, index) => (
            <div className="left-right-spacing">
              <div className="w-full pr-2">
                <textarea 
                  type="text"
                  id={"jobContent"}
                  className="form-style flex-wrap"
                  placeholder="Enter content..."
                  value={item}
                  onChange={(e) => handleJobContentChange(e.target.value, index)}
                  required 
                />
              </div>
              <div>
                <button
                  className="remove-content-button"
                  onClick={() => handleContentDelete(index)}
                >
                  {"X"}
                </button>
              </div>
            </div>
            )
          )}
        </div>
      )}

      <div className="left-right-spacing">
        <button
          disabled={!jobForm.id}
          className={`${jobForm.id ? "removeButton bg-slate-800" : "disabledButton"}`}
          onClick={handleDeleteJob}
        >
          {"Delete"}
        </button>
        <button
          className="removeButton bg-slate-800"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="addButton bg-slate-800"
          onClick={handleSaveJob}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default JobEditor;
