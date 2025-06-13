import React from 'react';
import MarkdownPage from '../../components/MarkdownPage';

const TermsPage = () => {
  const docConfig = {
    file: 'terms-of-service.md',
    title: 'Terms of Service'
  };

  return (
    <div className="container mx-auto px-4">
        <MarkdownPage 
          filePath={docConfig.file} 
          title={docConfig.title} 
          showBackButton={false}
        />
    </div>
  );
};

export default TermsPage;
