import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  background: var(--header-color);
  width: 100%;
  font-size: 0.75rem;
  display: flex;
  /* line-height: 100%; */
  justify-content: space-evenly;
  align-items: center;
  /* padding: calc(var(--main-padding) / 4); */
  text-shadow:
   -1px -1px 1px #00000099,  
    1px -1px 1px #00000099,
    -1px 1px 1px #00000099,
     1px 1px 1px #00000099;

  & > div {
    width: 30%;
    text-align: center;
  }
`;

function InfoBar(props) {
  return (
    <Bar labels={props.labels}>
      <div>size: { props.cellDimensions.width } x { props.cellDimensions.height }</div>
      <div>{ props.percentBlack }% black</div>      
    </Bar>
  );
}

export default InfoBar;
