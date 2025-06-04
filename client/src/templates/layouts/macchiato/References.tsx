import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { ReferenceType } from 'types/types';

interface ReferencesProps {
  references: ReferenceType[];
}

const ReferencesSection = styled.div`
  margin-bottom: 20px;
`;

const References: React.FC<ReferencesProps> = ({ references }) => {
  if (!references || !references.length) return null;

  return (
    <ReferencesSection>
      <Section title="References">
        {references.map((reference, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontFamily: '"Lato", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              margin: '0 0 8px 0'
            }}>
              {reference.name}
            </h4>
            {reference.reference && (
              <p style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                lineHeight: '1.4',
                margin: '0',
                fontStyle: 'italic'
              }}>
                "{reference.reference}"
              </p>
            )}
          </div>
        ))}
      </Section>
    </ReferencesSection>
  );
};

export default References; 