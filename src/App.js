import React, { useState, useEffect, useCallback } from 'react';
import Board from "./Board";
import ControlPanel from "./ControlPanel";
import styled from "styled-components";

window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px')
});

const AppContainer = styled.div`
  background: #ccc;
  height: var(--view-height);
  max-height: var(--view-height);
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (orientation: landscape) {
    display: grid;
    grid-template-columns: 
      auto
      minmax(auto, 35vw)
    ;
    grid-template-rows: 
      var(--header-height)
      1fr
    ;
  }
`; 
const Header = styled.header`
  background-color: var(--header-color);
  width: 100vw;
  min-height: var(--header-height);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;  
  padding-left: calc(var(--main-padding) * 1.5);
  color: white;
  @media (orientation: landscape) {
    grid-column-end: span 2;
  }
`;
const BoardArea = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100vw;
  flex-grow: 1;
  background: #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (orientation: landscape) {
    grid-column-start: 1;
  }
`;
function App() {
  const [cells, setCells] = useState([]);
  const [mode, setMode] = useState('editMode');
  const [cellDimensions, setCellDimensions] = useState({width: 12, height: 12});

  const getLabelledNumberedCells = (baseArray, setCoords) => {
    let updatedCells = [...baseArray];
    let totalCells = updatedCells.flat().length;
    let onNumberedCell = 0;
    let numberedIndexes = [];
    baseArray.forEach((row, r, rowsArray) => {
      updatedCells[r] = row.map((cell, c, cellArray) => {        
        let cellTotalIndex = (r * cellDimensions.height) + c + 1;            
        let isBlank = cell.blank;       
        let numbered;
        if (isBlank) {
          numberedIndexes.push(cellTotalIndex + cellDimensions.width);
          numberedIndexes.push(cellTotalIndex + 1);
        } else {
          let bottomHasSpace = cellTotalIndex <= (totalCells - (cellDimensions.height - 1));
          let rightHasSpace = c <= cellDimensions.width - 1;
          let onTopOrLeftEdge = r === 0 || c === 0;
          if (bottomHasSpace && rightHasSpace && (onTopOrLeftEdge || numberedIndexes.includes(cellTotalIndex))) {
            numbered = true
            onNumberedCell++;
          }
        }
        // let rando = 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.round(25 * cellTotalIndex/(cellDimensions.width * cellDimensions.height))];
        let newCell = { ...cell }
        newCell.number = numbered ? onNumberedCell : '';
        newCell.letter = '';
        // newCell.blank = cell.blank;
        if (!newCell.coords) {
          newCell.coords = { row: r, column: c }
        }        
        if (setCoords) {
          newCell.coords = { row: r, column: c }
          // newCell.blank = false;
          newCell.index = cellTotalIndex;
        }
        return cell = newCell;
      });
    });
    console.warn('made updatedCells', updatedCells);
    return updatedCells;
  }

  useEffect(() => {
    let cellArray = [];
    if (cells[0]) {
      console.log('calling when cells[0] exists!', cells[0])
      cellArray = [...cells];
    } else {
      cellArray = new Array(cellDimensions.height).fill(
        new Array(cellDimensions.width).fill({}, 0, cellDimensions.width),
        0,
        cellDimensions.height
      );
    }
    console.warn('cellArray was', cellArray)
    let initialCells = getLabelledNumberedCells(cellArray, true);
    setCells(initialCells);
    console.warn('set to', initialCells)
    // setCells(cellArray);
  }, [cellDimensions.width, cellDimensions.height]);

  const toggleMode = (modeClicked) => {
    console.log('clicked', modeClicked)
    let newMode;
    if (mode === modeClicked) {
      console.warn(modeClicked, 'was already on')
      newMode = undefined;
    } else {
      console.warn(modeClicked, 'was not already on.', mode, 'was on.')
      newMode = modeClicked;
    }
    setMode(newMode);
  }
  const changeBoardSize = (e) => {
    let newSize = e.target.value;
    document.querySelector('header').innerHTML = newSize;
    console.log('setting to new size', newSize)
    setCellDimensions(newSize);
  }
  // const handleChangeCells = (e) => {
  //   let coordPair = e.currentTarget.id.split('-');
  //   let coords = { row: parseInt(coordPair[0]), column: parseInt(coordPair[1]) };
  //   let targetCellCoordSets = [coords];
  //   let mirrorCell = mirroredCell(coords);
  //   if (mirrorCell) {
  //     targetCellCoordSets.push(mirrorCell);
  //   }
  //   let newCells = [...cells];
  //   targetCellCoordSets.forEach(coords => {
  //     let targetCell = newCells[coords.row][coords.column];
  //     if (targetCell.blank) {
  //       targetCell.blank = false;
  //     } else {
  //       targetCell.blank = true;
  //     }
  //     console.log('flipped blank on', targetCell.index, targetCell)
  //   });
  //   // newCells = getLabelledNumberedCells(newCells);
  //   setCells(newCells);
  //   requestAnimationFrame(() => {
  //     newCells = getLabelledNumberedCells(newCells);
  //     setCells(newCells)
  //   });
  // }

  const handleCellChange = (coords, blank) => {
    console.log('received', coords);
    let newCells = [...cells];
    let targetCell = newCells[coords.row][coords.column];
    let mirrorCoords = {
      column: (cellDimensions.width-1)-coords.column, 
      row: (cellDimensions.height-1)-coords.row
    };
    let mirrorCell = newCells[mirrorCoords.row][mirrorCoords.column];
    console.log(targetCell);
    console.log(mirrorCell);

    targetCell.blank = blank;
    mirrorCell.blank = blank;
    setCells(newCells)
    requestAnimationFrame(() => {
      newCells = getLabelledNumberedCells(newCells);
      setCells(newCells)
    })
  }

  const clearBoard = () => {
    let newEmptyCellArray = new Array(cellDimensions.height).fill(
      new Array(cellDimensions.width).fill({}, 0, cellDimensions.width),
      0,
      cellDimensions.height
    );
    setCells(getLabelledNumberedCells(newEmptyCellArray, true));
  }
  return (
    <AppContainer>
      <Header>Crossword Puzzle Generator</Header>
      <BoardArea>
        <Board
          cellDimensions={cellDimensions}
          cells={cells}
          mode={mode}
          handleCellChange={handleCellChange}
        />
      </BoardArea>
      <ControlPanel 
        mode={mode}
        toggleMode={toggleMode}
        clearBoard={clearBoard}
        cellDimensions={cellDimensions}
        changeBoardSize={changeBoardSize}
      />
    </AppContainer>
  );
}

export default App;
