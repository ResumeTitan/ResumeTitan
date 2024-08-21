import React, { useState } from 'react';
import ResumeName from './ResumeName';
import PersonalInfo from './PersonalInfo';
import Schools from './Schools';
import Volunteers from './Volunteer';
import Jobs from './Jobs';
import Skills from './Skills';
import Summary from './Summary';
import Popup from '../Popup';
import api from 'api/actions';
import { swapArrayElements } from 'utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ButtonGridComponent from './SectionSelector';
import 'styles/index.css';

function ActionTab({
  resumeIn,
  onUpdateResumeName,
  onPrint,
  onUpdateWork, 
  onUpdateVolunteer,
  onUpdateEducation, 
  onUpdateBasics, 
  onUpdateSkills,
  onUpdateSummary,
  onUpdateSections
}) {
  const [sectionPopupOpen, setSectionPopupOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [aiSkillsLoading, setAiSkillsLoading] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  /**
   * @function handleSummaryAiCall
   */
  const handleSummaryAiCall = async () => {
    setAiSummaryLoading(true);
    const summaryResponse = await api.post("/resume/summary", resumeIn);
    onUpdateSummary(summaryResponse.data.response.summary);
    setAiSummaryLoading(false);
  }

  /**
   * @function handleSkillsAiCall
   */
  const handleSkillsAiCall = async () => {
    setAiSkillsLoading(true);
    const skillsResponse = await api.post("/resume/skills", resumeIn);
    console.log(skillsResponse.data.response.skills);
    onUpdateSkills(skillsResponse.data.response.skills);
    setAiSkillsLoading(false);
  }

  const handleSaveWork = (workForm) => {
    if (workForm.id) {
      const updatedWork = resumeIn.work.map((job) => {
        if (job.id === workForm.id) {
          return workForm;
        } else { 
          return job;
        }
      });
      onUpdateWork(updatedWork);
    } else {
      workForm.id = resumeIn.work.length + 1;
      onUpdateWork([...resumeIn.work, workForm]);
    }
  }

  const handleSaveVolunteer = (volunteerForm) => {
    if (volunteerForm.id) {
      const updatedVolunteer = resumeIn.volunteer.map((vol) => {
        if (vol.id === volunteerForm.id) {
          return volunteerForm;
        } else { 
          return vol;
        }
      });

      console.log(updatedVolunteer);
      onUpdateVolunteer(updatedVolunteer);
    } else {
      volunteerForm.id = resumeIn.work.length + 1;
      onUpdateVolunteer([...resumeIn.volunteer, volunteerForm]);
    }
  }

  const handleDeleteWork = (id) => {
    const updatedWork = resumeIn.work.filter((job) => job.id !== id);
    onUpdateWork(updatedWork);
  }

  const handleDeleteVolunteer = (id) => {
    const updatedVolunteer = resumeIn.volunteer.filter((volunteer) => volunteer.id !== id);
    onUpdateVolunteer(updatedVolunteer);
  }

  const handleSaveEducation = (educationForm) => {
    if (educationForm.id) {
      const updatedEducation = resumeIn.education.map((school) => {
        if (school.id === educationForm.id) {
          return educationForm;
        } else {
          return school;
        }
      });
      onUpdateEducation(updatedEducation);
    } else {
      educationForm.id = resumeIn.education.length + 1;
      onUpdateEducation([...resumeIn.education, educationForm]);
    }
  }

  const handleDeleteEducation = (id) => {
    const updatedEducation = resumeIn.education.filter((school) => school.id !== id);
    onUpdateEducation(updatedEducation);
  }

  const handleSwapJobs = (up, index) => {
    const tempWork = resumeIn.work;
    if (up) {
      swapArrayElements(tempWork, index, index - 1);
    } else {
      swapArrayElements(tempWork, index, index + 1);
    }
    onUpdateWork(tempWork);
  }

  const handleSwapEducation = (indexA, indexB) => {
    const tempEducation = resumeIn.education;
    swapArrayElements(tempEducation, indexA, indexB);
    onUpdateEducation(tempEducation);
  }

  return (
    <div>
      <ResumeName initName={resumeIn.name} onPrint={ onPrint } onUpdateResumeName={onUpdateResumeName} />
      <PersonalInfo initialInfo={resumeIn.basics} key={resumeIn.basics} onUpdate={onUpdateBasics} />
      <Summary summary={resumeIn.basics.summary} aiLoading={aiSummaryLoading} onUpdate={onUpdateSummary} onAiCall={handleSummaryAiCall} />

      {resumeIn.sections.includes("Education") && (
        <Schools 
          education={resumeIn.education} 
          onSave={handleSaveEducation} 
          onDelete={handleDeleteEducation} 
          onReorder={handleSwapEducation}
        />
      )}

      {resumeIn.sections.includes("Work") && (
        <Jobs 
          jobs={resumeIn.work} 
          onSave={handleSaveWork} 
          onDelete={handleDeleteWork} 
          onSwap={handleSwapJobs}
      />)}

      {resumeIn.sections.includes("Volunteer") && (
        <Volunteers 
          volunteerExperience={resumeIn.volunteer} 
          onSave={handleSaveVolunteer}
          onDelete={handleDeleteVolunteer}
      />)}

      {resumeIn.sections.includes("Skills") && (
        <Skills initSkills={resumeIn.skills} aiLoading={aiSkillsLoading} onUpdate={onUpdateSkills} onAiCall={handleSkillsAiCall}/>
      )}
      

      <div className="form-container">
        <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={() => {setSectionPopupOpen(!sectionPopupOpen)}}>
          <AddCircleIcon fontSize="large"/>
          <span>{"Add Section"}</span>
        </div>
      </div>

      {sectionPopupOpen && (
        <div>
        <ButtonGridComponent onAdd={(sections) => {
          onUpdateSections(sections);
          setSectionPopupOpen(false);
        }}
          onClose={() => setSectionPopupOpen(false)}></ButtonGridComponent>
        </div>
      )}

       {/* Popup */}
       {popupOpen && <Popup message={`These fields will be filled in when clicking "Generate Resume"`} handleOk={() => setPopupOpen(false)} />}
    </div>
  )
}

export default ActionTab;
