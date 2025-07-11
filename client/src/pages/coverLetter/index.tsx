import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Spinner from 'components/Spinner';
import api, { setTokenFunction } from 'api/actions';
import CoverLetterTemplate from './CoverLetterHolder';
import { FormContainer } from 'components/Form/styled';
import FormField from 'components/Form/FormField';
import FormArea from 'components/Form/FormArea';
import FormDropdown from 'components/Form/FormDropdown';
import { useAuth } from '@clerk/clerk-react';
import 'styles/index.css';
import { CoverLetterType, ResumeType } from 'types/types';
import styled, { createGlobalStyle } from 'styled-components';
import { PDFDownloadLink, BlobProviderParams } from '@react-pdf/renderer';
import CoverLetterPDF from './CoverLetterPDF';

const Container = styled.div`
  background-color: white;
  color: black; /* Change to your desired text color */
  display: flex;
  flex-direction: row; /* default: row */
  padding: 1rem;

  @media (max-width: 1200px) {
    flex-direction: column; /* on small screens, stack (cover letter below forms) */
    padding: 1rem;
  }
`;

const ResponsiveFormContainer = styled.div`
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  @media (max-width: 1200px) {
    max-width: 100%;
    width: 100%;
    margin-top: 1rem;
  }
`;

// Add a styled wrapper for the cover letter preview
const CoverLetterPreviewWrapper = styled.div`
  margin-left: 2rem;
  display: flex;
  align-items: flex-start;
  @media (max-width: 1200px) {
    margin-left: 0;
    margin-top: 1rem;
    justify-content: center;
    /* Scale down the cover letter for small screens */
    & > * {
      transform: scale(1);
      transform-origin: top center;
    }
  }
  @media (max-width: 600px) {
    & > * {
      transform: scale(0.8);
    }
  }
`;

const PrintOnlyCoverLetter = createGlobalStyle`
  @media print {
    body * {
      display: none !important;
    }
    #print-root, #print-root * {
      display: block !important;
      position: static !important;
      width: 100% !important;
      box-shadow: none !important;
      background: white !important;
      color: black !important;
      transform: none !important;
    }
  }
`;

