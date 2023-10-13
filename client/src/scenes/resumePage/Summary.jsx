import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';

import 'index.css';

export const Summary = ({ summary }) => {
  const [editing, setEditing] = useState(false);
  return (
    <SectionWrapper title="Summary">
      <div 
        className="ml-1 leading-5"
        contentEditable={editing}
        suppressContentEditableWarning={true}
        onBlur={() => setEditing(false)}
        onClick={() => setEditing(true)}
      >{summary}</div>
    </SectionWrapper>
  );
};
