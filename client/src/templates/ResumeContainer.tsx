import React, { forwardRef, useEffect } from 'react';
import OnePageResume from './layouts/onepage';
import ProfessionalResume from './layouts/professional/Resume';
import MacchiatoResume from './layouts/macchiato/Resume';
import StudentClassicResume from './layouts/studentClassic/StudentClassicResume';
import AcademicModernResume from './layouts/academicModern/AcademicModernResume';
import { ResumeTypeProps } from 'types/types';
import styled from 'styled-components';

interface ScaledContainerProps {
  $scale?: number;
}

interface ResumeContainerProps extends ResumeTypeProps {
  onOverflowChange?: (hasOverflow: boolean) => void;
}

const StyledContainer = styled.div`
  width: 210mm;
  height: 297mm;
  background-color: white;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: top left;

  @media print {
    box-shadow: none;
    width: 210mm;
    height: 297mm;
    transform: none;
  }
`;

const ScaledContainer = styled.div<ScaledContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  overflow: auto;
  background-color: #f5f5f5;

  @media screen {
    & > ${StyledContainer} {
      transform: scale(${props => props.$scale || 1});
    }
  }

  @media print {
    padding: 0;
    overflow: visible;
    background-color: white;
    
    & > ${StyledContainer} {
      transform: none;
      width: 210mm;
      height: 297mm;
    }
  }
`;

const ResumeContainer = forwardRef<HTMLDivElement, ResumeContainerProps>(({ resume, onOverflowChange }, ref) => {
  // Calculate scale based on container width while maintaining A4 aspect ratio
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Check for content overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (ref && 'current' in ref && ref.current) {
        const contentHeight = ref.current.scrollHeight;
        const containerHeight = ref.current.clientHeight;
        const hasOverflow = contentHeight > containerHeight;
        
        if (onOverflowChange) {
          onOverflowChange(hasOverflow);
        }
      }
    };

    // Check overflow after initial render and on content changes
    checkOverflow();
    
    // Set up a ResizeObserver to check for overflow when content changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (ref && 'current' in ref && ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resume, onOverflowChange, ref]);

  // Update scale on window resize - maintain A4 aspect ratio
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 40; // Account for padding
        const containerHeight = containerRef.current.clientHeight - 40; // Account for padding
        
        // A4 dimensions: 210mm x 297mm (aspect ratio: 1:1.414)
        const a4Width = 210; // mm
        const a4Height = 297; // mm
        const a4AspectRatio = a4Height / a4Width; // 1.414
        
        // Calculate scale based on width
        const scaleByWidth = containerWidth / a4Width;
        
        // Calculate scale based on height
        const scaleByHeight = containerHeight / a4Height;
        
        // Use the smaller scale to ensure the entire A4 page fits
        const newScale = Math.min(scaleByWidth, scaleByHeight, 1); // Don't scale up beyond 1
        
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <ScaledContainer ref={containerRef} $scale={scale}>
      <StyledContainer ref={ref}>
        {resume.theme === "harvard" && <ProfessionalResume resume={resume} />}
        {resume.theme === "one-page" && <OnePageResume resume={resume} />}
        {resume.theme === "professional" && <ProfessionalResume resume={resume} />}
        {resume.theme === "macchiato" && <MacchiatoResume resume={resume} />}
        {resume.theme === "student-classic" && <StudentClassicResume resume={resume} />}
        {resume.theme === "academic-modern" && <AcademicModernResume resume={resume} />}
        {/* Default */}
        {resume.theme === "" && <ProfessionalResume resume={resume} />}
      </StyledContainer>
    </ScaledContainer>
  );
});

ResumeContainer.displayName = 'ResumeContainer';

export default ResumeContainer;
