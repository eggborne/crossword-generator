import React from 'react';
import styled from 'styled-components';
import ToggleButton from './ToggleButton';

const PanelContainer = styled.div`
  max-width: 100%;  
  flex-grow: 1;
  background: var(--header-color);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 3rem;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.75rem;
  padding: 0.75rem;
  align-items: stretch;
  justify-items: stretch;

  & > #size-slider {
    grid-column-start: 1;
    grid-column-end: span 1;
    width: 100%;
    justify-self: center;
  }
  @media (orientation: landscape) {
    width: 100%;
    height: 100%;
    grid-template-columns: 0.5fr 0.5fr;
    grid-column-start: 2;
    justify-self: end;
  }
`;

function ControlPanel(props) {
  return (
    <PanelContainer>
      <ToggleButton 
        labels={{off: 'EDIT PATTERN', on: 'EDITING PATTERN'}}
        onClickButton={() => props.toggleMode('editMode')}
        on={props.mode === 'editMode'}
      />
      <ToggleButton
        labels={{off: 'EDIT WORDS', on: 'EDITING WORDS'}}
        onClickButton={() => props.toggleMode('letterMode')}
        on={props.mode === 'letterMode'}
      />
      <button>CHICKENS</button>
      <button>CHICKENS</button>
      <button>CHICKENS</button>
      <ToggleButton
        labels={{off: 'CLEAR ALL', on: 'CLEAR ALL'}}
        onClickButton={props.clearBoard}        
      />
      {/* <input value={props.cellDimensions.width} onChange={ props.changeBoardSize } id='size-slider' type='number' min={10} max={30} /> */}
    </PanelContainer>
  );
}

export default ControlPanel;
