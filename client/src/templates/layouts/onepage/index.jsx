import React from "react";
import './style.css';

// Import necessary components for each section
import Basics from "./partials/basics";
import Education from "./partials/education";
import Skills from "./partials/skills";
import Work from "./partials/work";
// import Publications from "./Publications";
// import Projects from "./Projects";
// import Certificates from "./Certificates";
// import Awards from "./Awards";
// import Volunteer from "./Volunteer";
// import Languages from "./Languages";
// import Interests from "./Interests";
// import References from "./References";

// Define the Resume component
export function OnePageResume({ resume }) {
  // Destructure resume object
  const { basics } = resume;

  // Render the Resume component
  return (
    <div id="resume">
      <Basics basics={basics} />
      <Education education={resume.education} />
      <Work work={resume.work} />
      <Skills skills={resume.skills} />
      {/* <Publications publications={resume.publications} />
      <Projects projects={resume.projects} />
      <Certificates certificates={resume.certificates} />
      <Awards awards={resume.awards} />
      <Volunteer volunteer={resume.volunteer} />
      <Languages languages={resume.languages} />
      <Interests interests={resume.interests} />
      <References references={resume.references} /> */}
    </div>
  );
};
