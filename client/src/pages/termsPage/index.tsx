import React from 'react';
import MarkdownPage from '../../components/MarkdownPage';
import 'styles/index.css';

const TermsPage = () => {
  const docConfig = {
    file: 'terms-of-service.md',
    title: 'Terms of Service'
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-main-green to-dark-green text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold leading-tight tracking-wide xl:text-5xl mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-lightest-green max-w-3xl mx-auto leading-relaxed">
              Understanding how we protect your data and ensure a secure, 
              professional experience on ResumeTitan
            </p>
            <div className="mt-6 text-lightest-green">
              <span className="text-sm">Last Updated: April 2, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12" data-aos="fade-up">
          <MarkdownPage 
            filePath={docConfig.file} 
            title={docConfig.title} 
            showBackButton={false}
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-lightest-green py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-main-green mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service or our practices, 
            please don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="primary-action-button text-lg bg-main-green text-white border-main-green hover:bg-dark-green hover:border-dark-green"
            >
              Contact Support
            </a>
            <a
              href="/privacy"
              className="primary-action-button text-lg bg-transparent text-main-green border-main-green hover:bg-main-green hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
