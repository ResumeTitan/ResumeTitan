import React, { useState } from 'react';
import { formatDate } from 'utils';

export const School = ({ school, i }) => {

  const formattedDate = formatDate(school.graduationDate);
  const [isEditingDegree, setIsEditingDegree] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingMajor, setIsEditingMajor] = useState(false);
  const [isEditingGraduationDate, setIsEditingGraduationDate] = useState(false);
  const [isEditingAccomplishments, setIsEditingAccomplishments] = useState(false);

  return (
    <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
      <div className="flex">
        <div 
          className="font-bold hover:border-gray-700 border-2 border-transparent"
          onClick={() => setIsEditingName(true)}
          onBlur={() => setIsEditingName(false)}
          contentEditable={isEditingName}
        >
          {school.name}
        </div>
        <span 
          className="ml-auto text-muted hover:border-gray-700 border-2 border-transparent"
          onClick={() => setIsEditingGraduationDate(true)}
          onBlur={() => setIsEditingGraduationDate(false)}
          contentEditable={isEditingGraduationDate}
        >{formattedDate}</span>
      </div>
      <div className="flex">
        <h3
          className="hover:border-gray-700 border-2 border-transparent"
          onClick={() => setIsEditingDegree(true)}
          onBlur={() => setIsEditingDegree(false)}
          contentEditable={isEditingDegree}
        >
          {school.degree}, {school.major}
        </h3>
        <span 
          className="ml-auto text-muted hover:border-gray-700 border-2 border-transparent"
          onClick={() => setIsEditingLocation(true)}
          onBlur={() => setIsEditingLocation(false)}
          contentEditable={isEditingLocation}
        >{school.location}</span>
      </div>
      <ul className="list-disc ml-4">
        {school.accomplishments.map((resp) => (
          <li 
            key={resp}
            className="hover:border-gray-700 border-2 border-transparent"
            onClick={() => setIsEditingAccomplishments(true)}
            onBlur={() => setIsEditingAccomplishments(false)}
            contentEditable={isEditingAccomplishments}
          >{resp}</li>
        ))}
      </ul>
    </li>
    );
};