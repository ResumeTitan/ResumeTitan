import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { WorkType } from 'types/types';

// Define the props for the Work component
interface WorkProps {
  work: WorkType[] | null;  // work can be an array of WorkItem objects or null
}

const Work: React.FC<WorkProps> = ({ work }) => {
  if (!work) {
    return null;
  }

  return (
    <div>
      <Section title="Experience">
        {work.map((w, key) => (
          <Experience
            title={w.position}
            subTitle={w.name}
            startDate={w.startDate}
            endDate={w.endDate}
            summary={w.summary}
            highlights={w.highlights}
            key={key}
          />
        ))}
      </Section>
    </div>
  );
};

export default Work;
