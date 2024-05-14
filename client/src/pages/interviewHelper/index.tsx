import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DetailsExpand from './Details';
import Spinner from 'components/Spinner';
import { createInterview, getInterview } from 'api/interview';
import 'styles/index.css';

interface Interview {
  question: string;
  example: string;
  guidance: string;
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
   * useEffect
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
      const { interview } = await createInterview(token, jobTitle, jobDescription);
      setInterview(interview.interview);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="form-container">
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
              <label htmlFor={"phone"} className="form-label">Job Description</label>
              <textarea 
                id={"phone"}
                className="form-style" 
                rows={10}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
            </div>

            <div className="p-4">
              <button
                className="interview-button bg-slate-800"
                onClick={handleGenerateInterview}
              >
              {"Generate Interview Questions"}
            </button>
            </div>
        </div>

        {interview.length > 0 && (
          <div className="form-container">
            <div className="interview-questions">
              {interview.map((question, index) => (
                <div key={index} className="question-container">
                  <div className="p-4">{index + 1}. {question.question}</div>
                  <div className="px-4">
                    <textarea className="form-style" rows={4} />
                  </div>
                  <DetailsExpand label="Example Answer:" description={question.example} />
                  <DetailsExpand label="Guidance:" description={question.guidance} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      { isLoading && (
        <Spinner />
      )}
    </div>
  );
};

export default InterviewPage;
