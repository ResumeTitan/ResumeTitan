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

// Define the mapping of component keys to components
const componentMap = {
  basics: Basics,
  education: Education,
  work: Work,
  skills: Skills,
  // publications: Publications,
  // projects: Projects,
  // certificates: Certificates,
  // awards: Awards,
  // volunteer: Volunteer,
  // languages: Languages,
  // interests: Interests,
  // references: References,
};

// Define the Resume component
export function OnePageResume({ resume, order }) {
  // Render the Resume component
  return (
    <div id="resume">
      {order.map((key) => {
        const Component = componentMap[key];
        if (!Component) return null;
        return <Component key={key} {...resume} />;
      })}
    </div>
  );
};
