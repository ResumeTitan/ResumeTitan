import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import ActionBar from './Action';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { getScaleForResumeViewer } from 'utils';
import HarvardResume from 'templates/layouts/harvard/Harvard';
import ResumeContainer from 'templates/ResumeContainer';
import { createResume } from '../../api/resume';
import Spinner from 'components/Spinner';
import { useParams } from 'react-router-dom';
import { getResume } from '../../api/resume';
import './Action.css';
const MED_SCREEN_WIDTH = 1200;

// This page should do all loading, other pages do rendering

const ResumeComponent = React.forwardRef((props, ref) => (
  <div ref={ref} className="print:!scale-100">
    <ResumeContainer>
      <HarvardResume personalInfo={props.personalInfo} schools={props.schools} jobs={props.jobs} skills={props.skills}/>
    </ResumeContainer>
  </div>
));

function ActionPage() {
  const resumeId = useParams().id;
  const token = useSelector((state) => state.token);
  const [scale, setScale] = useState(1);
  const [showResume, setShowResume] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const [profile, setProfile] = useState(currentUser ? currentUser :{
    firstName: 'John',
    lastName: 'Doe',
    phone: '(123)-456-7890',
    email: 'johndoe@example.com',
  });
  const [resumeLoading, setResumeLoading] = useState(false);
  const resumeRef = React.useRef();

  const loadResume = async () => {
    try {
      const { resume } = await getResume(token, resumeId);
      console.log('resume', resume);
      setSchools(resume.schools);
      setJobs(resume.jobs);
      setSkills(resume.skills);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleViewResume = () => {
    togglePopup();
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
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

  const handleGenerateResume = async () => {
    const resume = {
      name: "Resume",
      jobs: jobs,
      schools: schools,
    };
    setResumeLoading(true);
    try {
      const generatedResume = await createResume(token, resume);
      console.log('generatedResume', generatedResume);
      setSchools(generatedResume.resume.schools);
      setJobs(generatedResume.resume.jobs);
      setSkills(generatedResume.resume.skills);
      setResumeLoading(false);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const handleSaveProfile = (profileIn) => {
    console.log('handleSaveProfile', profileIn);
    setProfile(profileIn);
  }

  return (
    <div className="flex flex-rows justify-center min-h-screen bg-slate-400">
      {resumeLoading && (
        <Spinner />
      )}
      <ActionBar 
        profile={profile}
        jobs={jobs}
        schools={schools}
        onPrint={handleSaveToPdf}
        onUpdateJobs={updateJobs}
        onUpdateSchools={updateSchools}
        onUpdateProfile={handleSaveProfile}
        onGenerateResume={handleGenerateResume} 
      />
      {!isOpen && showResume && (
        <div onClick={togglePopup} className="p-2 origin-top ease-linear" style={{transform: "scale(0.9)"}}>
          <ResumeComponent 
            personalInfo={profile}
            schools={schools}
            jobs={jobs}
            skills={skills}
            ref={resumeRef}/>
        </div>
      )}
      {!showResume && (
        <div className="fixed bottom-24 right-4 hover:cursor-pointer" onClick={handleViewResume}>
          <DocumentScannerIcon className="text-white" style={{ fontSize: 70 }}/>
        </div>
      )}

      {isOpen && (
        <div className="fixed bg-black bg-opacity-50 flex justify-center items-center w-full h-full overflow-auto top-0" onClick={togglePopup}>
          <div className="pt-2 ease-linear transform -translate-y-96 print:!scale-100" style={{transform: `scale(${scale})`}}>
          <ResumeComponent 
            personalInfo={profile}
            schools={schools} 
            jobs={jobs}
            skills={skills}
            ref={resumeRef}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionPage;
