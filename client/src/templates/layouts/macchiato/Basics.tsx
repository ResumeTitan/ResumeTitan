import React from 'react';
import styled from 'styled-components';
import { BasicsType } from 'types/types';

interface BasicsProps {
  basics: BasicsType;
}

const Header = styled.header`
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: gray;
  }
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
`;

const Contact = styled.div`
  margin-bottom: 1.5rem;
  div {
    margin-bottom: 0.5rem;
  }

  strong {
    display: inline-block;
    width: 80px;
  }
`;

const Summary = styled.div`
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const LocationSection = styled.section`
  h3 {
    margin-bottom: 0.5rem;
  }

  div {
    margin-bottom: 0.5rem;
  }

  strong {
    display: inline-block;
    width: 120px;
  }
`;

const ProfilesSection = styled.section`
  h3 {
    margin-bottom: 0.5rem;
  }

  .item {
    margin-bottom: 0.5rem;
  }

  .network {
    display: inline-block;
    width: 120px;
    font-weight: bold;
  }

  .url a {
    text-decoration: none;
    color: blue;
  }
`;

const BasicsComponent: React.FC<BasicsProps> = ({ basics }) => {
  return (
    <div>
      <Header>
        <h1>{basics.name}</h1>
        <h2>{basics.label}</h2>
      </Header>

      <Section id="basics">
        <Contact className="contact">
          {basics.url && (
            <div className="website">
              <strong>Website:</strong> {basics.url}
            </div>
          )}
          {basics.email && (
            <div className="email">
              <strong>Email:</strong> {basics.email}
            </div>
          )}
          {basics.phone && (
            <div className="phone">
              <strong>Phone:</strong> {basics.phone}
            </div>
          )}
        </Contact>

        {basics.summary && (
          <Summary className="summary">
            <p>{basics.summary}</p>
          </Summary>
        )}

        {basics.location && (
          <LocationSection id="location">
            <h3>Location</h3>
            {basics.location.address && (
              <div className="address">
                <strong>Address:</strong> {basics.location.address}
              </div>
            )}
            {basics.location.postalCode && (
              <div className="postalCode">
                <strong>Postal code:</strong> {basics.location.postalCode}
              </div>
            )}
            {basics.location.city && (
              <div className="city">
                <strong>City:</strong> {basics.location.city}
              </div>
            )}
            {basics.location.countryCode && (
              <div className="countryCode">
                <strong>Country code:</strong> {basics.location.countryCode}
              </div>
            )}
            {basics.location.region && (
              <div className="region">
                <strong>Region:</strong> {basics.location.region}
              </div>
            )}
          </LocationSection>
        )}

        {basics.profiles && basics.profiles.length > 0 && (
          <ProfilesSection id="profiles">
            <h3>Profiles</h3>
            {basics.profiles.map((profile, index) => (
              <div key={index} className="item">
                {profile.network && (
                  <strong className="network">{profile.network}</strong>
                )}
                {profile.username && (
                  <div className="username">{profile.username}</div>
                )}
                {profile.url && (
                  <div className="url">
                    <a href={profile.url} target="_blank" rel="noopener noreferrer">Link</a>
                  </div>
                )}
              </div>
            ))}
          </ProfilesSection>
        )}
      </Section>
    </div>
  );
};

export default BasicsComponent;
