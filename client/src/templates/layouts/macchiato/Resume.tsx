import React from 'react';
import Basics from './Basics';
import Work from './Work';
import Education from './Education';
import ResumeHeader from './ResumeHeader';
import Volunteer from './Volunteer';
import Skills from './Skills';
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

const Languages = () => (
  <section>
    {/* Implement the languages content here */}
  </section>
);

const Interests = () => (
  <section>
    {/* Implement the interests content here */}
  </section>
);

const Summary = () => (
  <section>
    {/* Implement the summary content here */}
  </section>
);

const Projects = () => (
  <section>
    {/* Implement the projects content here */}
  </section>
);

const Awards = () => (
  <section>
    {/* Implement the awards content here */}
  </section>
);

const Publications = () => (
  <section>
    {/* Implement the publications content here */}
  </section>
);

const References = () => (
  <section>
    {/* Implement the references content here */}
  </section>
);

const Resume: React.FC<ResumeTypeProps> = ({ resume }) => {
  return (
    <Page id="resume">
      <ResumeHeader basics={ resume.basics }/>
      <ResumeContent>
        <LeftColumn>
          <Basics basics={ resume.basics }/>
          <Skills skills={ resume.skills }/>
          <Languages />
          <Interests />
        </LeftColumn>
        <RightColumn>
          <Summary />
          <Work work={ resume.work } />
          <Projects />
          <Education education={ resume.education }/>
          <Volunteer volunteer={ resume.volunteer }/>
          <Awards />
          <Publications />
          <References />
        </RightColumn>
      </ResumeContent>
    </Page>
  );
};

export default Resume;
