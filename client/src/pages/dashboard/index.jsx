import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes } from '../../api/resume';

export const Dashboard = () => {
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  const [numResumesShown, setNumResumesShown] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumResumesShown(2);
      } else if (window.innerWidth < 1024) {
        setNumResumesShown(3);
      } else {
        setNumResumesShown(4);
      }
    };

    // Add event listener to window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up listener on component unmount
    };
  }, []);

  const loadResumes = async () => {
    const data = await getResumes(token, currentUser._id);
    setResumes(data.resumes);
  };

  const handleClickResume = (resumeId) => {
    console.log("Clicked resume with id: " + resumeId);
    navigate(`/resume/${resumeId}`);
  }

  useEffect(() => {
    loadResumes();
  }, []);

    // Create an array of ResumeWidget components based on numWidgets
    const resumeWidgets = Array.from({ length: Math.min(resumes.length, numResumesShown) }, (_, index) => (
      <div className="hover:cursor-pointer" onClick={() => handleClickResume(resumes[index]._id)}>
        <ResumeCard
          personalInfo={currentUser}
          schools={resumes[index].schools}
          jobs={resumes[index].jobs}
          skills={resumes[index].skills} />
      </div>
    ));

  return (
    <div className="bg-slate-400 p-2">
      <h1 className="text-3xl font-bold mb-8">Welcome, {currentUser?.firstName}!</h1>
      <div className="text-3xl font-bold">My Resumes:</div>
      <div className="flex flex-cols lg:min-w-0 transform scale-25 w-1/2 h-auto -translate-y-96 -translate-x-32">
        {resumeWidgets}
      </div>
    </div>
  );
};
