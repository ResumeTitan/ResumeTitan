import React from "react";
import styled from "styled-components";
import { BasicsType } from "types/types";
import { SectionContent, SectionBlock, SectionName } from './Partials';

interface BasicsComponentProps {
  basics: BasicsType;
}

const Name = styled.span`
  font-size: 26px;
`;

const SectionLine = styled.div`
  border-style: dashed;
  border-width: 1px;
  border-color: #CFCFCF;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SmallFont = styled.div`
  font-size: 1.0rem;
`;

const Divider = styled.span`
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
`;

const BasicsComponent: React.FC<BasicsComponentProps> = ({ basics }) => {
  // Destructure basics object
  const { name, label, email, phone, location, profiles, summary, url } = basics;

  return (
    <div>
      {name && (
        <>
          <Name>{name}</Name>
          {label && <span>{label}</span>}
        </>
      )}

      {email || phone || location || url ? (
        <SmallFont id="basicsBlock">
          <div className="contactBlock">
            {email && <span className="email">{email}</span>}
            {phone && (
              <>
                <Divider>|</Divider>
                <span className="phone">{phone}</span>
              </>
            )}
            {location && (
              <>
                <Divider>|</Divider>
                <span className="address">
                  {location.city && location.city}
                  {location.region && `, ${location.region}`}
                </span>
              </>
            )}
            {url && (
              <>
                <Divider>|</Divider>
                <span className="website">
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </span>
              </>
            )}
          </div>
          {profiles && profiles.length > 0 && profiles[0].network && (
            <div id="profilesBlock">
              {profiles.map((profile, index) => (
                <span key={index} className="url">
                  <b>{profile.network}:</b>{" "}
                  <a href={profile.url}>{profile.url}</a>
                  {index !== profiles.length - 1 && (
                    <span className="divider">|</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </SmallFont>
      ) : null}

      {summary && (
        <>
          <SectionLine />
          <SectionBlock>
            <SectionName>
              <span>SUMMARY</span>
            </SectionName>
            <SectionContent>
              <span>{summary}</span>
            </SectionContent>
          </SectionBlock>
        </>
      )}
    </div>
  );
};

export default BasicsComponent;
