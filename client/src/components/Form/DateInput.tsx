import React from 'react';
import styled from 'styled-components';
import { FormLabel, FormDateInput } from 'components/Form/styled';

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Div = styled.div`
  flex: 1;
  margin: 10px;

  // Optional: Add some styling for the divs
  // padding: 20px;
  // border: 1px solid #ccc;
  // background-color: #f8f8f8;
`;

const DateInput: React.FC<SectionComponentProps> = ({ title, value, onChange, children, disabled, className }) => {
  return (
    <Div className={className}>
      <FormLabel>
        {title && (
          <>
            <h4>{title}</h4>
          </>
        )}
      </FormLabel>
      <FormDateInput value={value} onChange={onChange} disabled={disabled}/>
      {children}
    </Div>
  );
};

export default DateInput;
