import React from "react";
import { SkillType } from "types/types";
import styled from "styled-components";
import { SectionContent, SectionBlock, SectionName } from './Partials';

interface SkillsProps {
  skills: SkillType[];
}

const SkillBlock = styled.div`
  margin-bottom: 0.1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.1rem;
`;

const SkillsComponent: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div>
      <SectionBlock>
        <SectionName>
          <span>SKILLS</span>
        </SectionName>
        <SectionContent>
          {skills.map((skill, index) => (
            <SkillBlock key={index}>
              <div>
                <span className="title">
                  {skill.name && skill.name}
                </span>
              </div>
              <div>
                {skill.keywords.length > 0 && (
                  <>
                    {skill.keywords.map((keyword, idx) => (
                      <span key={idx}>
                        {keyword}
                        {idx < skill.keywords.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </SkillBlock>
          ))}
        </SectionContent>
      </SectionBlock>
    </div>
  );
};

export default SkillsComponent;
