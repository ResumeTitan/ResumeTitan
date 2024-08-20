import React from "react";
import { WorkType } from "types/types";
import { formatDate } from '../../../../utils';

interface WorkProps {
  work: WorkType[];
}

const WorkComponent: React.FC<WorkProps> = ({ work }) => {
  return (
    <>
      {work.length > 0 && (
        <div id="workBlock" className="sectionBlock">
          <div className="sectionName">
            <span>EXPERIENCE</span>
          </div>
          <div className="sectionContent">
            {work.map((job, index) => (
              <div key={index} className="jobBlock">
                <div className="blockHeader">
                  <span className="title">{job.name}</span>
                  {job.position && (
                    <>
                      {" | "}
                      <span className="position">{job.position}</span>
                    </>
                  )}
                  {job.startDate && (
                    <span className="date">
                      {formatDate(job.startDate)} &mdash;{" "}
                      {job.endDate ? formatDate(job.endDate) : "Present"}
                    </span>
                  )}
                </div>
                {job.summary && (
                  <div className="summary">
                    <p>{job.summary}</p>
                  </div>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="highlights">
                    {job.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
                {index !== work.length - 1 && <div className="separator"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkComponent;
