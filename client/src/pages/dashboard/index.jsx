import React, { useEffect, useState } from 'react';
import ResumeCard from './ResumeCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumes } from '../../api/resume';
import { setActiveResume } from '../../state';

export const Dashboard = () => {
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  const [numResumesShown, setNumResumesShown] = useState(3);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      if (window.innerWidth < 512) {
        setNumResumesShown(1);
      } else if (window.innerWidth < 680) {
        setNumResumesShown(2);
      } else if (window.innerWidth < 940) {
        setNumResumesShown(3);
      } else if (window.innerWidth < 940) {
        setNumResumesShown(4);
      } else {
        setNumResumesShown(5);
      }
    };

    // Add event listener to window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up listener on component unmount
    };
  }, [])

  const loadResumes = async () => {
    if (!currentUser) {
      return;
    }
    const data = await getResumes(token, currentUser._id);
    setResumes(data.resumes);
  };

  const handleClickResume = (resumeId) => {
    console.log("Clicked resume with id: " + resumeId);
    setActiveResume(resumeId);
    navigate(`/resume`);
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
    <div className="bg-slate-400 text-white min-h-screen">
      <h1 className="text-3xl font-bold bg-slate-700 p-2 w-full">Welcome {currentUser?.firstName}</h1>
      <div className="text-3xl font-bold bg-slate-700 p-2">My Resumes:</div>
      <button className="mx-4 mt-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4" onClick={() => navigate('/resume')}>Add New</button>
      <div className="flex flex-cols lg:min-w-0 transform scale-25 w-1/2 h-auto -translate-y-96 -translate-x-32">
        {resumeWidgets}
      </div>
    </div>
  );
};
