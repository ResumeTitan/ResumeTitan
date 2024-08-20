import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { ReferenceType } from 'types/types';

const Name = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 5px;
`;

const Reference = styled.p``;

interface ReferencesProps {
  references?: ReferenceType[];
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  if (!references) {
    return null;
  }

  return (
    <div>
      <Section title="References">
        {references.map((r, key) => (
          <div key={key} style={{ marginBottom: '15px' }}>
            <Name>{r.name}</Name>
            <Reference>{r.reference}</Reference>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default References;
