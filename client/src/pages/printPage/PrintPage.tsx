import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import styled from 'styled-components';
import OnePageResume from '../../templates/layouts/onepage';
import ProfessionalResume from '../../templates/layouts/professional/Resume';
import MacchiatoResume from '../../templates/layouts/macchiato/Resume';
import StudentClassicResume from '../../templates/layouts/studentClassic/StudentClassicResume';
import AcademicModernResume from '../../templates/layouts/academicModern/AcademicModernResume';
import StrattonResume from '../../templates/layouts/stratton/Resume';
import { ResumeType } from '../../types/types';
import api from '../../api/actions';
import Spinner from '../../components/Spinner';

const PrintPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media print {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    min-height: auto !important;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  z-index: 10;
  
  @media print {
    display: none;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #0b3733;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0a2e2a;
  }

  @media print {
    display: none;
  }
`;

const ResumeContainer = styled.div`
  width: 210mm;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  position: relative;

  @media print {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    width: 210mm;
    position: static !important;
  }
`;

const ResumeContent = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-height: 297mm;
  page-break-after: auto;
  page-break-inside: auto;

  @media print {
    min-height: auto;
    page-break-after: auto;
    page-break-inside: auto;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 16px;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
  max-width: 600px;
`;

const PageBreakIndicator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  border-top: 4px dotted #ccc;
  pointer-events: none;
  z-index: 1;

  @media print {
    display: none;
  }
`;

export const PrintPage: React.FC = () => {
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const clerkId = searchParams.get('clerkId');
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/resume?id=${id}&clerkId=${clerkId}`);
        const { resume: loadedResume } = data;
        setResume(loadedResume);
      } catch (err: any) {
        console.error('Error loading resume:', err);
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [id, clerkId]);



  // Set document title to resume name when resume is loaded
  useEffect(() => {
    if (resume?.name) {
      document.title = `${resume.name} - Print`;
      console.log('Resume loaded for printing:', resume.name, 'Theme:', resume.theme);
    }
    
    // Reset title when component unmounts
    return () => {
      document.title = 'ResumeTitan';
    };
  }, [resume]);

  // Check for overflow when resume content is rendered
  useEffect(() => {
    if (resume && resumeRef.current) {
      const checkOverflow = () => {
        const container = resumeRef.current;
        if (container) {
          const contentHeight = container.scrollHeight;
          
          // Calculate the actual A4 page height in pixels
          const containerWidth = container.clientWidth;
          const a4Width = 210; // mm
          const a4Height = 297; // mm
          const a4AspectRatio = a4Height / a4Width;
          const renderedHeight = containerWidth * a4AspectRatio;
          
          // Calculate page breaks every 297mm (A4 height)
          const pageBreakPositions: number[] = [];
          
          // Only add page breaks if content actually exceeds one page
          if (contentHeight > renderedHeight) {
            let currentPosition = renderedHeight;

            while (currentPosition < contentHeight) {
              pageBreakPositions.push(currentPosition);
              currentPosition += renderedHeight;
            }
          }

          setPageBreaks(pageBreakPositions);
        }
      };

      // Check after a short delay to ensure content is rendered
      const timeoutId = setTimeout(checkOverflow, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [resume]);



  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/resume', { state: { resumeId: id } });
  };

  const renderResumeContent = () => {
    if (!resume) return null;

    switch (resume.theme) {
      case "harvard":
      case "professional":
      case "":
        return <ProfessionalResume resume={resume} />;
      case "one-page":
        return <OnePageResume resume={resume} />;
      case "macchiato":
        return <MacchiatoResume resume={resume} />;
      case "student-classic":
        return <StudentClassicResume resume={resume} />;
      case "academic-modern":
        return <AcademicModernResume resume={resume} />;
      case "meyer":
        return <StrattonResume resume={resume} />;
      default:
        return <ProfessionalResume resume={resume} />;
    }
  };

  if (loading) {
    return (
      <PrintPageContainer>
        <Spinner />
      </PrintPageContainer>
    );
  }

  if (error) {
    return (
      <PrintPageContainer>
        <ErrorMessage>
          <h2>Error Loading Resume</h2>
          <p>{error}</p>
          <ActionButton onClick={handleBack}>
            <BackIcon />
            Back to Editor
          </ActionButton>
        </ErrorMessage>
      </PrintPageContainer>
    );
  }

  return (
    <PrintPageContainer className="PrintPageContainer">
      <ButtonContainer className="ButtonContainer">
        <ActionButton onClick={handleBack} className="ActionButton">
          <BackIcon />
          Back to Editor
        </ActionButton>
        <ActionButton onClick={handlePrint} className="ActionButton">
          <PrintIcon />
          Print Resume
        </ActionButton>
      </ButtonContainer>

      <ResumeContainer ref={resumeRef} className="ResumeContainer">
        <ResumeContent data-resume="print-container">
          {renderResumeContent()}
          
          {/* Page break indicators */}
          {pageBreaks.map((position, index) => (
            <PageBreakIndicator
              key={index}
              style={{ top: `${position}px` }}
            />
          ))}
        </ResumeContent>
      </ResumeContainer>
    </PrintPageContainer>
  );
};

export default PrintPage; 