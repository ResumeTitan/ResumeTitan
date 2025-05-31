import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MarkdownContainer = styled.div`
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    line-height: 1.6;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #115E59;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s;
    margin-bottom: 1.5rem;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #0F766E;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(17, 94, 89, 0.2);
    }

    &.bottom {
      margin-top: 2rem;
      margin-bottom: 0;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .button-container {
    text-align: left;
  }

  .button-container.bottom {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #E5E7EB;
  }

  h1 {
    font-size: 2.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #115E59;
    border-bottom: 2px solid #115E59;
    padding-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.875rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #115E59;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #0F766E;
  }

  h4, h5, h6 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #0F766E;
  }

  p {
    margin-bottom: 1rem;
    color: #374151;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
    color: #374151;
  }

  blockquote {
    border-left: 4px solid #115E59;
    padding-left: 1rem;
    margin: 1.5rem 0;
    background-color: #F0FDF4;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  code {
    background-color: #F3F4F6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  pre {
    background-color: #1F2937;
    color: #F9FAFB;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th, td {
    border: 1px solid #D1D5DB;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #115E59;
    color: white;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #F9FAFB;
  }

  a {
    color: #115E59;
    text-decoration: underline;
  }

  a:hover {
    color: #0F766E;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  hr {
    border: none;
    height: 2px;
    background-color: #E5E7EB;
    margin: 2rem 0;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 1.125rem;
    color: #6B7280;
  }

  .error {
    background-color: #FEF2F2;
    border: 1px solid #FECACA;
    color: #B91C1C;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
  }
`;

interface MarkdownPageProps {
  filePath: string;
  title?: string;
}

const BackButton: React.FC<{ className?: string }> = ({ className }) => (
  <Link to="/docs" className={`back-button ${className || ''}`}>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back to User Guides
  </Link>
);

const MarkdownPage: React.FC<MarkdownPageProps> = ({ filePath, title }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Import the markdown file dynamically
        const markdownModule = await import(`../docs/${filePath}`);
        
        // Fetch the actual content
        const response = await fetch(markdownModule.default);
        const text = await response.text();
        
        setContent(text);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError('Failed to load document. Please check if the file exists.');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filePath]);

  // Set document title
  useEffect(() => {
    if (title) {
      document.title = `${title} - ResumeTitan`;
    }
    
    return () => {
      document.title = 'ResumeTitan';
    };
  }, [title]);

  if (loading) {
    return (
      <MarkdownContainer>
        <div className="container">
          <div className="loading">Loading document...</div>
        </div>
      </MarkdownContainer>
    );
  }

  if (error) {
    return (
      <MarkdownContainer>
        <div className="container">
          <div className="button-container">
            <BackButton />
          </div>
          <div className="error">{error}</div>
        </div>
      </MarkdownContainer>
    );
  }

  return (
    <MarkdownContainer>
      <div className="container">
        <div className="button-container">
          <BackButton />
        </div>
        
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom component for links to handle internal routing
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith('http') || href?.startsWith('//');
              return (
                <a 
                  href={href} 
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>

        <div className="button-container bottom">
          <BackButton className="bottom" />
        </div>
      </div>
    </MarkdownContainer>
  );
};

export default MarkdownPage; 