import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { ContactInfo } from "./ContactInfo";
import { Summary } from "./Summary";
import { Jobs } from "./Jobs";
import { Schools } from "./Schools";
import { Skills}  from "./Skills";
import { getResume } from "../../api/resume";

import 'index.css';

const MED_SCREEN_WIDTH = 768;

/**
 * Resume Page content
 * @param id Resume ID to display
 * @returns Resume page content
 */
function ResumePage() {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const resumeRef = React.useRef();
  
  const [showAlert, setShowAlert] = useState(false);
  const [ackAlert, setAckAlert] = useState(false);
  const [resume, setResume] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log()
        const response = await getResume(token, user._id);
        setResume(response.resume);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
    console.log(resume);
    
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
        image: { type: 'jpeg', quality: 0.99 },
        html2canvas: { scale: 1 },
        // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // html2pdf().set(opt).from(element).save();
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

  return (
    <div className="m-2">
      <div className="font-serif aspect-[1/1.4142] border-2 h-[297mm] flex bg-white" ref={resumeRef}>
        {isLoading && <Spinner />}
        {resume && (
          <div>
            <div>
              <ContactInfo 
                firstName={user.firstName} 
                lastName={user.lastName} 
                email={user.email}
                phone={resume.phone}/>
              <Summary summary={resume.objective || 'Fill summary here'}/>
              <Schools schools={resume.schools}/>
              <Jobs jobs={resume.jobs} />
              <Skills skills={resume.skills}/>
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
  
export default ResumePage;
