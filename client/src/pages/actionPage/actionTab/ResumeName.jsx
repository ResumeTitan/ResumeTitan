import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import 'styles/index.css';

function ResumeName({ initName, onPrint, onUpdateResumeName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeName, setResumeName] = useState(initName);
  const inputRef = useRef();

  const handleIsEditing = () => {
    setIsEditing(true);
  }

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateResumeName(resumeName);
  }

  const handlePrint = () => {
    onPrint();
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
    setResumeName(initName);
  }, [isEditing, initName]);

  return (
    <div className="form-section">
      <div className="flex-center">
        <div>
          {isEditing ? (
            <div className="flex">
              <input
                className="form-style"
                id="resumeName"
                type="text"
                placeholder="Enter Resume Name"
                onChange={(e) => setResumeName(e.target.value)}
                onBlur={handleBlur}
                value={resumeName}
                ref={inputRef}
              />
              <button onClick={handleBlur} className="submit-button mx-2 px-2">{"Save"}</button>
            </div>
          ) : (
            <div
              className="flex items-center font-bold text-lg hover:text-lighter-green hover:cursor-pointer transition-colors duration-300"
              onClick={handleIsEditing}
            >
              <div className="mr-2">{resumeName || "Resume Name"}</div>
              <EditIcon fontSize="medium"/>
            </div>
          )}
        </div>
        <div>
          <button onClick={handlePrint} className="submit-button px-5 py-2.5 m-1 h-12 w-full">
            {"Save as PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeName;
