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
      <ResumeContainer resume={resume} />
    </div>
  )
}
