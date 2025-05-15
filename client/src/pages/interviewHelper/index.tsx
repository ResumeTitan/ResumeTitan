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
import Pricing from 'components/Pricing';
import { UserResource } from '@clerk/types';
import { useAuth } from '@clerk/clerk-react';
import 'styles/index.css';

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
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);

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
      let interviewId = '';
      if (location.state?.id) {
        interviewId = location.state.id;
      }
      let payload: any = { interviewId, clerkId: user.id };
      if (inputMode === 'link') {
        payload.jobUrl = jobUrl;
      } else {
        payload.jobTitle = jobTitle;
        payload.jobDescription = jobDescription;
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
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @function handleSaveInterview
   * @description Save the interview to the database
   */
  const handleSaveInterview = async () => {
    setIsLoading(true);
    try {
      const response = await api.put(`/interview/${location.state.id}`, {
        jobTitle,
        jobDescription,
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
            <label htmlFor="inputMode" className="form-label-text">Select Input Method</label>
            <select
              id="inputMode"
              className="form-style mb-4"
              value={inputMode}
              onChange={e => setInputMode(e.target.value as 'link' | 'manual')}
            >
              <option value="manual">Job Title and Description</option>
              <option value="link">Job From Link</option>
            </select>
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
          <div className="pb-4">
            <AddNewButton onClick={handleGenerateInterview}>Generate Interview Questions</AddNewButton>
          </div>
        </div>

        {interview.length > 0 && (
          <div className="form-container">
            <div className="form-text-main">
              Interview Questions
            </div>
            <div className="interview-questions">
              {interview.map((question, index) => (
                <div key={index} className="question-container">
                  <div className="p-4">{index + 1}. {question.question}</div>
                  <div className="px-4">
                    <textarea 
                      className="form-style" 
                      onChange={(event) => handleAnswerChange(index, event)} rows={4} 
                      value={question.answer}
                    />
                  </div>
                  <DetailsExpand label="Example Answer:" description={question.example} />
                  <DetailsExpand label="Guidance:" description={question.guidance} />
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
          <button
            className="remove-button"
            onClick={() => navigate('/dashboard')}
          >
            {"Exit to Dashboard"}
          </button>
          <div className="flex justify-end mt-4" style={{ position: 'relative' }}>
            {showSaveMessage && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-3 py-1 rounded text-sm whitespace-nowrap animate-fade-in-out border border-dark-green z-10">
                  Interview Saved!
                </div>
              )}
            <button className="save-button" onClick={handleSaveInterview}>Save Interview</button>
          </div>
        </div>
      </div>

      {/* Pricing Popup */}
      {/* {showPricingPopup && (
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
      )} */}

      { isLoading && (
        <Spinner />
      )}
    </div>
  );
};

export default InterviewPage;
