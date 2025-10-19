import React from 'react';
import { FormDiv, FormLabel, FormSelect } from 'components/Form/styled';

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
      <FormSelect value={value} onChange={onChange} >
      {children}
      </FormSelect>
    </FormDiv>
  );
};

export default FormField;
