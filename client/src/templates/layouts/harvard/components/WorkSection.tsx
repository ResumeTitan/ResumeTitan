import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { IWorkType } from '../../../../types/types';
import { formatDate } from '../../../../utils';

interface WorkSectionProps {
  experience: IWorkType[]; 
}

const sectionStyling = "flex justify-between items-center";

export const WorkSection = ({ experience }: WorkSectionProps) => {
  return (
    <div>
      <SectionHeading title="Professional Experience" />

      {experience.length > 0 && experience.map((item: IWorkType, index: number) => {
        return (
          <div key={index}>
            <SectionTitle label={item.name} />
            <div className={sectionStyling}>
              <SectionSubtitle label={item.position} />
              <div>
                <p className="text-s">
                  {formatDate(item.startDate)} -{' '}
                  {item.endDateCurrent === true ? 'Present' : `${formatDate(item.endDate)}`}
                </p>
              </div>
            </div>
            <div className={sectionStyling}>
            {item.content && item.content.length > 0 && (
              <SectionList items={item.content} />
            )}
          </div>
          </div>
        );
      })}
    </div>
  );
};
