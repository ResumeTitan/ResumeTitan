import React from 'react';
import styled from 'styled-components';
import { CertificateType } from 'types/types';
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

const CertificateItem = styled.div`
  margin-bottom: 2mm;
`;

const CertificateName = styled.div`
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const CertificateSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 10pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const Certificates: React.FC<{ certificates: CertificateType[] }> = ({ certificates = [] }) => {

  if (!certificates || certificates.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Certificates</SectionTitle>
      {certificates.map((cert, i) => (
        <CertificateItem key={i}>
          <CertificateName>
            {cert.url ? (
              <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ color: '#222', textDecoration: 'none' }}>
                {cert.name}
              </a>
            ) : (
              cert.name
            )}
          </CertificateName>
          <CertificateSubHeader>
            <span>{cert.issuer}</span>
            <span>{cert.date ? formatDate(cert.date) : ''}</span>
          </CertificateSubHeader>
        </CertificateItem>
      ))}
    </Section>
  );
};

export default Certificates; 