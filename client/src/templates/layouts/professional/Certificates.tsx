import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { CertificateType } from 'types/types';

interface CertificatesProps {
  certificates?: CertificateType[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  if (!certificates) {
    return null;
  }

  return (
    <div>
      <Section title="Certificates">
        {certificates.map((c, key) => (
          <Experience
            title={c.name}
            subTitle={c.issuer}
            date={c.date}
            key={key}
          />
        ))}
      </Section>
    </div>
  );
};

export default Certificates;
