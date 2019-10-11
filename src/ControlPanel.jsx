import React, { useEffect } from 'react';
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
  @media (orientation: landscape) {
    width: 100%;
    height: 100%;
    grid-template-columns: 0.5fr 0.5fr;
    grid-column-start: 2;
    justify-self: end;
  }
`;

function ControlPanel(props) {
  useEffect(() => {
    console.log('tile created');
  }, [])
  return (
    <PanelContainer>
      <ToggleButton 
        labels={{off: 'EDIT PATTERN', on: 'EDITING PATTERN'}}
        onClickButton={() => props.toggleMode('editMode')}
        on={props.mode === 'editMode'}
      />
      <ToggleButton
        labels={{off: 'SUCK LEMONS', on: 'SUCKING LEMONS'}}
        onClickButton={() => props.toggleMode('suckingLemons')}
        on={props.mode === 'suckingLemons'}
      />
      <button>CHICKENS</button>
      <button>CHICKENS</button>
      <button>CHICKENS</button>
      <button>CHICKENS</button>
    </PanelContainer>
  );
}

export default ControlPanel;
