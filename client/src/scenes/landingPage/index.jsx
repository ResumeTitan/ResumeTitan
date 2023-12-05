import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './heroSection';
import { LoginForm } from 'components/LoginForm';
import { useSelector } from 'react-redux';

function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleActionButton = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsLoginOpen(true);
    }
  }


  return (
    <div className="bg-white">
      <HeroSection />
      <div className="flex justify-center grid md:grid-cols-3">
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              Spend time on your job search, not your resume
            </div>
            <p className="text-gray-700 text-base">
              Are you tired of spending hours of time perfecting how your resume
              should look instead of finding your dream job? Let ResumeTitan
              take your resume to the next level with the use of artificial
              intelligence to fill in the blanks.
            </p>
          </div>
        </div>

        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              Next-gen features at your fingertips
            </div>
            <p className="text-gray-700 text-base">
              ResumeTitan allows for you to not only have professional-grade
              resumes generated in minutes, but also allows you to make your own
              changes to make your resume how YOU want it to look!
            </p>
          </div>
        </div>

        <div className="max-w-sm overflow-hidden m-4 flex items-center justify-center">
          <button
            className="text-lg px-6 py-4 font-bold leading-none border border-4 rounded text-white bg-teal-800 hover:border-transparent hover:bg-white hover:text-teal-800 items-center transition duration-300 ease-in-out"
            onClick={handleActionButton}
          >
            Get started now!
          </button>
        </div>
      </div>
      {isLoginOpen && (
        <LoginForm
          registerOpen={false}
          onCloseLogin={() => setIsLoginOpen(false)} 
        />
      )}
    </div>
  );
}

export default LandingPage;
