import React from 'react';
import styled from 'styled-components';

interface Props {
  name: string;
  email: string;
  coverLetter: string;
}

const CoverLetterContainer = styled.div`
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  min-height: 11in; /* to simulate letter size paper */
  max-height: 11in;
  width: 8.5in;
`;

const CoverLetter = styled.div`
  padding: 20px;
  font-family: 'Times New Roman', Times, serif;
`;


const CoverLetterTemplate: React.FC<Props> = ({
  coverLetter,
}) => {
  return (
    <CoverLetterContainer>
      <CoverLetter>
        <p>John Doe</p>
        <p>123 Main Street</p>
        <p>City, State, ZIP</p>
        <p>Date</p>
        <br />
        <p>Recipient Name</p>
        <p>Company</p>
        <p>Company Address</p>
        <br />
        <p>Dear Recipient Name,</p>
        <p>
          I am writing to express my interest in the position at Company. I believe my
          experience and skills align well with the requirements of the job, and I am confident
          I can contribute positively to your team.
        </p>
        <p>
          Thank you for considering my application. I look forward to the opportunity to
          discuss how I can contribute to your team.
        </p>
        <br />
        <p>Sincerely,</p>
        <p>John Doe</p>
      </CoverLetter>
    </CoverLetterContainer>
  );
};

export default CoverLetterTemplate;
