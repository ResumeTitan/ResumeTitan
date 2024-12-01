import React from 'react';
import OnePageResume from './layouts/onepage';
import ProfessionalResume from './layouts/professional/Resume';
import MacchiatoResume from './layouts/macchiato/Resume';
import { ResumeTypeProps } from 'types/types';
import styled from 'styled-components';

const aspectRatio = 210 / 296;

const StyledContainer = styled.div`
  width: 100%;
  min-width: 49.606em; /* 210mm -> ~13.125em (210mm = 793.7px, assuming 1em = 16px) */
  min-height: 69.921em; /* 296mm -> ~18.5em */
  size: 49.606em 69.921em;
  background-color: white;
  margin: 0 auto;

  /* Preserve aspect ratio using a pseudo-element */
  &::before {
    content: "";
    display: block;
    padding-top: calc(100% / ${1 / aspectRatio}); /* Sets height based on width */
  }

  /* Content positioning */
  & > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ScaledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  /* Automatically scale the Paper component to fit */
  @media (max-width: 53.125em) { /* 850px -> 53.125em */
    & > ${StyledContainer} {
      /* Remove transform scaling and let the aspect ratio handle resizing */
    }
  }

  @media (max-height: 68.75em) { /* 1100px -> 68.75em */
    & > ${StyledContainer} {
      /* Remove transform scaling and let the aspect ratio handle resizing */
    }
  }
`;

export default function ResumeContainer({ resume }: ResumeTypeProps) {
  return (
    <ScaledContainer>
      <StyledContainer id={"resume-container-master"}>
        {resume.theme === "harvard" && <ProfessionalResume resume={resume} />}
        {resume.theme === "one-page" && <OnePageResume resume={resume} />}
        {resume.theme === "professional" && <ProfessionalResume resume={resume} />}
        {resume.theme === "macchiato" && <MacchiatoResume resume={resume} />}
        {/* Default */}
        {resume.theme === "" && <ProfessionalResume resume={resume} />}
      </StyledContainer>
    </ScaledContainer>
  );
};
