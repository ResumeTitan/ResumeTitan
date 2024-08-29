import React from 'react';
import OneLineList from './OneLineList';
import Section from './Section';

interface Skill {
  name: string;
  keywords: string[];
}

interface SkillsProps {
  skills?: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  if (!skills) {
    return null;
  }

  return (
    <div>
      <Section title="Skills">
        {skills.map((w, key) => (
          <OneLineList key={key} name={w.name} items={w.keywords} />
        ))}
      </Section>
    </div>
  );
};

export default Skills;
