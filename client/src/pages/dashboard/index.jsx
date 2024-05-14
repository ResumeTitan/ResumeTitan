import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume } from 'api/resume';
import { deleteInterview, getInterviews } from 'api/interview';
import Spinner from 'components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Popup from './Popup';
import { formatDateFull } from 'utils';
import './dashboard.css';

export const Dashboard = () => {
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(0);


  /**
   * @function loadResumes
   * @description Load resumes from the database, sets state
   */
  const loadResumes = async () => {
    if (!currentUser) {
      return;
    }
    setIsLoading(true);
    const data = await getResumes(token, currentUser._id);
    setResumes(data.resumes);
    setIsLoading(false);
  };

  /**
   * @function loadInterviews
   * @description Load interviews from the database, sets state
   */
  const loadInterviews = async () => {
    if (!currentUser) {
      return;
    }
    const data = await getInterviews(token, currentUser._id);
    setInterviews(data.interviews);
  }

  const handleClickResume = (resumeId) => {
    navigate(`/resume`, {state: {resumeId: resumeId}});
  }

  const handleClickInterview = (interviewId) => {
    navigate('/interview', {state: {interviewId: interviewId}});
  }

  const handleClickedDelete = (resumeId) => {
    setDeleteId(resumeId);
    setShowPopup(true);
  }

  const handleDeleteResume = async () => {
    await deleteResume(token, deleteId);
    setShowPopup(false);
    await loadResumes();
  }

  const handleDeleteInterview = async (id) => {
    await deleteInterview(token, id);
    await loadInterviews();
  }

  useEffect(() => {
    setIsLoading(true);
    loadResumes();
    loadInterviews();
    setIsLoading(false);
  }, []);

    // Create an array of ResumeWidget components based on numWidgets
    const resumeWidgets = Array.from({ length: resumes.length }, (_, index) => (
      <div className="hover:cursor-pointer relative group">
        <ResumeCard
          basics={resumes[index].basics}
          education={resumes[index].education}
          work={resumes[index].work}
          skills={resumes[index].skills}
          theme={resumes[index].theme} 
        />

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
      <div className="overflow-x-scroll hide-scrollbar">
        <div className="flex lg:min-w-0 w-1/2 h-80 items-start p-2">
          <div className="transform scale-25 flex origin-top-left">
            {resumeWidgets}
          </div>
        </div>
      </div>

      <div>
        <div className="text-3xl font-bold bg-slate-700 p-2 flex">My Interviews:</div>
        <button className="mx-4 mt-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4" onClick={() => navigate('/interview')}>Add New</button>

        <div className="overflow-x-scroll hide-scrollbar">
          <div className="flex lg:min-w-0 w-1/2 h-80 items-start p-2">
            <div className="flex origin-top-left">
              {interviews.map((interview, index) => (
                <div onClick={() => handleClickInterview(interview._id)} className="hover:cursor-pointer relative group">
                  <div className="bg-gray-800 bg-opacity-25 w-40 h-40 p-2 m-2 rounded-lg">
                    <div className="text-xl font-bold">{interview.jobTitle}</div>
                    <div className="">{`Questions: ${interview.interview.length}`}</div>
                    <div className="">{`${formatDateFull(interview.createdAt)}`}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteInterview(interviews[index]._id);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && <Popup message={`Are you sure you want to delete this resume?`} handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}

      {/* Spinner while loading */}
      {isLoading && <Spinner />}
    </div>
  );
};
