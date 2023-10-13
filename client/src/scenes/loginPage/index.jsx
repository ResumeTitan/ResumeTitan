import React from 'react';
import Form from './Form';

const LoginPage = () => {

  return (
    <div className="flex flex-col items-center h-screen bg-background-light">
      <div className="flex w-full max-w-xs flex-col text-center pt-2 pb-20">
        <div className="text-lg font-bold text-light-text">Welcome to ResumeTitan!</div>
        <div className="text-light-text">Using AI to help build your resume</div>
      </div>
      <div className="justify-center bg-background-dark shadow-md rounded px-8 py-6">
        <Form />
      </div>
    </div>
  );
};

export default LoginPage;
