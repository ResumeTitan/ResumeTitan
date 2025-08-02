import React from 'react';
import styled from 'styled-components';
import { WorkType } from 'types/types';
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

const Work: React.FC<{ work: WorkType[] }> = ({ work = [] }) => {

  if (!work || work.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Professional Experience</SectionTitle>
      {work.map((job, i) => (
        <div key={i}>
          <JobHeader>
            <span>{job.name}</span>
          </JobHeader>
          <JobSubHeader>
            <span>{job.position}</span>
            <span>
              {job.startDate ? ` ${formatDate(job.startDate)}` : ''} {job.endDate ? ` - ${formatDate(job.endDate)}` : ''} {job.endDateCurrent ? ' - Present' : ''}
            </span>
          </JobSubHeader>
          {job.highlights && job.highlights.length > 0 && (
            <Bullets>
              {job.highlights.map((hl, j) => (
                <Bullet key={j}>{hl}</Bullet>
              ))}
            </Bullets>
          )}
        </div>
      ))}
    </Section>
  );
};

export default Work; 