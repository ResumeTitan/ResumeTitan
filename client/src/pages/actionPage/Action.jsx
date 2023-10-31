import React from 'react';
import ResumeName from './resumeName';
import PersonalInfo from './PersonalInfo';
import Schools from './Schools';
import Jobs from './Jobs';
import './Action.css';

function ActionBar({ profile, jobs, schools, onPrint, onUpdateJobs, onUpdateSchools, onUpdateProfile, onGenerateResume }) {

  const handleSaveJob = (jobForm) => {
    if (jobForm.id) {
      const updatedJobs = jobs.map((job) => {
        if (job.id === jobForm.id) {
          return jobForm;
        } else {
          return job;
        }
      });
      onUpdateJobs(updatedJobs);
    } else {
      jobForm.id = jobs.length + 1;
      onUpdateJobs([...jobs, jobForm]);
    }
  }

  const handleDeleteJob = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    onUpdateJobs(updatedJobs);
  }

  const handleSaveSchool = (schoolForm) => {
    if (schoolForm.id) {
      const updatedSchools = schools.map((school) => {
        if (school.id === schoolForm.id) {
          return schoolForm;
        } else {
          return school;
        }
      });
      onUpdateSchools(updatedSchools);
    } else {
      schoolForm.id = schools.length + 1;
      onUpdateSchools([...schools, schoolForm]);
    }
  }

  const handleDeleteSchool = (id) => {
    const updatedSchools = schools.filter((school) => school.id !== id);
    onUpdateSchools(updatedSchools);
  }

  const handleGenerateResume = () => {
    onGenerateResume();
  }

  return (
    <div 
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "600px", maxWidth: "600px"}}
      className="p-2"
    >
      <ResumeName onPrint={ onPrint } />
      <PersonalInfo initialInfo={profile} onUpdate={onUpdateProfile} />
      <Schools schools={schools} onSave={handleSaveSchool} onDelete={handleDeleteSchool} />
      <Jobs jobs={jobs} onSave={handleSaveJob} onDelete={handleDeleteJob} />
      <div className="w-full">
        <button onClick={handleGenerateResume} className="generateButton bg-slate-700">Generate Resume</button>
      </div>
    </div>
  )
}

export default ActionBar;
