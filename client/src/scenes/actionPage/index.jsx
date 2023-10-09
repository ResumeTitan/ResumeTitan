import React, { useEffect, useState } from 'react';
import Resume from './resume';
import ActionBar from './action';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { getScaleForResumeViewer } from 'utils';
const MED_SCREEN_WIDTH = 1000;

// This page should do all loading, other pages do rendering

function ActionPage() {
  const [viewing, setViewing] = useState(false);
  const [scale, setScale] = useState(1);
  const [showResume, setShowResume] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setViewing(!viewing);
  };

  const handleViewResume = () => {
    togglePopup();
  };

  useEffect(() => {
    const handleResize = () => {
      console.log("resize", getScaleForResumeViewer(window.innerWidth));
      if (viewing) {
        setScale(getScaleForResumeViewer(window.innerWidth));
      } else {
        if (window.innerWidth > MED_SCREEN_WIDTH) {
          setShowResume(true);
        } else {
          setShowResume(false);
        }
        setScale(getScaleForResumeViewer(window.innerWidth - 500));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [viewing]);
  
  return (
    <div className="flex flex-rows justify-center ">
      <ActionBar />
      {!isOpen && (
          <Resume viewing={viewing} scale={scale} show={showResume} onView={handleViewResume}/>
      )}
      {!showResume && (
        <div className="fixed bottom-4 right-4 hover:cursor-pointer" onClick={handleViewResume}>
          <DocumentScannerIcon className="text-white" style={{ fontSize: 100 }}/>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup-content rounded shadow-lg bg-background-dark">
            <h2 className="text-2xl font-bold mt-4 ml-4 text-light-text p-2">Popup Content</h2>
            <div className="p-2">
              <Resume viewing={viewing} scale={scale} show={showResume}/>
            </div>
            <button
              className="bg-blue-500 text-white font-bold mb-4 ml-4 py-2 px-4 rounded"
              onClick={togglePopup}
            >
              Close Popup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ActionPage;
