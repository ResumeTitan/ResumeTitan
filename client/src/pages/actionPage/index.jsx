import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ActionTab from './actionTab/Action';
import CustomizeTab from './customizeTab';
import Tabs from './Tabs';
import ResumeContainer from 'templates/ResumeContainer';
import { getResume, createResume, updateResume, getResumeAsPdf } from 'api/resume';
import Spinner from 'components/Spinner';
import { LoginForm } from 'components/LoginForm';
import 'styles/index.css';
import { styled } from '@mui/system';
import DescriptionIcon from '@mui/icons-material/Description';

const CustomIcon = styled(DescriptionIcon)({
  backgroundColor: 'white',
  color: 'black',
  fontSize: '72px',
  borderRadius: '10%'
});

// This page should do all loading, other pages do rendering

// The resume reference
const ResumeComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <ResumeContainer resume={{
      basics: props.basics,
      work: props.work,
      education: props.education,
      skills: props.skills,
    }} theme={props.theme} />
  </div>
));

function ActionPage() {
  const location = useLocation();
  const token = useSelector((state) => state.token);
  const [resumeId, setResumeId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [education, setEducation] = useState([]);
  const [work, setWork] = useState([]);
  const [skills, setSkills] = useState([]);
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

  /**
   * @function loadResume
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
      setBasics(resume.basics);
      setEducation(resume.education);
      setWork(resume.work);
      setSkills(resume.skills);
      setTheme(resume.theme);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  /**
   * @function useEffect
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
   * @function handleSaveToPdf
   * @description Called when clicking Print to PDF button, calls react-to-print library
   * @todo Fix printing for mobile, gets too many notifications, generate on backend
   */
  const handleSaveToPdf = async () => {
    const response = await getResumeAsPdf(token, location.state.resumeId);
    try {
      const pdf = await response.blob();
      // Create a URL for the Blob
      const url = URL.createObjectURL(pdf);

      // Create an <a> element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = 'resume.pdf';
      a.click();

      // Clean up the URL object after the download is initiated
      URL.revokeObjectURL(url);
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
      theme: theme
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
   */
  const handleSaveResume = async () => {
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
      theme: theme
    };
    setResumeLoading(true);
    try {
      const savedResume = await updateResume(token, resume);
      setBasics(savedResume.resume.basics);
      setEducation(savedResume.resume.education);
      setWork(savedResume.resume.work);
      setSkills(savedResume.resume.skills);
      setResumeLoading(false);
      navigate('/dashboard');
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

      <div className="px-2 pt-4 md:px-4 lg:px-8 w-full flex flex-col">
        <Tabs openTab={activeTab} setOpenTab={(tab) => setActiveTab(tab)} />
        {activeTab === 1 && (
          <ActionTab 
            basics={basics}
            work={work}
            education={education}
            skills={skills}
            summary={basics.summary}
            onPrint={handleSaveToPdf}
            onUpdateWork={(jobsIn) => setWork(jobsIn)}
            onUpdateEducation={(schoolsIn) => setEducation(schoolsIn)}
            onUpdateSkills={(skillsIn) => setSkills(skillsIn)}
            onUpdateSummary={(sum) => {
              setBasics({
                ...basics,
                summary: sum
              });
            }}
            onUpdateBasics={(basicsIn) => setBasics(basicsIn)}
            onGenerateResume={handleGenerateResume} 
            onSave={handleSaveResume}
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
          <button onClick={handleGenerateResume} className="generate-button">Generate Resume</button>
          <button onClick={handleSaveResume} className="save-button">Save and Exit</button>
        </div>

        <div onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 hover:cursor-pointer lg:hidden">
          <CustomIcon />
        </div>

      </div>
      {/* Desktop View */}
      <div className="hidden lg:block p-2 origin-top-left lg:w-1/2 xl:w-3/5 ease-linear transform lg:scale-60 xl:scale-90">
        <ResumeComponent 
          basics={basics}
          education={education}
          work={work}
          skills={skills}
          theme={theme}
          ref={resumeRef}
        />
      </div>

      {/* Mobile View */}
      <div className={`${isOpen ? "fixed": "hidden"} bg-black bg-opacity-50 flex justify-center items-center w-full h-full top-0`} onClick={() => setIsOpen(false)}>
        <div className="pt-4 transform translate-12 md:translate-y-24 scale-50 sm:scale-60 lg:scale-75 origin-center print:!scale-100">
        <ResumeComponent 
          basics={basics}
          education={education} 
          work={work}
          skills={skills}
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
