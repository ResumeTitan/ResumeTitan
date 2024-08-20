import React from 'react';
import Basics from './Basics';
import ResumeHeader from './ResumeHeader';
import styled from 'styled-components';
import { ResumeTypeProps } from 'types/types';

// Define styled components
const Page = styled.main`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ResumeContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const LeftColumn = styled.aside`
  flex: 1;
  max-width: 30%;
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

const Skills = () => (
  <section>
    {/* Implement the skills content here */}
  </section>
);

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

const Work = () => (
  <section>
    {/* Implement the work content here */}
  </section>
);

const Projects = () => (
  <section>
    {/* Implement the projects content here */}
  </section>
);

const Education = () => (
  <section>
    {/* Implement the education content here */}
  </section>
);

const Volunteer = () => (
  <section>
    {/* Implement the volunteer content here */}
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
    <Page id="resume" className="page">
      <ResumeHeader basics={ resume.basics }/>
      <ResumeContent className="resume-content">
        <LeftColumn className="left-column">
          <Basics basics={ resume.basics }/>
          <Skills />
          <Languages />
          <Interests />
        </LeftColumn>
        <RightColumn className="right-column">
          <Summary />
          <Work />
          <Projects />
          <Education />
          <Volunteer />
          <Awards />
          <Publications />
          <References />
        </RightColumn>
      </ResumeContent>
    </Page>
  );
};

export default Resume;
