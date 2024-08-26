import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import RtAnimatedImg from 'assets/rtAnimated.gif';

// Define the styled component that fills the entire page height
const FullPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; /* Fill the entire page height */
  text-align: center;
  background-color: #115E59; /* Adjust background color as needed */
  font-size: 24px;

  // @media (min-width: 1024px) {
  //   background-color: white; /* White background for desktop */
  //   flex-direction: row; /* Horizontal layout on desktop */
  //   justify-content: space-between;
  //   align-items: flex-start;
  //   position: relative;
  // }

  @media (max-width: 1024px) {
    font-size: 20px; /* Slightly smaller font size for tablets and smaller laptops */
  }

  @media (max-width: 768px) {
    font-size: 18px; /* Smaller font size for mobile devices */
  }

  @media (max-width: 480px) {
    font-size: 16px; /* Smallest font size for very small screens */
  }
`;

// Style the image
const LogoImage = styled.img`
  height: 50vh;
  margin-bottom: 10px;

  // @media (min-width: 1024px) {
  //   height: auto; /* Let it scale naturally */
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   background-color: #115E59; /* Green background for the logo */
  //   border-radius: 0 0 0 50px; /* Round only the bottom-left corner */
  //   width: 300px; /* Set a fixed width for the image */
  //   height: 300px; /* Set a fixed height for the image */
  //   padding: 20px; /* Add padding inside the image container */
  // }
`;

// Style the header
const LargeHeader = styled.h1`
  margin-bottom: 20px;    

  @media (min-width: 1024px) {
    text-align: left; /* Align text to the left on desktop */
    margin-bottom: 40px;
  }
`;

// Style the button
const LargeButton = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  padding: 16px 32px;
  background-color: #88abcb; /* Primary button color */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #082421; /* Darker shade on hover */
  }

  // @media (min-width: 1024px) {
  //   align-self: flex-start; /* Align button to the left on desktop */
  // }
`;

const FancyText = styled.span`
  font-size: 2rem; /* Adjust the size as needed */
  padding: 8px;
  font-weight: bold;
  background: linear-gradient(135deg, #FAF0CA, #FCFFFD); /* Gradient text */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:hover {
    transform: scale(1.10); /* Slight scale on hover */
    color: #80cbc4; /* Change color on hover */
  }

  // @media (min-width: 1024px) {
  //   color: #000;
  // }
`;

// Create the component
const LandingPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate(); // Use history to navigate

  const handleButtonClick = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <FullPageContainer>
      <LogoImage src={RtAnimatedImg} alt="Logo" />
      <LargeHeader>
        <FancyText>Creating your resume with AI today</FancyText>
      </LargeHeader>
      <LargeButton onClick={handleButtonClick}>Get Started Now</LargeButton>
    </FullPageContainer>
  );
};

export default LandingPage;
