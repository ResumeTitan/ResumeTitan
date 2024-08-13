import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Spinner from 'components/Spinner';
import api from 'api/actions';
import CoverLetterTemplate from './CoverLetterHolder';
import 'styles/index.css';

const CoverLetter: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [coverLetterId, setCoverLetterId] = React.useState(null);
  const [userResumes, setUserResumes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [selectedResume, setSelectedResume] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  /**
   * @function loadCoverLetter
   */
  const loadCoverLetter = async (id: string) => {
    const response = await api.get(`/cover-letter/${id}`);
    setCoverLetter(response.data.coverLetter);
  }

  /**
   * @function useEffect
   * @description Called when page loads
   */
  React.useEffect(() => {
    if (location.state) {
      const id = location.state.coverLetterId;
      setCoverLetterId(id);
      loadCoverLetter(id);
    }
    if (user) {
      console.log(user.fullName)
      setName(user.fullName || 'Your Name');
      setEmail(user.emailAddresses[0].emailAddress || 'Your Email')
    }
  }, []);

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
        jobTitle, 
        jobDescription, 
        coverLetterId,
        clerkId: user.id 
      });

      setCoverLetter(response.data.coverLetter.coverLetter);
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
      <div className="left-section">
        <div className="form-container">
          <div className="form-text-main">
            Cover Letter Information
          </div>
          <div className="p-4">
            <label htmlFor='jobTitle' className="form-label-text">Job Title</label>
            <input 
              type="text"
              id={"jobTitle"}
              className="form-style" 
              placeholder="Enter job title..."
              onChange={(event) => setJobTitle(event.target.value)}
            />
            <label htmlFor={"description"} className="form-label-text">Job Description</label>
            <textarea 
              id={"description"}
              className="form-style" 
              rows={10}
              onChange={(event) => setJobDescription(event.target.value)}
            />
            <span className="form-label-text">Select Resume</span>
            <select 
              className="form-style" 
              value={selectedResume} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setSelectedResume(e.target.value)}}
            >
              {userResumes && userResumes.map((resume: any) => (
                <option value={resume.id}>{resume.name}</option>
              ))}
            </select>
          </div>
          <div className="p-4">
            <button
              className="interview-button"
              onClick={handleGenerateCoverLetter}
            >
              {"Generate Cover Letter"}
            </button>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="form-container border-transparent">
          <div className="origin-top md:scale-50 lg:scale-60 xl:scale-70 2xl:scale-90">
            <CoverLetterTemplate 
              name={name} 
              email={email}
              coverLetter={coverLetter}
            />
          </div>
        </div>
      </div>

      { isLoading && (
        <Spinner />
      )}

    </div>
  );
};

export default CoverLetter;