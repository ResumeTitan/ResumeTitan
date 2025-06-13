import React from 'react';
import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import { IconButton, Link } from '@mui/material';
import { BasicsType } from 'types/types';
import Section from './Section';

interface Location {
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
}

interface AboutProps {
  basics: BasicsType;
}

const AboutContainer = styled.div`
  font-size: 16px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
`;

const InfoTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  svg {
    color: #39424B;
    font-size: 20px;
  }
`;

const About: React.FC<AboutProps> = ({ basics }) => {
  const formatAddress = (location: Location) => {
    const { city, region } = location;
    return `${city ? city + ', ' : ''}${region ? region : ''}`;
  };

  return (
    <AboutContainer>
      <Section title={"About"} > 
      {basics.location && (
        <InfoTag>
          <LocationOnIcon />
          {formatAddress(basics.location)}
        </InfoTag>
      )}

      {/* {basics.birthday && (
        <InfoTag>
          <CalendarTodayIcon />
          {`Born in ${basics.birthday}`}
        </InfoTag>
      )} */}

      {basics.email && (
        <InfoTag>
          <a href={`mailto:${basics.email}`}>
            <EmailIcon fontSize='small'/>
          </a>
          <div>
            {basics.email}
          </div>
        </InfoTag>
      )}

      {basics.phone && (
        <InfoTag>
          <PhoneIcon fontSize='small'/>
          <div>
            {basics.phone}
          </div>
        </InfoTag>
      )}

      {basics.url && (
        <InfoTag>
          <a href={basics.url}>
            <LanguageIcon fontSize='small' />
            <Link href={basics.url} target="_blank" rel="noopener noreferrer">
              {basics.url}
            </Link>
          </a>
        </InfoTag>
      )}

      {basics.profiles && basics.profiles.length > 0 && basics.profiles[0].network && basics.profiles.map((profile, index) => (
        <InfoTag key={index}>
          <IconButton component="a" href={profile.url}>
            <LanguageIcon /> {/* Replace with appropriate social media icons */}
          </IconButton>
          <Link href={profile.url} target="_blank" rel="noopener noreferrer">
            {profile.network}: {profile.username}
          </Link>
        </InfoTag>
      ))}
      </Section>
    </AboutContainer>
  );
};

export default About;
