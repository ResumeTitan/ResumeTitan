import React from 'react';
import styled from 'styled-components';

const Subsection = styled.div`
  h4 {
    font-family: "Lato", Helvetica, Arial, sans-serif;
    font-weight: 300;
    font-size: 14px;
  }

  h4.bold {
    font-weight: 700;
  }
`;

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  children?: React.ReactNode;
}

const SubsubsectionComponent: React.FC<SectionComponentProps> = ({ title, children }) => {
  return (
    <Subsection>
      {title && (
        <>
          <h4>{title}</h4>
        </>
      )}
      <h4>
        {children}
      </h4>
    </Subsection>
  );
};

export default SubsubsectionComponent;
