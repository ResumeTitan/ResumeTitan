import React from 'react';
import Section from './Section';
import Experience from './Experience';
import { PublicationType } from 'types/types';

interface PublicationsProps {
  publications?: PublicationType[];
}

const Publications: React.FC<PublicationsProps> = ({ publications }) => {
  if (!publications) {
    return null;
  }

  return (
    <div>
      <Section title="Publications">
        {publications.map((p, key) => (
          <Experience
            title={p.name}
            subTitle={p.publisher}
            date={p.releaseDate}
            summary={p.summary}
            key={key}
          />
        ))}
      </Section>
    </div>
  );
};

export default Publications;
