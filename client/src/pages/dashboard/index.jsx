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
  const [numResumesShown, setNumResumesShown] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      if (window.innerWidth < 512) {
        setNumResumesShown(1);
      } else if (window.innerWidth < 680) {
        setNumResumesShown(2);
      } else if (window.innerWidth < 940) {
        setNumResumesShown(3);
      } else if (window.innerWidth < 940) {
        setNumResumesShown(4);
      } else {
        setNumResumesShown(5);
      }
    };

    // Add event listener to window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up listener on component unmount
    };
  }, [])

  const loadResumes = async () => {
    if (!currentUser) {
      return;
    }
    const data = await getResumes(token, currentUser._id);
    setResumes(data.resumes);
  };

  const handleClickResume = (resumeId) => {
    console.log("Clicked resume with id: " + resumeId);
    dispatch(setActiveResume(resumeId));
    navigate(`/resume`);
  }

  const handleClickedDelete = (resumeIndex) => {
    setDeleteId(resumeIndex);
    setShowPopup(true);
  }

  const handleDeleteResume = () => {
    console.log("Clicked delete resume with id: " + deleteId);
    deleteResume(token, deleteId);
    setShowPopup(false);
    loadResumes();
  }

  useEffect(() => {
    loadResumes();
    dispatch(setActiveResume(null));
  }, []);

    // Create an array of ResumeWidget components based on numWidgets
    const resumeWidgets = Array.from({ length: Math.min(resumes.length, numResumesShown) }, (_, index) => (
      <div className="hover:cursor-pointer relative group">
        <ResumeCard
          personalInfo={currentUser}
          summary={resumes[index].objective}
          schools={resumes[index].schools}
          jobs={resumes[index].jobs}
          skills={resumes[index].skills} />
          
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
      <h1 className="text-3xl font-bold bg-slate-700 p-2 w-full">Welcome {currentUser?.firstName}</h1>
      <div className="text-3xl font-bold bg-slate-700 p-2">My Resumes:</div>
      <button className="mx-4 mt-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4" onClick={() => navigate('/resume')}>Add New</button>
      <div className="flex flex-cols lg:min-w-0 w-1/2 h-auto items-start p-2">
          <div className="transform scale-25 flex flex-cols origin-top-left">
            {resumeWidgets}
          </div>  
      </div>

      {/* Popup */}
      {showPopup && <Popup message={`Are you sure you want to delete this resume?`} handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}
    </div>
  );
};
