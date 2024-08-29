import React from 'react';
import OneLineList from './OneLineList';
import Section from './Section';
import { LanguageType } from 'types/types';

interface LanguagesProps {
  languages?: LanguageType[];
}

const Languages: React.FC<LanguagesProps> = ({ languages }) => {
  if (!languages) {
    return null;
  }

  return (
    <div>
      <Section title="Languages">
        {languages.map((l, key) => (
          <OneLineList key={key} name={l.language} items={[l.fluency]} />
        ))}
      </Section>
    </div>
  );
};

export default Languages;
