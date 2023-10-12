import React, { useEffect, useState } from 'react';
import ActionBar from './action';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { getScaleForResumeViewer } from 'utils';
import HarvardResume from 'templates/layouts/harvard/Harvard';
import ResumeContainer from 'templates/ResumeContainer';
const MED_SCREEN_WIDTH = 1200;

// This page should do all loading, other pages do rendering

function ActionPage() {
  const [scale, setScale] = useState(1);
  const [showResume, setShowResume] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleViewResume = () => {
    togglePopup();
  };

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        const newScale = getScaleForResumeViewer(window.innerWidth + 100)
        setScale(newScale > 0.85 ? 0.85 : newScale);
      } else {
        if (window.innerWidth > MED_SCREEN_WIDTH) {
          setShowResume(true);
        } else {
          setShowResume(false);
        }
        setScale(getScaleForResumeViewer(window.innerWidth - 384));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <div className="flex flex-rows justify-center ">
      <ActionBar />
      {!isOpen && showResume && (
        <div onClick={togglePopup} className="p-2 origin-top transition-all duration-300 ease-linear" style={{transform: "scale(0.9)"}}>
          <ResumeContainer>
            <HarvardResume/>
          </ResumeContainer>
        </div>
      )}
      {!showResume && (
        <div className="fixed bottom-4 right-4 hover:cursor-pointer" onClick={handleViewResume}>
          <DocumentScannerIcon className="text-white" style={{ fontSize: 100 }}/>
        </div>
      )}

      {isOpen && (
        <div className="fixed bg-black bg-opacity-50 flex justify-center items-center w-full h-full overflow-auto" onClick={togglePopup}>
          <div class="pt-2 transition-all duration-300 ease-linear	print:!scale-100" style={{transform: `scale(${scale})`}}>
          <ResumeContainer>
            <HarvardResume/>
          </ResumeContainer>
          </div>
        </div>
      )}

    </div>
  );
}

export default ActionPage;
