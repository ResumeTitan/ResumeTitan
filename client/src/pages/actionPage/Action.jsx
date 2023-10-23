import React, { useState } from 'react';
import ResumeName from './resumeName';
import Schools from './Schools';
import Jobs from './Jobs';

function ActionBar() {
  const [addingSchool, setAddingSchool] = useState(false);
  const [addingJob, setAddingJob] = useState(false);

  const handleSave = () => {
    setAddingSchool(false);
  }

  return (
    <div 
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "600px", maxWidth: "600px"}}
      className="p-2"
    >
      <ResumeName />
      <Schools adding={addingSchool} onSave={handleSave}/>
      <Jobs adding={addingJob} onSave={handleSave}/>
    </div>
  )
}

export default ActionBar;
