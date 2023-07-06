import React from 'react';
import Form from './Form';

const LoginPage = () => {

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6">
        <Form />
      </div>
    </div>
  );
};

export default LoginPage;
