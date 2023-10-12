import styled from 'styled-components';

interface StyleProps {
  jc?: string;
  ai?: string;
  rGap?: string;
  cGap?: string;
}

export const Flex = styled.div<StyleProps>`
  display: flex;
  justify-content: ${(props) => props.jc};
  align-items: ${(props) => props.ai};
  row-gap: ${(props) => props.rGap};
  column-gap: ${(props) => props.cGap};
`;

export const FlexCol = styled(Flex)`
  flex-direction: column;
`;

export const FlexRow = styled(Flex)`
  flex-direction: row;
`;

export const FlexHC = styled(Flex)`
  justify-content: center;
`;

export const FlexVC = styled(Flex)`
  align-items: center;
`;

export const FlexHVC = styled(Flex)`
  justify-content: center;
  align-items: center;
`;
