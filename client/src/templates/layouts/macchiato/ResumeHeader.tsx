import React from 'react';
import styled from 'styled-components';
import { BasicsType } from 'types/types';

interface ResumeHeaderProps {
  basics: BasicsType;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h1`
  font-family: "Josefin Sans", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 1.5px;
`;

const Label = styled.h2`
  font-family: "Josefin Sans", Helvetica, Arial, sans-serif;
  font-weight: 300;
  font-size: 16px;
  letter-spacing: 0.5px;
`;

const ProfilePic = styled.div`
  img {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    border: 2px solid #56817A;
  }
`;

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ basics }) => {
  if (!basics) return null;

  return (
    <Header>
      <ProfileHeader>
        <Name>{basics.name}</Name>
        <Label>{basics.label}</Label>
      </ProfileHeader>
      {/* {basics.picture && (
        <ProfilePic>
          <img src={basics.picture} alt="profile-pic" />
        </ProfilePic>
      )} */}
    </Header>
  );
};

export default ResumeHeader;
