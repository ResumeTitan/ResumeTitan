import React from 'react';
import styled from 'styled-components';
import Section from './Section';

// Styled component
const Summary = styled.p`
  padding-top: 0.4rem;
  font-size: 1.0rem;
`;

// Define types for the props
interface Basics {
  summary?: string;
}

interface SummaryComponentProps {
  basics: Basics;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({ basics }) => {
  const { summary } = basics;
  
  if (!summary) return null;

  return (
    <Section>
      <div className="secondary">
        <Summary>{summary}</Summary>
      </div>
    </Section>
  );
};

export default SummaryComponent;
