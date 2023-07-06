import React from 'react';
import { SectionWrapper } from './SectionWrapper';

export const Summary = ({ summary }) => {
  return (
    <SectionWrapper title="Summary">
      <div className="ml-1 leading-5">{summary}</div>
    </SectionWrapper>
  );
};