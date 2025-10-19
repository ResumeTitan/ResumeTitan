import React from 'react';
import { FormDiv, FormLabel, FormTextArea } from 'components/Form/styled';

// Define the props interface for SectionComponent
interface SectionComponentProps {
  title?: string;
  rows?: number;
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  children?: React.ReactNode;
}

const FormArea: React.FC<SectionComponentProps> = ({ title, rows, value, onChange, children }) => {
  return (
    <FormDiv>
      <FormLabel>
        {title && (
          <>
            <h4>{title}</h4>
          </>
        )}
      </FormLabel>
      <FormTextArea value={value} rows={rows} onChange={onChange}/>
      {children}
    </FormDiv>
  );
};

export default FormArea;
