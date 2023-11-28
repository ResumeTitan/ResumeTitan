import React, { useState } from 'react';
import { VerticalList } from '../../components/VerticalList';

function Job({ editingJob, onSave, onDelete, onCancel }) {
  const [jobForm, setJobForm] = useState(editingJob);

  const handleSaveJob = () => {
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

  const handleJobContentChange = (content) => {
    setJobForm({ ...jobForm, content: content.map((item) => item.content) });
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <label htmlFor={"title"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Title</label>
        <input 
          type="text"
          id={"title"}
          className="formStyle" 
          placeholder="Enter job title..."
          onChange={handleJobChange}
          value={jobForm.title || ''}
          required />
      </div>
      <div className="mb-6">
        <label htmlFor={"employer"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employer</label>
        <input 
          type="text"
          id={"employer"}
          className="formStyle"
          placeholder="Enter employer..."
          value={jobForm.employer || ''}
          onChange={handleJobChange}
          required 
        />
      </div> 
      <div className="mb-6 flex flex-cols justify-between">
        <div className="w-full pr-2">
        <label htmlFor={"city"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
        <input 
          type="text"
          id={"city"}
          className="formStyle"
          placeholder="Enter city..."
          value={jobForm.city || ''}
          onChange={handleJobChange}
          required />
        </div>
        <div className="w-full pl-2">
        <label htmlFor={"state"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
        <input 
          type="text"
          id={"state"}
          className="formStyle"
          placeholder="Enter state..."
          value={jobForm.state || ''}
          onChange={handleJobChange}
          required />
        </div>
      </div>

      <div className="mb-6 flex flex-cols justify-between">
        <div className="w-full pr-2">
          <label htmlFor={"startDate"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
          <div className="flex flex-cols">
            <div className="w-[75%] pr-1">
              <input 
                type="text"
                id={"startDateMonth"}
                className="formStyle"
                placeholder="Enter month..."
                value={jobForm.startDateMonth || ''}
                onChange={handleJobChange}
                required />
            </div>
            <div className="pl-1">
              <input 
                type="text"
                id={"startDateYear"}
                className="formStyle"
                placeholder="Enter year..."
                value={jobForm.startDateYear || ''}
                onChange={handleJobChange}
                required />
            </div>
          </div>
        </div>
        <div className="w-full pl-2">
        <div className="w-full pr-2">
          <div className="flex justify-between">
            <label htmlFor={"endDate"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
            <div class="flex items-center">
              <input type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked state</label>
            </div>
          </div>
          <div className="flex flex-cols">
            <div className="w-[75%] pr-1">
              <input 
                type="text"
                id={"endDateMonth"}
                className="formStyle"
                placeholder="Enter month..."
                value={jobForm.endDateMonth || ''}
                onChange={handleJobChange}
                required />
            </div>
            <div className="pl-1">
              <input 
                type="text"
                id={"endDateYear"}
                className="formStyle"
                placeholder="Enter year..."
                value={jobForm.endDateYear || ''}
                onChange={handleJobChange}
                required />
            </div>
          </div>
      </div>
        </div>
      </div>

      <div className="my-6">
        <label htmlFor={"notes"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
        <textarea 
          id={"notes"}
          className="formStyle"
          placeholder="Math club, passed organic chemistry, etc."
          value={jobForm.notes || ''}
          onChange={handleJobChange}
          required 
        />
      </div>

      {jobForm.content && (
        <div className="m-2">
          <label htmlFor={"jobContent"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
          <VerticalList items={jobForm.content.map((item, index) => ({ id: index + 1, content: item })) || []} onSave={handleJobContentChange} />
        </div>
      )}

      <div className="flex justify-between">
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

export default Job;
