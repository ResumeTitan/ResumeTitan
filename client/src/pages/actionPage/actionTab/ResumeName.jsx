import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import './Action.css';

function ResumeName({ onPrint }) {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const inputRef = useRef();

  const handleIsEditing = () => {
    setIsEditing(true);
  }

  const handleBlur = () => {
    setIsEditing(false);
  }

  const handlePrint = () => {
    onPrint();
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="rounded-lg border border-black border-2 px-4 bg-slate-700 w-full text-white">
      <div className={`flex justify-between items-center`}>
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div>
              <input
                className="formStyle"
                id="resumeName"
                type="text"
                placeholder="Enter Resume Name"
                onChange={(e) => setResumeName(e.target.value)}
                onBlur={handleBlur}
                value={resumeName}
                ref={inputRef}
              />
            </div>
          ) : (
            <div
              className="flex items-center font-bold text-lg hover:text-accent-blue hover:cursor-pointer transition-colors duration-300"
              onClick={handleIsEditing}
            >
              <div className="mr-2">{resumeName || "Resume Name"}</div>
              <EditIcon fontSize="medium"/>
            </div>
          )}
        </div>
        <div>
          <button onClick={handlePrint} className="border-2 submitButton">
            {"Print to PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeName;
