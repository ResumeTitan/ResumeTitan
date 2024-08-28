import React from 'react';
import styled from 'styled-components';
import { CoverLetterType } from 'types/types';

interface Props {
  coverLetter: CoverLetterType;
}

const CoverLetterContainer = styled.div`
  flex: 2;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  width: 100%;

  @media print {
    border: 0px solid #ccc;
    height: 11in;
  }

  // width: 100%; /* Set width to 100% of its container */
  // padding-top: 141.4%; /* The height is set as a percentage of the width to maintain the aspect ratio */
  // position: relative; /* This is necessary for the content inside the container */
  
  // @media (max-width: 768px) {
  //   padding-top: 141.4%;
  // }
  
  // @media (min-width: 768px) {
  //   width: 210mm; /* Set the width explicitly for larger screens */
  //   height: 297mm; /* Set the height explicitly for larger screens */
`;

const CoverLetter = styled.div`
  padding: 20px;
  font-family: 'Times New Roman', Times, serif;
`;

const CoverLetterTemplate: React.FC<Props> = ({ coverLetter }) => {
  const paragraphs = coverLetter.letter ? coverLetter.letter.split('\n').map((text, index) => (
    <p key={index}>{text.trim() !== '' ? text : <>&nbsp;</>}</p>
  )) : null;

  console.log(coverLetter.date);

  return (
    <CoverLetterContainer>
      <CoverLetter>
        <p>{coverLetter.name}</p>
        <p>{`${coverLetter.city || '[City]'}, ${coverLetter.state || '[State]'}`}</p>
        <p>{new Date(coverLetter.date).toDateString()}</p>
        <br />
        <p>{`${coverLetter.jobTitle || '[Job Title]'}`}</p>
        <p>{`${coverLetter.companyName || '[Company Name]'}`}</p>
        <br />
        {paragraphs}
      </CoverLetter>
    </CoverLetterContainer>
  );
};

export default CoverLetterTemplate;
