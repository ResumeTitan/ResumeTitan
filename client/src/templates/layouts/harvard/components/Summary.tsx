import React from "react";
import { SectionHeading } from '../elements/SectionHeading';

export const Summary = ({
  summary,
}: {
  summary: string;
}) => {
  return (
    <div className="">
      <SectionHeading title="Summary" />
      <div className="flex justify-center items-center p-2">
        {summary}
      </div>
    </div>
  );
};
