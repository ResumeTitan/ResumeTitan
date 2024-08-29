import React from 'react';
import styled from 'styled-components';
import { SkillType } from 'types/types';

interface SkillsProps {
  skills: SkillType[];
}

const SkillsContainer = styled.div`
  .skills-container {
    margin-bottom: 15px;
  }
`;

const SkillSection = styled.section`
  padding-top: 20px;
  margin-bottom: 15px;
`;

const SkillTitle = styled.h3`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.4px;
`;

const SkillLevel = styled.h4`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
`;

const KeywordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Keyword = styled.h6`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 10px;
  margin: 0.15em;
  background: ghostwhite;
  border-radius: 5px;
`;

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  if (!skills.length) return null;

  return (
    <SkillsContainer>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <SkillSection key={index}>
            {skill.name && <SkillTitle>{skill.name}</SkillTitle>}
            {skill.level && <SkillLevel>{skill.level}</SkillLevel>}
            {skill.keywords && skill.keywords.length > 0 && (
              <KeywordsContainer>
                {skill.keywords.map((keyword, idx) => (
                  <Keyword key={idx}>{keyword}</Keyword>
                ))}
              </KeywordsContainer>
            )}
          </SkillSection>
        ))}
      </div>
    </SkillsContainer>
  );
};

export default Skills;
