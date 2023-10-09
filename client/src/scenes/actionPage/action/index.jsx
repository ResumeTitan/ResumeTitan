import React, { useState } from 'react';
import { Popover } from '@material-ui/core';
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
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "600px", minWidth: "600px"}}
      className="p-2"
    >
      <ResumeName />
      <Schools adding={addingSchool} onSave={handleSave}/>

      <button className="addButton" onClick={handleButtonClick}>
        <AddCircleIcon />
        <div>{" Add Section "}</div>
      </button>
      <Popover
        open={isPopoverOpen}
        anchorEl={document.getElementById('add-section-button')}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <div className="flex flex-cols">
          <button className="flex flex-cols items-center addButton" onClick={handleAddSchool}>
            <SchoolIcon />
            <div className="flex p-2">{"Education"}</div>
            
          </button>
          <button className="flex flex-cols items-center addButton">
            <WorkIcon className="flex"/>
            <div className="flex p-2">{"Work Experience"}</div>
          </button>
        </div>
      </Popover>
    </div>
  )
}

export default ActionBar;
