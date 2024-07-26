import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { ICertificatesType } from 'types/types';
import { formatDate } from '../../../../utils';

interface CertificateSectionProps {
  certificates: ICertificatesType[];
}

export const CertificatesSection = ({ certificates }: CertificateSectionProps) => {
  return (
    <div>
      <SectionHeading title="Certificates" />

      {certificates.length > 0 && certificates.map((item: ICertificatesType, index: number) => {
        return (
        <div key={`resume-cert-${index}`}>
          <div className="flex justify-between items-center">
            <div>
              <SectionTitle label={item.name} />
              <SectionSubtitle label={`${item?.issuer ? item.issuer : ''} ${item?.issuer || ''}`} />
            </div>
          <div>
              <p className="text-s py-1">
                {formatDate(item.date)}
              </p>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  );
};