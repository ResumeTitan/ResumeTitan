import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    console.log('jobForm', jobForm);
  }, [jobForm]);

  return (
    <div className="mt-6">
      <div className="mb-6">
        <label htmlFor={"name"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job Name</label>
        <input 
          type="text"
          id={"name"}
          className="formStyle" 
          placeholder="Harvard University"
          onChange={handleJobChange}
          value={jobForm.name || ''}
          required />
      </div>
      <div className="mb-6">
        <label htmlFor={"location"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
        <input 
          type="text"
          id={"location"}
          className="formStyle"
          placeholder="Raleigh, NC"
          value={jobForm.location || ''}
          onChange={handleJobChange}
          required 
        />
      </div> 
      <div className="mb-6">
        <label htmlFor={"jobmajor"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
        <input 
          type="text"
          id={"major"}
          className="formStyle"
          placeholder="Business Administration"
          value={jobForm.major || ''}
          onChange={handleJobChange}
          required />
      </div> 
      <div className="mb-6">
        <label htmlFor={"degree"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
        <select id={"degree"} className="formStyle" onChange={handleJobChange}>
          <option >High School Diploma</option>
          <option>Bachelor of Science</option>
          <option>Bachelor of Arts</option>
          <option>Masters Degree</option>
          <option>Doctorate</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">Graduation Date</label>
        <input
          type="date" 
          id={"graduationDate"}
          className="formStyle"
          value={jobForm.graduationDate || ''}
          onChange={handleJobChange}
          required 
        />
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
      <div className="flex justify-between">
        <button
          className="addButton bg-slate-800"
          onClick={handleSaveJob}
        >
          {"Save"}
        </button>
        <button
          className="removeButton bg-slate-800"
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
      </div>
    </div>
  );
}

export default Job;
