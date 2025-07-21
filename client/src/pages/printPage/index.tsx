import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeType } from 'types/types';
import api from 'api/actions';
import Spinner from 'components/Spinner';

export const PrintToPdf = () => {
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const clerkId = searchParams.get('clerkId');

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
    }
    loadResume();
  }, [id, clerkId]);

  // Set document title to resume name when resume is loaded
  useEffect(() => {
    if (resume?.name) {
      document.title = resume.name;
    }
    
    // Reset title when component unmounts
    return () => {
      document.title = 'ResumeTitan';
    };
  }, [resume]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return resume && (
    <div data-resume="print-container">
      <ResumeContainer resume={resume} />
    </div>
  )
}
