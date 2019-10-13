import React, { useCallback }from 'react';
import styled from 'styled-components';

const CellContainer = styled.div`  
  position: relative;
  outline: calc(var(--cell-width) / 24) solid var(--blank-color);  
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  width: var(--cell-width);
  height: var(--cell-height);
  max-height: var(--cell-height);
  padding: 0;
  transition: background 210ms ease;

  &.selected {
    background: #00ff0099 !important;
  }
`;
const Number = styled.div`
  position: absolute;
  top: 0; 
  left: calc(var(--cell-width) / 32);
  font-size: var(--cell-number-size);
  pointer-events: none;
`;
const Letter = styled.div`
  padding: 0;
  font-size: calc(var(--cell-letter-size) / 2);  
  text-align: center;
  pointer-events: none;
`;

const Cell =(props) => {
  // console.count('CELL');
  return (
    <CellContainer 
      id={`cell-${props.index}`}
      style={props.style} 
      className={props.selected ? 'cell-container selected' : 'cell-container'}
      blank={props.blank} 
      {...{ [window.CLICK_METHOD.down]: props.handleCellClick }}
      // onClick={() => props.handleCellClick(props.index) }

      // {...{ [window.CLICK_METHOD.up]: props.applyCellLabels }}
    >
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
    && prevProps.selected === nextProps.selected
    && prevProps.number === nextProps.number
    && prevProps.letter === nextProps.letter
    && prevProps.coords === nextProps.coords
    && prevProps.mode === nextProps.mode
    && prevProps.symmetry === nextProps.symmetry
    // && prevProps.handleCellClick === nextProps.handleCellClick
  ;
  return equal;
}

export default React.memo(Cell, isEqual)
// export default Cell;
