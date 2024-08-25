import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import Subsection from './Subsection';
import Subsubsection from './Subsubsection';
import { HighlightItem, HighlightsList } from './Resume';
import { WorkType } from 'types/types';

interface ExperienceProps {
  work: WorkType[];
}

const WorkContainer = styled.div`
  padding: 10px;
`;

const Item = styled.section`
  margin-bottom: 20px;
`;

const Summary = styled.p`
  font-size: 14px;
  margin-bottom: 12px;
`;

const Experience: React.FC<ExperienceProps> = ({ work }) => {
  return (
    <>
      {work.length > 0 && (
        <WorkContainer>
          <Section title={"Experience"} >
            {work.map((job, index) => (
              <Item key={index}>
                <Subsection title={job.name} />

                {job.position && <Subsubsection title={job.position } />}

                {job.summary && <Summary>{job.summary}</Summary>}

                {job.highlights && job.highlights.length > 0 && (
                  <HighlightsList>
                    {job.highlights.map((highlight, idx) => (
                      <HighlightItem key={idx}>{highlight}</HighlightItem>
                    ))}
                  </HighlightsList>
                )}
              </Item>
            ))}
          </Section>
        </WorkContainer>
      )}
    </>
  );
};

export default Experience;
