import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import '../index.css';

function ResumeName() {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const inputRef = useRef();

  const handleIsEditing = () => {
    setIsEditing(true);
  }

  const handleBlur = () => {
    setIsEditing(false);
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
                className="shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <button className="submitButton">
          {"Download"}
        </button>
      </div>
    </div>
  );
}

export default ResumeName;
