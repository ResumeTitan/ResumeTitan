import React from 'react';
import { TermsOfService } from '../../components/TermsOfService';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600 text-sm">Last updated: 10-20-2023</p>
        <TermsOfService />
      </div>

    </div>
  );
};

export default TermsPage;
