import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  /* background: #00000066; */
  width: 100%;
  height: 1.75rem;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: var(--main-padding);
  text-shadow:
   -1px -1px 0 #00000099,  
    1px -1px 0 #00000099,
    -1px 1px 0 #00000099,
     1px 1px 0 #00000099;

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
