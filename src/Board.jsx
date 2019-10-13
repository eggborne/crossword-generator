import React,  {useMemo } from 'react';
import styled from 'styled-components';
import Card from "@material-ui/core/Card";
import Cell from './Cell';

const BoardContainer = styled(Card)`  
  width: var(--board-size);
  max-height: calc(var(--board-size) * (var(--cells-high) / var(--cells-width) / 3));
  display: grid;
  grid-template-rows: repeat(var(--cells-wide), 1fr);
  grid-template-columns: repeat(var(--cells-high), 1fr);
  box-shadow: 1px 1px calc(var(--main-padding) / 2) #00000066, -1px -1px calc(var(--main-padding) / 2) #00000066;
  outline: calc(var(--board-size) / var(--cells-wide) / 12) solid var(--blank-color);
  /* outline-offset: calc(var(--main-padding) * -1); */
  /* padding: calc(var(--main-padding)); */

  /* overrides Material */
  &.board {
    border-radius: 0;
  }
  /*  */

  @media (orientation: landscape) {
    max-width: 60vw;
    max-height: 60vw;
  }
`;

function Board(props) {
  return (
    <BoardContainer raised className='board'>
      {props.cells.map((cellObj, c) => (    
        <Cell
          key={c+'-'+cellObj.row+'-'+cellObj.column}
          mode={props.mode}
          style={{ backgroundColor: cellObj.blank ? 'var(--blank-color' : 'transparent' }}
          selected={cellObj.index === props.selectedCellIndex}
          symmetry={props.symmetry}
          index={cellObj.index}
          blank={cellObj.blank}
          letter={cellObj.letter}
          number={cellObj.number}
          coords={cellObj.coords}
          handleCellClick={props.handleCellClick}
        />)
      )}
    </BoardContainer>
  );
}

export default Board;