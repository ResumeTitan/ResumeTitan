import React from 'react';
import styled from 'styled-components';
import List from './List';
import DateComponent from './Date';
import DateRange from './DateRange';

// Styled components
const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.35rem;
  margin-bottom: 3px;
`;

const SubTitle = styled.div`
  font-style: italic;
  font-size: 1.2rem;
  margin-bottom: 3px;
`;

const Container = styled.div`
  margin-bottom: 10px;
`;

const Summary = styled.p`
  margin-bottom: 5px;
`;

// Define the props interface
interface ExperienceProps {
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  subTitle?: string;
  summary?: string;
  highlights?: string[];
}

const Experience: React.FC<ExperienceProps> = ({
  title,
  date,
  startDate,
  endDate,
  subTitle,
  summary,
  highlights,
}) => {
  return (
    <Container>
      <Meta>
        <Title>{title}</Title>
        <div className="secondary">
          {date ? (
            <DateComponent date={date} />
          ) : (
            <DateRange startDate={startDate} endDate={endDate} />
          )}
        </div>
      </Meta>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
      <div className="secondary">
        {summary && <Summary>{summary}</Summary>}
        {highlights && <List items={highlights} />}
      </div>
    </Container>
  );
};

export default Experience;
