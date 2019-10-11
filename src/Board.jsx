import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const BoardContainer = styled.div`
  background: var(--cell-color);
  width: var(--board-size);
  height: var(--board-size);
  display: grid;
  grid-template-rows: ${props => `repeat(${props.cellDimensions.height}, 1fr)`};
  grid-template-columns: ${props => `repeat(${props.cellDimensions.width}, 1fr)`};
  box-shadow: 1px 1px 2px 2px #333, -1px -1px 5px black;

  @media (orientation: landscape) {
    max-width: 60vw;
    max-height: 60vw;
  }
`;

function Board(props) {
  let flatCells = props.cells.flat();
  return (
    <BoardContainer cellDimensions={props.cellDimensions}>
      {flatCells.map((cellObj, c) => (    
        <Cell
          index={c}
          key={c}
          blank={cellObj.blank}
          letter={cellObj.letter}
          number={cellObj.number}
          coords={cellObj.coords}
          handleCellChange={props.handleCellChange}
          cellDimensions={props.cellDimensions}
        />)
      )}
    </BoardContainer>
  );
}

export default Board;