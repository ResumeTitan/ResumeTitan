import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ActionTab from './actionTab/Action';
import CustomizeTab from './customizeTab';
import Tabs from './Tabs';
import ResumeContainer from 'templates/ResumeContainer';
import { getResume, createResume, updateResume } from 'api/resume';
import Spinner from 'components/Spinner';
import ErrorAlert from 'components/Alert/ErrorAlert';
import { LoginForm } from 'components/LoginForm';
import api from 'api/actions';
import 'styles/index.css';
import { styled } from '@mui/system';
import DescriptionIcon from '@mui/icons-material/Description';
import { saveAs } from 'file-saver';

const CustomDocumentIcon = styled(DescriptionIcon)({
  backgroundColor: '#0b3733',
  color: 'white',
  fontSize: '72px',
  borderRadius: '30%',
  borderWidth: '4px',
  borderColor: '#0b3733',
});

// This page should do all loading, other pages do rendering

// The resume reference
const ResumeComponent = React.forwardRef((props, ref) => (
  <div className="border-2 border-gray-700" ref={ref}>
    <ResumeContainer resume={{
      basics: props.basics,
      work: props.work,
      education: props.education,
      skills: props.skills,
      certificates: props.certificates,
    }} theme={props.theme} />
  </div>
));

function ActionPage() {
  const location = useLocation();
  const token = useSelector((state) => state.token);
  const [resumeId, setResumeId] = useState(null);
  const [resumeName, setResumeName] = useState('Resume Name');
  const [isOpen, setIsOpen] = useState(false);
  const [education, setEducation] = useState([]);
  const [work, setWork] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [theme, setTheme] = useState('harvard');
  const currentUser = useSelector((state) => state.user);
  const isAuth = Boolean(useSelector((state) => state.token));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [basics, setBasics] = useState({
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
  });
  const [resumeLoading, setResumeLoading] = useState(false);
  const navigate = useNavigate();
  const resumeRef = React.useRef();
  const [activeTab, setActiveTab] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [useJobDescription, setUseJobDescription] = useState(false);
  const [showPrintError, setShowPrintError] = useState(false);

  /**
   * @function loadResume
   * @description Fetch updated resume from mongodb and update states 
   * @param {string} id The resume id to load
   * @returns 
   */
  const loadResume = async (id) => {
    setResumeLoading(true);
    try {
      if (!id) {
        return;
      }
      const { resume } = await getResume(token, id);
      setBasics(resume.basics);
      setEducation(resume.education);
      setWork(resume.work);
      setSkills(resume.skills);
      setCertificates(resume.certificates);
      setTheme(resume.theme);
      setResumeName(resume.name);
      setResumeLoading(false);
    } catch (err) {
      console.log(err);
      setResumeLoading(false);
      throw err;
    }
  };

  /**
   * @function useEffect
   * @description hook for if resumeId changes (refresh)
   */
  React.useEffect(() => {
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
   * @function handleSaveToPdf
   * @description Called when clicking Print to PDF button, calls react-to-print library
   * @todo Fix printing for mobile, gets too many notifications, generate on backend
   */
  const handleSaveToPdf = async () => {
    if (!currentUser.premiumUntil || new Date(currentUser.premiumUntil) < new Date()) {
      setShowPrintError(true);
      return;
    }

    try {
      setResumeLoading(true);

      // Save the resume first
      await handleSaveResume(false);
  
      const response = await api.get(`/resume/print/${resumeId}`, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const resumeNameClean = resumeName.replace(' ', '_');
      saveAs(pdfBlob, `${resumeNameClean}.pdf`);

      setResumeLoading(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * @function handleGenerateResume
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
      work: work,
      education: education,
      basics: basics,
      theme: theme,
      name: resumeName
    };
    setResumeLoading(true);
    try {
      const jobDescriptionStr = useJobDescription ? jobDescription : '';
      const newResume = await createResume(token, resume, jobDescriptionStr);
      setResumeLoading(false);
      setResumeId(newResume.resume._id);
      await loadResume(newResume.resume._id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @function handleSaveResume
   * @description Save current state of resume, only works if logged in
   *    Redirect to dashboard
   * @param {boolean} exit If true, redirect to dashboard
   */
  const handleSaveResume = async (exit) => {
    if (!isAuth) {
      setIsLoginOpen(true);
      return;
    }
    const resume = {
      _id: resumeId,
      userId: currentUser._id,
      work: work,
      education: education,
      basics: basics,
      skills: skills,
      certificates: certificates,
      theme: theme,
      name: resumeName
    };
    setResumeLoading(true);
    try {
      const savedResume = await updateResume(token, resume);
      setBasics(savedResume.resume.basics);
      setEducation(savedResume.resume.education);
      setWork(savedResume.resume.work);
      setSkills(savedResume.resume.skills);
      setCertificates(savedResume.resume.certificates);
      setResumeId(savedResume.resume._id);
      setResumeLoading(false);
      if (exit) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <div className="page-container">
      {resumeLoading && (
        <Spinner />
      )}

      <div className="px-2 p-4 md:px-4 lg:px-8 w-full flex flex-col">
      {showPrintError && (
        <div className="layover-container">
        <ErrorAlert 
          onClose={() => setShowPrintError(false)}
        >
          <p>You must be a premium member to save resume. 
            Upgrade to premium by <a className="underline" href="/pricing">clicking here.</a>
          </p>
        </ErrorAlert>
        </div>
      )}
        <Tabs openTab={activeTab} setOpenTab={(tab) => setActiveTab(tab)} />
        {activeTab === 1 && (
          <ActionTab 
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            certificates={certificates}
            summary={basics.summary}
            resumeName={resumeName}
            onUpdateResumeName={setResumeName}
            onPrint={handleSaveToPdf}
            onUpdateWork={(jobsIn) => setWork(jobsIn)}
            onUpdateEducation={(schoolsIn) => setEducation(schoolsIn)}
            onUpdateSkills={(skillsIn) => setSkills(skillsIn)}
            onUpdateCertificates={(certificatesIn) => setCertificates(certificatesIn)}
            onUpdateSummary={(sum) => {
              setBasics({
                ...basics,
                summary: sum
              });
            }}
            onUpdateBasics={(basicsIn) => setBasics(basicsIn)}
            onGenerateResume={handleGenerateResume} 
          />
        )}
        {activeTab === 2 && (
          <CustomizeTab 
            description={jobDescription}
            descriptionUsed={useJobDescription}
            onUpdateJobDescription={(description) => setJobDescription(description)}
            isJobDescriptionUsed={(checked) => setUseJobDescription(checked)}
            onChangeTheme={(theme) => setTheme(theme)}
          />
        )}
        <div className="w-full">
          <button onClick={() => handleSaveResume(false)} className="save-button">Save Resume</button>
          <button onClick={() => handleSaveResume(true)} className="save-button">Save and Exit</button>
        </div>

        <div onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 hover:cursor-pointer lg:hidden">
          <CustomDocumentIcon />
        </div>

      </div>
      {/* Desktop View */}
      <div className="hidden lg:block p-2 origin-top-left lg:w-1/2 xl:w-3/5 ease-linear transform lg:scale-60 xl:scale-90">
        <ResumeComponent 
          basics={basics}
          education={education}
          work={work}
          skills={skills}
          certificates={certificates}
          theme={theme}
          ref={resumeRef}
        />
      </div>

      {/* Mobile View */}
      <div className={`${isOpen ? "fixed": "hidden"} bg-black bg-opacity-50 flex justify-center items-center w-full h-full top-0`} onClick={() => setIsOpen(false)}>
        <div className="pt-4 transform scale-50 sm:scale-60 lg:scale-75 print:!scale-100">
          <ResumeComponent 
            basics={basics}
            education={education} 
            work={work}
            skills={skills}
            certificates={certificates}
            theme={theme}
            ref={resumeRef}
          />
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
