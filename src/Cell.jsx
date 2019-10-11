import React, { useCallback } from 'react';
import styled from 'styled-components';

const CellContainer = styled.div`
  position: relative;
  background-color: ${props => props.blank ? 'var(--blank-color)' : 'transparent'};
  outline: 1px solid var(--blank-color);  
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  width: ${props => `calc(var(--board-size) / ${props.cellDimensions.width})`};
  height: ${props => `calc(var(--board-size) / ${props.cellDimensions.width})`};
  max-height: ${props => `calc(var(--board-size) / ${props.cellDimensions.height})`};
  padding: 0;
  /* cursor: ${props => props.mode === 'editMode' ? 'pointer' : ''}; */
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
  padding: 0;
  font-size: var(--cell-letter-size);  
  text-align: center;
`;

function Cell(props) {
  console.count('cell')
  const onClickCell = () => {
    props.handleCellChange(props.coords, !props.blank)
  };
  return (
    <CellContainer blank={props.blank} cellDimensions={props.cellDimensions} onPointerDown={onClickCell}>
      <Number>
        { props.number }
      </Number>
      <Letter>        
        { props.letter }
      </Letter>
    </CellContainer>
  );
}

function isEqual(prevProps, nextProps) {
  let equal =
    prevProps.blank === nextProps.blank
    && prevProps.number === nextProps.number
    
  ;
  return equal;
}

export default React.memo(Cell, isEqual)
// export default Cell;
