import React, { useState } from 'react';
import ResumeName from './ResumeName';
import PersonalInfo from './PersonalInfo';
import Schools from './Schools';
import Volunteers from './Volunteer';
import Jobs from './Jobs';
import Skills from './Skills';
import Awards from './Awards';
import Summary from './Summary';
import Popup from '../Popup';
import api from 'api/actions';
import { swapArrayElements } from 'utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ButtonGridComponent from './SectionSelector';
import 'styles/index.css';

function ActionTab({
  resumeIn,
  onPrint,
  onUpdateResume,
  onUploadPdf
}) {
  const [sectionPopupOpen, setSectionPopupOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [aiSkillsLoading, setAiSkillsLoading] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);


  /**
   * @function handleSummaryAiCall
   */
  const handleSummaryAiCall = async (userInput = '') => {
    setAiSummaryLoading(true);
    const summaryResponse = await api.post("/resume/summary", {
      ...resumeIn,
      userInput: userInput, // Always pass the AI assistant text, even if empty
      operationType: userInput ? 'edit' : 'generate'
    });
    setAiSummaryLoading(false);
    onUpdateResume({
      ...resumeIn, basics: {
        ...resumeIn.basics,
        summary: summaryResponse.data.response.summary
      }
    });
  }

  /**
   * @function handleSkillsAiCall
   */
  const handleSkillsAiCall = async (userInput = '') => {
    setAiSkillsLoading(true);
    const skillsResponse = await api.post("/resume/skills", {
      ...resumeIn,
      userInput: userInput, // Always pass the AI assistant text, even if empty
      operationType: userInput ? 'edit' : 'generate'
    });
    setAiSkillsLoading(false);
    onUpdateResume({
      ...resumeIn,
      skills: skillsResponse.data.response.skills
    });
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
      onUpdateResume({
        ...resumeIn,
        work: updatedWork
      });
    } else {
      workForm.id = resumeIn.work.length + 1;
      onUpdateResume({
        ...resumeIn,
        work: [...resumeIn.work, workForm]
      });
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

      onUpdateResume({
        ...resumeIn,
        volunteer: updatedVolunteer
      });
    } else {
      volunteerForm.id = resumeIn.work.length + 1;
      onUpdateResume({
        ...resumeIn,
        volunteer: [...resumeIn.volunteer, volunteerForm]
      });
    }
  }

  /**
   * @function handleDeleteWork
   * @param {string} id Idetifier of work item
   */
  const handleDeleteWork = (id) => {
    const updatedWork = resumeIn.work.filter((job) => job.id !== id);
    onUpdateResume({
      ...resumeIn,
      work: updatedWork
    })
  }

  /**
   * @function handleDeleteVolunteer
   * @param {string} id Idetifier of volunteer item
   */
  const handleDeleteVolunteer = (id) => {
    const updatedVolunteer = resumeIn.volunteer.filter((volunteer) => volunteer.id !== id);
    onUpdateResume({
      ...resumeIn,
      volunteer: updatedVolunteer
    });
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
      onUpdateResume({
        ...resumeIn,
        education: updatedEducation
      });
    } else {
      educationForm.id = resumeIn.education.length + 1;
      onUpdateResume({
        ...resumeIn,
        education: [...resumeIn.education, educationForm]
      });
    }
  }

  const handleDeleteEducation = (id) => {
    const updatedEducation = resumeIn.education.filter((school) => school.id !== id);
    onUpdateResume({
      ...resumeIn,
      education: updatedEducation
    });
  }

  const handleSaveAward = (awardForm) => {
    if (awardForm.id) {
      const updatedAwards = resumeIn.awards.map((award) => {
        if (award.id === awardForm.id) {
          return awardForm;
        } else {
          return award;
        }
      });
      onUpdateResume({
        ...resumeIn,
        awards: updatedAwards
      });
    } else {
      awardForm.id = resumeIn.awards.length + 1;
      onUpdateResume({
        ...resumeIn,
        awards: [...resumeIn.awards, awardForm]
      });
    }
  }

  const handleDeleteAward = (id) => {
    const updatedAwards = resumeIn.awards.filter((award) => award.id !== id);
    onUpdateResume({
      ...resumeIn,
      awards: updatedAwards
    });
  }

  const handleSwapJobs = (up, index) => {
    const tempWork = resumeIn.work;
    if (up) {
      swapArrayElements(tempWork, index, index - 1);
    } else {
      swapArrayElements(tempWork, index, index + 1);
    }
    onUpdateResume({
      ...resumeIn,
      work: tempWork
    });
  }

  const handleSwapEducation = (indexA, indexB) => {
    const tempEducation = resumeIn.education;
    swapArrayElements(tempEducation, indexA, indexB);
    onUpdateResume({
      ...resumeIn,
      education: tempEducation
    });
  }

  const handleSwapAwards = (indexA, indexB) => {
    const tempAwards = resumeIn.awards;
    swapArrayElements(tempAwards, indexA, indexB);
    onUpdateResume({
      ...resumeIn,
      awards: tempAwards
    });
  }

  const handleUpdateResumeName = (name) => {
    onUpdateResume({...resumeIn, name});
  }

  const handleUpdateSummary = (summary) => {
    onUpdateResume({
      ...resumeIn, basics: {
        ...resumeIn.basics,
        summary
      }
    });
  }

  const handleUpdateSkills = (skills) => {
    onUpdateResume({...resumeIn, skills});
  }

  const handleUpdateBasics = (basics) => {
    onUpdateResume({...resumeIn, basics});
  }

  const handleAddSection = (sections) => {
    const currentSections = resumeIn.sections.concat(sections);
    onUpdateResume({...resumeIn, sections: currentSections});
    setSectionPopupOpen(false);
  }

  return (
    <div>
      <ResumeName initName={resumeIn.name} onPrint={ onPrint } onUpdateResumeName={handleUpdateResumeName} onUploadPdf={onUploadPdf} />
      <PersonalInfo initialInfo={resumeIn.basics} onUpdate={handleUpdateBasics} />
      <Summary summary={resumeIn.basics.summary} aiLoading={aiSummaryLoading} onUpdate={handleUpdateSummary} onAiCall={handleSummaryAiCall} />

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
        <Skills initSkills={resumeIn.skills} aiLoading={aiSkillsLoading} onUpdate={handleUpdateSkills} onAiCall={handleSkillsAiCall}/>
      )}
      
      {resumeIn.sections.includes("Awards") && (
        <Awards 
          initAwards={resumeIn.awards || []} 
          aiLoading={false}
          onUpdate={(awards) => onUpdateResume({...resumeIn, awards})}
          onAiCall={() => {}}
        />
      )}

      <div className="form-container">
        <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={() => {setSectionPopupOpen(!sectionPopupOpen)}}>
          <AddCircleIcon fontSize="large"/>
          <span>{"Add Section"}</span>
        </div>
      </div>

      {sectionPopupOpen && (
        <div>
        <ButtonGridComponent onAdd={handleAddSection}
          onClose={() => setSectionPopupOpen(false)}></ButtonGridComponent>
        </div>
      )}

       {/* Popup */}
       {popupOpen && <Popup message={`These fields will be filled in when clicking "Generate Resume"`} handleOk={() => setPopupOpen(false)} />}
    </div>
  )
}

export default ActionTab;
