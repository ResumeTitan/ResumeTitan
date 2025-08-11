import React from 'react';
import styled from 'styled-components';
import { BasicsType } from 'types/types';

const Name = styled.div`
  font-size: 20pt;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1mm;
  line-height: 1.1;
`;

const Contact = styled.div`
  text-align: center;
  font-size: 10pt;
  margin-bottom: 4mm;
  line-height: 1.2;
`;

const Basics: React.FC<{ basics: BasicsType }> = ({ basics }) => {

  return (
    <>
      <Name>{basics?.name || 'Your Name'}</Name>
      <Contact>
        {basics?.email} {basics?.phone && <>| {basics.phone}</>} {basics?.url && <>| {basics.url}</>}
        {basics?.profiles && basics.profiles[0]?.url && <> | {basics.profiles[0].url}</>}
        {basics?.location && basics?.location.city && basics?.location.region && <> | {basics.location.city}, {basics.location.region}</>}
      </Contact>
    </>
  );
};

export default Basics; 