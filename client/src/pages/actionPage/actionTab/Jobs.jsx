import React, { useState } from 'react';
import JobEditor from './JobEditor';
import WorkIcon from '@mui/icons-material/Work';
import 'styles/index.css';

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
      <div className="form-text-main">{"Work"}</div>
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          
          {jobs.map((job, index) => (
            <div key={`job-${index}`} className="form-secondary-area" onClick={() => handleEditJob(job.id)}>
              <div className="w-full">
                <div className="font-bold">
                  {job?.position}
                </div>
                <div>
                  {job?.name}
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
          <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={handleAddJob}>
            <WorkIcon fontSize="large"/>
            <span>{"Add Job"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
