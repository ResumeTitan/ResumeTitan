import React from 'react';
import styled from 'styled-components';

// Styled components
const ListContainer = styled.ul`
  padding-left: 20px;
  line-height: 1.4rem;

  li::before {
    content: '•';
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    line-height: 10px;
  }
`;

// Define the props interface
interface ListProps {
  items?: string[];
}

const List: React.FC<ListProps> = ({ items }) => {
  if (!items) {
    return null;
  }

  return (
    <ListContainer>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListContainer>
  );
};

export default List;
