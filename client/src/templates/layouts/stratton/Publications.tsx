import React from 'react';
import styled from 'styled-components';
import { PublicationType } from 'types/types';
import { formatDate } from '../../../utils';

const Section = styled.div`
  margin-top: 4mm;
`;

const SectionTitle = styled.div`
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2mm;
  border-bottom: 1pt solid #222;
  padding-bottom: 1mm;
  line-height: 1.2;
`;

const PublicationItem = styled.div`
  margin-bottom: 2mm;
`;

const PublicationName = styled.div`
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const PublicationSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 10pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const PublicationSummary = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-left: 2mm;
`;

const Publications: React.FC<{ publications: PublicationType[] }> = ({ publications = [] }) => {

  if (!publications || publications.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Publications</SectionTitle>
      {publications.map((pub, i) => (
        <PublicationItem key={i}>
          <PublicationName>
            {pub.url ? (
              <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ color: '#222', textDecoration: 'none' }}>
                {pub.name}
              </a>
            ) : (
              pub.name
            )}
          </PublicationName>
          <PublicationSubHeader>
            <span>{pub.publisher}</span>
            <span>{pub.releaseDate ? formatDate(pub.releaseDate) : ''}</span>
          </PublicationSubHeader>
          {pub.summary && <PublicationSummary>{pub.summary}</PublicationSummary>}
        </PublicationItem>
      ))}
    </Section>
  );
};

export default Publications; 