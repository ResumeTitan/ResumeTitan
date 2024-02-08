import React from 'react';

interface Props {
  name: string;
}

const CustomizeTab: React.FC<Props> = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default CustomizeTab;
