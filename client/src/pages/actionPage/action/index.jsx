import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ResumeName from './resumeName';
import Schools from './schools';

function ActionBar() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [addingSchool, setAddingSchool] = useState(false);

  const handleButtonClick = (event) => {
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  const handleAddSchool = () => {
    setAddingSchool(true);
  }

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

      <button className="addButton" onClick={handleButtonClick}>
        <AddCircleIcon />
        <div>{" Add Section "}</div>
      </button>
      {isPopoverOpen && (
        <div 
          className="absolute bg-white border border-gray-300 p-2 mt-2"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <button 
            className="flex items-center addButton mb-2"
            onClick={handleAddSchool}
          >
            <SchoolIcon />
            <div className="flex p-2">{"Education"}</div>
          </button>
          <button className="flex items-center addButton">
            <WorkIcon className="flex"/>
            <div className="flex p-2">{"Work Experience"}</div>
          </button>
        </div>
      )}
    </div>
  )
}

export default ActionBar;
