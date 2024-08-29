import React from "react";
import { formatDate } from '../../../../utils';
import { EducationType } from "types/types";
import { SectionContent, SectionBlock, SectionName } from './Partials';

interface Props {
  education: EducationType[];
}

const EducationComponent: React.FC<Props> = ({ education }) => {
  return (
    <>
      {education.length > 0 && (
        <>
          <SectionBlock>
            <SectionName>
              <span>EDUCATION</span>
            </SectionName>
            <SectionContent>
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
                    {edu.studyType && <>{edu.studyType} - </>}
                    {edu.area}
                    {edu.score && `, GPA: ${edu.score}`}
                  </div>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="highlights">
                      {edu.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </SectionContent>
          </SectionBlock>
        </>
      )}
    </>
  );
};

export default EducationComponent;
