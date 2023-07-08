import React, { useCallback } from 'react';

import "index.css";

export const ContactInfo = (props) => {
  const cleanLink = useCallback((link) => {
    return link.replace(/^https?:\/\//, '').replace(/^www\./, '');
  }, []);

  return (
    <div className="text-center">
      <h2 className="hover:border-blue-500 transition duration-300 font-bold">{props.firstName} {props.lastName}</h2>

      <h3>contactInfo.title</h3>

      <div className="resumeContent">
        <a href={`mailto:${props.email}`}>{props.email}</a>
        {true && (
          <>
            <span className="mx-2">•</span>
            <a href={`tel:${props.phone}`}>{"123-456-7890"}</a>
          </>
        )}

        {true && (
          <>
            <span className="mx-2">•</span>
            <a href={"config.contactInfo.secondLink"}>{cleanLink("config.contactInfo.secondLink")}</a>
          </>
        )}
      </div>
    </div>
  );
};
