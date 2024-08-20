import React from 'react';
import styled from 'styled-components';

// Styled component
const Text = styled.div`
  font-style: italic;
  font-size: 1.2rem;
`;

// Define the props interface
interface DateComponentProps {
  date?: string | null; // The date prop can be a string, null, or undefined
}

const DateComponent: React.FC<DateComponentProps> = ({ date }) => {
  if (!date) {
    return <Text>Present</Text>;
  }

  const fullDate = new Date(date);

  // Options for formatting the date
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  const formattedDate = fullDate.toLocaleDateString('en-US', options);

  return <Text>{formattedDate ?? 'Present'}</Text>;
};

export default DateComponent;
