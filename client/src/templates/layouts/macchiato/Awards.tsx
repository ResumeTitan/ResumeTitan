import React from 'react';
import styled from 'styled-components';
import { AwardType } from 'types/types';

interface AwardsProps {
  awards: AwardType[];
}

const AwardsContainer = styled.div`
  .awards-container {
    margin-bottom: 15px;
  }
`;

const AwardSection = styled.section`
  padding-top: 20px;
  margin-bottom: 15px;
`;

const AwardTitle = styled.h3`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`;

const AwardAwarder = styled.h4`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
`;

const AwardDate = styled.h5`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #888;
  margin-bottom: 6px;
`;

const AwardSummary = styled.p`
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #333;
  line-height: 1.3;
  margin: 0;
`;

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

const Awards: React.FC<AwardsProps> = ({ awards }) => {
  if (!awards || !awards.length) return null;

  return (
    <AwardsContainer>
      <div className="awards-container">
        {awards.map((award, index) => (
          <AwardSection key={index}>
            {award.title && <AwardTitle>{award.title}</AwardTitle>}
            {award.awarder && <AwardAwarder>{award.awarder}</AwardAwarder>}
            {award.date && <AwardDate>{formatDate(award.date)}</AwardDate>}
            {award.summary && <AwardSummary>{award.summary}</AwardSummary>}
          </AwardSection>
        ))}
      </div>
    </AwardsContainer>
  );
};

export default Awards; 