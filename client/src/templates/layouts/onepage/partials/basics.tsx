import React from "react";

interface Profile {
  network: string;
  url: string;
}

interface Location {
  city?: string;
  region?: string;
  countryCode?: string;
}

interface BasicsProps {
  basics: {
    name?: string;
    label?: string;
    email?: string;
    phone?: string;
    location?: Location;
    profiles?: Profile[];
    summary?: string;
  };
}

const BasicsComponent: React.FC<BasicsProps> = ({ basics }: BasicsProps) => {
  // Destructure basics object
  const { name, label, email, phone, location, profiles, summary } = basics;

  return (
    <div>
      {name && (
        <div id="nameBlock" className="largeFont">
          <span className="name">{name}</span>
          {label && <span className="label">{label}</span>}
        </div>
      )}

      {email || phone || location ? (
        <div id="basicsBlock" className="smallFont">
          <div className="contactBlock">
            {email && <span className="email">{email}</span>}
            {phone && (
              <>
                <span className="divider">|</span>
                <span className="phone">{phone}</span>
              </>
            )}
            {location && (
              <>
                <span className="divider">|</span>
                <span className="address">
                  {location.city && location.city}
                  {location.region && `, ${location.region}`}
                  {location.countryCode && `, ${location.countryCode}`}
                </span>
              </>
            )}
          </div>
          {profiles && profiles.length > 0 && (
            <div id="profilesBlock">
              {profiles.map((profile: any, index: number) => (
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
        </div>
      ) : null}

      {summary && (
        <>
          <div className="sectionLine"></div>
          <div id="summaryBlock" className="sectionBlock">
            <div className="sectionName">
              <span>SUMMARY</span>
            </div>
            <div className="sectionContent">
              <span>{summary}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BasicsComponent;
