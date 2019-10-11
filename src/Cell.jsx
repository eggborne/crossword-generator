import React, { useEffect } from 'react';
import styled from 'styled-components';
// import './App.css';

const CellContainer = styled.div`
  position: relative;
  background-color: ${props => props.blank ? 'var(--blank-color)' : 'var(--cell-color)'};
  outline: 1px solid var(--blank-color);  
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  max-height: 100%;
`;
const Number = styled.div`
  position: absolute;
  top: 0; 
  left: 0;
  font-size: var(--cell-number-size);
  align-self: flex-start;
  justify-self: flex-start;
`;
const Letter = styled.div`
  font-size: var(--cell-letter-size);
`;

function Cell(props) {

  return (
    <CellContainer blank={props.blank}>
      <Number>
        { props.cellData.number }
      </Number>
      <Letter>
        { props.cellData.letter.toUpperCase() }
      </Letter>
    </CellContainer>
  );
}

export default Cell;
