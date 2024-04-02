import React from 'react';
import ResumeName from './ResumeName';
import PersonalInfo from './PersonalInfo';
import Schools from './Schools';
import Jobs from './Jobs';
import Skills from './Skills';
import Summary from './Summary';
import Popup from '../Popup';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { swapArrayElements } from 'utils';
import '../index.css';

function ActionTab({
  basics, 
  work,
  education,
  skills,
  onPrint, 
  onUpdateWork, 
  onUpdateEducation, 
  onUpdateBasics, 
  onUpdateSkills,
  onUpdateSummary 
}) {
  const [popupOpen, setPopupOpen] = React.useState(false);

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

  return (
    <div>
      <ResumeName onPrint={ onPrint } />
      <PersonalInfo initialInfo={basics} key={basics} onUpdate={onUpdateBasics} />

      <Schools education={education} onSave={handleSaveEducation} onDelete={handleDeleteEducation} />
      <Jobs jobs={work} onSave={handleSaveWork} onDelete={handleDeleteWork} onSwap={handleSwapJobs}/>
      
      <div className="flex w-full">
        <div className="font-bold pr-2">Optional:</div>
        <button onClick={() => setPopupOpen(true)}>
          <HelpOutlineIcon/>
        </button>
      </div>
      
      <Summary initSummary={basics?.summary || ""} onUpdate={onUpdateSummary} />
      <Skills initSkills={skills} onUpdate={onUpdateSkills}/>

       {/* Popup */}
       {popupOpen && <Popup message={`These fields will be filled in when clicking "Generate Resume"`} handleOk={() => setPopupOpen(false)} />}
    </div>
  )
}

export default ActionTab;
