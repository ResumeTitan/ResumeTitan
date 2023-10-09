import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useReactToPrint } from 'react-to-print';
import Spinner from "../../../components/Spinner";
import { ContactInfo } from "../../resumePage/ContactInfo";
import { Summary } from "../../resumePage/Summary";
import { Jobs } from "../../resumePage/Jobs";
import { Schools } from "../../resumePage/Schools";
import { Skills}  from "../../resumePage/Skills";
import { getResume } from "../../../api/resume";
import { SchoolSection } from "./schoolSection";

import 'index.css';

/**
 * Resume Page content
 * @param id Resume ID to display
 * @returns Resume page content
 */
function Resume({ resume, viewing, scale, show, onView }) {
  const resumeRef = React.useRef();  
  const schools = useSelector(state => state.schools);  
  const showResume = viewing || show;

  return (
    <div id="resumepreview" 
      className="sidebar:flex grow overflow-auto scroll-smooth"
      style={{display: showResume ? "flex" : "none"}}
    >
      <div>
      <div ref={resumeRef} className={`${viewing ? "" : "cursor-zoom-in origin-top-left"}`} style={{ transform: `scale(${scale})` }} onClick={onView}>
        <div className="inline-flex">
          <div style={{
            height: "279.44mm",
            minHeight: "279.44mm",
            width: "215.9mm",
            minWidth: "215.9mm",
            position: "relative",
            backgroundColor: "white",
            overflow: "hidden",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
          }}
          >
            <ContactInfo 
              firstName={"user.firstName"}
              lastName={"user.lastName"}
              email={"user.email"}
              phone={"resume.phone"}
              editing={false}
            />
              {schools && <SchoolSection schools={schools}/>}
          {/* <Summary summary={"resume.objective" || 'Fill summary here'} editing={editing}/>
          
          <Jobs jobs={"resume.jobs"} editing={editing}/>
          <Skills skills={"resume.skills"} editing={editing}/> */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
  
export default Resume;
