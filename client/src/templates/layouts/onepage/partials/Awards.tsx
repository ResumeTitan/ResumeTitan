import React from "react";
import styled from "styled-components";
import { SectionContent, SectionBlock } from './Partials';

const SectionName = styled.div`
  width: 18%;
  vertical-align: top;
  display: inline-block;

  @media only screen and (max-width: 40em) {
    width: auto;
  }
`;

const BlockHeader = styled.div`
  margin-bottom: 10px;
`;

const HighlightList = styled.ul`
  margin-bottom: 0;
`;

const ListItem = styled.li`
  margin-bottom: 2px;
`;

interface Award {
  title: string;
  awarder?: string;
  date?: string;
  highlights?: string[];
}

interface AwardsProps {
  awards: Award[];
}

const Awards: React.FC<AwardsProps> = ({ awards }) => {
  if (awards.length === 0) return null;

  return (
    <SectionBlock>
      <SectionName>
        <span>AWARDS</span>
      </SectionName>
      <SectionContent>
        {awards.map((award, index) => (
          <React.Fragment key={index}>
            <BlockHeader>
              <span className="title">
                {award.title}
                {award.awarder && `, ${award.awarder}`}
              </span>
              {award.date && (
                <span className="date">
                  <span className="date">{award.date}</span>
                </span>
              )}
            </BlockHeader>
            {award.highlights && award.highlights.length > 0 && (
              <HighlightList className="highlights">
                {award.highlights.map((highlight, idx) => (
                  <ListItem key={idx}>{highlight}</ListItem>
                ))}
              </HighlightList>
            )}
            {index < awards.length - 1 && <div className="separator"></div>}
          </React.Fragment>
        ))}
      </SectionContent>
    </SectionBlock>
  );
};

export default Awards;
