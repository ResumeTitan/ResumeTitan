import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PrintIcon from '@mui/icons-material/Print';
import 'styles/index.css';

function ResumeName({ initName, onPrint, onUpdateResumeName, onUploadPdf }) {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeName, setResumeName] = useState(initName);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();
  const fileInputRef = useRef();

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setIsUploading(true);
    try {
      if (onUploadPdf) {
        await onUploadPdf(file);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
    setResumeName(initName);
  }, [isEditing, initName]);

  return (
    <div className="form-section">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                className="form-style flex-1"
                id="resumeName"
                type="text"
                placeholder="Enter Resume Name"
                onChange={(e) => setResumeName(e.target.value)}
                onBlur={handleBlur}
                value={resumeName}
                ref={inputRef}
              />
              <button onClick={handleBlur} className="submit-button px-4 py-2 sm:mx-2">{"Save"}</button>
            </div>
          ) : (
            <div
              className="flex items-center justify-center sm:justify-start font-bold text-lg hover:text-lighter-green hover:cursor-pointer transition-colors duration-300"
              onClick={handleIsEditing}
            >
              <div className="mr-2">{resumeName || "Resume Name"}</div>
              <EditIcon fontSize="medium"/>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={handleUploadClick} 
            className="primary-action-button hover:bg-darker-green flex items-center justify-center gap-2 w-full sm:w-auto"
            disabled={isUploading}
          >
            <UploadFileIcon fontSize="small"/>
            {isUploading ? "Uploading..." : "Upload from PDF"}
          </button>
          <button onClick={handlePrint} className="primary-action-button hover:bg-darker-green flex items-center justify-center gap-2 w-full sm:w-auto">
            <PrintIcon fontSize="small"/>
            {"Print Resume"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeName;
