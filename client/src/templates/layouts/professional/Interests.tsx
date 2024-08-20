import React from 'react';
import OneLineList from './OneLineList';
import Section from './Section';
import { InterestType } from 'types/types';

interface InterestsProps {
  interests?: InterestType[];
}

const Interests: React.FC<InterestsProps> = ({ interests }) => {
  // check if interests is null, empty, empty string or empty array
  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <div>
      <Section title="Interests">
        {interests.map((w, key) => (
          <OneLineList key={key} name={w.name} items={w.keywords} />
        ))}
      </Section>
    </div>
  );
};

export default Interests;
