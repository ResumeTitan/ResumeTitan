import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // or use react-router-dom's Link component
import RtAnimatedImg from 'assets/rtAnimated.gif';

// Define the styled component that fills the entire page height
const FullPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: between;
  align-items: center;
  height: 100vh; /* Fill the entire page height */
  text-align: center;
  background-color: #115E59; /* Adjust background color as needed */
`;

// Style the image
const LogoImage = styled.img`
  width: 40rem;
  height: auto;
  position-top: 0;
`;

// Style the header
const LargeHeader = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  color: #333; /* Adjust text color as needed */
`;

// Style the button
const LargeButton = styled.button`
  font-size: 36px;
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
`;

const FancyText = styled.span`
  font-size: 4rem; /* Adjust the size as needed */
  font-weight: bold;
  background: linear-gradient(135deg, #FAF0CA, #FCFFFD); /* Gradient from chartreuse green to deep sky blue */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.05); /* Slight scale on hover */
    color: #80cbc4; /* Change color to deep sky blue on hover */
  }
`;

// Create the component
const LandingPage: React.FC = () => {
  const navigate = useNavigate(); // Use history to navigate

  const handleButtonClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <FullPageContainer>
      <LogoImage src={RtAnimatedImg} alt="Logo" /> {/* Replace with your image path */}
      <LargeHeader><FancyText>Creating your resume with AI today</FancyText></LargeHeader>
      <LargeButton onClick={handleButtonClick}>Get Started Now</LargeButton>
    </FullPageContainer>
  );
};

export default LandingPage;
