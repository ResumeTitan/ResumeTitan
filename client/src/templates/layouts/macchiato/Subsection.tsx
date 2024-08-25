import React from 'react';
import styled from 'styled-components';

const Subsection = styled.div`
  h3 {
    font-family: "Lato", Helvetica, Arial, sans-serif;
    font-weight: 300;
    font-size: 20px;
    letter-spacing: .4px;
  }

  h3.bold {
    font-weight: 700;
  }
`;

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
}

const SubsectionComponent: React.FC<SectionComponentProps> = ({ title }) => {
  return (
    <Subsection>
      {title && (
        <>
          <h3>{title}</h3>
        </>
      )}
    </Subsection>
  );
};

export default SubsectionComponent;
