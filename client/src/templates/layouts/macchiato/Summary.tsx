import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { BasicsType } from 'types/types';

interface SummaryProps {
  basics: BasicsType;
}

const SummarySection = styled.div`
  margin-bottom: 20px;
`;

const Summary: React.FC<SummaryProps> = ({ basics }) => {
  if (!basics?.summary) return null;

  return (
    <SummarySection>
      <Section title="Summary">
        <p style={{
          fontFamily: '"Lato", Helvetica, Arial, sans-serif',
          fontSize: '12px',
          lineHeight: '1.4',
          margin: '0'
        }}>
          {basics.summary}
        </p>
      </Section>
    </SummarySection>
  );
};

export default Summary; 