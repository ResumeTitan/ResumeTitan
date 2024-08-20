import React from 'react';
import styled from 'styled-components';
import DateComponent from './Date'; // Renamed to avoid name conflicts with Date object

// Styled component
const Range = styled.div`
  display: flex;
  font-style: italic;
  font-size: 13px;
`;

// Define the props interface
interface DateRangeProps {
  startDate?: string | null; // startDate can be a string, null, or undefined
  endDate?: string | null; // endDate can be a string, null, or undefined
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, endDate }) => {
  return (
    <Range>
      <DateComponent date={startDate} />
      &nbsp;—&nbsp;
      <DateComponent date={endDate} />
    </Range>
  );
};

export default DateRange;
