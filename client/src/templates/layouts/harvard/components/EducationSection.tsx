import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { IEducationType } from '../../../../types/types';

interface EducationSectionProps {
  education: IEducationType[];
}

export const EducationSection = ({ education }: EducationSectionProps) => {
  return (
    <div>
      <SectionHeading title="Education" />

      {education.length > 0 && education.map((item: IEducationType, index: number) => {
        return (
        <div key={`resume-school${index}`}>
          <div className="flex justify-between items-center">
            <div>
              <SectionTitle label={item.name} />
              <SectionSubtitle label={`${item?.degree || ''}, ${item?.major || ''}`} />
            </div>
          <div>
              <p className="text-s py-1">
                {item.startDateMonth} {item.startDateYear} -{' '}
                {item.endDateCurrent === true ? 'Present' : `${item?.endDateMonth || ''} ${item?.endDateYear || ''}`}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            
            {item.content && item.content.length > 0 && (
              <SectionList items={item.content} />
            )}
          </div>
        </div>
        )
      })}
    </div>
  );
};