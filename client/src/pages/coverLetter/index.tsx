import React from 'react';
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
import styled from 'styled-components';

const Container = styled.div`
  background-color: white;
  color: black; /* Change to your desired text color */
  display: flex;
  flex-direction: column;
  padding: 1rem;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const CoverLetter: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userResumes, setUserResumes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
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
        console.log("loading cover letter");
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
      const response = await api.post("cover-letter", { 
        coverLetter,
        clerkId: user.id 
      });

      setCoverLetter(response.data.coverLetter);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSaveCoverLetter = async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }
      setIsLoading(true);
      const response = await api.put(`cover-letter/${coverLetter._id}`, { 
        coverLetter,
        clerkId: user.id 
      });

      setCoverLetter(response.data.coverLetter);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <div className="left-section no-print">
        <div className="form-container">
          <div className="form-text-main">
            Cover Letter Information
          </div>
          <div>
            <FormField 
              title={"Name"}
              value={coverLetter.name}
              onChange={(event) => setCoverLetter({...coverLetter, name: event.target.value})}
            />
            <FormField 
              title={"Job Title"}
              value={coverLetter.jobTitle}
              onChange={(event) => setCoverLetter({...coverLetter, jobTitle: event.target.value})}
            />
            <FormArea 
              title={"Job Description"}
              value={coverLetter.jobDescription}
              onChange={(event) => setCoverLetter({...coverLetter, jobDescription: event.target.value})}
            />
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
            <FormField 
                title={"Company Name"}
                value={coverLetter.company}
                onChange={(event) => {setCoverLetter({...coverLetter, company: event.target.value})}}
              />
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
            {coverLetter.letter && (
              <FormArea 
                title={"Cover Letter"}
                value={coverLetter.letter}
                rows={10}
                onChange={(event) => setCoverLetter({...coverLetter, letter: event.target.value})}
              />
            )}
          </div>
          <div className="p-4">
            <button
              className="interview-button"
              onClick={handleGenerateCoverLetter}
            >
              {"Generate Cover Letter"}
            </button>
            <button
              className="interview-button"
              onClick={() => window.print()}
            >
              {"Print Cover Letter"}
            </button>
            {coverLetter.letter && (
              <button
                className="interview-button"
                onClick={handleSaveCoverLetter}
              >
                {"Save Cover Letter"}
              </button>
            )}
          </div>
        </div>
      </div>

      <CoverLetterTemplate 
        coverLetter={coverLetter}
      />

      { isLoading && (
        <Spinner />
      )}

    </Container>
  );
};

export default CoverLetter;