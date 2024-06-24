import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DetailsExpand from './Details';
import Spinner from 'components/Spinner';
import { getInterview } from 'api/interview';
import api from 'api/actions';
import 'styles/index.css';

interface Interview {
  question: string;
  example: string;
  guidance: string;
  answer: string;
}

const InterviewPage: React.FC = () => {
  const location = useLocation();
  const token = useSelector((state: any) => state.token);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interview, setInterview] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const { interview } = await getInterview(token, id);
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
        await loadInterview(location.state.interviewId);
      }
    }
    loadInterviewChange().catch((err) => {
      console.log(err);
      throw err;
    });
  }, [location.state]);

  const handleGenerateInterview = async () => {
    try {
      setIsLoading(true);
      let interviewId = '';
      if (location.state?.interviewId) {
        interviewId = location.state.interviewId;
      }
      const response = await api.post("interview", { jobTitle, jobDescription, interviewId });
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

            <div className="p-4">
              <button
                className="interview-button"
                onClick={handleGenerateInterview}
              >
                {"Generate Interview Questions"}
              </button>
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
            onClick={() => window.location.replace('/dashboard')}
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

      { isLoading && (
        <Spinner />
      )}
    </div>
  );
};

export default InterviewPage;
