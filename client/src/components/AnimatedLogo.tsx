import React from 'react';
import styled, { keyframes } from 'styled-components';
import logoWhiteGearInner from '../assets/logo-white-gear-inner.png';
import logoWhiteGearOuter from '../assets/logo-white-gear-outer.png';

// Animation keyframes
const rotateCounterClockwise = keyframes`
  0% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-180deg);
  }
`;

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.6));
  }
`;

// Main container
const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 50vh;
  margin-top: 80px;
  position: relative;

  @media (max-width: 768px) {
    margin-top: 60px;
  }

  @media (max-width: 480px) {
    margin-top: 40px;
  }

  @media (max-width: 320px) {
    margin-top: 30px;
  }
`;

// Container for the gear system
const GearSystem = styled.div`
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    width: 270px;
    height: 270px;
  }
  
  @media (max-width: 480px) {
    width: 220px;
    height: 220px;
  }
`;

// Inner gear (stationary)
const InnerGear = styled.img`
  position: absolute;
  width: 110px;
  height: 125px;
  z-index: 2;
  animation: ${glow} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

// Outer gear (rotating around inner gear)
const OuterGear = styled.img`
  position: absolute;
  width: 320px;
  height: 320px;
  z-index: 1;
  animation: ${rotateCounterClockwise} 9s ease-in-out infinite;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    width: 270px;
    height: 270px;
  }
  
  @media (max-width: 480px) {
    width: 220px;
    height: 220px;
  }
`;

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <LogoContainer className={className}>
      <GearSystem>
        <OuterGear src={logoWhiteGearOuter} alt="Outer Gear" />
        <InnerGear src={logoWhiteGearInner} alt="Inner Gear" />
      </GearSystem>
    </LogoContainer>
  );
};

export default AnimatedLogo;
