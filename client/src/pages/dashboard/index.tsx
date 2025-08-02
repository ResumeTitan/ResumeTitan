import React, { useEffect, useState } from 'react';
import ResumeContainer from 'templates/ResumeContainer';
import { useNavigate } from 'react-router-dom';
import Spinner from 'components/Spinner';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Popup from './Popup';
import { useUser, useAuth } from '@clerk/clerk-react';
import api, { setTokenFunction } from 'api/actions';
import { setToken } from '../../state/authReducer';
import { useDispatch } from 'react-redux';
import { ResumeType } from 'types/types';
import DashboardContainer from './DashboardContainer';
import Pricing from 'components/Pricing';
import styled from 'styled-components';
import 'styles/index.css'

// Styled components for resume cards with hover animations
const ResumeCardHolder = styled.div`
  position: relative;
  margin: 4rem;
  border: 8px solid black;
  border-radius: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e0f2f1;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ResumeEditButton = styled.button`
  position: absolute;
  background-color: #0d4a45;
  color: white;
  border-radius: 9999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20rem;
  height: 20rem;
  top: 2rem;
  left: 2rem;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #115e59;
    transform: scale(1.1);
  }

  ${ResumeCardHolder}:hover & {
    opacity: 1;
  }
`;

const ResumeDeleteButton = styled.button`
  position: absolute;
  background-color: #dc2626;
  color: white;
  border-radius: 9999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20rem;
  height: 20rem;
  top: 2rem;
  right: 2rem;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #b91c1c;
    transform: scale(1.1);
  }

  ${ResumeCardHolder}:hover & {
    opacity: 1;
  }
`;

const ResumeTitle = styled.div`
  color: black;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.75rem;
  font-weight: bold;
`;

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

  // Set up the token function for API calls
  useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

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
    // if (locked) {
    //   setShowPricingPopup(true);
    // } else {
    //   navigate(url);
    // }
    navigate(url);
  }

  const resumeWidgets = resumes.map((resume, index) => (
    <ResumeCardHolder key={resume._id}>
      <ResumeTitle>
        {resume.name}
      </ResumeTitle>
      <div className="p-2">
        <ResumeContainer resume={resume} />
      </div>
      <ResumeEditButton
        onClick={() => handleClickResume(resume._id)}
      >
        <EditIcon style={{ fontSize: 196 }} />
      </ResumeEditButton>
      <ResumeDeleteButton
        onClick={() => handleClickedDelete(resume._id)}
      >
        <CloseIcon style={{ fontSize: 196 }} />
      </ResumeDeleteButton>
    </ResumeCardHolder>
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
        <div className="dashboard-header">My Resumes</div>
        <button className="dashboard-button" onClick={() => navigate('/resume')}>Add New</button>
        <div className="overflow-x-scroll overflow-y-hidden h-[22rem] hide-scrollbar">
          <div className="transform scale-25 flex origin-top-left">
            { resumes && resumes.length > 0 ? resumeWidgets : resumePlaceholder }
          </div>
        </div>
      </div>

      <DashboardContainer 
        title={"My Cover Letters"} 
        items={coverLetters}
        // TODO why is this erroring in typescript
        // @ts-ignore
        user={user!}
        onAdd={(locked: boolean) => handleContentAdd('/cover-letter', locked)}
        onEdit={(id) => navigate('/cover-letter', { state: { id } })}
        onDelete={handleDeleteCoverLetter}
      >
      </DashboardContainer>

      <DashboardContainer
        title={"My Interviews"}
        items={interviews}
        // TODO why is this erroring in typescript
        // @ts-ignore
        user={user!}
        onAdd={(locked: boolean) => handleContentAdd('/interview', locked)}
        onEdit={(id) => navigate('/interview', {state: { id } })}
        onDelete={handleDeleteInterview}
      />

      {/* Popup */}
      {showPopup && <Popup message="Are you sure you want to delete this resume?" handleDelete={handleDeleteResume} handleCancel={() => setShowPopup(false)} />}

      {/* Pricing Popup */}
      {showPricingPopup && (
        <div className="pricing-popup">
          <div className="absolute top-2 right-4 p-2 bg-red-500 text-white rounded-full">
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
