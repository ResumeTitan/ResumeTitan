import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Job from './Job';
import { addJob, setJob, deleteJob } from 'state';
import WorkIcon from '@mui/icons-material/Work';
import './Action.css';

function Jobs({ adding, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState({});
  
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.jobs);

  const handleSaveJob = (jobForm) => {
    setIsEditing(false);
    onSave();
    if (jobForm.id) {
      dispatch(setJob({ job: jobForm }));
      return;
    } else {
      jobForm.id = jobs.length + 1;
      dispatch(addJob({ job: jobForm }));
    }
  }

  const handleDeleteJob = (id) => {
    setIsEditing(false);
    dispatch(deleteJob({ job: { id } }));
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

  useEffect(() => {
    console.log('jobs', jobs);
  }, [jobs]);

  useEffect(() => {
    if (adding) {
      setIsEditing(true);
      setEditingJob({});
    } else {
      setIsEditing(false);
      setEditingJob({});
    }
  }, [adding]);

  const editingForm = (
    <div className="px-4 pb-4">
      <Job editingJob={editingJob} onSave={handleSaveJob} onDelete={handleDeleteJob} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="border border-black border-2 rounded-lg w-full m-6 text-white bg-slate-700">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div class="font-bold border-b border-black rounded-t p-4">{"Job Info"}</div>
          {jobs.map((job) => (
            <div className="p-4 border-b border-black hover:bg-slate-500" onClick={() => handleEditJob(job.id)}>
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
