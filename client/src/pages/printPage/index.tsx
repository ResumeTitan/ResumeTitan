import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeType } from 'types/types';
import { getResume } from 'api/resume';

export const PrintToPdf = () => {
  const [resume, setResume] = useState<ResumeType | null>(null);
  const { id } = useParams();
  const token = useSelector((state: any) => state.token);

  useEffect(() => {
    const loadResume = async () => {
      const { resume: loadedResume } = await getResume(token, id);
      setResume(loadedResume);
    }
    loadResume();
  }, [id, token]);

  return resume && (
    <div>
      <ResumeContainer resume={resume} theme={resume.theme || ""} />
    </div>
  )
}
