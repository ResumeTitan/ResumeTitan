import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ActionTab from './actionTab/Action';
import CustomizeTab from './customizeTab';
import Tabs from './Tabs';
import ResumeContainer from 'templates/ResumeContainer';
import { createResume, updateResume } from 'api/resume';
import Spinner from 'components/Spinner';
import { LoginForm } from 'components/LoginForm';
import { getResume } from 'api/resume';
import './index.css';
const LG_SCREEN_WIDTH = 1024;

// This page should do all loading, other pages do rendering

// The resume reference
const ResumeComponent = React.forwardRef((props, ref) => (
  <div ref={ref} className="print:!scale-100">
    <ResumeContainer resume={{
      basics: props.basics,
      jobs: props.jobs,
      schools: props.schools,
      skills: props.skills,
      summary: props.summary,
    }} theme={"harvard"} />
  </div>
));

function ActionPage() {
  const location = useLocation();
  const token = useSelector((state) => state.token);
  const [resumeId, setResumeId] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState('');
  const currentUser = useSelector((state) => state.user);
  const isAuth = Boolean(useSelector((state) => state.token));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [basics, setBasics] = useState({
    name: `${currentUser.firstName} ${currentUser.firstName}`,
    phone: '(123)-456-7890',
    email: currentUser?.email || 'johndoe@example.com',
  });
  const [resumeLoading, setResumeLoading] = useState(false);
  const navigate = useNavigate();
  const resumeRef = React.useRef();

  /**
   * loadResume
   * @description Fetch updated resume from mongodb and update states 
   * @param {string} id The resume id to load
   * @returns 
   */
  const loadResume = async (id) => {
    try {
      if (!id) {
        return;
      }
      const { resume } = await getResume(token, id);
      setSummary(resume.summary);
      setSchools(resume.schools);
      setJobs(resume.jobs);
      setSkills(resume.skills);
      setBasics(resume.basics);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  /**
   * togglePopup
   * @description Called by mobile viewer icon (DocumentScanner)
   *    
   */
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  /**
   * useEffect
   * @description hook called when resizing page, show resume preview if screen large enough
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > LG_SCREEN_WIDTH) {
        setShowResume(true);
      } else {
        setShowResume(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * useEffect
   * @description hook for if resumeId changes (refresh)
   */
  useEffect(() => {
    const loadResumeChange = async () => {
      if (location.state) {
        setResumeId(location.state.resumeId);
        await loadResume(location.state.resumeId);
      }
    }
    loadResumeChange().catch((err) => {
      console.log(err);
      throw err;
    });
  }, [location.state]);

  /**
   * handleSaveToPdf
   * @description Called when clicking Print to PDF button, calls react-to-print library
   * @todo Fix printing for mobile, gets too many notifications, generate on backend
   */
  const handleSaveToPdf = useReactToPrint({
    onBeforePrint: () => {
      if (window.innerWidth <= LG_SCREEN_WIDTH) {
        setIsOpen(true);
      }
    },
    content: () => resumeRef.current,
    documentTitle: 'Resume',
    pageStyle: '@page { size: A4; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }',
    onAfterPrint: () => {
      if (window.innerWidth <= LG_SCREEN_WIDTH) {
        setIsOpen(false);
      }
    }
  });

  /**
   * handleGenerateResume
   * @description Calls backend when clicking Generate Resume
   *    Check Auth first, if not logged in prompt login
   *    Start loading spinner
   */
  const handleGenerateResume = async () => {
    if (!isAuth) {
      setIsLoginOpen(true);
      return;
    }
    const resume = {
      _id: resumeId,
      jobs: jobs,
      schools: schools,
      basics: basics,
    };
    setResumeLoading(true);
    try {
      const newResume = await createResume(token, resume);
      setResumeLoading(false);
      setResumeId(newResume.resume._id);
      await loadResume(newResume.resume._id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * handleSaveResume
   * @description Save current state of resume, only works if logged in
   *    Redirect to dashboard
   */
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
      basics: basics,
      summary: summary,
      skills: skills
    };
    setResumeLoading(true);
    try {
      const savedResume = await updateResume(token, resume);

      setSchools(savedResume.resume.schools);
      setJobs(savedResume.resume.jobs);
      setSkills(savedResume.resume.skills);
      setResumeLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * render function
   */
  return (
    <div className="flex justify-center min-h-screen bg-slate-400">
      {resumeLoading && (
        <Spinner />
      )}

      <div className="px-2 md:px-4 lg:px-8 w-full flex flex-col">
      <Tabs></Tabs>

      <ActionTab 
        profile={basics}
        jobs={jobs}
        schools={schools}
        skills={skills}
        summary={summary}
        onPrint={() => {
          handleSaveToPdf();
        }}
        onUpdateJobs={(jobsIn) => setJobs(jobsIn)}
        onUpdateSchools={(schoolsIn) => setSchools(schoolsIn)}
        onUpdateSkills={(skillsIn) => setSkills(skillsIn)}
        onUpdateSummary={(sum) => setSummary(sum)}
        onUpdateProfile={(basicsIn) => setBasics(basicsIn)}
        onGenerateResume={handleGenerateResume} 
        onSave={handleSaveResume}
      />
      </div>
      {showResume && (
        <div className="p-2 origin-top ease-linear transform lg:scale-90">
          <ResumeComponent 
            personalInfo={basics}
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


      <div className={`${isOpen ? "fixed": "hidden"} bg-black bg-opacity-50 flex justify-center items-center w-full h-full overflow-auto top-0`} onClick={togglePopup}>
        <div className="pt-4 transform translate-12 md:translate-y-36 scale-50 sm:scale-60 lg:scale-75 origin-top print:!scale-100">
        <ResumeComponent 
          personalInfo={basics}
          summary={summary}
          schools={schools} 
          jobs={jobs}
          skills={skills}
          ref={resumeRef}/>
        </div>
      </div>

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
