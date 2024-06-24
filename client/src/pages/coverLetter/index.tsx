import React from 'react';
import { useSelector } from 'react-redux';
import api from 'api/actions';
import CoverLetterTemplate from './CoverLetterHolder';
import 'styles/index.css';

const CoverLetter: React.FC = () => {
  const currentUser = useSelector((state: any) => state.user);
  const [userResumes, setUserResumes] = React.useState([]);
  const [selectedResume, setSelectedResume] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  const loadResumes = async () => {
    const response = await api.get(`/resume/user?userId=${currentUser._id}`);
    console.log(response);
    const resumes = response.data.resumes;
    console.log(resumes);
    setUserResumes(resumes);
  }

  React.useEffect(() => {
    loadResumes();
  }, []);

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
            />
            <label htmlFor={"description"} className="form-label-text">Job Description</label>
            <textarea 
              id={"description"}
              className="form-style" 
              rows={10}
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
        </div>
        {coverLetter && (
          <div className='form-container'>
            <div className="form-text-main">
              Cover Letter Preview
            </div>
            <div className="p-4">
              <textarea 
                id={"description"}
                className="form-style" 
                rows={30}
                value={coverLetter}
                onChange={
                  (e: React.ChangeEvent<HTMLTextAreaElement>) => setCoverLetter(e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="right-section">
        <div className="form-container border-transparent">
          <div className="origin-top md:scale-50 lg:scale-60 xl:scale-75 2xl:scale-95">
            <CoverLetterTemplate />
          </div>          
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;