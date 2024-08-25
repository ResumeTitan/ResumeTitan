import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import Subsection from './Subsection';
import Subsubsection from './Subsubsection';
import { HighlightItem, HighlightsList } from './Resume';
import { EducationType } from 'types/types';

const Container = styled.div`
  padding: 20px;
`;

const Item = styled.section`
  margin-bottom: 20px;
`;

const SectionHeader = styled.h3`
  font-size: 1.5em;
  margin-bottom: 5px;
`;

const Location = styled.h5`
  font-size: 1em;
  color: #555;
`;

const Study = styled.h4`
  font-size: 1.2em;
  margin-top: 10px;
`;

const GPA = styled.h5`
  font-size: 1em;
  color: #888;
`;

const Specialization = styled.h5`
  font-size: 1em;
  font-style: italic;
`;

const CoursesList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const CourseItem = styled.li`
  font-size: 1em;
  line-height: 1.5;
`;

interface EducationProps {
  education: EducationType[];
}

const Education: React.FC<EducationProps> = ({ education }) => {
  if (!education.length) return null;

  return (
    <Container>
      <Section title={"Experience"} >
      {education.map((edu, index) => (
        <Item key={index}>
          <Subsection title={edu.institution} />
            {/* {edu.location && <Location>{edu.location}</Location>} */}
          <Subsubsection>
            {edu.studyType && `${edu.studyType} `}
            {edu.area && edu.area}
          </Subsubsection>
          {edu.score && <GPA>{edu.score}</GPA>}
          {/* {edu.specialization && (
            <Specialization>{edu.specialization}</Specialization>
          )} */}
          {edu.courses && edu.courses.length > 0 && (
            <CoursesList>
              {edu.courses.map((course, i) => (
                <CourseItem key={i}>{course}</CourseItem>
              ))}
            </CoursesList>
          )}
          {edu.highlights && edu.highlights.length > 0 && (
            <HighlightsList>
              {edu.highlights.map((highlight, idx) => (
                <HighlightItem key={idx}>{highlight}</HighlightItem>
              ))}
            </HighlightsList>
          )}

        </Item>
      ))}
      </Section>
    </Container>
  );
};

export default Education;
