import React from 'react';
import { SectionWrapper } from './sectionWrapper';

const JobSection = ({ jobs }) => {
  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-1">
        {jobs.map((job, i) => (
          <li key={job.name} className={i % 2 ? `mt-1` : `mt-half`}>
          <div className="flex">
            <div className="font-bold">
              {job.name}
            </div>
            <span className="ml-auto text-muted">{job.date}</span>
          </div>
          <div className="flex">
            <h3>
              {job.degree}, {job.major}
            </h3>
            <span className="ml-auto text-muted">{job.location}</span>
          </div>
          <ul className="list-disc ml-4">
            {job.accomplishments.map((resp) => (
              <li key={resp}>{resp}</li>
            ))}
          </ul>
        </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};

export default JobSection;
