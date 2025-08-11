import React from 'react';
import styled from 'styled-components';
import { AwardType } from 'types/types';
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

const AwardItem = styled.div`
  margin-bottom: 2mm;
`;

const AwardTitle = styled.div`
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const AwardSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 10pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const AwardSummary = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-left: 2mm;
`;

const Awards: React.FC<{ awards: AwardType[] }> = ({ awards = [] }) => {

  if (!awards || awards.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Awards</SectionTitle>
      {awards.map((award, i) => (
        <AwardItem key={i}>
          <AwardTitle>{award.title}</AwardTitle>
          <AwardSubHeader>
            <span>{award.awarder}</span>
            <span>{award.date ? formatDate(award.date) : ''}</span>
          </AwardSubHeader>
          {award.summary && <AwardSummary>{award.summary}</AwardSummary>}
        </AwardItem>
      ))}
    </Section>
  );
};

export default Awards; 