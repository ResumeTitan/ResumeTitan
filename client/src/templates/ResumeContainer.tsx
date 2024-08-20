import React from 'react';
import OnePageResume from './layouts/onepage';
import ProfessionalResume from './layouts/professional/Resume';
import MacchiatoResume from './layouts/macchiato/Resume';
import { ResumeTypeProps } from 'types/types';
import styled from 'styled-components';

// Define the styled component
const StyledContainer = styled.div`
  width: 210mm;
  height: 296mm;
  background-color: white;
  margin: 0 auto;
`;

export default function ResumeContainer({ resume } : ResumeTypeProps) {
  return (
    <>
      <StyledContainer id={"resume-container-master"}>
        { resume.theme === "harvard" && (
          <ProfessionalResume resume={ resume } />
        )}
        { resume.theme === "one-page" && (
          <OnePageResume resume={ resume }/>
        )}
        { resume.theme === "professional" && (
          <ProfessionalResume resume={ resume } />
        )}
        {/* { resume.theme === "harvard" && (
          <MacchiatoResume resume={ resume } />
        )} */}
        {/* Default */}
        { resume.theme === "" && (
          <MacchiatoResume resume={ resume } />
        )}
      </StyledContainer>
    </>
  );
};
