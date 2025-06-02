import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import RtAnimatedImg from 'assets/rtAnimated.gif';
import AnimatedLogo from '../../components/AnimatedLogo';

// Animation keyframes
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
    height: 100svh; /* Use small viewport height for mobile */
    min-height: -webkit-fill-available; /* Safari fallback */
  }

  @media (max-width: 480px) {
    font-size: 16px; /* Smallest font size for very small screens */
    height: 100svh; /* Use small viewport height for mobile */
    min-height: -webkit-fill-available; /* Safari fallback */
  }
`;

// Style the header
const LargeHeader = styled.h1`
  margin-bottom: 20px;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out 0.5s forwards;

  @media (min-width: 1024px) {
    text-align: left; /* Align text to the left on desktop */
    margin-bottom: 40px;
  }
`;

// Style the button
const GetStartedButton = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  padding: 16px 32px;
  cursor: pointer;
  transition: background-color 0.3s;
  opacity: 0;
  animation: ${fadeInUp} 1s ease-out 1s forwards;

  &:hover {
    background-color: #082421;
    color: white;
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
      <AnimatedLogo />
      <LargeHeader>
        <FancyText>Creating your resume with AI today</FancyText>
      </LargeHeader>
      <GetStartedButton className="login-button p-5" onClick={handleButtonClick}>Get Started Now</GetStartedButton>
    </FullPageContainer>
  );
};

export default LandingPage;
