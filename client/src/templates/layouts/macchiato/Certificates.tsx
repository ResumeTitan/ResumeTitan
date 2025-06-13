import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { CertificateType } from 'types/types';

interface CertificatesProps {
  certificates: CertificateType[];
}

const CertificatesSection = styled.div`
  margin-bottom: 20px;
`;

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  if (!certificates || !certificates.length) return null;

  return (
    <CertificatesSection>
      <Section title="Certifications">
        {certificates.map((certificate, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontFamily: '"Lato", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              margin: '0 0 4px 0'
            }}>
              {certificate.name}
              {certificate.url && (
                <span style={{ marginLeft: '8px' }}>
                  <a 
                    href={certificate.url} 
                    style={{ 
                      color: '#56817A', 
                      textDecoration: 'none',
                      fontSize: '12px'
                    }}
                  >
                    [View Certificate]
                  </a>
                </span>
              )}
            </h4>
            {certificate.issuer && (
              <div style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic',
                marginBottom: '4px'
              }}>
                {certificate.issuer}
              </div>
            )}
            {certificate.date && (
              <div style={{
                fontFamily: '"Lato", Helvetica, Arial, sans-serif',
                fontSize: '12px',
                color: '#666'
              }}>
                {formatDate(certificate.date)}
              </div>
            )}
          </div>
        ))}
      </Section>
    </CertificatesSection>
  );
};

export default Certificates; 