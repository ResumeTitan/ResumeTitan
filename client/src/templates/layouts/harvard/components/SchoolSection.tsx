// import { dateParser } from 'src/helpers/utils';
// import { HTMLRenderer } from 'src/helpers/common/components/HTMLRenderer';
// import { IWorkIntrf } from 'src/stores/index.interface';
import { SectionHeading } from '../elements/SectionHeading';
import { SectionList } from '../elements/SectionList';
import { SectionSubtitle } from '../elements/SectionSubtitle';
import { SectionTitle } from '../elements/SectionTitle';
import { ISchoolType } from '../../../../types/types';

interface SchoolSectionProps {
  education: ISchoolType[];
}

export const SchoolSection = ({ education }: SchoolSectionProps) => {
  return (
    <div>
      <SectionHeading title="Education" />

      {education.length > 0 && education.map((item: ISchoolType, index: number) => {
        return (
        <div>
          <div key={`school${index}`} className="flex justify-between items-center">
            <div>
              <SectionTitle label={item.name} />
              <SectionSubtitle label={`${item.degree}, ${item.major}`} />
            </div>
          <div>
              <p className="text-s py-1">
                {item.startDateYear} -{' '}
                {item.endDateYear === '-1' ? 'present' : `${item.endDateYear}`}
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