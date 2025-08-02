import React from 'react';
import styled from 'styled-components';
import { InterestType } from 'types/types';

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

const InterestItem = styled.div`
  margin-bottom: 2mm;
`;

const InterestName = styled.div`
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const InterestKeywords = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-left: 2mm;
`;

const Interests: React.FC<{ interests: InterestType[] }> = ({ interests = [] }) => {

  if (!interests || interests.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Interests</SectionTitle>
      {interests.map((interest, i) => (
        <InterestItem key={i}>
          <InterestName>{interest.name}</InterestName>
          {interest.keywords && interest.keywords.length > 0 && (
            <InterestKeywords>{interest.keywords.join(', ')}</InterestKeywords>
          )}
        </InterestItem>
      ))}
    </Section>
  );
};

export default Interests; 