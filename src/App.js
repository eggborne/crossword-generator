import React, { useState, useEffect } from 'react';
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
  align-items: center;
  justify-content: center;  
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
  // const [buttons, setButtons] = useState(['cock', 'salad', 'mustard']);
  const [mode, setMode] = useState(undefined);
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
  return (
    <AppContainer>
      <Header>Crossword Puzzle Generator</Header>
      <BoardArea>
        <Board
          size={12}
          mode={mode}
        />
      </BoardArea>
      <ControlPanel 
        mode={mode}
        toggleMode={toggleMode}
      />
    </AppContainer>
  );
}

export default App;
