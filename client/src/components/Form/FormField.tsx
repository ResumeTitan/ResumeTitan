import React from 'react';
import { FormDiv, FormLabel, FormInput } from 'components/Form/styled';

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

const FormField: React.FC<SectionComponentProps> = ({ title, value, onChange, children }) => {
  return (
    <FormDiv>
      <FormLabel>
        {title && (
          <>
            <h4>{title}</h4>
          </>
        )}
      </FormLabel>
      <FormInput value={value} onChange={onChange}/>
      {children}
    </FormDiv>
  );
};

export default FormField;
