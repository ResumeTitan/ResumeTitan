import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useNavigate } from 'react-router-dom';
import Spinner from 'components/Spinner';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Popup from './Popup';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from 'api/actions';
import { setToken } from '../../state/authReducer';
import { useDispatch } from 'react-redux';
import { ResumeType } from 'types/types';
import DashboardContainer from './DashboardContainer';
import Pricing from 'components/Pricing';
import 'styles/index.css'

export const Dashboard: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeType[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /**
   * @function loadResumes
   * @description Load resumes from the database, sets state
   */
  const loadResumes = async () => {
    if (!user) {
      return null;
    }
    const userId = user.id;
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

  /**
   * @function loadInterviews
   * @description Load interviews from the database, sets state
   */
  const loadCoverLetters = async () => {
    if (!user) {
      return;
    }
    const response = await api.get(`/cover-letter`);
    setCoverLetters(response.data.coverLetters);
  }

  useEffect(() => {
    const loadData = async () => {
      const newToken = await getToken();
      if (!newToken) {
        return null;
      }
      dispatch(setToken(newToken));
      setIsLoading(true);
      await loadResumes();
      await loadInterviews();
      await loadCoverLetters();
      setIsLoading(false);
    };

    window.scrollTo(0, 0);
    if (isLoaded) {
      if (!isSignedIn) {
        navigate("/sign-in");
      } else {
        loadData();
      }
    }
  }, [isLoaded, isSignedIn]);

  const handleClickResume = (resumeId: string) => {
    navigate(`/resume`, { state: { resumeId } });
  };

  const handleClickedDelete = (resumeId: string) => {
    setDeleteId(resumeId);
    setShowPopup(true);
  };

  const handleDeleteResume = async () => {
    if (deleteId !== null) {
      try {
        await api.delete(`/resume/delete/${deleteId}`);
        setShowPopup(false);
        await loadResumes()
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const handleDeleteInterview = async (id: string) => {
    try {
      await api.delete(`/interview/${id}`);
      await loadInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const handleDeleteCoverLetter = async (id: string) => {
    try {
      await api.delete(`/cover-letter/${id}`);
      await loadCoverLetters();
    } catch (error) {
      console.error('Error deleting cover-letter:', error);
    }
  };

  const handleContentAdd = (url: string, locked = false) => {
    if (locked) {
      setShowPricingPopup(true);
    } else {
      navigate(url);
    }
  }

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

      <DashboardContainer 
        title={"My Cover Letters:"} 
        items={coverLetters}
        user={user!}
        onAdd={(locked: boolean) => handleContentAdd('/cover-letter', locked)}
        onEdit={(id) => navigate('/cover-letter', { state: { id } })}
        onDelete={handleDeleteCoverLetter}
      >
      </DashboardContainer>

      <DashboardContainer
        title={"My Interviews: "}
        items={interviews}
        user={user!}
        onAdd={(locked: boolean) => handleContentAdd('/interview', locked)}
        onEdit={(id) => navigate('interview', {state: { id } })}
        onDelete={handleDeleteInterview}
      />

      {/* Popup */}
      {showPopup && <Popup message="Are you sure you want to delete this resume?" handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}

      {/* Pricing Popup */}
      {showPricingPopup && (
        <div className="pricing-popup">
          <div className="absolute top-2 right-4 p-2 bg-red-500 rounded-full">
            <button
              onClick={() => setShowPricingPopup(false)}
            >
              <CloseIcon fontSize="large" />
            </button>
          </div>
          <div className="relative text-black bg-white p-6 rounded shadow-lg">
            <Pricing />
          </div>
        </div>
      )}

      {/* Spinner while loading */}
      {isLoading && <Spinner />}
    </div>
  );
};
