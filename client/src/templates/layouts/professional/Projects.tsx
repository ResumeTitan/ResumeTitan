import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { ProjectType } from 'types/types';

// Define the props for the Work component
interface WorkProps {
  projects: ProjectType[] | null;
}

const Work: React.FC<WorkProps> = ({ projects }) => {
  if (!projects) {
    return null;
  }

  return (
    <div>
      <Section title="Projects">
        {projects.map((w, key) => (
          <Experience
            title={w.name}
            startDate={w.startDate}
            endDate={w.endDate}
            summary={w.description}
            highlights={w.highlights}
            key={key}
          />
        ))}
      </Section>
    </div>
  );
};

export default Work;
