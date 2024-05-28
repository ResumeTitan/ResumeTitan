import React, { useState } from 'react';
import { LoginForm } from 'components/LoginForm';
import heroImg from 'assets/heroImg.png';

const Hero: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            Empower Your Career
          </span>

          <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 dark:text-neutral-50 xl:text-5xl">
            Create Professional Resumes in Minutes
          </h2>

          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Looking for a job can be stressful, but creating your resume doesn't have to be. 
            Our AI-powered tool helps you craft a stunning resume in just a few clicks. 
            Simply enter your information, and let our technology do the rest. 
            Log in or sign up to get started!
          </p>

          <div className="flex space-x-8">
            <button
              onClick={() => {
                setIsLoginOpen(true)
                setIsRegistering(true)
              }}
              className="rounded-md bg-neutral-900 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:outline-neutral-400"
            >
              Sign Up
            </button>

            <button
              onClick={() => {
                setIsLoginOpen(true)
                setIsRegistering(false)
              }}
              className="rounded-md bg-transparent px-10 py-3 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-100 dark:ring-neutral-600 dark:hover:bg-neutral-800 dark:focus-visible:outline-neutral-400"
            >
              Log In
            </button>
          </div>
        </div>

        <div className="order-last mx-auto max-w-lg lg:order-first">
          <img src={heroImg} alt="hero" className="border rounded-lg md:order-last order-first" />
        </div>
      </div>
      {isLoginOpen && (
        <LoginForm
          registerOpen={isRegistering}
          onCloseLogin={() => setIsLoginOpen(false)} 
        />
      )}
    </div>
  );
}

export default Hero;
