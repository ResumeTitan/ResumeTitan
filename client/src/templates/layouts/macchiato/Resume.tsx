import React from 'react';
import Basics from './Basics';
import Work from './Work';
import Education from './Education';
import ResumeHeader from './ResumeHeader';
import Volunteer from './Volunteer';
import Skills from './Skills';
import Awards from './Awards';
import Languages from './Languages';
import Interests from './Interests';
import Summary from './Summary';
import Projects from './Projects';
import Publications from './Publications';
import References from './References';
import Certificates from './Certificates';
import styled from 'styled-components';
import { ResumeTypeProps } from 'types/types';

// Define styled components
const Page = styled.main`
  width: 100%;
  min-height: 100%;
  border-top: 12px solid #56817A;
  padding: 36px 22px 30px 34px;
  background-color: #fff;
  color: #000;
`;

const ResumeContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: 'Lato', Helvetica, Arial, sans-serif;
`;

const LeftColumn = styled.aside`
  float: left;
  width: 160px;
  margin-right: 20px;
  word-wrap: break-word;

  flex: 1;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightColumn = styled.div`
  flex: 2;
  max-width: 65%;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Container = styled.div`
  padding: 20px;
`;

export const HighlightsList = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

export const HighlightItem = styled.li`
  margin-bottom: 8px;
  font-size: 12px;
`;

// Define which sections go in the left panel (sidebar)
const leftPanelSections = ['Skills', 'Awards', 'Languages', 'Interests'];

// Define section component mappings
const sectionComponents = {
  Skills: Skills,
  Awards: Awards,
  Languages: Languages,
  Interests: Interests,
  Summary: Summary,
  Work: Work,
  Projects: Projects,
  Education: Education,
  Volunteer: Volunteer,
  Publications: Publications,
  References: References,
  Certificates: Certificates,
};

const Resume: React.FC<ResumeTypeProps> = ({ resume }) => {
  const sections = resume.sections || [
    'Summary', 'Work', 'Projects', 'Education', 
    'Skills', 'Volunteer', 'Awards', 'Languages'
  ];

  // Filter sections for left and right panels
  const leftSections = sections.filter(section => leftPanelSections.includes(section));
  const rightSections = sections.filter(section => !leftPanelSections.includes(section));

  const renderSection = (sectionName: string) => {
    const SectionComponent = sectionComponents[sectionName as keyof typeof sectionComponents];
    if (!SectionComponent) return null;

    // Pass the appropriate props based on section type
    const props = { 
      key: sectionName,
      ...resume 
    };

    return <SectionComponent {...props} />;
  };

  return (
    <Page id="resume">
      <ResumeHeader basics={resume.basics} />
      <ResumeContent>
        <LeftColumn>
          <Basics basics={resume.basics} />
          {leftSections.map(renderSection)}
        </LeftColumn>
        <RightColumn>
          {rightSections.map(renderSection)}
        </RightColumn>
      </ResumeContent>
    </Page>
  );
};

export default Resume;
