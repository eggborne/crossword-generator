import React, { useEffect } from 'react';
import styled from 'styled-components';
import Slider from "@material-ui/core/Slider";
import Typography from '@material-ui/core/Typography';

import InfoBar from "./InfoBar";
import ToggleButton from './ToggleButton';

const PanelContainer = styled.div`  
  font-size: calc(var(--header-height) / 3.5);
  position: relative;
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

  & > .slider-area {
    grid-column-end: span 3;
    height: calc(var(--header-height) * 1.25);
    border: 2px solid #00000044;
    border-radius: calc(var(--header-height) / 8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }
  & > .slider-area > span > *:first-child {
    transform-origin: center;
    transform: scaleY(4);
    box-shadow:  -1px -1px 1px #00000044,  
    1px -1px 1px #00000044,
    -1px 1px 1px #00000044,
     1px 1px 1px #00000044;
  }
  & #discrete-slider {
    font-size: inherit;
    font-family: inherit;
    justify-self: flex-start;
    padding-right: 1rem;
    line-height: 125%;
    text-shadow:
   -1px -1px 0 #00000066,  
    1px -1px 0 #00000066,
    -1px 1px 0 #00000066,
     1px 1px 0 #00000066;
  }
  & > .slider-area > span > *:last-child {
   transform: scale(2);
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
        labels={{off: 'APPLY LABELS', on: 'APPLY LABELS'}}
        onClickButton={props.applyCellLabels}        
      />
      <ToggleButton
        labels={{off: 'CLEAR ALL', on: 'CLEAR ALL'}}
        onClickButton={props.clearBoard}        
      />
       <ToggleButton 
        labels={{off: 'EDIT LETTERS', on: 'EDITING LETTERS'}}
        onClickButton={() => props.toggleMode('letterMode')}
        on={props.mode === 'letterMode'}
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <div id='diagram-size-slider-area' className='slider-area'>
        <Typography id='discrete-slider'>
          DIAGRAM SIZE
        </Typography>
        <Slider
          // defaultValue={13}          
          aria-labelledby="discrete-slider"
          min={13}
          max={23}
          marks
          id={'diagram-size-slider'}
          valueLabelDisplay={'auto'}
          onChangeCommitted={props.changeBoardSize}
        />
      </div>

      <InfoBar
        mode={props.mode}
        cellDimensions={props.cellDimensions}
        percentBlack={props.percentBlack}
      />
    </PanelContainer>
  );
}

function isEqual(prevProps, nextProps) {
  return (
    prevProps.percentBlack === nextProps.percentBlack &&
    prevProps.cellDimensions === nextProps.cellDimensions &&
    prevProps.mode === nextProps.mode
  );
}

// export default React.memo(ControlPanel, isEqual);
export default ControlPanel;
