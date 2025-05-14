import React, { useState } from 'react';

export type DegreeType = 
  | 'High School Diploma'
  | 'GED'
  | "Associate's Degree"
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'PhD'
  | 'Certificate'
  | 'Diploma'
  | 'Professional Certification'
  | 'Trade School'
  | 'Bootcamp'
  | '';

interface DegreePickerProps {
  onChange: (degree: DegreeType) => void;
  initialValue?: DegreeType;
}

export const DegreePicker: React.FC<DegreePickerProps> = ({ onChange, initialValue = '' }) => {
  const [selectedDegree, setSelectedDegree] = useState<DegreeType>(initialValue);

  const handleDegreeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const degree = event.target.value as DegreeType;
    setSelectedDegree(degree);
    onChange(degree);
  };

  return (
      <select className="form-style" value={selectedDegree} onChange={handleDegreeChange}>
        <option value="">Select a degree</option>
        <optgroup label="High School">
          <option value="High School Diploma">High School Diploma</option>
          <option value="GED">GED</option>
        </optgroup>
        <optgroup label="Undergraduate">
          <option value="Associate's Degree">Associate's Degree</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
        </optgroup>
        <optgroup label="Graduate">
          <option value="Master's Degree">Master's Degree</option>
          <option value="PhD">PhD</option>
        </optgroup>
        <optgroup label="Professional & Technical">
          <option value="Certificate">Certificate Program</option>
          <option value="Diploma">Diploma Program</option>
          <option value="Professional Certification">Professional Certification</option>
          <option value="Trade School">Trade School</option>
          <option value="Bootcamp">Coding Bootcamp</option>
        </optgroup>
        <option value="">(Blank)</option>
      </select>
  );
};
