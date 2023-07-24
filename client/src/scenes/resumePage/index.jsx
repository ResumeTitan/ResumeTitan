import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useReactToPrint } from 'react-to-print';
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
  const [editing, setEditing] = useState(false);

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

  const generatePDF = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: 'Resume',
    pageStyle: '@page { size: A4; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }',
    onAfterPrint: () => {console.log('printed')}
  });

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
    <div className="m-2 content-center justify-center items-center">
      {/* TODO add edit mode */}
      {/* <div className="flex justify-center items-center m-4">
        <label class="inline-flex relative items-center mr-5 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={editing}
          readOnly
        />
        <div
          onClick={() => {
            setEditing(!editing);
          }}
          className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Edit Mode</span>
        </label>
      </div> */}
      <div className="flex justify-center items-center">
      <div className={`font-serif border-2 aspect-[1/1.4142] h-[297mm] flex bg-white p-2`} ref={resumeRef}>
        {isLoading && <Spinner />}
        {resume && (
          <div>
            <div>
              <ContactInfo 
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                phone={resume.phone}
                editing={editing}
              />
              <Summary summary={resume.objective || 'Fill summary here'} editing={editing}/>
              <Schools schools={resume.schools} editing={editing}/>
              <Jobs jobs={resume.jobs} editing={editing}/>
              <Skills skills={resume.skills} editing={editing}/>
            </div>
          </div>
        )}
      </div>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="submitButton bg-slate-800" 
          onClick={generatePDF}>Download as PDF</button>
      </div>
    </div>
  );    
}
  
export default ResumePage;
