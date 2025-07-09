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
    awards: [],

    theme: "professional", 
    font: "times-new-roman",
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
  const [previewScale, setPreviewScale] = useState(0.4);
  const [hasOverflow, setHasOverflow] = useState(false);

  const handleOverflowChange = (hasOverflow) => {
    setHasOverflow(hasOverflow);
  };

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
        @media screen and (max-width: 768px) {
          .resume-container {
            transform: scale(1) !important;
            transform-origin: top left !important;
            width: 210mm !important;
            height: 297mm !important;
          }
          .layover-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            z-index: 9999 !important;
          }
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

      // Check if we're on mobile
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        setResumeLoading(true);
        const response = await api.post("/resume/print", {
          id: currentResume._id,
          name: currentResume.name || 'Resume',
        }, {
          responseType: 'blob'
        });

        // Create a blob URL and trigger download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentResume.name || 'Resume'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setResumeLoading(false);
      } else {
        // Use the print function for desktop
        await handlePrint();
      }
    } catch (error) {
      console.error('Error saving to PDF:', error);
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
  const handleSaveResume = async (exit, updatedResume = null) => {
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
      let response;
      if (updatedResume) {
        response = await api.put("/resume/update", updatedResume);
      } else {
        response = await api.put("/resume/update", currentResume);
      }
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

  const handleUpdateResume = (updatedResume) => {
    setCurrentResume(updatedResume);
    
    // Save silently without showing spinner
    handleSilentSaveResume(updatedResume);
  }

  /**
   * @function handleSilentSaveResume
   * @description Save current state of resume silently without showing spinner
   * @param {Object} updatedResume The resume to save
   */
  const handleSilentSaveResume = async (updatedResume) => {
    if (!isSignedIn) {
      return;
    }
    try {
      const newToken = await refreshToken();
      if (!newToken) {
        throw new Error('Failed to refresh token');
      }
      const response = await api.put("/resume/update", updatedResume);
      const savedResume = response.data.resume;
      
      // If this was a new resume (no _id), update the state with the returned _id
      // so subsequent saves don't create new resumes
      if (!updatedResume._id && savedResume._id) {
        setCurrentResume(savedResume);
      }
    } catch (err) {
      console.log('Silent save error:', err);
      // Optionally show a subtle error notification instead of throwing
    }
  }

  const handleUpdateSections = (sections) => {
    setCurrentResume({...currentResume, sections});
    handleSaveResume(false, {...currentResume, sections});
  }

  /**
   * @function handleUploadPdf
   * @description Handle PDF file upload and extract resume data
   * @param {File} file The PDF file to upload
   */
  const handleUploadPdf = async (file) => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    setResumeLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await api.post('/resume/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedData = response.data;
      
      // Update the current resume with extracted data
      const updatedResume = {
        ...currentResume,
        ...extractedData,
        name: extractedData.name || currentResume.name || 'Uploaded Resume'
      };

      setCurrentResume(updatedResume);
      
      // Save the updated resume
      await handleSaveResume(false, updatedResume);
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to upload and process PDF. Please try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  // Set up the token function for API calls
  React.useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

  React.useEffect(() => {
    if (isOpen) {
      const updateScale = () => {
        const width = window.innerWidth;
        if (width <= 300) {
          setPreviewScale(0.3);
        } else if (width <= 400) {
          setPreviewScale(0.4);
        } else if (width <= 500) {
          setPreviewScale(0.5);
        } else if (width <= 650) {
          setPreviewScale(0.6);
        } else {
          setPreviewScale(0.7);
        }
      };
      updateScale();
      window.addEventListener('resize', updateScale);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('resize', updateScale);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

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
      {hasOverflow && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-700">
            Warning: Your resume content exceeds one page. Consider removing some content or adjusting formatting.
          </p>
        </div>
      )}
        <Tabs openTab={activeTab} setOpenTab={(tab) => setActiveTab(tab)} />
        {activeTab === 1 && (
          <ActionTab 
            resumeIn={currentResume}
            onUpdateResume={handleUpdateResume}
            onPrint={handleSaveToPdf}
            onGenerateResume={handleGenerateResume} 
            onUploadPdf={handleUploadPdf}
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
            onChangeFont={(font) => setCurrentResume({...currentResume, font: font})}
            onUpdateSections={handleUpdateSections}
          />
        )}
        <div className="w-full">
          <button onClick={() => handleSaveResume(false)} className="save-button">Save Resume</button>
          <button onClick={() => handleSaveResume(true)} className="save-button">Save and Exit</button>
        </div>

        <div onClick={() => setIsOpen(true)} className="fixed bottom-4 left-8 hover:cursor-pointer xl:hidden">
          <CustomDocumentIcon />
        </div>

      </div>
      {/* Desktop View */}
      <div className="overflow-hidden p-2 hidden xl:block w-full">
        <div className="w-full p-2">
          <ResumeContainer 
            ref={resumeRef} 
            resume={currentResume} 
            onOverflowChange={handleOverflowChange}
          />
        </div>
      </div>

      {/* Mobile View */}
      {isOpen && (
        <div className="layover-container" onClick={() => setIsOpen(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="resume-container-wrapper" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '10px'
          }}>
            <div style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'center center',
              width: '794px',
              height: '1122px',
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <ResumeContainer 
                ref={resumeRef} 
                resume={currentResume} 
                onOverflowChange={handleOverflowChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionPage;
