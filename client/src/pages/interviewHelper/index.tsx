import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import DetailsExpand from './Details';
import Spinner from 'components/Spinner';
import api from 'api/actions';
import { isUserPremium } from '../../utils/index';
import LockIcon from '@mui/icons-material/Lock';
import { AddNewButton, AddNewLockedButton } from 'components/Styled';
import CloseIcon from '@mui/icons-material/Close';
import Pricing from 'components/Pricing';
import { UserResource } from '@clerk/types';
import 'styles/index.css';

interface Interview {
  question: string;
  example: string;
  guidance: string;
  answer: string;
}

const InterviewPage: React.FC = () => {
  const { user } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interview, setInterview] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);


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

      console.log("Loaded");

      const response = await api.get(`/interview/${id}`);

      const interview = response.data.interview;
      setInterview(interview.interview);
      setJobTitle(interview.jobTitle);
      setJobDescription(interview.jobDescription);
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
        console.log(location.state.id);
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
      if (location.state?.interviewId) {
        interviewId = location.state.interviewId;
      }
      const response = await api.post("interview", { 
        jobTitle, 
        jobDescription, 
        interviewId, 
        clerkId: user.id 
      });
      //@ts-ignore
      setInterview(response.data.interview.interview);
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
      const response = await api.put(`/interview/${location.state.interviewId}`, {
        jobTitle,
        jobDescription,
        interview,
      });

      setInterview(response.data.interview.interview);
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
          </div>

          <div className="p-4">
            <label htmlFor={"description"} className="form-label-text">Job Description</label>
            <textarea 
              id={"description"}
              className="form-style" 
              rows={10}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </div>

          <div className="pb-4">
          {isUserPremium(user as UserResource) ? (
            <AddNewButton onClick={handleGenerateInterview}>Generate Interview Questions</AddNewButton>
          ) : (
            <AddNewLockedButton onClick={() => setShowPricingPopup(true)}>
              <span className="pr-2">Generate Interview Questions</span><LockIcon /></AddNewLockedButton>
          )}
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
          <button
            className="add-button border-2 border-black"
            onClick={handleSaveInterview}
          >
            {"Save Interview"}
          </button>
        </div>
      </div>

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

      { isLoading && (
        <Spinner />
      )}
    </div>
  );
};

export default InterviewPage;
