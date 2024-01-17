import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { ISchoolType } from '../../../../types/types';

interface SchoolSectionProps {
  schools: ISchoolType[];
}

export const SchoolSection = ({ schools }: SchoolSectionProps) => {
  return (
    <div>
      <SectionHeading title="Education" />

      {schools.length > 0 && schools.map((item: ISchoolType, index: number) => {
        return (
        <div>
          <div key={`school${index}`} className="flex justify-between items-center">
            <div>
              <SectionTitle label={item.name} />
              <SectionSubtitle label={`${item.degree}, ${item.major}`} />
            </div>
          <div>
              <p className="text-s py-1">
                {item.startDateMonth} {item.startDateYear} -{' '}
                {item.endDateCurrent === true ? 'present' : `${item.endDateMonth} ${item.endDateYear}`}
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