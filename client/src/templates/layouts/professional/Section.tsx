import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Section = styled.div`
  width: 100%;
  margin: 0 auto 18px;

  h2 {
    margin: 0;
    padding: 0;
    margin-bottom: 3px;
    font-weight: 600;
    font-size: 20px;
  }

  hr {
    margin: 0;
    padding: 0;
    margin-top: 7px;
    margin-bottom: 3px;
  }
`;

const Container = styled.div`
  margin: 0;
  width: 100%;
`;

// Define the props interface for SectionComponent
interface SectionComponentProps {
  children: ReactNode;
  title?: string;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ children, title }) => {
  return (
    <Section>
      {title && (
        <>
          <h2>{title}</h2>
          <hr />
        </>
      )}
      <Container>{children}</Container>
    </Section>
  );
};

export default SectionComponent;
