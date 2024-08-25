import React from 'react';
import OnePageResume from './layouts/onepage';
import ProfessionalResume from './layouts/professional/Resume';
import MacchiatoResume from './layouts/macchiato/Resume';
import { ResumeTypeProps } from 'types/types';
import styled from 'styled-components';

// Define the styled component
const StyledContainer = styled.div`
  width: 210mm;
  max-width: 210mm;
  height: 296mm;
  min-height: 296mm;

  background-color: white;
  margin: 0 auto;
`;

const ScaledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  & > ${StyledContainer} {
    transform-origin: top left;
    transform: scale(1);
  }

  /* Automatically scale the Paper component to fit */
  @media (max-width: 850px) {
    & > ${StyledContainer} {
      transform: scale(calc(100vw / 850));
    }
  }

  @media (max-height: 1100px) {
    & > ${StyledContainer} {
      transform: scale(calc(100vh / 1100));
    }
  }
`;

export default function ResumeContainer({ resume } : ResumeTypeProps) {
  return (
    <ScaledContainer>
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
        { resume.theme === "macchiato" && (
          <MacchiatoResume resume={ resume } />
        )}
        {/* Default */}
        { resume.theme === "" && (
          <ProfessionalResume resume={ resume } />
        )}
      </StyledContainer>
    </ScaledContainer>
  );
};
