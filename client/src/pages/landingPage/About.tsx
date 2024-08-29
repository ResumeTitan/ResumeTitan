import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import interviewImg from 'assets/interview.png';
import 'styles/index.css';

const About: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleActionButton = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto mt-24 max-w-7xl px-4 sm:mt-32 sm:px-6 lg:mt-40 lg:px-8" data-aos="fade-left">
      <div className="lg:pr-10 flex-1 max-w-4xl flex-col space-y-7">
        <h3 className="text-lg font-medium uppercase tracking-wide text-neutral-800">
          Spend time on your job search, not your resume
        </h3>

        <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 xl:text-5xl">
          Innovative Features at Your Fingertips
        </h2>

        <p className="text-lg text-neutral-600">
          Whether you're a seasoned professional or just starting out, our tool provides 
          personalized suggestions to highlight your skills and experiences. 
          In a matter of minutes, you can have your own professional-grade resumes generated and ready to send out. 
          Say goodbye to formatting headaches and let us help you get noticed by employers.
        </p>

        <p className="text-lg text-neutral-600">
          Click to get started now, or read more about us and our mission to redesign the job application process.
        </p>

        <div className="flex space-x-8">
          <button
            onClick={handleActionButton}
            className="action-button text-md"
          >
            Get Started
          </button>
          <a
            href="/about"
            className="secondary-action-button text-md"
          >
            About Us
          </a>     
        </div>
      </div>
      <div className="my-8 order-last mx-auto max-w-lg ">
        <img src={interviewImg} alt="hero" className="rounded-lg md:order-last order-first" />
      </div>
    </div>
  );
}

export default About;
