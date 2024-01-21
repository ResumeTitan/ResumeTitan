import React, { useEffect, useState } from 'react';
import Job from './Job';
import WorkIcon from '@mui/icons-material/Work';
import './Action.css';

function Jobs({ jobs, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState({});

  const handleSaveJob = (jobForm) => {
    setIsEditing(false);
    onSave(jobForm);
  }

  const handleDeleteJob = (id) => {
    setIsEditing(false);
    onDelete(id);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditJob = (index) => {
    console.log('index', index);
    console.log('jobs', jobs);
    const foundJob = jobs.find(obj => obj.id === index);
    console.log('index', foundJob);
    setEditingJob(foundJob);
    setIsEditing(true);
  }

  const handleAddJob = () => {
    setIsEditing(true);
    setEditingJob({});
  }

  useEffect(() => {}, [jobs]);

  const editingForm = (
    <div className="px-4 pb-4">
      <Job editingJob={editingJob} onSave={handleSaveJob} onDelete={handleDeleteJob} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="border border-black border-2 rounded-lg w-full my-4 text-white bg-slate-700">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div className="font-bold border-b border-black rounded-t p-4">{"Job Info"}</div>
          {jobs.map((job, index) => (
            <div key={`job-${index}`} className="p-4 border-b border-black hover:bg-slate-500" onClick={() => handleEditJob(job.id)}>
              <div className="flex justify-between font-bold">
                {job?.title}
              </div>
              <div className="flex justify-between">
                {job?.employer}
              </div>
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center addButton`} onClick={handleAddJob}>
            <WorkIcon fontSize="large"/>
            <span>{"Add Job"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
