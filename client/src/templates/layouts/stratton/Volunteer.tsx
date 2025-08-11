import React from 'react';
import styled from 'styled-components';
import { VolunteerType } from 'types/types';
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

const Volunteer: React.FC<{ volunteer: VolunteerType[] }> = ({ volunteer = [] }) => {

  if (!volunteer || volunteer.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Volunteer Experience</SectionTitle>
      {volunteer.map((vol, i) => (
        <div key={i}>
          <JobHeader>
            <span>{vol.organization}</span>
          </JobHeader>
          <JobSubHeader>
            <span>{vol.position}</span>
            <span>
              {vol.startDate ? ` ${formatDate(vol.startDate)}` : ''} {vol.endDate ? ` - ${formatDate(vol.endDate)}` : ''} {vol.endDateCurrent ? ' - Present' : ''}
            </span>
          </JobSubHeader>
          {vol.highlights && vol.highlights.length > 0 && (
            <Bullets>
              {vol.highlights.map((hl, j) => (
                <Bullet key={j}>{hl}</Bullet>
              ))}
            </Bullets>
          )}
        </div>
      ))}
    </Section>
  );
};

export default Volunteer; 