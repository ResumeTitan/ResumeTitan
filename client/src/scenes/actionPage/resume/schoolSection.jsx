import React from 'react';
import { SectionWrapper } from './sectionWrapper';

export const SchoolSection = ({ schools }) => {
  return (
    <SectionWrapper title="Education">
      <ul className="ml-1">
        {schools.map((school, i) => (
          <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
          <div className="flex">
            <div className="font-bold">
              {school.name}
            </div>
            <span className="ml-auto text-muted">{school.date}</span>
          </div>
          <div className="flex">
            <h3>
              {school.degree}, {school.major}
            </h3>
            <span className="ml-auto text-muted">{school.location}</span>
          </div>
          {/* <ul className="list-disc ml-4">
            {school.accomplishments.map((resp) => (
              <li key={resp}>{resp}</li>
            ))}
          </ul> */}
        </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};

export default SchoolSection;
