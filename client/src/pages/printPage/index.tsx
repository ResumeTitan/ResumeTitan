import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeType } from 'types/types';
import { getResume } from 'api/resume';
import Spinner from 'components/Spinner';

export const PrintToPdf = () => {
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const clerkId = searchParams.get('clerkId');
  const hasOverflow = searchParams.get('hasOverflow') === 'true';
  const token = useSelector((state: any) => state.token);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        setError(null);
        const { resume: loadedResume } = await getResume(token, id, clerkId);
        setResume(loadedResume);
      } catch (err: any) {
        console.error('Error loading resume:', err);
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [id, token, clerkId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return resume && (
    <div data-resume="print-container">
      <style>
        {`
          @page {
            size: 210mm 297mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            height: auto !important;
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
          }
          #root {
            height: auto !important;
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
          }
          .resume-container {
            width: 210mm !important;
            height: ${hasOverflow ? 'auto' : '297mm'} !important;
            min-height: ${hasOverflow ? '297mm' : 'auto'} !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
            page-break-inside: ${hasOverflow ? 'auto' : 'avoid'} !important;
          }
          .resume-content {
            width: 210mm !important;
            height: ${hasOverflow ? 'auto' : '297mm'} !important;
            page-break-inside: ${hasOverflow ? 'auto' : 'avoid'} !important;
            page-break-after: ${hasOverflow ? 'auto' : 'avoid'} !important;
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
          }
          .page-container {
            height: auto !important;
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
          }
          /* Ensure all content is visible */
          * {
            overflow: ${hasOverflow ? 'visible' : 'hidden'} !important;
          }
        `}
      </style>
      <ResumeContainer resume={resume} />
    </div>
  )
}
