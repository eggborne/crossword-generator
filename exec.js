signaled = false
duplicates = 0
addedWords = []
editDirection = undefined

editing = false
boardLegitimate = true
wordIndex = 0
var len = 12
function update() {
	// if (wordIndex < sortedWords[len].length && (counter % 10 === 0)) {
	// 	var word = sortedWords[len][wordIndex]
	// 	console.log("recording " + word + " - " + wordIndex + "/" + sortedWords[len].length)
	// 	recordDefinition(word)
		
	// 	wordIndex++
	// }
	handleInputs()
	if (counter === rightClickedAt && selectedCell.label) {
		var word = prompt("Enter word down:")
		if (word) {

			printWord(word,selectedCell.pos.x,selectedCell.pos.y,"down")
			// board.updateWordData()
		}
	}
	if (counter === clickedAt && selectedCell && selectedCell.label) {
		// var word = prompt("Enter word across:")
		// if (word) {

		// 	printWord(word,selectedCell.pos.x,selectedCell.pos.y,"across")
		// 	// board.updateWordData()
		// }
	}
	if (counter === pressedSpaceAt) {
		undoLastPrint(0)
		board.updateWordData()
	}
	if (counter === pressedRightAt) {

		findAppropriateWord("across")
	}
	if (counter === pressedDownAt) {
		if (downButton.sprite.tint === 0xdd0000) {
			// if (selectedCell && selectedCell.wordData.down.length) {
				
			// 	printWord("*".repeat(selectedCell.wordData.down.length),selectedCell.pos.x,selectedCell.pos.y,"down")
			// 	downButton.sprite.tint = 0x88ff88
			// }
		} else {
			findAppropriateWord("down")
		}
		
	}
	if (counter === pressedLeftAt) {
		clearBlock(currentBlock)    
		// selectedCell.letter.alpha = 0
		// selectedCell.letter.text = "*"
		// board.updateWordData()
		// scanForInvalidWords()
	}
	if (counter === middleClickedAt) {
		// console.log("Middle")
		// if (selectedCell.sprite.tint === 0xffffff) {
		// 	selectedCell.sprite.blank()
		// 	if (selectedCell.letter.alpha !== 0) {
		// 		selectedCell.letter.alpha = 0
		// 		selectedCell.letter.text = "*"
		// 	}
		// } else {
		// 	var equiv = selectedCell.board.getCellEquivalent(selectedCell.pos.x,selectedCell.pos.y)
		// 	selectedCell.sprite.tint = equiv.sprite.tint = 0xffffff
		// }
		// board.labelNumberedCells()
		// board.compileWordSpaces()
		// board.updateWordData()
		// scanForInvalidWords()
		
		
	}

	if (selectedCell) {
		// debug.text = selectedCell.pos.x + ", " + selectedCell.pos.y
	}
	
	debug.text = changedWords.length + " changed: " + changedWords
	
	renderer.render(stage);
	requestAnimationFrame(update);
	counter++
}



