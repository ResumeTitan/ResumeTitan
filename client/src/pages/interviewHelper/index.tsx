import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import DetailsExpand from './Details';
import Spinner from 'components/Spinner';
import api, { setTokenFunction } from 'api/actions';
import { isUserPremium } from '../../utils/index';
import LockIcon from '@mui/icons-material/Lock';
import { AddNewButton, AddNewLockedButton } from 'components/Styled';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import Pricing from 'components/Pricing';
import { UserResource } from '@clerk/types';
import { useAuth } from '@clerk/clerk-react';
import InterviewPrintOptions, { PrintOptions } from 'components/InterviewPrintOptions';
import PrintableInterview from 'components/PrintableInterview';
import 'styles/index.css';
import SpeechToTextTextarea from 'components/SpeechToTextTextarea';

interface Interview {
  question: string;
  example: string;
  guidance: string;
  answer: string;
}

const InterviewPage: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [inputMode, setInputMode] = useState<'link' | 'manual'>('manual');
  const [interview, setInterview] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(location.state?.id || null);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);
  const [company, setCompany] = useState('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [printOptions, setPrintOptions] = useState<PrintOptions | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Set up the token function for API calls
  useEffect(() => {
    setTokenFunction(getToken);
  }, [getToken]);

  /**
   * loadInterview
   * @description Fetch updated resume from mongodb and update states 
   * @param {string} id The resume id to load
   * @returns 
   */
  const loadInterview = async (id: string) => {
    setIsLoading(true);
    try {
      if (!id) {
        return;
      }

      const response = await api.get(`/interview/${id}`);

      const interview = response.data.interview;
      setInterview(interview.questions);
      setJobTitle(interview.jobTitle || '');
      setJobDescription(interview.jobDescription || '');
      if (interview.jobUrl) {
        setInputMode('link');
        setJobUrl(interview.jobUrl);
      } else {
        setInputMode('manual');
        setJobUrl('');
      }
      setCompany(interview.company || '');
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * @function useEffect
   * @description hook for if resumeId changes (refresh)
   */
  useEffect(() => {
    const loadInterviewChange = async () => {
      if (location.state) {
        await loadInterview(location.state.id);
      }
    }
    loadInterviewChange().catch((err) => {
      console.log(err);
      throw err;
    });
  }, [location.state]);

  /**
   * @function handleGenerateInterview
   * @description Create interview from backend when generate button clicked
   */
  const handleGenerateInterview = async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }
      setIsLoading(true);
      setErrorMessage(''); // Clear any previous errors
      let interviewId = '';
      if (location.state?.id) {
        interviewId = location.state.id;
      }
      let payload: any = { interviewId, clerkId: user.id, useJobUrl: inputMode === 'link' };
      if (inputMode === 'link') {
        payload.jobUrl = jobUrl;
      } else {
        payload.jobTitle = jobTitle;
        payload.jobDescription = jobDescription;
        payload.company = company;
      }
      const response = await api.post("interview", payload);
      //@ts-ignore
      setInterview(response.data.interview.questions);
      if (response.data.interview.jobTitle) {
        setJobTitle(response.data.interview.jobTitle);
      }
      if (response.data.interview.jobDescription) {
        setJobDescription(response.data.interview.jobDescription);
      }
      if (response.data.interview.company) {
        setCompany(response.data.interview.company);
      }

      setInterviewId(response.data.interview._id);
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
        setErrorMessage("An error occurred while generating interview questions");
      }
    }
  }

  /**
   * @function handleSaveInterview
   * @description Save the interview to the database
   */
  const handleSaveInterview = async () => {
    setIsLoading(true);
    try {
      const response = await api.put(`/interview/${interviewId}`, {
        jobTitle,
        jobDescription,
        company,
        jobUrl,
        useJobUrl: inputMode === 'link',
        questions: interview,
      });
      setInterview(response.data.interview.questions);
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 2000);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  /**
   * @function handleAnswerChange
   * @description Update the answer for the question
   */
  const handleAnswerChange = (index: number, event: any) => {
    const newInterview = [...interview];
    newInterview[index].answer = event.target.value;
    setInterview(newInterview);
  }

  const handleAnalyzeAnswer = async (index: number) => {
    setAnalyzingIndex(index);
    try {
      const question = interview[index];
      const response = await api.post('/interview/analyze', {
        answer: question.answer,
        example: question.example,
        guidance: question.guidance,
      });
      const newAnalysis = [...analysis];
      newAnalysis[index] = response.data.analysis;
      setAnalysis(newAnalysis);
    } catch (error) {
      const newAnalysis = [...analysis];
      newAnalysis[index] = 'Error analyzing answer.';
      setAnalysis(newAnalysis);
    }
    setAnalyzingIndex(null);
  };

  const onGenerateClick = () => {
    if (interview.length > 0) {
      setShowConfirmPopup(true);
    } else {
      handleGenerateInterview();
    }
  };

  const handlePrintInterview = (options: PrintOptions) => {
    setPrintOptions(options);
    // Trigger print after state update
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const hasJobInfo = Boolean(jobTitle || company || jobDescription);

  // Custom tab button style matching cover letter generator
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

  /**
   * @description Render the Interview Page
   */
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="form-container">
          <div className="form-text-main">
            Enter Details
          </div>
          <div className="p-4">
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
            
            {inputMode === 'link' ? (
              <div className="w-full pr-2">
                <label htmlFor="jobUrl" className="form-label-text">Job Posting URL</label>
                <input
                  type="text"
                  id="jobUrl"
                  className="form-style"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  placeholder="Paste the job posting link here..."
                />
              </div>
            ) : (
              <>
                <div className="w-full pr-2">
                  <label htmlFor={"company"} className="form-label-text">Company</label>
                  <input 
                    type="text"
                    id={"company"}
                    className="form-style"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>
                <div className="w-full pr-2 mt-4">
                  <label htmlFor={"title"} className="form-label-text">Job Title</label>
                  <input 
                    type="text"
                    id={"title"}
                    className="form-style"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor={"description"} className="form-label-text">Job Description</label>
                  <textarea 
                    id={"description"}
                    className="form-style" 
                    rows={10}
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="left-right-spacing p-2">
            <button className="save-button" onClick={onGenerateClick}>Generate Interview Questions</button>
            <button 
              className="save-button" 
              onClick={handleSaveInterview}
              disabled={isLoading || interview.length === 0}
            >Save Interview</button>
          </div>
          {showConfirmPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-400 max-w-xs w-full">
                <div className="text-black font-semibold mb-4">Are you sure?</div>
                <div className="text-black mb-4 text-sm">Generating new questions will overwrite your current questions and answers.</div>
                <div className="flex justify-end gap-2">
                  <button className="secondary-action-button" onClick={() => setShowConfirmPopup(false)}>Cancel</button>
                  <button className="save-button" onClick={() => { setShowConfirmPopup(false); handleGenerateInterview(); }}>Yes, Overwrite</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {interview.length > 0 && (
          <div className="form-container">
            <div className="form-text-main flex justify-between items-center mb-4">
              <span>Interview Questions</span>
              <button
                className="interview-button bg-white flex items-center gap-2"
                onClick={() => setShowPrintOptions(true)}
              >
                <PrintIcon />
                Print Interview
              </button>
            </div>
            <div className="interview-questions">
              {interview.map((question, index) => (
                <div
                  key={index}
                  className={`question-container p-6 border-2 border-gray-300 rounded-lg bg-white shadow-sm${index !== 0 ? ' mt-6' : ''}${index !== interview.length - 1 ? ' mb-6' : ''}`}
                  style={{ position: 'relative' }}
                >
                  <div className="p-4 font-bold text-lg md:text-xl text-black border-b border-gray-200 mb-2">{index + 1}. {question.question}</div>
                  <div className="px-4">
                    <SpeechToTextTextarea
                      className="form-style text-base md:text-lg text-black h-64 md:h-40"
                      value={question.answer}
                      onChange={function(val: string) { handleAnswerChange(index, { target: { value: val } }); }}
                      placeholder="Type your answer here..."
                    />
                  </div>
                  <DetailsExpand label={<span className="text-base md:text-lg font-semibold text-black">Example Answer:</span>} description={<span className="text-base md:text-lg text-black">{question.example}</span>} />
                  <DetailsExpand label={<span className="text-base md:text-lg font-semibold text-black">Guidance:</span>} description={<span className="text-base md:text-lg text-black">{question.guidance}</span>} />
                  <div className="px-4 pb-2">
                    <button
                      className="save-button"
                      style={{ minWidth: 180 }}
                      onClick={() => handleAnalyzeAnswer(index)}
                      disabled={analyzingIndex === index || !question.answer}
                    >
                      {analyzingIndex === index ? 'Analyzing...' : 'Analyze My Answer'}
                    </button>
                    {analysis[index] && (
                      <div className="mt-2 p-2 border rounded bg-gray-50 text-black">
                        <strong>AI Analysis:</strong> {analysis[index]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="py-4 flex justify-between">
          <div className="flex justify-end mt-2" style={{ position: 'relative' }}>
            <button
              className="secondary-action-button"
              onClick={() => navigate('/dashboard')}
            >
              {"Exit to Dashboard"}
            </button>
          </div>
          <div className="flex justify-end mt-2" style={{ position: 'relative' }}>
            {showSaveMessage && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-6 py-3 rounded text-base whitespace-nowrap animate-fade-in-out border border-dark-green z-50 shadow-lg font-semibold">
                Interview Saved!
              </div>
            )}
            <button className="save-button" onClick={handleSaveInterview}>Save Interview</button>
          </div>
        </div>
      </div>

      {/* Print Options Popup */}
      {showPrintOptions && (
        <InterviewPrintOptions
          onClose={() => setShowPrintOptions(false)}
          onPrint={handlePrintInterview}
          hasJobInfo={hasJobInfo}
        />
      )}

      {/* Printable Interview Component */}
      {printOptions && (
        <PrintableInterview
          interview={interview}
          jobTitle={jobTitle}
          company={company}
          jobDescription={jobDescription}
          options={printOptions}
        />
      )}

      { isLoading && (
        <Spinner />
      )}
    </div>
  );
};

export default InterviewPage;
