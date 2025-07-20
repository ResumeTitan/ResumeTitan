import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MarkdownPage from '../../components/MarkdownPage';

// Define available docs and their metadata
const availableDocs = {
  'getting-started': {
    file: 'getting-started.md',
    title: 'Getting Started'
  },
  'resume': {
    file: 'resume.md',
    title: 'Resume Builder User Guide'
  },
  'ai-prompts': {
    file: 'ai-prompts.md',
    title: 'Suggested AI Prompts'
  },
  'cover-letter': {
    file: 'cover-letter.md',
    title: 'Cover Letter Generator User Guide'
  },
  'interview': {
    file: 'interview.md',
    title: 'Interview Preparation User Guide'
  }
};

const DynamicDocsPage: React.FC = () => {
  const { docName } = useParams<{ docName: string }>();
  
  // If no docName provided, redirect to getting-started
  if (!docName) {
    return <Navigate to="/docs/getting-started" replace />;
  }
  
  // Check if the requested doc exists
  const docConfig = availableDocs[docName as keyof typeof availableDocs];
  
  if (!docConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Document Not Found</h1>
          <p className="text-gray-600 mb-4">
            The requested documentation page could not be found.
          </p>
          <a 
            href="/docs/getting-started" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Getting Started
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <MarkdownPage 
      filePath={docConfig.file} 
      title={docConfig.title} 
      showBackButton={true}
    />
  );
};

export default DynamicDocsPage;
