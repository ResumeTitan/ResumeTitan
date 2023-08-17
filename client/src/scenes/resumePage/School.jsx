import React from 'react';

export const School = ({ school, i }) => {
  return (
    <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
      <div className="flex">
        <div className="font-bold">
          {school.name}
        </div>
        <span className="ml-auto text-muted">{school.graduationDate}</span>
      </div>
      <div className="flex">
        <h3>
          {school.degree}, {school.major}
        </h3>
        <span className="ml-auto text-muted">{school.location}</span>
      </div>
      <ul className="list-disc ml-4">
        {school.accomplishments.map((resp) => (
          <li key={resp}>{resp}</li>
        ))}
      </ul>
    </li>
    );
};