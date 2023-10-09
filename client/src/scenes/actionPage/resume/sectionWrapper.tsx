import React, { PropsWithChildren } from 'react';

import "index.css";

interface SectionWrapperProps extends PropsWithChildren<{
  title: string;
}> {
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => (
  <div>
    <div className="mt-5 mx-4 mb-2 pt-1 font-extrabold text-xl">{title}</div>
      <hr className="mx-4 border-solid border-1" />
    <div className="mt-2 mx-2">{children}</div>
  </div>
);
