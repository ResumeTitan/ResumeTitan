import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { Job } from './Job';

import "index.css";

export const Jobs = ({ jobs }) => {
  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-1">
        {jobs.map((job, i) => (
          <Job key={job.company} job={job} i={i} />
        ))}
      </ul>
    </SectionWrapper>
  );
};