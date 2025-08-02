import React from 'react';
import styled from 'styled-components';
import { EducationType } from 'types/types';
import { formatDate } from '../../../utils';

const Section = styled.div`
  margin-top: 4mm;
`;

const SectionTitle = styled.div`
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2mm;
  border-bottom: 1pt solid #222;
  padding-bottom: 1mm;
  line-height: 1.2;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const JobSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 10pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const Bullets = styled.ul`
  margin: 1mm 0 1mm 3mm;
  padding: 0;
  list-style-type: disc;
`;

const Bullet = styled.li`
  margin-bottom: 1mm;
  font-size: 9pt;
  line-height: 1.3;
`;

const Small = styled.span`
  font-size: 9pt;
  line-height: 1.2;
`;

const Education: React.FC<{ education: EducationType[] }> = ({ education = [] }) => {

  if (!education || education.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Education</SectionTitle>
      {education.map((edu, i) => (
        <div key={i}>
          <JobHeader>
            <span>{edu.institution}</span>
          </JobHeader>
          <JobSubHeader>
            <span>{edu.studyType} {edu.area && <>in {edu.area}</>} </span>
            <span>{edu.endDate ? `Graduated ${formatDate(edu.endDate)}` : ''}</span>
          </JobSubHeader>
          {edu.score && <Small>GPA: {edu.score}</Small>}
          {edu.highlights && edu.highlights.length > 0 && (
            <Bullets>
              {edu.highlights.map((hl, j) => (
                <Bullet key={j}>{hl}</Bullet>
              ))}
            </Bullets>
          )}
        </div>
      ))}
    </Section>
  );
};

export default Education; 