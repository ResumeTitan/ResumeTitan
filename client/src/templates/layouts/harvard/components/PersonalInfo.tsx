import React from "react";
import { PersonalName } from "../elements/PersonalName";
import { PersonalContact } from "../elements/PersonalContact";
import { IBasicsType } from 'types/types';

interface Props {
  basics: IBasicsType
}

export const PersonalInfo = ({ basics }: Props) => {
  console.log(basics);
  return (
    <div className="flex justify-center items-center p-2">
      <div>
        <PersonalName name={basics?.name} />
        <div className="flex gap-3">
          {basics?.label && (
            <PersonalContact text={basics?.label} />
          )}
          {basics?.phone && (
            <PersonalContact text={basics.phone} />
          )}
          {basics?.email && (
            <PersonalContact text={basics?.email} />
          )}
          {basics?.city && (
            <PersonalContact text={basics.city} />
          )}
          {basics?.url && (
            <div className="flex gap-2 ml-2 items-center">
              <PersonalContact text={basics.url} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
