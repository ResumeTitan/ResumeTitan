import React from "react";

// Import necessary components for each section
import Basics from "./partials/basics";
import Education from "./partials/education";
import Skills from "./partials/skills";
import Work from "./partials/work";
// import Publications from "./Publications";
// import Projects from "./Projects";
// import Certificates from "./Certificates";
import Awards from "./partials/Awards";
import Volunteer from "./partials/Volunteer";
// import Languages from "./Languages";
// import Interests from "./Interests";
// import References from "./References";
import { ResumeTypeProps } from "types/types";
import styled from 'styled-components';

const Layout = styled.div`
  max-width: 660px;
  margin: 0 auto;
  line-height: calc(1ex / 0.32);
  margin-top: 40px;
  font-family: "Times New Roman", Times, serif;
  color: black;
`;

const SectionLine = styled.div`
  border-style: dashed;
  border-width: 1px;
  border-color: #CFCFCF;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const sectionComponents = {
  Basics: Basics,
  Education: Education,
  Work: Work,
  Volunteer: Volunteer,
  // Projects: Projects,
  // Certificates: Certificates,
  // Publications: Publications,
  Awards: Awards,
  // Languages: Languages,
  Skills: Skills,
  // Interests: Interests,
  // References: References,
};

// Define the Resume component
const OnePageResume: React.FC<ResumeTypeProps> = ({ resume }) => {
  // Render the Resume component
  return (
    <Layout>
      {resume.sections.map((section) => {
        const SectionComponent = sectionComponents[section as keyof typeof sectionComponents];
        if (SectionComponent) {
          return (
            <div>
              <SectionComponent key={section} {...resume} />
              <SectionLine />
            </div>
          );
        }
        return null;
      })}
    </Layout>
  );
};

export default OnePageResume;
