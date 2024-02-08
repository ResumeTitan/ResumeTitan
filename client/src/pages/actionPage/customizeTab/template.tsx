import React from 'react';

interface Props {
  theme: string;
}

const Template: React.FC<Props> = ({ theme }) => {
  return <div>Hello, {theme}!</div>;
};

export default Template;
