import React from "react";

interface Skill {
  name?: string;
  level?: string;
  keywords?: string[];
  details?: { text?: string; comment?: string }[];
}

interface SkillsProps {
  skills: Skill[];
}

const SkillsComponent: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <>
      {skills.length > 0 && (
        <>
          <div className="sectionLine"></div>
          <div id="skills" className="sectionBlock">
            <div className="sectionName">
              <span>SKILLS</span>
            </div>
            <div className="sectionContent">
              <ul className="skillBlock">
              {skills.map((skill, index) => (
                  <span key={index}>
                    <li className="skill">{skill}</li>
                  </span>
              ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SkillsComponent;
