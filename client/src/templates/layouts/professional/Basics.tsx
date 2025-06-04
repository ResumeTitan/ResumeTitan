import React from 'react';
import styled from 'styled-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Section from './Section';
import Summary from './Summary';
import { BasicsType } from 'types/types';

// Styled components
const Title = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-top: 25px;
  margin-bottom: 25px;
`;

const BasicInfo = styled.div`
  display: flex;
  gap: 10px 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.0rem;
  svg {
    color: #000;
    margin-right: 5px;
    width: 10px;
  }

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;

interface BasicsComponentProps {
  basics: BasicsType;
}

const BasicsComponent: React.FC<BasicsComponentProps> = ({ basics }) => {
  const { name, url, location, profiles = [], phone, email } = basics;

  const linkedin = profiles.find(({ network }) => network === 'linkedin');
  const github = profiles.find(({ network }) => network === 'github');
  const twitter = profiles.find(({ network }) => network === 'twitter');

  return (
    <Section>
      <Title>{name}</Title>
      <div className="secondary">
        <BasicInfo>
          {location && location.city && (
            <Info>
              <LocationOnIcon />
              {location.city}, {location.region}
            </Info>
          )}
          {email && (
            <Info>
              <EmailIcon />
              {email}
            </Info>
          )}
          {phone && (
            <Info>
              <PhoneIcon />
              {phone}
            </Info>
          )}
          {url && (
            <Info>
              <LinkIcon />
              <a href={url}>{url}</a>
            </Info>
          )}
          {linkedin && (
            <Info>
              <LinkedInIcon />
              <a href={`https://linkedin.com/${linkedin.username}`}>
                {linkedin.username}
              </a>
            </Info>
          )}
          {github && (
            <Info>
              <GitHubIcon />
              <a href={`https://github.com/${github.username}`}>
                {github.username}
              </a>
            </Info>
          )}
          {twitter && (
            <Info>
              <TwitterIcon />
              <a href={`https://twitter.com/${twitter.username}`}>
                {twitter.username}
              </a>
            </Info>
          )}
        </BasicInfo>
        <Summary basics={basics}/>
      </div>
    </Section>
  );
};

export default BasicsComponent;
