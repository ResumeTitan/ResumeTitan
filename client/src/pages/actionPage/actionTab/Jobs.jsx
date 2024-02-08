import React, { useState } from 'react';
import JobEditor from './JobEditor';
import WorkIcon from '@mui/icons-material/Work';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import './Action.css';

function Jobs({ jobs, onSave, onDelete, onSwap }) {
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
    console.log("found job", index);
    const foundJob = jobs.find(obj => obj.id === index);
    setEditingJob(foundJob);
    setIsEditing(true);
  }

  const handleAddJob = () => {
    setIsEditing(true);
    setEditingJob({});
  }

  const editingForm = (
    <div className="px-4 pb-4">
      <JobEditor editingJob={editingJob} onSave={handleSaveJob} onDelete={handleDeleteJob} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="form-container">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div className="font-bold border-b border-black rounded-t p-4">{"Job Info"}</div>
          {jobs.map((job, index) => (
            <div key={`job-${index}`} className="left-right-spacing p-4 border-b border-black hover:bg-slate-500 hover:cursor-pointer" onClick={() => handleEditJob(job.id)}>
              <div className="w-full ">
                <div className="font-bold">
                  {job?.title}
                </div>
                <div>
                  {job?.employer}
                </div>
              </div>
              {/* <div className="flex">
                {index > 0 && <ArrowCircleUpIcon 
                  className="hover:cursor-pointer" 
                  sx={{ "&:hover": { color: "blue" } }} 
                  fontSize='medium'
                  onClick={() => {onSwap(true, index)}}
                />}
                {index + 1 < jobs.length && <ArrowCircleDownIcon 
                  fontSize='medium'
                  className="hover:cursor-pointer" 
                  sx={{ "&:hover": { color: "blue" } }} 
                  onClick={() => {onSwap(false, index)}}
                />}
              </div> */}
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
