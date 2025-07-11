import React from 'react';
import styled from 'styled-components';
import { LanguageType } from 'types/types';

interface LanguagesProps {
  languages: LanguageType[];
}

const LanguagesContainer = styled.div`
  .languages-container {
    margin-bottom: 15px;
  }
`;

const LanguageSection = styled.section`
  padding-top: 20px;
  margin-bottom: 15px;
`;

const LanguageName = styled.h3`
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`;

const LanguageFluency = styled.h4`
  font-weight: 400;
  font-size: 11px;
  color: #666;
  text-transform: capitalize;
`;

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  if (!languages || !languages.length) return null;

  return (
    <LanguagesContainer>
      <div className="languages-container">
        {languages.map((language, index) => (
          <LanguageSection key={index}>
            {language.language && <LanguageName>{language.language}</LanguageName>}
            {language.fluency && <LanguageFluency>{language.fluency}</LanguageFluency>}
          </LanguageSection>
        ))}
      </div>
    </LanguagesContainer>
  );
};

export default Languages; 