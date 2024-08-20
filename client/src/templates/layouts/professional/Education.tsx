import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { EducationType } from 'types/types';

interface EducationProps {
  education: EducationType[]
}

const Education: React.FC<EducationProps> = ({ education }) => {
  if (!education) {
    return null;
  }

  return (
    <div>
      <Section title="Education">
        {education.map((e, key) => {
          let subTitle = e.area ? `${e.studyType} in ${e.area}` : e.studyType;

          if (e.score) {
            subTitle = `${subTitle} (${e.score})`;
          }

          return (
            <Experience
              title={e.institution}
              subTitle={subTitle}
              startDate={e.startDate}
              endDate={e.endDate}
              highlights={e.highlights}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Education;
