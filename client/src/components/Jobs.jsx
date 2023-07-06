import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export const Jobs = ({ jobs }) => {
  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-1">
        {jobs.map((job, i) => (
          <li key={job.company} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <h2>
                {job.company}
              </h2>
              <span className="ml-auto text-muted">{job.startDate}</span>
            </div>
            <div className="flex">
              <h3>{job.title}</h3>
              <span className="ml-auto text-muted">{job.location}</span>
            </div>
            <p>{job.notes}</p>
            <ul className="list-disc ml-4">
              {job.responsibilities.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};