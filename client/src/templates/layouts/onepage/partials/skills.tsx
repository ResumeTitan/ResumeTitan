import React from "react";

interface SkillsProps {
  skills: string[];
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
