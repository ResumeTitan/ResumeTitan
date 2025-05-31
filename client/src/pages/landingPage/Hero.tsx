import React from 'react';
import heroImg from 'assets/heroImg.png';
import 'styles/index.css';

const Hero: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2" data-aos="fade-right">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <h2 className="text-lg font-medium uppercase tracking-wide text-neutral-800">
            Empower Your Career
          </h2>

          <h1 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 xl:text-5xl">
            Create Professional Resumes in Minutes
          </h1>

          <p className="text-lg text-neutral-600">
            Looking for a job can be stressful, but creating your resume doesn't have to be. 
            Our AI-powered tool helps you craft a stunning resume in just a few clicks. 
            Simply enter your information, and let our technology do the rest. 
            Log in or sign up to get started!
          </p>

          <div className="flex space-x-8">
            <a
              className="primary-action-button text-lg"
              href="/sign-up"
            >Sign Up</a>

            <a
              className="primary-action-button text-lg"
              href="/sign-in"
            >Log In</a>
          </div>
        </div>

        <div className="order-last mx-auto max-w-lg lg:order-first">
          <img src={heroImg} alt="hero" className="rounded-lg md:order-last order-first" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
