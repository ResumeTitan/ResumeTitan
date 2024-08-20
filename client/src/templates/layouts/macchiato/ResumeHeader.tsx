import React from 'react';
import styled from 'styled-components';
import { BasicsType } from 'types/types';

interface ResumeHeaderProps {
  basics: BasicsType;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  clear: both;
`;

const ProfileHeader = styled.div`
  h1 {
    font-size: 2rem;
    margin: 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0;
    color: gray;
  }
`;

const ProfilePic = styled.div`
  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
`;

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ basics }) => {
  return (
    <Header className="resume-header">
      <ProfileHeader className="profile-header">
        <h1>{basics.name}</h1>
        <h2>{basics.label}</h2>
      </ProfileHeader>
      {/* {basics.picture && (
        <ProfilePic className="profile-pic">
          <img src={basics.picture} alt="profile-pic" />
        </ProfilePic>
      )} */}
    </Header>
  );
};

export default ResumeHeader;
