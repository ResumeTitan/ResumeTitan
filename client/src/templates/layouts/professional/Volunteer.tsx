import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { VolunteerType } from 'types/types';

interface VolunteerProps {
  volunteer: VolunteerType[]
}

const Volunteer: React.FC<VolunteerProps> = ({ volunteer }) => {
  if (!volunteer) {
    return null;
  }

  return (
    <div>
      <Section title="Volunteer">
        {volunteer.map((e, key) => {
          // let subTitle = e.area ? `${e.studyType} in ${e.area}` : e.studyType;

          // if (e.score) {
          //   subTitle = `${subTitle} (${e.score})`;
          // }

          return (
            <Experience
              title={e.position}
              subTitle={e.organization}
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

export default Volunteer;
