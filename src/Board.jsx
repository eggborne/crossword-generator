import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Cell from "./Cell";

const BoardContainer = styled.div`  
  background: #ddd;
  width: var(--board-size);
  height: var(--board-size);
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  grid-template-columns: repeat(12, 1fr);
  box-shadow: 1px 1px 2px 2px #333, -1px -1px 5px black;
  
  @media (orientation: landscape) {
    max-width: 60vw;
    max-height: 60vw;
  }
`;

function Board(props) {  
  console.log('Board props', props);
  const [cells, setCells] = useState([]);  
  useEffect(() => {
    console.log('useEffect on Board.props.size!');
    let cellsCopy = new Array(props.size)
    .fill(new Array(props.size)
    .fill({}, 0, props.size), 0, props.size);

    let initialCells = [];
    
    cellsCopy.map((cellRow, r, rowsArray) => {
      console.log('going over row', r, '---------------------------------------------');
      initialCells[r] = [];
      cellRow.map((cell, c, cellRowArray) => {
        let totalIndex = (r * props.size) + c + 1;
        console.log('setting num to', totalIndex)
        let newCell = {
          number: totalIndex,
          letter: 'x',
          blank: totalIndex % 5 === 0
        };
        initialCells[r][c] = newCell;        
      });
    });
    console.warn('made initial cells', initialCells);
    setCells(initialCells);
  }, []);

  return (
    <BoardContainer>
      {cells.map((cellRow, r) =>     
        cellRow.map((cellObj, c) => {
          console.error('row', r, cellRow)
          console.error('cell', c, cellObj)
          let totalIndex = (r * props.size) + c;
          // console.log('doing cell', t, 'of row', r, totalIndex)
          return <Cell 
            blank={cellObj.blank}
            index={totalIndex}
            key={totalIndex}
            cellData={cellObj}
          />
        })
        // return <Cell 
        //   type={i % 2 === 0 ? 'white' : 'black'}
        //   index={i}
        //   key={i}   
        // />
      )}
    </BoardContainer>
  );
}

export default Board;
