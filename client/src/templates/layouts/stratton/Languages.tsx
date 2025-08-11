import React from 'react';
import styled from 'styled-components';
import { LanguageType } from 'types/types';

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

const LanguageItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1mm;
  font-size: 10pt;
  line-height: 1.2;
`;

const LanguageName = styled.span`
  font-weight: bold;
`;

const LanguageFluency = styled.span`
  font-style: italic;
`;

const Languages: React.FC<{ languages: LanguageType[] }> = ({ languages = [] }) => {

  if (!languages || languages.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Languages</SectionTitle>
      {languages.map((language, i) => (
        <LanguageItem key={i}>
          <LanguageName>{language.language}</LanguageName>
          <LanguageFluency>{language.fluency}</LanguageFluency>
        </LanguageItem>
      ))}
    </Section>
  );
};

export default Languages; 