import React from 'react';

export const School = ({ school, i }) => {
  const formatDate = (date) => {
    const inputDateStr = "2022-05-17";
    const inputDate = new Date(inputDateStr);

    // Options for formatting the date
    const options = { year: 'numeric', month: 'long' };

    // Format the date to "Month, Year" format
    const formattedDate = inputDate.toLocaleString('en-US', options);
    return formattedDate;
  };

  const formattedDate = formatDate(school.graduationDate);

  return (
    <li key={school.name} className={i % 2 ? `mt-1` : `mt-half`}>
      <div className="flex">
        <div className="font-bold">
          {school.name}
        </div>
        <span className="ml-auto text-muted">{formattedDate}</span>
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