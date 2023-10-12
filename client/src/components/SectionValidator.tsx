import React, { Fragment, ReactNode, useMemo } from 'react';

export const SectionValidator = ({
  value,
  children,
}: {
  value:
    | string;
  children: ReactNode;
}) => {
  const isValid = useMemo(() => {
    return (value || '').length > 0;
  }, [value]);

  if (!isValid) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
