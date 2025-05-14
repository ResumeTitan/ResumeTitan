import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ActionTab from './actionTab/Action';
import CustomizeTab from './customizeTab';
import Tabs from './Tabs';
import ResumeContainer from 'templates/ResumeContainer';
import Spinner from 'components/Spinner';
import ErrorAlert from 'components/Alert/ErrorAlert';
import api, { setTokenFunction } from 'api/actions';
import 'styles/index.css';
import { styled } from '@mui/system';
import DescriptionIcon from '@mui/icons-material/Description';
import { useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch } from 'react-redux';
import { setToken } from '../../state/authReducer';
import { isUserPremium } from 'utils';


const CustomDocumentIcon = styled(DescriptionIcon)({
  backgroundColor: '#0b3733',
  color: 'white',
  fontSize: '72px',
  borderRadius: '30%',
  borderWidth: '4px',
  borderColor: '#0b3733',
});

// This page should do all loading, other pages do rendering

function ActionPage() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  const location = useLocation();
  const [currentResume, setCurrentResume] = useState({
    basics: {
      name: '',
      label: '',
      image: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: '',
      },
      profiles: [
        {
          network: '',
          username: '',
          url: '',
        },
      ],
    },
    education: [],
    work: [],
    skills: [],
    volunteer: [],

    theme: "professional", 
    sections: ["Basics"],
    name: "Resume Name"
  });
  const [isOpen, setIsOpen] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [useJobDescription, setUseJobDescription] = useState(false);
  const [showPrintError, setShowPrintError] = useState(false);
  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${currentResume.name || 'Resume'}.pdf`,
    format: 'a4',
    pageStyle: `
      @page {
        size: 210mm 297mm;
        margin: 0;
      }
      @media print {
        html, body {
          height: auto;
          overflow: hidden;
          width: 210mm;
          margin: 0;
          padding: 0;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #root {
          height: auto;
          overflow: hidden;
          width: 210mm;
        }
        .page-container {
          height: auto;
          overflow: hidden;
          width: 210mm;
        }
        .resume-container {
          width: 210mm !important;
          height: 297mm !important;
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      setResumeLoading(true);
    },
    onAfterPrint: () => {
      setResumeLoading(false);
    },
    onPrintError: () => {
      setResumeLoading(false);
      console.error('Print failed');
    }
  });

  const refreshToken = async () => {
    const newToken = await getToken();
    if (!newToken) {
      return null;
    }
    dispatch(setToken(newToken));
    return newToken;
  }

  /**
   * @function useEffect
   * @description hook for if resumeId changes (refresh)
   */
  React.useEffect(() => {
    const loadResumeChange = async () => {
      if (user) {
        setCurrentResume({
          ...currentResume,
          basics: {
            ...currentResume.basics,
            name: user.fullName,
            email: user.emailAddresses.at(0).toString()
          }
        });
      }

      if (location.state) {
        await loadResume(location.state.resumeId);
      }
    }
    loadResumeChange().catch((err) => {
      console.log(err);
      throw err;
    });
  }, [location.state]);

  /**
   * @function loadResume
   * @description Fetch updated resume from mongodb and update states 
   * @param {string} id The resume id to load
   * @returns 
   */
  const loadResume = async (id) => {
    setResumeLoading(true);
    try {
      if (!id) {
        return;
      }
      await refreshToken();
      const response = await api.get(`/resume?id=${id}`);
      const resume = response.data.resume;
      setCurrentResume(resume);
      setResumeLoading(false);
    } catch (err) {
      console.log(err);
      setResumeLoading(false);
      throw err;
    }
  };

  /**
   * @function handleSaveToPdf
   * @description Called when clicking Print to PDF button, calls react-to-print library
   * @todo Fix printing for mobile, gets too many notifications, generate on backend
   */
  const handleSaveToPdf = async () => {
    // TODO: Uncomment this if we want to check for premium users
    // if (!isUserPremium(user)) {
    //   setShowPrintError(true);
    //   return;
    // }

    try {
      // Save the resume first
      await handleSaveResume(false);

      // Use the print function
      await handlePrint();
    } catch (error) {
      console.log(error);
      setResumeLoading(false);
      throw error;
    }
  };

  /**
   * @function handleGenerateResume
   * @description Calls backend when clicking Generate Resume
   *    Check Auth first, if not logged in prompt login
   *    Start loading spinner
   */
  const handleGenerateResume = async () => {
    if (!isSignedIn) {
      return navigate('/dashboard');
    }
    try {
      await refreshToken();
      const jobDescriptionStr = useJobDescription ? jobDescription : '';
      const response = await api.post("/resume/create", {
        resume: currentResume,
        jobDescription: jobDescriptionStr
      });
      const newResume = response.data;
      setResumeLoading(false);
      setCurrentResume(newResume);
      await loadResume(newResume._id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @function handleSaveResume
   * @description Save current state of resume, only works if logged in
   *    Redirect to dashboard
   * @param {boolean} exit If true, redirect to dashboard
   */
  const handleSaveResume = async (exit) => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }
    setResumeLoading(true);
    try {
      const newToken = await refreshToken();
      if (!newToken) {
        throw new Error('Failed to refresh token');
      }
      const response = await api.put("/resume/update", currentResume);
      const savedResume = response.data.resume;
      setCurrentResume(savedResume);
      setResumeLoading(false);
      if (exit) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
      setResumeLoading(false);
      throw err;
    }
  }

  // Set up the token function for API calls
  React.useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

  return (
    <div className="page-container">
      {resumeLoading && (
        <Spinner />
      )}

      <div className="px-2 pt-4 md:px-4 lg:px-8 w-full flex flex-col">
      {showPrintError && (
        <div className="layover-container">
        <ErrorAlert 
          onClose={() => setShowPrintError(false)}
        >
          <p>You must be a premium member to save resume. 
            Upgrade to premium by <a className="underline" href="/pricing">clicking here.</a>
          </p>
        </ErrorAlert>
        </div>
      )}
        <Tabs openTab={activeTab} setOpenTab={(tab) => setActiveTab(tab)} />
        {activeTab === 1 && (
          <ActionTab 
            resumeIn={currentResume}
            onUpdateResume={(resumeIn) => setCurrentResume(resumeIn)}
            onPrint={handleSaveToPdf}
            onGenerateResume={handleGenerateResume} 
          />
        )}
        {activeTab === 2 && (
          <CustomizeTab 
            resume={currentResume}
            description={jobDescription}
            descriptionUsed={useJobDescription}
            onUpdateJobDescription={(description) => setJobDescription(description)}
            isJobDescriptionUsed={(checked) => setUseJobDescription(checked)}
            onChangeTheme={(theme) => setCurrentResume({...currentResume, theme: theme})}
            onUpdateSections={(sections) => setCurrentResume({...currentResume, sections})}
          />
        )}
        <div className="w-full">
          <button onClick={() => handleSaveResume(false)} className="save-button">Save Resume</button>
          <button onClick={() => handleSaveResume(true)} className="save-button">Save and Exit</button>
        </div>

        <div onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 hover:cursor-pointer xl:hidden">
          <CustomDocumentIcon />
        </div>

      </div>
      {/* Desktop View */}
      <div className="overflow-hidden p-2 hidden xl:block w-full">
        <div className="w-full outline p-2">
          <ResumeContainer ref={resumeRef} resume={currentResume} />
        </div>
      </div>

      {/* Mobile View */}
      {isOpen && (
        <div className="layover-container" onClick={() => setIsOpen(false)}>
          <div>
            <ResumeContainer ref={resumeRef} resume={currentResume} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionPage;
