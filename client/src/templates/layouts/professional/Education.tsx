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
          // Format the subtitle based on the type of education
          let subTitle = '';
          
          if (e.studyType) {
            // For professional certifications and trade schools
            if (e.studyType === 'Professional Certification' || e.studyType === 'Trade School' || e.studyType === 'Bootcamp') {
              subTitle = e.area ? `${e.studyType}: ${e.area}` : e.studyType;
            }
            // For high school education
            else if (e.studyType === 'High School Diploma' || e.studyType === 'GED') {
              subTitle = e.studyType;
            }
            // For traditional degrees
            else {
              subTitle = e.area ? `${e.studyType} in ${e.area}` : e.studyType;
            }
          }

          // Add score/GPA if available
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
