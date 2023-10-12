import React from 'react';
import Form from './Form';

const LoginPage = () => {

  return (
    <div className="flex justify-center items-center h-screen bg-background-light">
      <div className="bg-background-dark shadow-md rounded px-8 py-6">
        <Form />
      </div>
    </div>
  );
};

export default LoginPage;
