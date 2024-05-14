import React, { useState } from 'react';

type DegreeType = 'Bachelor' | 'Master' | 'PhD' | '';

interface DegreePickerProps {
  onChange: (degree: DegreeType) => void;
}

const DegreePicker: React.FC<DegreePickerProps> = ({ onChange }) => {
  const [selectedDegree, setSelectedDegree] = useState<DegreeType>('');

  const handleDegreeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const degree = event.target.value as DegreeType;
    setSelectedDegree(degree);
    onChange(degree);
  };

  return (
      <select className="form-style" value={selectedDegree} onChange={handleDegreeChange}>
        <option value="">Select a degree</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
        <option value="PhD">PhD</option>
        <option value="">(Blank)</option>
      </select>
  );
};

export default DegreePicker;
