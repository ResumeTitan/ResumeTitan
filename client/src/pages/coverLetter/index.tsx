import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Spinner from 'components/Spinner';
import api from 'api/actions';
import CoverLetterTemplate from './CoverLetterHolder';
import { FormContainer } from 'components/Form/styled';
import FormField from 'components/Form/FormField';
import FormArea from 'components/Form/FormArea';
import FormDropdown from 'components/Form/FormDropdown';
import 'styles/index.css';
import { CoverLetterType, ResumeType } from 'types/types';

const CoverLetter: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const [userResumes, setUserResumes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState<CoverLetterType>({
    _id: '',
    letter: '',
    name: '',
    date: new Date(),
    jobDescription: '',
    jobTitle: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZip: '',
    hiringManager: 'Hiring Manager',
    resumeId: ''
  });

  /**
   * @function loadCoverLetter
   */
  const loadCoverLetter = async (id: string) => {
    const response = await api.get(`/cover-letter/${id}`);
    setCoverLetter({...coverLetter, letter: response.data.coverLetter.letter});
  }

  /**
   * @function loadResumes
   */
  const loadResumes = async (id: string) => {
    const response = await api.get(`/resume/user?userId=${id}`);
    setUserResumes(response.data.resumes);
  }

  /**
   * @function useEffect
   * @description Called when page loads
   */
  React.useEffect(() => {
    async function load() {
      if (user) {
        setCoverLetter({...coverLetter, name: user.fullName || 'Your Name'});
        await loadResumes(user.id);
      }
  
      if (location.state) {
        const id = location.state.coverLetterId;
        setCoverLetter({...coverLetter, _id: id})
        await loadCoverLetter(id);
      }
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

  if (!user) {
    return null;
  }

  return (
    <div className="cover-letter-container">
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
              title={"Hiring Manager (Optional)"}
              value={coverLetter.hiringManager}
              onChange={(event) => setCoverLetter({...coverLetter, hiringManager: event.target.value})}
            />
            <FormField 
              title={"Job Title"}
              value={coverLetter.jobTitle}
              onChange={(event) => setCoverLetter({...coverLetter, jobTitle: event.target.value})}
            />
            <FormArea 
              title={"Job Description"}
              onChange={(event) => setCoverLetter({...coverLetter, jobDescription: event.target.value})}
            />
            <FormContainer>
              <FormField 
                title={"Address"}
                value={coverLetter.address}
                onChange={(event) => setCoverLetter({...coverLetter, address: event.target.value})}
              />
              <FormField 
                title={"City"}
                value={coverLetter.city}
                onChange={(event) => setCoverLetter({...coverLetter, city: event.target.value})}
              />
              <FormField 
                title={"State"}
                value={coverLetter.state}
                onChange={(event) => setCoverLetter({...coverLetter, state: event.target.value})}
              />
            </FormContainer>
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
          </div>
        </div>
      </div>

      <CoverLetterTemplate 
        coverLetter={coverLetter}
      />

      { isLoading && (
        <Spinner />
      )}

    </div>
  );
};

export default CoverLetter;