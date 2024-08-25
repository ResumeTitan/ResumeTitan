import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import Subsection from './Subsection';
import Subsubsection from './Subsubsection';
import { Container } from './Resume';

interface Volunteer {
  organization: string;
  position?: string;
  summary?: string;
  highlights?: string[];
  website?: string;
}

interface VolunteerProps {
  volunteer: Volunteer[];
}

const Item = styled.section`
  margin-bottom: 15px;
`;

const Summary = styled.p`
  font-size: 11px;
  margin: 5px 0;
`;

const HighlightsList = styled.ul`
  padding-left: 25px;
  margin: 10px 0 0;
  list-style: none;
`;

const HighlightItem = styled.li`
  margin-bottom: 3px;
  font-size: 11px;
`;

const VolunteerExperience: React.FC<VolunteerProps> = ({ volunteer }) => {
  return (
    <>
      {volunteer.length > 0 && (
        <Container>
          <Section title="Volunteer">
            {volunteer.map((vol, index) => (
              <Item key={index}>
                <Subsection title={ vol.organization }/>
                {vol.position && <Subsubsection>{vol.position}</Subsubsection>}
                {vol.summary && <Summary>{vol.summary}</Summary>}
                {vol.highlights && vol.highlights.length > 0 && (
                  <HighlightsList>
                    {vol.highlights.map((highlight, idx) => (
                      <HighlightItem key={idx}>{highlight}</HighlightItem>
                    ))}
                  </HighlightsList>
                )}
              </Item>
            ))}
          </Section>
        </Container>
      )}
    </>
  );
};

export default VolunteerExperience;
