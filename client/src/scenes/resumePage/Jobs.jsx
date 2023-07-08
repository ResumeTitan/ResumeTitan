import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';

import "index.css";

export const Jobs = ({ jobs }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(jobs[0].title);

  const handleDivClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setText(e.target.innerText);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <SectionWrapper title="Work Experience">
      <ul className="ml-1">
        {jobs.map((job, i) => (
          <li key={job.company} className={i % 2 ? `mt-1` : `mt-half`}>
            <div className="flex">
              <div className="font-bold">
                {job.company}
              </div>
              <span className="ml-auto text-muted">{job.startDate}</span>
            </div>
            <div className="flex ">
              <div className={`hover:border-gray-700 border-transparent border-2 ${isEditing ? 'bg-yellow-100' : ''}`}
                onClick={handleDivClick}
                onBlur={handleBlur}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
              >
                {/* {job.title} */}
                {text}
              </div>
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