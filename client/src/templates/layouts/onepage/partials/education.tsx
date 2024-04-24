import React from "react";
import { formatDate } from '../../../../utils';

interface Education {
  institution?: string;
  startDate?: string;
  endDate?: string;
  studyType?: string;
  area?: string;
  gpa?: string;
  content?: string[];
}

interface Props {
  education: Education[];
}

const EducationComponent: React.FC<Props> = ({ education }) => {
  return (
    <>
      {education.length > 0 && (
        <>
          <div className="sectionLine"></div>
          <div id="education" className="sectionBlock">
            <div className="sectionName">
              <span>EDUCATION</span>
            </div>
            <div className="sectionContent">
              {education.map((edu, index) => (
                <div key={index} className="educationBlock">
                  <span className="title">{edu.institution}</span>
                  {edu.startDate && (
                    <span className="date">
                      {formatDate(edu.startDate)} &mdash;{" "}
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </span>
                  )}
                  <div>
                    {edu.studyType && <>{edu.studyType} </>}
                    - {edu.area}
                    {edu.gpa && `, GPA: ${edu.gpa}`}
                  </div>
                  {edu.content && edu.content.length > 0 && (
                    <ul className="highlights">
                      {edu.content.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EducationComponent;
