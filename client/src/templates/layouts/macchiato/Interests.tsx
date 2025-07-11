import React from 'react';
import styled from 'styled-components';
import { InterestType } from 'types/types';

interface InterestsProps {
  interests: InterestType[];
}

const InterestsContainer = styled.div`
  .interests-container {
    margin-bottom: 15px;
  }
`;

const InterestSection = styled.section`
  padding-top: 20px;
  margin-bottom: 15px;
`;

const InterestName = styled.h3`
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`;

const KeywordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Keyword = styled.h6`
  font-weight: 400;
  font-size: 10px;
  margin: 0.15em;
  background: ghostwhite;
  border-radius: 5px;
  padding: 2px 6px;
`;

const Interests: React.FC<InterestsProps> = ({ interests }) => {
  if (!interests || !interests.length) return null;

  return (
    <InterestsContainer>
      <div className="interests-container">
        {interests.map((interest, index) => (
          <InterestSection key={index}>
            {interest.name && <InterestName>{interest.name}</InterestName>}
            {interest.keywords && interest.keywords.length > 0 && (
              <KeywordsContainer>
                {interest.keywords.map((keyword, idx) => (
                  <Keyword key={idx}>{keyword}</Keyword>
                ))}
              </KeywordsContainer>
            )}
          </InterestSection>
        ))}
      </div>
    </InterestsContainer>
  );
};

export default Interests; 