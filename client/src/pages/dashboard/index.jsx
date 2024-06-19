import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume } from 'api/resume';
import { deleteInterview, getInterviews } from 'api/interview';
import Spinner from 'components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
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
   * @function useEffect
   * @description Scroll to top of page on load
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

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

  const handleDeleteInterview = async (event, id) => {
    event.stopPropagation();
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
      <div className="relative group mx-16 my-8 border-8 border-black rounded-2xl hover:bg-lightest-green">
        <ResumeCard resume={resumes[index]} />
        <div className="text-black my-4 flex justify-center items-center text-6xl">
          {resumes[index].name}
        </div>

        <button
          onClick={() => handleClickResume(resumes[index]._id)}
          className="dashboard-edit-button w-5/6 h-96 top-10 left-20"
        >
          <EditIcon style={{ fontSize: 256 }} />
        </button>
        <button
          onClick={() => handleClickedDelete(resumes[index]._id)}
          className="dashboard-delete-button w-5/6 h-96 bottom-60 left-20"
        >
          <CloseIcon style={{ fontSize: 256 }} />
        </button>

      </div>
    ));

  return (
    <div className="bg-white text-white">
      <div className="dashboard-container">
        <div className="dashboard-header">My Resumes:</div>
        <button className="dashboard-button" onClick={() => navigate('/resume')}>Add New</button>
        <div className="overflow-x-scroll overflow-y-hidden h-80 hide-scrollbar">
          <div className="transform scale-25 flex origin-top-left">
            {resumeWidgets}
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">My Interviews:</div>
        <button className="dashboard-button" onClick={() => navigate('/interview')}>Add New</button>
        <div className="overflow-x-scroll hide-scrollbar">
          <div className="flex p-2 origin-top-left">
            {interviews.map((interview, index) => (
              <div className="border border-4 m-2 rounded-lg border-black hover:bg-lightest-green relative group">
                <div className="text-black w-40 h-40 p-2 m-2 rounded-lg">
                  <div className="text-xl font-bold">{interview.jobTitle}</div>
                  <div className="">{`Questions: ${interview.interview.length}`}</div>
                  <div className="">{`${formatDateFull(interview.createdAt)}`}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickInterview(interview._id);
                  }}
                  className="dashboard-edit-button top-3 left-3 w-16 h-16"
                >
                  <EditIcon style={{ fontSize: 48 }}/>
                </button>
                <button
                  onClick={(e) => handleDeleteInterview(e, interviews[index]._id)}
                  className="dashboard-delete-button top-3 right-3 w-16 h-16"
                >
                  <CloseIcon style={{ fontSize: 48 }} />
                </button>
              </div>
            ))}
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
