import React from 'react';
import styled from 'styled-components';
import { CoverLetterType } from 'types/types';

interface Props {
  coverLetter: CoverLetterType;
}

const CoverLetterContainer = styled.div`
  flex: 2;
  font-size: 18px;
  padding: 10px;
  border: 1px solid #ccc;
  height: 11in;
  width: 100%;

  @media print {
    border: 0px solid #ccc;
    height: 11in;
  }
`;

const CoverLetter = styled.div`
  padding: 20px;
  font-family: 'Times New Roman', Times, serif;
`;

const CoverLetterTemplate: React.FC<Props> = ({ coverLetter }) => {
  const paragraphs = coverLetter.letter.split('\n').map((text, index) => (
    <p key={index}>{text.trim() !== '' ? text : <>&nbsp;</>}</p>
  ));

  return (
    <CoverLetterContainer>
      <CoverLetter>
        <p>{coverLetter.name}</p>
        <p>{coverLetter.address}</p>
        <p>{`${coverLetter.city}, ${coverLetter.state}, ${coverLetter.zip}`}</p>
        <p>{coverLetter.date.toString()}</p>
        <br />
        <p>{coverLetter.companyName}</p>
        <p>Company Address</p>
        <br />
        {paragraphs}
      </CoverLetter>
    </CoverLetterContainer>
  );
};

export default CoverLetterTemplate;
