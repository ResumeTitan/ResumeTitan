import React from 'react';
import styled from 'styled-components';
import { SkillType } from 'types/types';

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

const SkillsSection = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-bottom: 1mm;
`;

const Skills: React.FC<{ skills: SkillType[] }> = ({ skills = [] }) => {

  if (!skills || skills.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Skills</SectionTitle>
      {skills.map((skill, index) => (
        <SkillsSection key={index}>
          <b>{skill.name}{skill.keywords.length > 0 ? ':' : ''}</b> {skill.keywords && skill.keywords.length > 0 ? skill.keywords.join(', ') : ''}
        </SkillsSection>
      ))}
    </Section>
  );
};

export default Skills; 