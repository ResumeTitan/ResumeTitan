import React from "react";
import { SectionHeading } from "../elements/SectionHeading";

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection = ({ skills }: SkillsSectionProps) => {
  return (
    <div>
      <div className="p-2">
        <SectionHeading title="Skills" />
      </div>
      <div className="p-2">
        <ul className="leading-5 grid grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-center">
            <span className="h-1 w-1 rounded-full bg-black mr-2"></span>
            {skill}
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
};