import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActionBar from './Action';
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
  const schools = useSelector(state => state.schools);
  const jobs = useSelector(state => state.jobs);

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
    <div className="flex flex-rows justify-center min-h-screen bg-slate-400">
      <ActionBar />
      {!isOpen && showResume && (
        <div onClick={togglePopup} className="p-2 origin-top ease-linear" style={{transform: "scale(0.9)"}}>
          <ResumeContainer>
            <HarvardResume education={schools}/>
          </ResumeContainer>
        </div>
      )}
      {!showResume && (
        <div className="fixed bottom-2 right-4 hover:cursor-pointer" onClick={handleViewResume}>
          <DocumentScannerIcon className="text-white" style={{ fontSize: 100 }}/>
        </div>
      )}

      {isOpen && (
        <div className="fixed bg-black bg-opacity-50 flex justify-center items-center w-full h-full overflow-auto top-0" onClick={togglePopup}>
          <div class="pt-2 ease-linear	print:!scale-100" style={{transform: `scale(${scale})`}}>
          <ResumeContainer>
            <HarvardResume education={schools}/>
          </ResumeContainer>
          </div>
        </div>
      )}

    </div>
  );
}

export default ActionPage;
