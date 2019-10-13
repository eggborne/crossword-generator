import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import ToggleButton from "./ToggleButton";

const WordClueListContainer = styled(Card)`
  height: calc(
    var(--view-height) - var(--header-height) - var(--main-padding) * 2
  );
  margin: var(--main-padding);
  display: grid;
  grid-template-rows: 1fr var(--header-height);
  
  /* outline: calc(var(--board-size) / var(--cells-wide) / 12) solid var(--blank-color); */
  /* outline-offset: calc(var(--main-padding) * -1); */
  padding: calc(var(--main-padding));

  & > #word-list {
    display: flex;
    align-items: stretch;
    justify-content: center;
  }
  & > #button-area {
    display: flex;
    justify-content: center;
  }
  & > #button-area button {
    width: calc(var(--header-height) * 3);
  }
`;

function WordClueList(props) {
  return (
    <WordClueListContainer raised className="board">
      <div id='word-list'>
        
      </div>
      <div id='button-area'>
        <ToggleButton
          labels={{ off: "CLOSE", on: "CLOSE" }}
          linkUrl={"/"}
        />
      </div>
    </WordClueListContainer>
  );
}

export default WordClueList;
