import React from 'react';

interface SectionListProps {
  items: string[];
}

export const SectionList: React.FC<SectionListProps> = ({ items }) => {
  return (
    <ul className="ml-6 p-0 list-disc">
      {items.map((item, index) => (
        <li className="mb-[0.1rem]" key={index}>{item}</li>
      ))}
    </ul>
  );
};
