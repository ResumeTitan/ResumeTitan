import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { PublicationType } from 'types/types';

interface PublicationsProps {
  publications: PublicationType[];
}

const PublicationsSection = styled.div`
  margin-bottom: 20px;
`;

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  if (!publications || !publications.length) return null;

  return (
    <PublicationsSection>
      <Section title="Publications">
        {publications.map((publication, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontFamily: '"Lato", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              margin: '0 0 4px 0'
            }}>
              {publication.name}
              {publication.url && (
                <span style={{ marginLeft: '8px' }}>
                  <a 
                    href={publication.url} 
                    style={{ 
                      color: '#56817A', 
                      textDecoration: 'none',
                      fontSize: '12px'
                    }}
                  >
                    [View Publication]
                  </a>
                </span>
              )}
            </h4>
            {publication.publisher && (
              <div style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic',
                marginBottom: '4px'
              }}>
                {publication.publisher}
              </div>
            )}
            {publication.releaseDate && (
              <div style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                color: '#666',
                marginBottom: '8px'
              }}>
                {formatDate(publication.releaseDate)}
              </div>
            )}
            {publication.summary && (
              <p style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                lineHeight: '1.4',
                margin: '0'
              }}>
                {publication.summary}
              </p>
            )}
          </div>
        ))}
      </Section>
    </PublicationsSection>
  );
};

export default Publications; 