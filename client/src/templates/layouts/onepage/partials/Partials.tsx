import styled from 'styled-components';

export const SectionBlock = styled.div`
  display: flex;
  width: 100%;
`;

export const SectionContent = styled.div`
  width: 80%;
  vertical-align: top;
  display: inline-block;

  ul {
    padding-left: 20px;
    margin-top: 6px;
    list-style-type: circle;
  }

  .title {
    font-weight: bold;
  }

  .date {
    float: right;
  }

  .separator {
    height: 14px;
  }

  @media only screen and (max-width: 40em) {
    width: 100%;

    .date {
      padding-right: 2em;
    }
  }
`;

export const SectionName = styled.div`
  width: 18%;
  vertical-align: top;
  display: inline-block;
`;
