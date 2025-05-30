import React from 'react';
import { FormDiv, FormLabel, FormInput } from 'components/Form/styled';

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

const FormField: React.FC<SectionComponentProps> = ({ title, value, onChange, onBlur, disabled, placeholder, children }) => {
  return (
    <FormDiv>
      <FormLabel>
        {title && (
          <>
            <h4>{title}</h4>
          </>
        )}
      </FormLabel>
      <FormInput value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} placeholder={placeholder} />
      {children}
    </FormDiv>
  );
};

export default FormField;
