import React from "react";
import { SkillType } from "types/types";
import '../style.css';

interface SkillsProps {
  skills: SkillType[];
}

const SkillsComponent: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div>
      <div id="skills" className="sectionBlock">
        <div className="sectionName">
          <span>SKILLS</span>
        </div>
        <div className="sectionContent">
          {skills.map((skill, index) => (
            <div className="skillBlock" key={index}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsComponent;
