import React from "react";
import { PersonalName } from "../elements/PersonalName";
import { PersonalContact } from "../elements/PersonalContact";
import { SectionSubtitle } from "../elements/SectionSubtitle";

export const PersonalInfo = ({
  name,
  label,
  url,
  email,
  phone,
  city,
  image,
}: {
  name: string;
  label: string;
  url: string;
  email: string;
  phone: string;
  city: string;
  image: string;
}) => {
  return (
    <div className="flex justify-center items-center p-2">
      <div>
        <PersonalName name={name} />
        <div className="flex gap-3">
          <PersonalContact text={phone} />
          <PersonalContact text={email} />
          <PersonalContact text={city} />
          {url && (
            <div className="flex gap-2 ml-2 items-center">
              <PersonalContact text={url} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
