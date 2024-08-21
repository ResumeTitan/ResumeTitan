import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ActionTab from './actionTab/Action';
import CustomizeTab from './customizeTab';
import Tabs from './Tabs';
import ResumeContainer from 'templates/ResumeContainer';
import Spinner from 'components/Spinner';
import ErrorAlert from 'components/Alert/ErrorAlert';
import api from 'api/actions';
import 'styles/index.css';
import { styled } from '@mui/system';
import DescriptionIcon from '@mui/icons-material/Description';
import { saveAs } from 'file-saver';
import { useUser, useAuth } from "@clerk/clerk-react";
import { useDispatch } from 'react-redux';
import { setToken } from '../../state/authReducer';

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

  const refreshToken = async () => {
    const newToken = await getToken();
    if (!newToken) {
      return null;
    }
    dispatch(setToken(newToken));
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
    if (!user.publicMetadata.premiumUntil || new Date(user.publicMetadata.premiumUntil) < new Date()) {
      setShowPrintError(true);
      return;
    }

    try {
      setResumeLoading(true);

      // Save the resume first
      await handleSaveResume(false);

      // Construct the URL you want to open
      const newPageUrl = `${window.location.origin}/../print-resume/${currentResume._id}`; // Replace '/new-page' with your route
      window.open(newPageUrl, '_blank');

      setResumeLoading(false);
    } catch (error) {
      console.log(error);
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
    }
    setResumeLoading(true);
    try {
      await refreshToken();
      const response = await api.put("/resume/update", currentResume);
      const savedResume = response.data.resume;
      setCurrentResume(savedResume);
      setResumeLoading(false);
      if (exit) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

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
            onUpdateSections={(sections) => setCurrentResume({
              ...currentResume,
              sections: [...new Set([...currentResume.sections, ...sections])]
            })}
            onUpdateResumeName={(resumeName) => setCurrentResume({
              ...currentResume,
              name: resumeName
            })}
            onPrint={handleSaveToPdf}
            onUpdateWork={(jobsIn) => setCurrentResume({
              ...currentResume,
              work: jobsIn
            })}
            onUpdateEducation={(schoolsIn) => setCurrentResume({
              ...currentResume,
              education: schoolsIn
            })}
            onUpdateVolunteer={(volunteerIn) => setCurrentResume({
              ...currentResume,
              volunteer: volunteerIn
            })}
            onUpdateSkills={(skillsIn) => setCurrentResume({
              ...currentResume,
              skills: skillsIn
            })}
            onUpdateSummary={(sum) => {
              setCurrentResume({
                ...currentResume,
                basics: {
                  ...currentResume.basics,
                  summary: sum
                }
              });
            }}
            onUpdateBasics={(basicsIn) => {
              setCurrentResume({
                ...currentResume,
                basics: basicsIn
              });
            }}
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

        <div onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 hover:cursor-pointer lg:hidden">
          <CustomDocumentIcon />
        </div>

      </div>
      {/* Desktop View */}
      <div className="hidden lg:block m-2 p-2 origin-top-left lg:w-1/2 xl:w-3/5 ease-linear transform lg:scale-60 xl:scale-90">
        <div className="border-2 border-gray-400">
        <ResumeContainer resume={currentResume} />
        </div>
        
      </div>

      {/* Mobile View */}
      <div className={`${isOpen ? "fixed": "hidden"} bg-black bg-opacity-50 flex justify-center items-center w-full h-full top-0`} onClick={() => setIsOpen(false)}>
        <div className="pt-4 transform scale-50 sm:scale-60 lg:scale-75 print:!scale-100">
          <ResumeContainer resume={currentResume} />
        </div>
      </div>
    </div>
  );
}

export default ActionPage;
