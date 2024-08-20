import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useNavigate } from 'react-router-dom';
import Spinner from 'components/Spinner';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Popup from './Popup';
import { formatDateFull } from '../../utils/index';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from 'api/actions';
import { setToken } from '../../state/authReducer';
import { useDispatch } from 'react-redux';
import { ResumeType } from 'types/types';

export const Dashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeType[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /**
   * @function loadResumes
   * @description Load resumes from the database, sets state
   */
  const loadResumes = async () => {
    if (!user) {
      return null;
    }
    const newToken = await getToken();
    if (!newToken) {
      return null;
    }
    const userId = user.id;
    dispatch(setToken(newToken));
    const response = await api.get(`/resume/user?userId=${userId}`);
    setResumes(response.data.resumes);
  }

  /**
   * @function loadInterviews
   * @description Load interviews from the database, sets state
   */
  const loadInterviews = async () => {
    if (!user) {
      return;
    }
    const response = await api.get(`/interview`);
    setInterviews(response.data.interviews);
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadResumes();
      await loadInterviews();
      setIsLoading(false);
    };
    
    window.scrollTo(0, 0);
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(true);
      loadResumes();
      loadInterviews();
      setIsLoading(false);
    }

    window.scrollTo(0, 0);
  }, [isLoaded]);


  const handleClickResume = (resumeId: string) => {
    navigate(`/resume`, { state: { resumeId } });
  };

  const handleClickInterview = (interviewId: string) => {
    navigate('/interview', { state: { interviewId } });
  };

  const handleClickedDelete = (resumeId: string) => {
    setDeleteId(resumeId);
    setShowPopup(true);
  };

  const handleDeleteResume = async () => {
    if (deleteId !== null) {
      try {
        await api.delete(`/resume/delete?id=${deleteId}`);
        setShowPopup(false);
        await loadResumes()
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handleDeleteInterview = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    try {
      await api.delete(`/interview/${id}`);
      await loadInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const resumeWidgets = resumes.map((resume, index) => (
    <div key={resume._id} className="relative group mx-16 my-8 border-8 border-black rounded-2xl hover:bg-lightest-green">
      <ResumeCard resume={resume} />
      <div className="text-black my-4 flex justify-center items-center text-6xl">
        {resume.name}
      </div>
      <button
        onClick={() => handleClickResume(resume._id)}
        className="dashboard-edit-button w-5/6 h-96 top-20 left-20"
      >
        <EditIcon style={{ fontSize: 256 }} />
      </button>
      <button
        onClick={() => handleClickedDelete(resume._id)}
        className="dashboard-delete-button w-5/6 h-96 bottom-60 left-20"
      >
        <CloseIcon style={{ fontSize: 256 }} />
      </button>
    </div>
  ));

  const resumePlaceholder = (
    <div className="relative group mx-16 my-8 border-8 border-black rounded-2xl hover:bg-lightest-green">
      <div className="bg-gray w-[210mm] h-[296mm] bg-gray-200 my-0 mx-auto">
        <div className="text-black text-9xl">
          No resumes made yet, click "Add New" to get started
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-white">
      <div className="dashboard-container">
        <div className="dashboard-header">My Resumes:</div>
        <button className="dashboard-button" onClick={() => navigate('/resume')}>Add New</button>
        <div className="overflow-x-scroll overflow-y-hidden h-[22rem] hide-scrollbar">
          <div className="transform scale-25 flex origin-top-left">
            { resumes && resumes.length > 0 ? resumeWidgets : resumePlaceholder }
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">My Interviews:</div>
        <button className="dashboard-button" onClick={() => navigate('/interview')}>Add New</button>
        <div className="overflow-x-scroll hide-scrollbar">
          <div className="flex p-2 origin-top-left">
            {interviews.map((interview) => (
              <div key={interview._id} className="border border-4 m-2 rounded-lg border-black hover:bg-lightest-green relative group">
                <div className="text-black w-40 h-40 p-2 m-2 rounded-lg">
                  <div className="text-xl font-bold">{interview.jobTitle}</div>
                  <div className="">Questions: {interview.interview.length}</div>
                  <div className="">{formatDateFull(interview.createdAt)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickInterview(interview._id);
                  }}
                  className="dashboard-edit-button top-3 left-3 w-16 h-16"
                >
                  <EditIcon style={{ fontSize: 48 }} />
                </button>
                <button
                  onClick={(e) => handleDeleteInterview(e, interview._id)}
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
      {showPopup && <Popup message="Are you sure you want to delete this resume?" handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}

      {/* Spinner while loading */}
      {isLoading && <Spinner />}
    </div>
  );
};
