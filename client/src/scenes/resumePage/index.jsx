import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import Spinner from "../components/Spinner";
import { ContactInfo, Summary, Jobs, Schools, Skills} from "../components";


import '../styles/Resume.css';

const MED_SCREEN_WIDTH = 768;

/**
 * Resume Page content
 * @param id Resume ID to display
 * @returns Resume page content
 */
export function ResumePage({ resume }) {
  const resumeRef = React.useRef();
  const token = useSelector((state) => state.token);
  const jobs = resume.jobs;
  const schools = resume.schools;

  const [showAlert, setShowAlert] = useState(false);
  const [ackAlert, setAckAlert] = useState(false);
  const [resumeData, setResumeData] = useState({ resume });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MED_SCREEN_WIDTH) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSaveAsPDF = async () => {
    const element = resumeRef.current;

    if (element) {
      const opt = {
        margin: 0,
        filename: 'my_component.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  if (showAlert && !ackAlert) {
    return (
      <div className="bg-yellow-200 border-yellow-500 border-4 p-4">
        <p className="font-bold">Warning</p>
        <p>This page may not display properly on small screens.</p>
        <button onClick={() => setAckAlert(true)}>OK</button>
      </div>
    )
  }

  const handleEdit = (field, value) => {
    setResumeData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="m-2">
      <div className="resume-container" ref={resumeRef}>
        {false && <Spinner />}
        {resumeData && jobs && schools && (
          <div key="resume">
            <div>
              <ContactInfo 
                firstName={resumeData.firstName} 
                lastName={resumeData.lastName} 
                email='{resume.email}'
                phone={resumeData.phone}/>
              <Summary summary={resumeData.objective || 'Fill summary here'}/>
              <Schools schools={schools}/>
              <Jobs jobs={jobs} />
              <Skills skills={resumeData.skills}/>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="submitButton bg-slate-800" 
          onClick={handleSaveAsPDF}>Download as PDF</button>
      </div>
    </div>
  );    
}
  