const CoverLetter: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userResumes, setUserResumes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState<CoverLetterType>({
    _id: '',
    letter: '',
    name: '',
    date: new Date(),
    jobDescription: '',
    jobTitle: '',
    city: '',
    state: '',
    company: '',
    resumeId: ''
  });
  const [inputMode, setInputMode] = React.useState<'manual' | 'link'>('manual');
  const [jobUrl, setJobUrl] = React.useState('');
  const [showSaveMessage, setShowSaveMessage] = React.useState(false);
  const coverLetterRef = useRef<HTMLDivElement>(null);

  // Set up the token function for API calls
  React.useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

  /**
   * @function loadCoverLetter
   */
  const loadCoverLetter = async (id: string) => {
    const response = await api.get(`/cover-letter/${id}`);
    if (response.status !== 404) {
      return response.data.coverLetter;
    }
  }

  /**
   * @function loadResumes
   */
  const loadResumes = async (id: string) => {
    const response = await api.get(`/resume/user?userId=${id}`);
    const resumesIn = response.data.resumes;

    if (resumesIn.length >= 0) {
      setUserResumes(resumesIn);
      return resumesIn[0]._id;
    } else {
      return 0;
    }
  }

  /**
   * @function useEffect
   * @description Called when page loads
   */
  React.useEffect(() => {
    async function load() {
      let newCoverLetter = coverLetter;
      if (location.state) {
        const id = location.state.id;
        newCoverLetter = await loadCoverLetter(id);
        newCoverLetter["_id"] = id;
      }

      if (user) {
        if (newCoverLetter.name === '') {
          newCoverLetter["name"] = user.fullName || 'Your Name';
        }
        const resumeId = await loadResumes(user.id);
        newCoverLetter["resumeId"] = resumeId;
      }

      setCoverLetter(newCoverLetter);
    }

    load();
  }, [user]);

  /**
   * @function handleGenerateCoverLetter
   * @description Call AI to generate cover letter
   */
  const handleGenerateCoverLetter = async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }
      setIsLoading(true);
      setErrorMessage(''); // Clear any previous errors
      let payload: any = { clerkId: user.id };
      if (inputMode === 'link') {
        payload.coverLetter = { ...coverLetter, jobUrl, useJobUrl: true };
      } else {
        payload.coverLetter = { ...coverLetter, useJobUrl: false };
      }
      const response = await api.post("cover-letter", payload);
      setCoverLetter(response.data.coverLetter);
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      // Check if this is a URL parsing error
      if (inputMode === 'link' && (error.response?.status === 400 || error.response?.data?.errorType === 'URL_PARSE_ERROR')) {
        setErrorMessage("Failed to load job, please enter manually or try again later");
        // Automatically switch to manual mode
        setInputMode('manual');
      } else {
        setErrorMessage("An error occurred while generating cover letter");
      }
    }
  }

  const handleSaveCoverLetter = async (exit: boolean) => {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      setIsLoading(true);
      
      // Send only the cover letter data, not the entire payload
      const coverLetterData = { ...coverLetter };
      
      console.log('Saving cover letter data:', coverLetterData);
      const response = await api.put(`cover-letter/${coverLetter._id}`, coverLetterData);
      setCoverLetter(response.data.coverLetter);
      setIsLoading(false);
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 2000);
      if (exit) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Custom tab button style
  const tabButtonStyle = (active: boolean) => ({
    flex: 1,
    padding: '6px 0',
    borderRadius: '8px 8px 0 0',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    background: active ? '#115E59' : '#e2e8f0',
    color: active ? 'white' : '#115E59',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  });

  if (!user) {
    return null;
  }

  return (
    <Container>
      <div style={{ flex: 1, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="form-container mt-1">
            <div className="form-text-main mb-4">
              Cover Letter Information
            </div>
            {/* Profile Info Section */}
            <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
              <div className="font-bold mb-2">Profile Information</div>
              <FormField 
                title={"Name"}
                value={coverLetter.name}
                onChange={(event) => setCoverLetter({...coverLetter, name: event.target.value})}
              />
              {/* <FormField 
                title={"Email"}
                value={user?.emailAddresses?.[0]?.toString() || ''}
                onChange={() => {}}
                disabled
              /> */}
              <FormContainer>
                <FormField 
                  title={"City"}
                  value={coverLetter.city}
                  onChange={(event) => {setCoverLetter({...coverLetter, city: event.target.value})}}
                />
                <FormField 
                  title={"State"}
                  value={coverLetter.state}
                  onChange={(event) => {setCoverLetter({...coverLetter, state: event.target.value})}}
                />
              </FormContainer>
            </div>

            {/* AI Input Section */}
            <div className="mb-6 p-4 rounded bg-white border border-gray-200">
              <div className="font-bold mb-2">Job Information for AI</div>
              <div style={{ display: 'flex', marginBottom: 16, gap: 2 }}>
                <button
                  style={tabButtonStyle(inputMode === 'manual')}
                  onClick={() => setInputMode('manual')}
                  type="button"
                >
                  Job Title/Description
                </button>
                <button
                  style={tabButtonStyle(inputMode === 'link')}
                  onClick={() => setInputMode('link')}
                  type="button"
                >
                  Job URL
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{errorMessage}</span>
                    <button
                      onClick={() => setErrorMessage('')}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {inputMode === 'manual' ? (
                <>
                  <FormField 
                    title={"Job Title"}
                    value={coverLetter.jobTitle}
                    onChange={(event) => setCoverLetter({...coverLetter, jobTitle: event.target.value})}
                  />
                  <FormField 
                    title={"Company"}
                    value={coverLetter.company}
                    onChange={(event) => setCoverLetter({...coverLetter, company: event.target.value})}
                  />
                  <FormArea 
                    title={"Job Description"}
                    value={coverLetter.jobDescription}
                    onChange={(event) => setCoverLetter({...coverLetter, jobDescription: event.target.value})}
                  />
                </>
              ) : (
                <>
                  <FormField 
                    title={"Job Posting URL"}
                    value={jobUrl}
                    onChange={(event) => setJobUrl(event.target.value)}
                    placeholder="Paste the job posting link here..."
                  />
                </>
              )}
              <FormDropdown 
                title={"Select Resume"}
                onChange={(event) => {
                  const resumeId = userResumes.find((res: ResumeType) => res.name === event.target.value);
                  if (resumeId) {
                    setCoverLetter({...coverLetter, resumeId})}
                  }
                }
              >
                {userResumes && userResumes.map((resume: any) => (
                  <option value={resume.id}>{resume.name}</option>
                ))}
              </FormDropdown>
            </div>

            {coverLetter.letter && (
              <FormArea 
                title={"Cover Letter"}
                value={coverLetter.letter}
                rows={15}
                onChange={(event) => setCoverLetter({...coverLetter, letter: event.target.value})}
              />
            )}
            <div className="p-4">
              <button
                className="interview-button"
                onClick={handleGenerateCoverLetter}
              >
                {isLoading ? 'Writing...' : 'Write Cover Letter with AI'}
              </button>
              <button>
                <PDFDownloadLink
                  document={<CoverLetterPDF coverLetter={coverLetter} />}
                  fileName="cover-letter.pdf"
                >
                  {/* @ts-ignore */}
                  {({ loading }) => (
                    <button
                      className="interview-button"
                      style={{ marginTop: '1rem' }}
                    >
                      {loading ? 'Preparing PDF...' : 'Download PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
              </button>

              {coverLetter.letter && (
                <button
                  className="interview-button"
                  onClick={() => handleSaveCoverLetter(false)}
                >
                  {"Save Cover Letter"}
                </button>
              )}
              {coverLetter.letter && (
                <button
                  className="interview-button"
                  onClick={() => handleSaveCoverLetter(true)}
                >
                  {"Save and Exit"}
                </button>
              )}
              {showSaveMessage && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-6 py-3 rounded text-base whitespace-nowrap animate-fade-in-out border border-dark-green z-50 shadow-lg font-semibold">
                  Cover Letter Saved!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CoverLetterPreviewWrapper id="print-root" ref={coverLetterRef}>
        <CoverLetterTemplate coverLetter={coverLetter} />
      </CoverLetterPreviewWrapper>

      <PrintOnlyCoverLetter />

      { isLoading && (
        <Spinner />
      )}

    </Container>
  );
};

export default CoverLetter;