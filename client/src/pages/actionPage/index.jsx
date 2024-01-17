import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ActionBar from './Action';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { getScaleForResumeViewer } from 'utils';
import HarvardResume from 'templates/layouts/harvard/Harvard';
import ResumeContainer from 'templates/ResumeContainer';
import { createResume, updateResume } from '../../api/resume';
import Spinner from 'components/Spinner';
import { LoginForm } from 'components/LoginForm';
import { getResume } from '../../api/resume';
import { setActiveResume } from '../../state';
import './Action.css';
const MED_SCREEN_WIDTH = 1200;

// This page should do all loading, other pages do rendering

const ResumeComponent = React.forwardRef((props, ref) => (
  <div ref={ref} className="print:!scale-100">
    <ResumeContainer>
      <HarvardResume personalInfo={props.personalInfo} summary={props.summary} schools={props.schools} jobs={props.jobs} skills={props.skills}/>
    </ResumeContainer>
  </div>
));

function ActionPage() {
  const resumeId = useSelector((state) => state.activeResume);
  const token = useSelector((state) => state.token);
  const [scale, setScale] = useState(1);
  const [showResume, setShowResume] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState('');
  const currentUser = useSelector((state) => state.user);
  const isAuth = Boolean(useSelector((state) => state.token));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: currentUser?.firstName || 'John',
    lastName: currentUser?.lastName || 'Doe',
    phone: '(123)-456-7890',
    email: currentUser?.email || 'johndoe@example.com',
  });
  const [resumeLoading, setResumeLoading] = useState(false);
  const navigate = useNavigate();
  const resumeRef = React.useRef();

  const loadResume = async () => {
    try {
      if (!resumeId) {
        return;
      }
      const { resume } = await getResume(token, resumeId);
      setSummary(resume.summary);
      setSchools(resume.schools);
      setJobs(resume.jobs);
      setSkills(resume.skills);
      setProfile(resume.basics);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const togglePopup = () => {
    const newScale = getScaleForResumeViewer(window.innerWidth + 100)
    setScale(newScale > 0.85 ? 0.85 : newScale);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  useEffect(() => {
    loadResume();
    const handleResize = () => {
      if (isOpen) {
        // Mobile viewer is open, set scale based on window size
        const newScale = getScaleForResumeViewer(window.innerWidth + 100)
        setScale(newScale > 0.85 ? 0.85 : newScale);
      } else {
        if (window.innerWidth > MED_SCREEN_WIDTH) {
          setShowResume(true);
        } else {
          setShowResume(false);
        }
        setScale(getScaleForResumeViewer(window.innerWidth - 384));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSaveToPdf = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: 'Resume',
    pageStyle: '@page { size: A4; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }',
    onAfterPrint: () => {console.log('printed')}
  });

  const updateJobs = (jobsIn) => {
    console.log('updateJobs', jobsIn);
    setJobs(jobsIn);
  }

  const updateSchools = (schoolsIn) => {
    console.log('updateSchools', schoolsIn);
    setSchools(schoolsIn);
  }

  const updateSkills = (skillsIn) => {
    console.log('updateSkills', skillsIn);
    setSkills(skillsIn);
  }

  const handleGenerateResume = async () => {
    if (!isAuth) {
      setIsLoginOpen(true);
      return;
    }
    const resume = {
      _id: resumeId,
      jobs: jobs,
      schools: schools,
      basics: profile
    };
    setResumeLoading(true);
    try {
      await createResume(token, resume);
      setResumeLoading(false);
      loadResume();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const handleSaveResume = async () => {
    if (!isAuth) {
      setIsLoginOpen(true);
      return;
    }
    const resume = {
      _id: resumeId,
      userId: currentUser._id,
      jobs: jobs,
      schools: schools,
      basics: profile,
      summary: summary,
      skills: skills
    };
    setResumeLoading(true);
    try {
      const generatedResume = await updateResume(token, resume);
      setSchools(generatedResume.resume.schools);
      setJobs(generatedResume.resume.jobs);
      setSkills(generatedResume.resume.skills);
      setResumeLoading(false);
      setActiveResume(null);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const handleSaveProfile = (profileIn) => {
    setProfile(profileIn);
  }

  return (
    <div className="flex flex-cols justify-center min-h-screen bg-slate-400">
      {resumeLoading && (
        <Spinner />
      )}

      <ActionBar 
        profile={profile}
        jobs={jobs}
        schools={schools}
        skills={skills}
        summary={summary}
        onPrint={handleSaveToPdf}
        onUpdateJobs={updateJobs}
        onUpdateSchools={updateSchools}
        onUpdateSkills={updateSkills}
        onUpdateSummary={(sum) => setSummary(sum)}
        onUpdateProfile={handleSaveProfile}
        onGenerateResume={handleGenerateResume} 
        onSave={handleSaveResume}
      />
      {!isOpen && showResume && (
        <div className="p-2 origin-top ease-linear" style={{transform: "scale(0.9)"}}>
          <ResumeComponent 
            personalInfo={profile}
            summary={summary}
            schools={schools}
            jobs={jobs}
            skills={skills}
            ref={resumeRef}/>
        </div>
      )}

      {!showResume && (
        <div className="fixed bottom-8 right-8 hover:cursor-pointer" onClick={togglePopup}>
          <DocumentScannerIcon className="text-white" style={{ fontSize: 70 }}/>
        </div>
      )}

      {isOpen && (
        <div className="fixed bg-black bg-opacity-50 flex justify-center items-center w-full h-full overflow-auto top-0" onClick={togglePopup}>
          <div className="pt-2 ease-linear transform -translate-y-96 print:!scale-100" style={{transform: `scale(${scale})`}}>
          <ResumeComponent 
            personalInfo={profile}
            summary={summary}
            schools={schools} 
            jobs={jobs}
            skills={skills}
            ref={resumeRef}/>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <LoginForm
          registerOpen={true}
          onCloseLogin={() => {
            setIsLoginOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ActionPage;
