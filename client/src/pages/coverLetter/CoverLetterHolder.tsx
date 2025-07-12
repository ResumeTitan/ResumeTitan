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
  width: 8.5in;
  max-width: 8.5in;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  background: white;

  @media print {
    border: 0px solid #ccc;
    box-shadow: none;
  }

  &.pdf-export {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    height: 11in !important;
    width: 8.5in !important;
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

  return (
    <CoverLetterContainer>
      <CoverLetter>
        <p>{coverLetter.name}</p>
        <p>{`${coverLetter.city || '[City]'}, ${coverLetter.state || '[State]'}`}</p>
        <p>{new Date(coverLetter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <br />
        <p>{`${coverLetter.jobTitle || '[Job Title]'}`}</p>
        <p>{`${coverLetter.company || '[Company Name]'}`}</p>
        <br />
        {paragraphs}
      </CoverLetter>
    </CoverLetterContainer>
  );
};

export default CoverLetterTemplate;
