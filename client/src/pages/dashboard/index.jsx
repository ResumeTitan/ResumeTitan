import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume } from '../../api/resume';
import { setActiveResume } from '../../state';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Popup from './Popup';
import './dashboard.css';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  const [numResumesShown, setNumResumesShown] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const loadResumes = async () => {
    if (!currentUser) {
      return;
    }
    const data = await getResumes(token, currentUser._id);
    setResumes(data.resumes);
  };

  const handleClickResume = (resumeId) => {
    dispatch(setActiveResume(resumeId));
    navigate(`/resume`, {state: {resumeId: resumeId}});
  }

  const handleClickedDelete = (resumeIndex) => {
    setDeleteId(resumeIndex);
    setShowPopup(true);
  }

  const handleDeleteResume = async () => {
    await deleteResume(token, deleteId);
    setShowPopup(false);
    await loadResumes();
  }

  useEffect(() => {
    loadResumes();
    dispatch(setActiveResume(null));
  }, []);

    // Create an array of ResumeWidget components based on numWidgets
    const resumeWidgets = Array.from({ length: Math.min(resumes.length, numResumesShown) }, (_, index) => (
      <div className="hover:cursor-pointer relative group">
        <ResumeCard
          basics={resumes[index].basics}
          education={resumes[index].education}
          work={resumes[index].work}
          skills={resumes[index].skills}
          theme={"harvard"} />
          
        {/* Overlay */}
        <div className="hidden absolute inset-0 bg-gray-800 bg-opacity-25 group-hover:flex group-hover:flex-rows items-center justify-center">
          <button className="bg-green-700 bg-opacity-25 text-white w-full h-full hover:bg-opacity-75"
            onClick={() => handleClickResume(resumes[index]._id)}>
            <EditIcon style={{ fontSize: 256 }}/>
          </button>
          <button className="bg-red-700 bg-opacity-25 text-white w-full h-full hover:bg-opacity-75"
            onClick={() => handleClickedDelete(resumes[index]._id)}>
            <DeleteIcon style={{ fontSize: 256 }}/>
          </button>
        </div>
      </div>
    ));

  return (
    <div className="bg-slate-400 text-white min-h-screen">
      <h1 className="text-3xl font-bold bg-slate-700 p-2 w-full">Welcome to ResumeTitan</h1>

      <div className="text-3xl font-bold bg-slate-700 p-2">My Resumes:</div>
      <button className="mx-4 mt-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4" onClick={() => navigate('/resume')}>Add New</button>
      <div className="overflow-x-scroll">
        <div className="flex lg:min-w-0 w-1/2 h-80 items-start p-2">
          <div className="transform scale-25 flex origin-top-left">
            {resumeWidgets}
          </div>
        </div>
      </div>

      <div className="text-3xl font-bold bg-slate-700 p-2 flex">My Interviews:</div>
      <button className="mx-4 mt-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4" onClick={() => navigate('/interview')}>Add New</button>

      {/* <Tabs onTabClick={() => {}}/> */}

      {/* Popup */}
      {showPopup && <Popup message={`Are you sure you want to delete this resume?`} handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}
    </div>
  );
};
