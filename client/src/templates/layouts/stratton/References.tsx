import React from 'react';
import styled from 'styled-components';
import { ReferenceType } from 'types/types';

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

const ReferenceItem = styled.div`
  margin-bottom: 2mm;
`;

const ReferenceName = styled.div`
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const ReferenceText = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-left: 2mm;
  font-style: italic;
`;

const References: React.FC<{ references: ReferenceType[] }> = ({ references = [] }) => {

  if (!references || references.length === 0) return null;

  return (
    <Section>
      <SectionTitle>References</SectionTitle>
      {references.map((reference, i) => (
        <ReferenceItem key={i}>
          <ReferenceName>{reference.name}</ReferenceName>
          <ReferenceText>{reference.reference}</ReferenceText>
        </ReferenceItem>
      ))}
    </Section>
  );
};

export default References; 