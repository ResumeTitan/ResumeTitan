import React from 'react';
import { SectionWrapper } from './SectionWrapper';

import "../scenes/resumePage/index.css";

export const Schools = ({ schools }) => {
  return (
    <SectionWrapper title="Schools">
      <ul className="ml-1">
        {schools.map((school, i) => (
          <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <h2>
                {school.name}
              </h2>
              <span className="ml-auto text-muted">{school.startDate}</span>
            </div>
            <div className="flex">
              <h3>
                {school.degree}, {school.major}
              </h3>
              <span className="ml-auto text-muted">{school.location}</span>
            </div>
            <ul className="list-disc ml-4">
              {school.accomplishments.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};