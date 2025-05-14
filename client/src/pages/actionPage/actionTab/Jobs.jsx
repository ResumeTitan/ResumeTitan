import React, { useState } from 'react';
import JobEditor from './JobEditor';
import WorkIcon from '@mui/icons-material/Work';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

  const handleMoveUp = (index, e) => {
    e.stopPropagation();
    if (index > 0) {
      onSwap(true, index);
    }
  }

  const handleMoveDown = (index, e) => {
    e.stopPropagation();
    if (index < jobs.length - 1) {
      onSwap(false, index);
    }
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
            <div key={`job-${index}`} 
              className="form-secondary-area flex items-center" 
              onClick={() => handleEditJob(job.id)}
            >
              <div className="flex items-center gap-2 mr-4">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveUp(index, e)}
                  disabled={index === 0}
                >
                  <KeyboardArrowUpIcon />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveDown(index, e)}
                  disabled={index === jobs.length - 1}
                >
                  <KeyboardArrowDownIcon />
                </button>
              </div>
              <div className="flex-grow">
                <div className="font-bold">
                  {job?.position}
                </div>
                <div>
                  {job?.name}
                </div>
              </div>
              <button 
                className="green-button px-6 py-2 border border-1 min-w-[100px]" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditJob(job.id);
                }}
              >
                {"Edit"}
              </button>
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
