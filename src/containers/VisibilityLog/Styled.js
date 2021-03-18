import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;

  > .content {
    flex: 1;
    margin: 2px;
    border: 1px solid;
    overflow: auto;
  }
`;
