import React, { useState } from 'react';
import { getToAndFromDates } from 'utils';

export const Job = ({ job, i }) => {
  const [title, setTitle] = useState(job.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [company, setCompany] = useState(job.company);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const [location, setLocation] = useState(job.location);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [responsibilities, setResponsibilities] = useState(job.responsibilities);
  const [isEditingResponsibilities, setIsEditingResponsibilities] = useState(false);

  const [dateRange, setDateRange] = useState(getToAndFromDates(job.startDate, job.endDate));
  const [isEditingDateRange, setIsEditingDateRange] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.innerText);
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.innerText);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.innerText);
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.innerText);
  };

  const handleResponsibilitiesChange = (e) => {
    // setCompany(e.target.innerText);
    console.log("got change");
  };

  return (
    <li key={job.company} className={i % 2 ? `mt-1` : `mt-half`}>
    <div className="flex">
      <div className={`font-bold hover:border-gray-700 border-transparent border-2 ${isEditingCompany ? 'bg-yellow-100' : ''}`}
        onClick={() => setIsEditingCompany(true)}
        onBlur={() => setIsEditingCompany(false)}
        onInput={handleCompanyChange}
        contentEditable={isEditingCompany}
        suppressContentEditableWarning={true}
      >
        {company}
      </div>
      <span className={`font-sans ml-auto text-muted hover:border-gray-700 border-transparent border-2 ${isEditingDateRange ? 'bg-yellow-100' : ''}`}
        onClick={() => setIsEditingDateRange(true)}
        onBlur={() => setIsEditingDateRange(false)}
        onInput={handleDateRangeChange}
        contentEditable={isEditingDateRange}
        suppressContentEditableWarning={true}>
          {dateRange}
      </span>
    </div>
    <div className="flex ">
      <div className={`hover:border-gray-700 border-transparent border-2 ${isEditingTitle ? 'bg-yellow-100' : ''}`}
        onClick={() => setIsEditingTitle(true)}
        onBlur={() => setIsEditingTitle(false)}
        onInput={handleTitleChange}
        contentEditable={isEditingTitle}
        suppressContentEditableWarning={true}
      >
        {title}
      </div>
      <span className={`ml-auto text-muted hover:border-gray-700 border-transparent border-2 ${isEditingLocation ? 'bg-yellow-100' : ''}`}
        onClick={() => setIsEditingLocation(true)}
        onBlur={() => setIsEditingLocation(false)}
        onInput={handleLocationChange}
        contentEditable={isEditingLocation}
        suppressContentEditableWarning={true}
      >{location}</span>
    </div>
    <ul className="list-disc ml-4">
      {responsibilities.map((resp) => (
        <li className={`hover:border-gray-700 border-transparent border-2 ${isEditingResponsibilities ? 'bg-yellow-100' : ''}`} key={resp}
        onClick={() => setIsEditingResponsibilities(true)}
        onBlur={() => setIsEditingResponsibilities(false)}
        onInput={handleResponsibilitiesChange}
        contentEditable={isEditingResponsibilities}
        suppressContentEditableWarning={true}
      >{resp}</li>
      ))}
    </ul>
  </li>
  );
};