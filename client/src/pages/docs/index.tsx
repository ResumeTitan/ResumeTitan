import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DocsContainer = styled.div`
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .doc-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .doc-card:hover {
    border-color: #115E59;
    box-shadow: 0 4px 12px rgba(17, 94, 89, 0.1);
    transform: translateY(-2px);
  }

  .doc-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #115E59;
    margin-bottom: 0.5rem;
    text-decoration: none;
  }

  .doc-description {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #115E59;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    color: #6b7280;
    font-size: 1.125rem;
  }
`;

const DocsPage: React.FC = () => {
  const docs = [
    {
      path: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using ResumeTitan to create your first professional resume.'
    },
    {
      path: 'resume',
      title: 'Resume Builder User Guide',
      description: 'Learn how to use the Resume Builder to create a professional resume.'
    },
    {
      path: 'ai-prompts',
      title: 'Suggested AI Prompts',
      description: 'Discover the best AI prompts for the best results.'
    },
    {
      path: 'cover-letter',
      title: 'Cover Letter Generator User Guide',
      description: 'Learn how to use the Cover Letter Generator to create a professional cover letter.'
    },
    {
      path: 'interview',
      title: 'Interview Preparation User Guide',
      description: 'Learn how to use the Interview Preparation tool to prepare for your next interview.'
    }
  ];

  return (
    <DocsContainer>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Documentation</h1>
          <p className="page-subtitle">
            Everything you need to know about using ResumeTitan
          </p>
        </div>

        <div className="docs-grid">
          {docs.map((doc) => (
            <Link 
              key={doc.path} 
              to={`/docs/${doc.path}`} 
              style={{ textDecoration: 'none' }}
            >
              <div className="doc-card">
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-description">{doc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Need help? <Link to="/contact" style={{ color: '#115E59' }}>Contact our support team</Link>
          </p>
        </div>
      </div>
    </DocsContainer>
  );
};

export default DocsPage; 