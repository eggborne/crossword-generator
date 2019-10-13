import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import Board from "./Board";
import ControlPanel from "./ControlPanel";
import styled from "styled-components";
import axios from 'axios';

window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px')
});

window.CLICK_METHOD = 
  window.PointerEvent ? { down: 'onPointerDown', up: 'onPointerUp'}
  : window.TouchEvent ? { down: 'onTouchStart', up: 'onTouchEnd'} 
  : { down: 'onMousedown', up: 'onMouseUp'};

  console.error('USING CLICK -------', window.CLICK_METHOD, ' ------------------------');

window.addEventListener('load', () => {
  console.error('LOADED.');
});

const AppContainer = styled.div`
  color: var(--text-color);
  background: var(--body-bg-color);
  min-height: var(--view-height);
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
  text-shadow:
   -2px -1px 0 #00000088,  
    2px -1px 0 #00000088,
    -2px 1px 0 #00000088,
     2px 1px 0 #00000088;
  @media (orientation: landscape) {
    grid-column-end: span 2;
  }
`;
const BoardArea = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100vw;
  flex-grow: 1;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (orientation: landscape) {
    grid-column-start: 1;
  }
`;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
  // console.big('APP')
  const [wordList, setWordList] = useState(new Array(15).fill(undefined, 0, 15));
  const [cells, setCells] = useState([]);
  const [mode, setMode] = useState('editMode');
  const [cellDimensions, setCellDimensions] = useState({});
  const [selectedCellIndex, setSelectedCellIndex] = useState(undefined);

  useEffect(() => {
    let cellArray = [];
    if (cells[0]) {
      cellArray = [...cells];
    } else {
      cellArray = getnewCellArrayWithDimensions({width: 13, height: 13});
    }
    let initialCells = getLabelledNumberedCells(cellArray);
    setCells(initialCells);
    
  }, [cellDimensions.width, cellDimensions.height]);

  const getFullWordListOfLength = (length) => {
    return axios({
      method: 'post',
      url: 'https://api.eggborne.com/crossword/getwordlist.php',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        length: length
      },
    });
  }
  const saveDiagram = (array, creator) => {
    return axios({
      method: 'post',
      url: 'https://api.eggborne.com/crossword/savediagram.php',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        array: array,
        creator: creator,
      }
    });
  }
  
  const getWordList = (length) => {
    console.error('CALLING DB FOR', length, '-LETTER WORDS |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
    return new Promise((resolve) => {
      getFullWordListOfLength(length).then(response => {
        if (response.data) {
          let wordObjectList = response.data.split(' || ').filter(obj => obj).map(wordObj => wordObj = JSON.parse(wordObj));
          let newList = [...wordList];
          newList[length] = wordObjectList;
          setWordList(newList);
          resolve(wordObjectList);
          // setWordList(wordList => wordList[8] = wordObjectList);        
        } else {
          console.error('COULD NOT GET WORD LIST OF LENGTH', length);
        }        
      });
    });
  }

  const wordArrayOfLength = (length) => {
    return new Promise(async resolve => {
      let listOfWords = wordList[length] || await getWordList(length);      
      resolve(listOfWords);
    })
  }

  const getRandomWordOfLength = async (length) => {
    return new Promise(async resolve => {
      let listOfWords = await wordArrayOfLength(length);
      let randomIndex = randomInt(0, listOfWords.length - 1);
      let randomWordObject = listOfWords[randomIndex];
      resolve(randomWordObject);
    })
  }
  
  const toggleMode = (modeClicked) => {    
    let newMode;
    if (mode === modeClicked) {
      // newMode = undefined;
    } else {
      newMode = modeClicked;
      setMode(newMode);
    }
  }
  const changeBoardSize = () => {
    let newSize = parseInt(document.querySelector('#diagram-size-slider-area .MuiSlider-root input').value);
    setCellDimensions({width: newSize, height: newSize});
    clearBoard(newSize);
  }

  const handleCellFlip = (cellIndex, newBlankStatus) => {
    console.green('flipping', mode)
    let newCells = [...cells];
    // let targetCell = newCells[coords.row][coords.column];
    let targetCell = newCells.flat()[cellIndex];
    let targetCoords = targetCell.coords;
    let mirrorCoords = {
      column: (cellDimensions.width-1)-targetCoords.column, 
      row: (cellDimensions.height-1)-targetCoords.row
    };
    let mirrorCell = newCells[mirrorCoords.row][mirrorCoords.column];
    targetCell.blank = newBlankStatus;
    mirrorCell.blank = newBlankStatus;
    setCells(newCells);
    getRandomWordOfLength(11).then(resp => {
      console.log('GOT RANDO', resp.word)
    })
    // applyCellLabels(newCells);
  }

  const handleCellSelect = (cellIndex, newSelectedStatus) => {

    let newCells = [...cells];
    let targetCell = newCells[cellIndex];
  }

  function getLabelledNumberedCells(baseArray, setCoords) {
    if (!Array.isArray(baseArray)) { 
      baseArray = cells;
    }
    let updatedCells = [...baseArray];
    let totalCells = updatedCells.flat().length;
    let onNumberedCell = 0;
    let numberedIndexes = [];
    [...baseArray].forEach((row, r, rowsArray) => {
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
        let rando = 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.round(25 * cellTotalIndex/(cellDimensions.width * cellDimensions.height))];
        let newCell = { ...cell }
        newCell.letter = true ? '' : rando;
        // newCell.blank = cell.blank;
        if (!newCell.coords) {
          newCell.coords = { row: r, column: c }
        }        
        if (setCoords) {
          newCell.coords = { row: r, column: c }
          // newCell.blank = false;
          newCell.index = cellTotalIndex;
        } else {
          newCell.number = numbered ? onNumberedCell : null;
        }
        return cell = newCell;
      });
    });
    return updatedCells;
  }

  function applyCellLabels(baseArray) {
    let newCells = getLabelledNumberedCells(baseArray);
    setCells(newCells);
  }

  function getnewCellArrayWithDimensions(newDimensions) {
    let root = document.documentElement;
    root.style.setProperty('--cells-wide', newDimensions.width);
    root.style.setProperty('--cells-high', newDimensions.height);
    setCellDimensions(newDimensions);
    return new Array(newDimensions.height)  // make an array with r rows
    .fill(new Array(newDimensions.width)    // that each containing an array of length c
      .fill({}, 0, newDimensions.width),    // fill each of those with an empty object
      0, newDimensions.height               // finish filing each row of the outer array
    );
  }

  const clearBoard = (newSize) => {
    if (typeof newSize !== 'number') {
      newSize = cellDimensions.width;
    }
    setCells([]);
    let newCells = getLabelledNumberedCells(getnewCellArrayWithDimensions({width: newSize, height: newSize}), true);
    setCells(newCells);
    // requestAnimationFrame(() => {
    // });
  }

  const showWordList = () => {
    console.log('balls')
  }

  const percentBlack = useMemo(() => 
    Math.round(([...cells].flat().filter(cell => cell.blank).length / [...cells].flat().length) * 100)
  , [cells])

  return (
    <AppContainer>
      <Header>Crossword Puzzle Generator</Header>
      <BoardArea>
        <Board
          percentBlack={percentBlack}
          cellDimensions={cellDimensions}
          cells={cells}
          mode={mode}
          handleCellClick={mode === 'editMode' ? handleCellFlip : handleCellSelect}
          applyCellLabels={applyCellLabels}
        />
      </BoardArea>
      <ControlPanel
        mode={mode}        
        percentBlack={percentBlack}
        toggleMode={toggleMode}
        clearBoard={clearBoard}
        cellDimensions={cellDimensions}
        changeBoardSize={changeBoardSize}
        applyCellLabels={applyCellLabels}
        showWordList={showWordList}
      />      
    </AppContainer>
  );
}

export default App;
