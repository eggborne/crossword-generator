import React, { useState, useEffect, useMemo } from 'react';
import Board from "./Board";
import ControlPanel from "./ControlPanel";
import InfoBar from "./InfoBar";
import WordClueList from "./WordClueList";
import styled from "styled-components";
import axios from 'axios';
import NavTabs from './NavTabs';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
  display: grid;
  align-items: stretch;
  justify-items: stretch;
  grid-template-rows: 
    var(--header-height)
    100vmin
    auto
    1fr
    var(--footer-height)
  ;

  & .MuiTabs-scroller > span {
   background: transparent;
   margin 0;
   border: calc(var(--main-padding) / 4) solid green;
   border-top-left-radius: calc(var(--header-height) / 10);
   border-top-right-radius: calc(var(--header-height) / 10);
   /* z-index: 0; */
   height: 100%;
  }
  & .MuiTab-root {
    font-size: 0.75rem;
    font-family: var(--main-font);   
    background: transparent;
  }
  & .MuiBox-root {
    display: none;
  }
  & .MuiAppBar-colorPrimary {
    background: var(--header-color);
  }

  @media (orientation: landscape) {
    display: grid;
    grid-template-columns: 
      1fr
      minmax(min-content, 35vw)
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (orientation: landscape) {
    grid-column-start: 1;
  }
`;

const Footer = styled.footer`
  font-size: 0.65rem;  
  background-color: var(--header-color);
  padding: 0 var(--main-padding);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: var(--text-color);
  text-shadow:
   -2px -1px 0 #00000088,  
    2px -1px 0 #00000088,
    -2px 1px 0 #00000088,
     2px 1px 0 #00000088;
  
  & > a {
    opacity: 0.75;
    transition: opacity 300ms ease;
    transition-delay: 200ms;
  }
  &.hidden > a {
    opacity: 0;
  }
`;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function App() {
  // console.big('APP')
  const [loaded, setLoaded] = useState(false);
  const [wordList, setWordList] = useState(new Array(15).fill(undefined, 0, 15));
  const [cells, setCells] = useState([]);
  const [mode, setMode] = useState('editMode');
  const [cellDimensions, setCellDimensions] = useState({});
  const [selectedCellIndex, setSelectedCellIndex] = useState(undefined);
  const [symmetry, setSymmetry] = useState(1);

  useEffect(() => {
    console.warn('----------- [] useEffect -------------------------------')
    let cellArray = getnewCellArrayWithDimensions({width: 13, height: 13});    
    cellArray = getIndexedCells(cellArray);
    setCells(cellArray);
    requestAnimationFrame(() => {
      setLoaded(true);    
    });
  }, []);

  useEffect(() => {
    console.log('mode', mode)
    if (mode === 'editMode') {
      setSelectedCellIndex(undefined)
    }
  }, [mode]);

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

  const getMirrorCoords = (symmetry, targetCell) => {
    let coordArray = [];
    if (symmetry >= 1) {
      let mirrorCoords = {
        column: (cellDimensions.width-1)-targetCell.coords.column, 
        row: (cellDimensions.height-1)-targetCell.coords.row
      };
      coordArray.push(mirrorCoords);      
    }
    if (symmetry === 2) {
      let mirrorCoords1 = {
        column: targetCell.coords.row, 
        row: (cellDimensions.width-1)-targetCell.coords.column
      };
      let mirrorCoords2 = {
        column: (cellDimensions.width-1)-mirrorCoords1.column, 
        row: (cellDimensions.height-1)-mirrorCoords1.row
      };
      coordArray.push(mirrorCoords1);      
      coordArray.push(mirrorCoords2);      
    }
    return coordArray;
  }

  const handleCellClick = (e) => {
    let cellIndex = parseInt(e.target.id.split('-')[1]);
    console.log('clicked cell', cellIndex)
    let newCells = [...cells];
    let targetCell = newCells.flat()[cellIndex];
    if (mode === 'editMode') {
      let newBlankStatus = !targetCell.blank;      
      targetCell.blank = newBlankStatus;
      getMirrorCoords(symmetry, targetCell).forEach(coords => {
        let mirrorCell = newCells[coords.row][coords.column];
        mirrorCell.blank = newBlankStatus;
      });  
    } else if (mode === 'letterMode') {      
      console.log('selected cell', targetCell);
      console.log('selected index', targetCell.index);
      if (selectedCellIndex !== targetCell.index) {
        setSelectedCellIndex(targetCell.index)
      }
    }
    setCells(newCells);
    // applyCellLabels(newCells);
  }

  function getLabelledCells(baseArray, setCoords) {
    let start = window.performance.now();
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
        let numbered;
        if (cell.blank) {
          // make the cells below and to the right numbered
          numberedIndexes.push(cellTotalIndex + cellDimensions.width);
          numberedIndexes.push(cellTotalIndex + 1);
        } else {          
          if (r === 0 || c === 0 || numberedIndexes.includes(cellTotalIndex)) {            
            numbered = true
            onNumberedCell++;
          }
        }
        let newCell = { ...cell }
        if (numbered === (cell.number === null)) {
          newCell.number = numbered ? onNumberedCell : null;
        }
        return cell = newCell;
      });
    });
    console.warn('labeled cells in', window.performance.now() - start);
    return updatedCells;
  }

  function getIndexedCells(baseArray, shadeAll) {
    let start = window.performance.now();
    let updatedCells = [...baseArray];
    let cellsDone = 0;
    [...baseArray].forEach((row, r) => {
      updatedCells[r] = row.map((cell, c) => {        
        let newCell = { ...cell };
        newCell.coords = { row: r, column: c};
        newCell.blank = shadeAll;
        newCell.number = null;
        newCell.letter = '';
        newCell.index = cellsDone;
        cellsDone++;
        return cell = newCell;
      });
    });
    console.warn('indexed cells in', window.performance.now() - start);
    return updatedCells;
  }

  function applyCellLabels(baseArray) {
    setCells(getLabelledCells(baseArray));
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
    let start = window.performance.now();
    setCells([]);
    if (typeof newSize !== 'number') {
      newSize = cellDimensions.width;
    }
    let newCells = getnewCellArrayWithDimensions({width: newSize, height: newSize});
    newCells = getIndexedCells(newCells);
    setCells(newCells);
    console.warn('cleared board in', window.performance.now() - start);
  }
  const fillBoard = () => {
    let start = window.performance.now();
    setCells([]);
    let newCells = getnewCellArrayWithDimensions({width: cellDimensions.width, height: cellDimensions.height});
    newCells = getIndexedCells(newCells, true);
    setCells(newCells);
    console.warn('shaded board in', window.performance.now() - start);
  }

  const showWordList = () => {
    console.log('balls')
  }

  const handleChangeMode = (newIndex) => {
    let newMode = ['editMode', 'letterMode', 'clueMode'][newIndex];
    setMode(newMode);
  }
  const handleChangeSymmetry = (newIndex) => {
    setSymmetry(newIndex);      
  }

  const percentBlack = useMemo(() => 
    Math.round(([...cells].flat().filter(cell => cell.blank).length / [...cells].flat().length) * 100)
  , [cells])

  return (
    <Router>

    <AppContainer>
      <Header>Crossword Generator</Header>
      <Switch>
        <Route path='/wordlist'>
          <WordClueList

          />
        </Route>
        <Route path='/'>
          <BoardArea>
            <Board
              percentBlack={percentBlack}
              cellDimensions={cellDimensions}
              cells={cells.flat()}
              mode={mode}
              symmetry={symmetry}
              selectedCellIndex={selectedCellIndex}
              handleCellClick={handleCellClick}
              // applyCellLabels={applyCellLabels}
              />
          </BoardArea>
          <NavTabs          
            defaultValue={0}
            labels={['Diagram', 'Words', 'Clues']}
            onChangeSelected={handleChangeMode}
            value={['editMode', 'letterMode', 'clueMode'].indexOf(mode)}
          />
          <ControlPanel
            mode={mode}        
            percentBlack={percentBlack}
            toggleMode={toggleMode}
            clearBoard={clearBoard}
            fillBoard={fillBoard}
            cellDimensions={cellDimensions}
            symmetry={symmetry}
            changeBoardSize={changeBoardSize}
            applyCellLabels={applyCellLabels}
            showWordList={showWordList}
            handleChangeSymmetry={handleChangeSymmetry}
          />      
          <InfoBar
            mode={mode}
            cellDimensions={cellDimensions}
            percentBlack={percentBlack}
          />
        </Route>
      </Switch>
      {/* <Footer className={loaded ? null : 'hidden'}><a href='https://mikedonovan.dev/'>mikedonovan.dev</a></Footer> */}
    </AppContainer>
    </Router>
  );
}

export default App;
