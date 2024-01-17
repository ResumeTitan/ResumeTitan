import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { IWorkType } from '../../../../types/types';

interface WorkSectionProps {
  experience: IWorkType[]; 
}

export const WorkSection = ({ experience }: WorkSectionProps) => {
  return (
    <div>
      <SectionHeading title="Professional Experience" />

      {experience.length > 0 && experience.map((item: IWorkType, index: number) => {
        return (
          <div key={index}>
            <SectionTitle label={item.employer} />
            <div className="flex justify-between items-center">
              <SectionSubtitle label={item.title} />
              <div>
                <p className="text-s">
                  {item.startDateMonth} {item.startDateYear} -{' '}
                  {item.endDateCurrent === true ? 'present' : `${item.endDateYear} ${item.endDateYear}`}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
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
