import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { AwardType } from 'types/types';

interface AwardsProps {
  awards?: AwardType[];
}

const Awards: React.FC<AwardsProps> = ({ awards }) => {
  if (!awards) {
    return null;
  }

  return (
    <div>
      <Section title="Awards">
        {awards.map((a, key) => (
          <Experience
            title={a.title}
            subTitle={a.awarder}
            date={a.date}
            summary={a.summary}
            key={key}
          />
        ))}
      </Section>
    </div>
  );
};

export default Awards;
