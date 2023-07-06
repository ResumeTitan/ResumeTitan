import React, { PropsWithChildren } from 'react';

import "../scenes/resumePage/index.css";

interface SectionWrapperProps extends PropsWithChildren<{
  title: string;
}> {
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => (
  <>
    <h2 className="mt-1">{title}</h2>
      <hr className="border-solid border-1" />
    <div className="mt-[0.0825rem]">{children}</div>
  </>
);