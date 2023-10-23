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
    <div className="mb-3">
      <SectionHeading title="Education" />

      {education.length > 0 && education.map((item: ISchoolType, index: number) => {
        return (
          <div key={`school${index}`} className="py-2">
          <SectionTitle label={item.name} />
          <div className="flex justify-between items-center">
            <SectionSubtitle label={`${item.degree}, ${item.major}`} />
            <div>
              <p className="text-s">
                {item.startDate} -{' '}
                {item.endDate === 'present' ? 'present' : item.endDate}
              </p>
            </div>
          </div>
          {/* <SectionList items={item.content} /> */}
        </div>
        )
      })}
    </div>
  );
};