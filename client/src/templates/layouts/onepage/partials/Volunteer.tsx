import React from 'react';
import { VolunteerType } from 'types/types';
import { SectionContent, SectionBlock, SectionName } from './Partials';

interface VolunteerSectionProps {
  volunteer: VolunteerType[];
}

const VolunteerSection: React.FC<VolunteerSectionProps> = ({ volunteer }) => {
  return (
    <>
      {volunteer.length > 0 && (
        <SectionBlock>
          <SectionName>
            <span>VOLUNTEER</span>
          </SectionName>
          <SectionContent>
            {volunteer.map((vol, index) => (
              <React.Fragment key={index}>
                <div className="blockHeader">
                  <span className="title">
                    {vol.organization && vol.organization}
                    {vol.position && `, ${vol.position}`}
                  </span>
                  {vol.startDate && (
                    <span className="date">
                      {vol.startDate} &mdash; {vol.endDate || 'Present'}
                    </span>
                  )}
                  {vol.url && (
                    <div className="website">
                      <a href={vol.url}>{vol.url}</a>
                    </div>
                  )}
                  {vol.highlights && vol.highlights.length > 0 && (
                    <ul className="highlights">
                      {vol.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </React.Fragment>
            ))}
          </SectionContent>
        </SectionBlock>
      )}
    </>
  );
};

export default VolunteerSection;
