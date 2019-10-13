import React from 'react';
import styled from 'styled-components';
import Button from "@material-ui/core/Button";


import {
  Link
} from "react-router-dom";

const ButtonContainer = styled.div`
  & button {
    color: #ddd;
    font-family: inherit;
    line-height: 120%;
    border: calc(var(--header-height) / 8) solid transparent;
    border-radius: calc(var(--header-height) / 10);
    font-size: calc(var(--header-height) / 3.5);
    width: 100%;
    height: 100%;
    align-self: stretch;
    background: var(--button-color) !important;
    display: flex;
    align-items: center;
    transform-origin: center;
    transition: background 210ms ease, border 180ms ease;
  }
  & button:active {    
    background-color: var(--button-on-color) !important;
    border-color: #ffffff66;
  }
  & button::after {
    content: '${props => props.labels.off}';    
    position: absolute;
    transform: translate(0, -50%);
    top: 50%;
    width: min-content;
    text-shadow:
   -1px -1px 0 #00000066,  
    1px -1px 0 #00000066,
    -1px 1px 0 #00000066,
     1px 1px 0 #00000066;
  }
  &.on button::after {
    content: '${props => props.labels.on}';
  }
  &.on button {
    background-color: var(--button-on-color) !important;    
    border-color: #ffffff66;
    color: var(--text-color);
  }
`;

function ToggleButton(props) {
  return (
    
    <ButtonContainer labels={props.labels} className={props.on ? `on` : null}>
      {props.linkUrl ?
        <Button variant={'contained'}
        // {...{ [window.CLICK_METHOD.down]: props.onClickButton }}                                      
          // onClick={props.onClickButton } 
        >
        <span></span>
        </Button>
      :
        <Button variant={props.on ? 'text' : 'contained'}
        {...{ [window.CLICK_METHOD.down]: props.onClickButton }}                                      
          // onClick={props.onClickButton } 
        >
        <span></span>
        </Button>
      }
    </ButtonContainer>
  );
}

export default ToggleButton;
