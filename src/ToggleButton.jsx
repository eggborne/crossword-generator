import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  
  & > button {    
    transition: background 300ms ease;
    
  }
  & > button::after {
    
    content: '${props => props.labels.off}';
    max-width: 100%;
  }
  & > button.on::after {
    content: '${props => props.labels.on}';
  }
  & > button.on {
    background-color: #090;
    border-radius: 0;
  }
`;

function ToggleButton(props) {
  return (
    <ButtonContainer labels={props.labels}>
      <button         
        className={props.on ? `on` : null}
        onClick={props.onClickButton}
      >
      </button>
    </ButtonContainer>
  );
}

export default ToggleButton;
