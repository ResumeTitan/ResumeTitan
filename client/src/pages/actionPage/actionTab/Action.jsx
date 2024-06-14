import React, { useEffect, useState } from 'react';
import ResumeName from './ResumeName';
import PersonalInfo from './PersonalInfo';
import Schools from './Schools';
import Jobs from './Jobs';
import Skills from './Skills';
import Summary from './Summary';
import Popup from '../Popup';
import api from 'api/actions';
import { swapArrayElements } from 'utils';
import 'styles/index.css';

function ActionTab({
  basics,
  work,
  education,
  skills,
  resumeName,
  onUpdateResumeName,
  onPrint, 
  onUpdateWork, 
  onUpdateEducation, 
  onUpdateBasics, 
  onUpdateSkills,
  onUpdateSummary 
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [aiSkillsLoading, setAiSkillsLoading] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  /**
   * @function handleSummaryAiCall
   */
  const handleSummaryAiCall = async () => {
    setAiSummaryLoading(true);
    const summaryResponse = await api.post("/new/summary", { 
      summary: basics.summary,
      work: work,
      education: education,
      skills: skills
    });
    onUpdateSummary(summaryResponse.data.response.summary);
    setAiSummaryLoading(false);
  }

  /**
   * @function handleSkillsAiCall
   */
  const handleSkillsAiCall = async () => {
    setAiSkillsLoading(true);
    const summaryResponse = await api.post("/new/skills", { 
      summary: basics.summary,
      work: work,
      education: education,
      skills: skills
    });
    onUpdateSkills(summaryResponse.data.response.skills);
    setAiSkillsLoading(false);
  }

  const handleSaveWork = (workForm) => {
    if (workForm.id) {
      const updatedWork = work.map((job) => {
        if (job.id === workForm.id) {
          return workForm;
        } else { 
          return job;
        }
      });
      onUpdateWork(updatedWork);
    } else {
      workForm.id = work.length + 1;
      onUpdateWork([...work, workForm]);
    }
  }

  const handleDeleteWork = (id) => {
    const updatedWork = work.filter((job) => job.id !== id);
    onUpdateWork(updatedWork);
  }

  const handleSaveEducation = (educationForm) => {
    if (educationForm.id) {
      const updatedEducation = education.map((school) => {
        if (school.id === educationForm.id) {
          return educationForm;
        } else {
          return school;
        }
      });
      onUpdateEducation(updatedEducation);
    } else {
      educationForm.id = education.length + 1;
      onUpdateEducation([...education, educationForm]);
    }
  }

  const handleDeleteEducation = (id) => {
    const updatedEducation = education.filter((school) => school.id !== id);
    onUpdateEducation(updatedEducation);
  }

  const handleSwapJobs = (up, index) => {
    const tempWork = work;
    if (up) {
      swapArrayElements(tempWork, index, index - 1);
    } else {
      swapArrayElements(tempWork, index, index + 1);
    }
    onUpdateWork(tempWork);
  }

  const handleSwapEducation = (indexA, indexB) => {
    const tempEducation = education;
    swapArrayElements(tempEducation, indexA, indexB);
    onUpdateEducation(tempEducation);
  }

  return (
    <div>
      <ResumeName initName={resumeName} onPrint={ onPrint } onUpdateResumeName={onUpdateResumeName} />
      <PersonalInfo initialInfo={basics} key={basics} onUpdate={onUpdateBasics} />

      <Schools key={education} education={education} onSave={handleSaveEducation} onDelete={handleDeleteEducation} onReorder={handleSwapEducation}/>
      <Jobs jobs={work} onSave={handleSaveWork} onDelete={handleDeleteWork} onSwap={handleSwapJobs}/>      
      <Summary summary={basics?.summary || ""} aiLoading={aiSummaryLoading} onUpdate={onUpdateSummary} onAiCall={handleSummaryAiCall} />
      <Skills initSkills={skills} aiLoading={aiSkillsLoading} onUpdate={onUpdateSkills} onAiCall={handleSkillsAiCall}/>

       {/* Popup */}
       {popupOpen && <Popup message={`These fields will be filled in when clicking "Generate Resume"`} handleOk={() => setPopupOpen(false)} />}
    </div>
  )
}

export default ActionTab;
