import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Section = styled.div`
  max-width: 700px;

  h2 {
    font-family: "Josefin Sans", Helvetica, Arial, sans-serif;
    font-weight: 800;
    font-size: 16px;
    letter-spacing: .5px;
  }

  hr {
    width: 45px;
    margin: 8px 0 10px;
    border-top: 1px solid #56817A;
  }
`;

const Container = styled.div`
  margin: 0 8px;
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
