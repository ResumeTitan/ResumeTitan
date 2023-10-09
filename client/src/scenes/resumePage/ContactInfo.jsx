import React, { useCallback } from 'react';

import "index.css";

export const ContactInfo = (props) => {
  const cleanLink = useCallback((link) => {
    return link.replace(/^https?:\/\//, '').replace(/^www\./, '');
  }, []);

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters from the input
    if (phone) {
      const digitsOnly = phone.replace(/\D/g, '');

      // Format the phone number
      let formattedNumber = '';
      if (digitsOnly.length >= 3) {
        formattedNumber += `(${digitsOnly.slice(0, 3)})`;
      }
      if (digitsOnly.length >= 6) {
        formattedNumber += ` ${digitsOnly.slice(3, 6)}`;
      }
      if (digitsOnly.length > 6) {
        formattedNumber += `-${digitsOnly.slice(6)}`;
      }
  
      return formattedNumber;
    } else {
      return phone;
    }
  };

  return (
    <div className="text-center">
      <h2 className="hover:border-blue-500 transition duration-300 font-bold mt-4">{props.firstName} {props.lastName}</h2>

      <div className="resumeContent">
        <a href={`mailto:${props.email}`}>{props.email}</a>
        {true && (
          <>
            <span className="mx-2">•</span>
            <a className="font-sans" href={`tel:${props.phone}`}>{formatPhoneNumber(props.phone)}</a>
          </>
        )}

        {false && (
          <>
            <span className="mx-2">•</span>
            <a href={"config.contactInfo.secondLink"}>{cleanLink("config.contactInfo.secondLink")}</a>
          </>
        )}
      </div>
    </div>
  );
};
