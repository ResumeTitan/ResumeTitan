import React from 'react';
import { ResumeType } from 'types/types';
import styled from 'styled-components';
import { formatDate } from '../../../utils';
import Basics from './Basics';
import Education from './Education';
import Work from './Work';
import Volunteer from './Volunteer';
import Projects from './Projects';
import Awards from './Awards';
import Skills from './Skills';
import Interests from './Interests';
import Languages from './Languages';
import References from './References';
import Certificates from './Certificates';
import Publications from './Publications';

const Container = styled.div`
  background: white;
  padding: 10mm 8mm 8mm 8mm;
  font-family: 'Georgia', 'Times New Roman', Times, serif;
  color: #222;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 10pt;
  line-height: 1.2;
  margin: 0 auto;
  
  @media print {
    width: 210mm;
    margin: 0;
    padding: 10mm 8mm 8mm 8mm;
  }
`;

const sectionComponents = {
  Basics: Basics,
  Education: Education,
  Work: Work,
  Volunteer: Volunteer,
  Projects: Projects,
  Awards: Awards,
  Skills: Skills,
  Interests: Interests,
  Languages: Languages,
  References: References,
  Certificates: Certificates,
  Publications: Publications,
};

const StrattonResume: React.FC<{ resume: ResumeType }> = ({ resume }) => {
  return (
    <Container>
      {resume.sections.map((section) => {
        const SectionComponent = sectionComponents[section as keyof typeof sectionComponents];
        if (SectionComponent) {
          return <SectionComponent key={section} {...resume} />;
        }
        return null;
      })}
    </Container>
  );
};

export default StrattonResume; 