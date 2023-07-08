import React, { PropsWithChildren } from 'react';

import "index.css";

interface SectionWrapperProps extends PropsWithChildren<{
  title: string;
}> {
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => (
  <>
    <div className="border-y-2 mt-5 mb-3 py-1 font-extrabold text-2xl text-midnightBlue">{title}</div>
      <hr className="border-solid border-1" />
    <div className="mt-[0.0825rem]">{children}</div>
  </>
);
