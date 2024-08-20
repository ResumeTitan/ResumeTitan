import React from 'react';
import { VerticalList } from 'components/VerticalList';

interface SectionListProps {
  sections: string[];
  saveSections: (sections: string[]) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, saveSections }) => {
  return (
    <div className="flex items-center p-4">
      <VerticalList items={sections} onSave={saveSections}/>
    </div>
  );
};

export default SectionList;
