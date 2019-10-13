import React, { useEffect } from 'react';
import styled from 'styled-components';
import Slider from "@material-ui/core/Slider";
import Typography from '@material-ui/core/Typography';
import ToggleButton from './ToggleButton';
import NavTabs from './NavTabs';

const PanelContainer = styled.div`
  --panel-space: calc(var(--view-height) - var(--header-height) - 100vw);
  font-size: calc(var(--header-height) / 3.5);
  position: relative;
  max-width: 100%;  
  flex-grow: 1;
  background: var(--header-color);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: var(--header-height) repeat(2, 3rem);
  grid-column-gap: var(--main-padding);
  grid-row-gap: var(--main-padding);
  padding: var(--main-padding);

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
  & > .text-label {
    align-self: center;
    justify-self: center;
    font-size: 1rem
  }
  & .nav-tabs {
    grid-column-start: 2;
    grid-column-end: span 2;
    align-self: center;
  }
  
  & .MuiTab-root {
    font-size: 1rem !important;
    
  }
  & .MuiTab-root:first-of-type {
    font-size: 0.65rem !important;
  }
  & .MuiAppBar-colorPrimary {
    background: var(--button-color) !important;
    border-radius: calc(var(--header-height) / 10);    
  }
  & .MuiTabs-scroller > span {
   background: #fff;;
   /* border: 0 !important; */
   border-radius: calc(var(--header-height) / 10);
   z-index: 2;
   height: 100%;
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
      {/* <ToggleButton 
        labels={{off: 'EDIT PATTERN', on: 'EDITING PATTERN'}}
        onClickButton={() => props.toggleMode('editMode')}
        on={props.mode === 'editMode'}
      /> */}
      <ToggleButton
        labels={{off: 'APPLY LABELS', on: 'APPLY LABELS'}}
        onClickButton={props.applyCellLabels}        
      />
      <ToggleButton
        labels={{off: 'CLEAR ALL', on: 'CLEAR ALL'}}
        onClickButton={props.clearBoard}        
      />
      <ToggleButton
        labels={{off: 'SHADE ALL', on: 'SHADE ALL'}}
        onClickButton={props.fillBoard}        
      />
      {/* <ToggleButton 
        labels={{off: 'EDIT LETTERS', on: 'EDITING LETTERS'}}
        onClickButton={() => props.toggleMode('letterMode')}
        on={props.mode === 'letterMode'}
      />      
      <ToggleButton
        labels={{off: 'WORD LIST'}}
        linkUrl={'/wordlist'}
        onClickButton={props.showWordList}        
      /> */}
      {/* <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      />
      <ToggleButton
        labels={{off: 'WORD LIST', on: 'WORD LIST'}}
        onClickButton={props.showWordList}        
      /> */}
      <div className='text-label'>Symmetry</div>
      <NavTabs
        defaultValue={1}
        labels={['None', '2', '4']}
        onChangeSelected={props.handleChangeSymmetry}
        value={props.symmetry}
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
