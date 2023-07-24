import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { School } from './School';

export const Schools = ({ schools }) => {
  return (
    <SectionWrapper title="Education">
      <ul className="ml-1">
        {schools.map((school, i) => (
          <School key={school.name} school={school} i={i} />
        ))}
      </ul>
    </SectionWrapper>
  );
};

export default Schools;