import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Job from './Job';
import { addJob, setJob, deleteJob } from 'state';
import WorkIcon from '@mui/icons-material/Work';
import './index.css';

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
      dispatch(addJob({ school: jobForm }));
    }
  }

  const handleDeleteJob = (id) => {
    setIsEditing(false);
    dispatch(deleteJob({ school: { id } }));
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditJob = (index) => {
    setIsEditing(true);
    const foundJob = jobs.find(obj => obj.id === index);
    console.log('index', foundJob);
    setEditingJob(foundJob);
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
    <div className="p-4">
      <div className="whitespace-nowrap flex justify-between">
        <div className="formHeader">Job Info</div>
      </div>
      <Job editingJob={editingJob} onSave={handleSaveJob} onDelete={handleDeleteJob} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="border border-black border-2 rounded-lg w-full m-6 text-white bg-slate-700">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div class="font-bold border-b border-black rounded-t p-4">{"Job Info"}</div>
          {jobs.map((school) => (
            <div className={`p-4 border-b border-black `} onClick={() => handleEditJob(school.id)}>
              <div className="flex justify-between font-bold">
                {school.name}
              </div>
              <div className="flex justify-between">
                {school.degree}
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
