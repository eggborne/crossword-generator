printList = []
selectedCell = undefined
function undoLastPrint(delay) {
    var prev = printList[printList.length-1]
    if (prev) {
        // console.log("set to replace " + prev.word + " with " + prev.prevWord)
        printWord(prev.prevWord,prev.startX,prev.startY,prev.direction,true)
        if (prev.direction === "across") {
            acrossButton.sprite.tint = 0x88ff88
        } else {
            downButton.sprite.tint = 0x88ff88
        }
        printList.splice(-1)
        
        // scanForInvalidWords()
        
    } else {
        console.log("no prev")
    }
    clearMarks()
    // debug.text = ""
}
function clearLastPrintedArea(delay) {
    var prev = printList[printList.length-1]
    if (prev) {
        
        printWord("*".repeat(prev.word.length),prev.startX,prev.startY,prev.direction,true)
        if (prev.direction === "across") {
            acrossButton.sprite.tint = 0x88ff88
        } else {
            downButton.sprite.tint = 0x88ff88
        }
        printList.splice(-1)
        
        // scanForInvalidWords()
        
    } else {
        console.log("no prev")
    }
}
function getEndIntersection(posX,posY,direction) {
    var startingCell = board.cells[posY][posX]
    if (direction === "across") {
        var endingCell = board.cells[posY][posX+startingCell.wordData[direction].length-1]
    } else {
        var endingCell = board.cells[posY+startingCell.wordData[direction].length-1][posX]
    }
    return endingCell 
}
function stripAsterisks(word) {
    var strippedWord = ""
    for (var c=0;c<word.length;c++) {
        var char = word[c]
        if (char !== "*") {
            strippedWord += char
        }
    }
    return strippedWord
}
function getIndexesOfAsterisks(word) {
    var indexes = []
    for (var c=0;c<word.length;c++) {
        var char = word[c]
        if (char === "*") {
            indexes.push(c)
        }
    }
    return indexes
}
function scanForInvalidWords() {
    
    for (var w=0;w<changedWords.length;w++) {
        var word = changedWords[w]
        // console.log("checking " + word + " - " + (w+1) + " of " + changedWords.length)
        if (!checkIfMatchExists(sortedWords[word.length],word)) {
            boardLegitimate = false
            lastInvalidIndex = w
            
            return word
        } else {
            // console.log(word + " found valid")
            boardLegitimate = true
        }
    }
    console.log(changedWords.length + " changed: " + changedWords)
    // boardLegitimate = true
    // // console.log("scanning............................")
    // for (var r=0;r<board.cells.length;r++) {
    //     var row = board.cells[r]
    //     for (var w=0;w<row.length;w++) {
            
    //         var cell = row[w]
            
    //         if (cell.label) {
    //             var allAsterisks = cell.wordData.across.split("").every(function(char) {
    //                 return char === "*"
    //             })
    //             if (!allAsterisks) {
    //                 var wordArray = sortedWords[cell.wordData.across.length]
    //                 var query = cell.wordData.across                    
    //                 var hasMatches = checkIfMatchExists(wordArray,query,cell,"across")
    //                 if (!hasMatches) {
    //                     boardLegitimate = false
    //                     return
    //                 }         

    //             } 

            
    //             allAsterisks = cell.wordData.down.split("").every(function(char) {
    //                 return char === "*"
    //             })
    //             if (!allAsterisks) {
    //                var wordArray = sortedWords[cell.wordData.down.length]
    //                 var query = cell.wordData.down
    //                 var hasMatches = checkIfMatchExists(wordArray,query,cell,"down")
    //                 if (!hasMatches) {
    //                     boardLegitimate = false
    //                     return
    //                 }
                   
    //             }
    //         }
        
    //     }
    // }
    
}
function printWord(word,startX,startY,direction,noLog) {
    if (!noLog) {
        printList.push({"word":word,"prevWord":"","startX":startX,"startY":startY,"direction":direction})
    }
    var origWord = board.cells[startY][startX].wordData[direction]
    // console.log("printing " + word + " over " + origWord)
    var xPos = startX
    var yPos = startY
    var steps = 0
    // console.log("starting from cell " + startX + "," + startY)
    
    var startingCell = board.cells[yPos][xPos]
    startingCell.wordData[direction] = word
    if (!noLog) {
        printList[printList.length-1].data = startingCell.wordData
    }
    
    // board.cells[yPos][xPos].assignWord(word,direction)
    for (var c=0;c<word.length;c++) {
        var char = word[c]
        // console.log("printing on cell " + xPos + "," + yPos)
        var cell = board.cells[yPos][xPos]
        if (!noLog) {
            printList[printList.length-1].prevWord += cell.letter.text
        }
        if (char !== cell.letter.text) {
            cell.letter.text = char.toUpperCase()
            
            if (char !== "*") {
                cell.letter.alpha = 1    
            } else {
                cell.letter.alpha = 0
            }
        }        

        if (direction === "across") {
            xPos++
            steps++
        } else {
            yPos++
            steps++
        }
    }
    // console.log("updating data from print of " + word)
    
    board.updateWordData()
    
}
function setWordMark(position,word,posX,posY,direction,color) {
    var steps = 0
    // console.log("marking " + posX + "," + posY)
    for (var c=0;c<word.length;c++) {
        var char = word[c]
        var cell = board.cells[posY][posX]
        
        cell.marker.visible = position
        if (color) {
            cell.marker.tint = color
        }

        if (direction === "across") {
            posX++
            steps++
        } else {
            posY++
            steps++
        }
    }
}
function clearMarks() {
    for (var r=0;r<board.cells.length;r++) {
        var row = board.cells[r]
        for (var c=0;c<board.cells[r].length;c++) {
            var cell = row[c]
            cell.marker.visible = false
            cell.marker.tint = 0xff0000
        }
    }
}
function findAppropriateWord(direction) {
   
    // currentAttempts = []
    // console.log("searching cell " + selectedCell.pos.x + ", " + selectedCell.pos.y + " - " + selectedCell.wordData[direction] + " for an " + direction)
    var spacePreviously = selectedCell.wordData[direction].toLowerCase()
    if (selectedCell && selectedCell.wordData[direction].length) {
        
        var tried = 0
        var origWord = selectedCell.wordData[direction].toLowerCase()
        var doomed = []
        // debug.text = ("working on " + selectedCell.label.text + " " + direction + "...")
        var candidates = getMatchesFromArray(sortedWords[selectedCell.wordData[direction].length],selectedCell.wordData[direction].toLowerCase())
        
        if (candidates.length) {
            var origLength = candidates.length
            var tried = 0
            // candidates = shuffle(candidates)
            var candIndex = randomInt(0,Math.floor(candidates.length-1))
            // console.log("printing word with index " + candIndex)
            // console.log("cand pool " +  candidates.toString())

            printWord(candidates[candIndex],selectedCell.pos.x,selectedCell.pos.y,direction)
            // console.log("initial random word " + candidates[candIndex] + " - 1 of " + candidates.length + " - score " + scrabbleScore(candidates[candIndex]))
            scanForInvalidWords()
            tried++
            if (!boardLegitimate) {

                // console.log("finding a match in " + candidates.length)
                // console.log("not legit")
                var toCheck = candidates.length
                
                if (toCheck > 500) {
                    // toCheck = 500
                }
                // console.log("checking " + toCheck + " words...")
                for (var c=0;c<candidates.length;c++) {
                    var cand = candidates[c]
                    
                    // console.log("trying " + cand + " - " + (c+1) + " of " + candidates.length)
                    
                    printWord(cand,selectedCell.pos.x,selectedCell.pos.y,direction,true)
                    scanForInvalidWords()
                    tried++
                    if (boardLegitimate) {
                        // console.log("exiting loop with word " + cand + " after rejecting " + tried)
                        // debug.text = "Found word " + cand.toUpperCase() + " for " + selectedCell.label.text + " " + direction + " after trying " + c
                        rootCells = []
                        // currentAttempts.push(cand)
                        return
                    } else {
                        // console.log(cand + " is no good because it has an invalid intersector at " + lastInvalidIndex )
                        printWord(spacePreviously,selectedCell.pos.x,selectedCell.pos.y,direction,true)
                        // console.log("printing " + spacePreviously + " back over " + cand)
                        var offendingIndex = getIndexesOfAsterisks(spacePreviously)[lastInvalidIndex]
                        var doomedString = "*".repeat(offendingIndex) + cand[offendingIndex] + "*".repeat(cand.length-offendingIndex-1)
                        if (doomed.indexOf(doomedString) === -1) {
                            // console.log("last invalid intersector was " + lastInvalidIndex + " in list. intersector index in " + spacePreviously + " was " + offendingIndex + ". No string " + doomedString + " can work. candidates.length now " + candidates.length)
                            removeMatchesFromArray(candidates,doomedString)
                            doomed.push(doomedString)
                        }
                        // find the offending letter in rejected word
                    }

                    if (!candidates[c+1]) {
                        // console.log("no next cand -------------------------------->")
                        break
                    }
        
                }



                
            } else {
                // debug.text = "Found word " + printList[printList.length-1].word.toUpperCase() + " for " + selectedCell.label.text + " " + direction + " on first try"
                        
            }
      
            if (!boardLegitimate) {
                
                // console.log("NO APPROPRIATE WORD. Tried " + tried + " of " + origLength)

                // debug.text = ("NO GOOD SOLUTION to " + selectedCell.label.text + " " + direction + "\ntried " + candidates.length + " words out of " + origLength)
                // undoLastPrint()
                // printWord(origWord,selectedCell.pos.x,selectedCell.pos.y,direction,true)
                // var prev = printList[printList.length-1]
                setWordMark(true,selectedCell.wordData[direction],selectedCell.pos.x,selectedCell.pos.y,direction)
            }
            rootCells = []
        }       
    }
    
}
function promptForWord() {
    var word = prompt("Enter word:")

}
function clearBlanks() {
    for (var r=0;r<board.cells.length;r++) {
        var row = board.cells[r]
        for (var c=0;c<row.length;c++) {
            var cell = row[c]
            cell.sprite.tint = 0xffffff
        }
    }
    // board.labelNumberedSpaces()
}
function randomizeBlanks() {
    clearBlanks()
    var xPos = Math.round(board.cells[0].length/4)
	var yPos = 0
	var clus = blankCluster(xPos,yPos,"vertical",randomInt(4,6))
	for (var c=0;c<clus.length;c++) {
		clus[c].sprite.blank()
	}
	// xPos = Math.round(board.cells[0].length/2)
	// var clus2 = blankCluster(xPos,yPos,"vertical",randomInt(3,4))
	// for (var c=0;c<clus2.length;c++) {
	// 	clus2[c].sprite.blank()
	// }
	xPos = Math.round(board.cells[0].length*0.6)
	var clus3 = blankCluster(xPos,yPos,"vertical",randomInt(4,5))
	for (var c=0;c<clus3.length;c++) {
		clus3[c].sprite.blank()
	}
	xPos = 0
	yPos = Math.round(board.cells[0].length/4)
	var clus = blankCluster(xPos,yPos,"horizontal",randomInt(4,4))
	for (var c=0;c<clus.length;c++) {
		clus[c].sprite.blank()
	}
	yPos = Math.round(board.cells[0].length/2)
	var clus2 = blankCluster(xPos,yPos,"horizontal",randomInt(3,4))
	for (var c=0;c<clus2.length;c++) {
		clus2[c].sprite.blank()
	}
	// yPos = Math.round(board.cells[0].length*0.6)
	// var clus3 = blankCluster(xPos,yPos,"horizontal",randomInt(3,3))
	// for (var c=0;c<clus3.length;c++) {
	// 	clus3[c].sprite.blank()
	// }
	xPos = Math.round(board.cells[0].length/2.5)
	yPos = Math.round(board.cells[0].length/3)
	var clus4 = blankCluster(xPos,yPos,"horizontal",randomInt(4,6))
	for (var c=0;c<clus4.length;c++) {
		clus4[c].sprite.blank()
	}
	// xPos = Math.round(board.cells[0].length/4)
	// yPos = Math.round(board.cells[0].length/2)
	// var clus4 = blankCluster(xPos,yPos,"vertical",randomInt(4,5))
	// for (var c=0;c<clus4.length;c++) {
	// 	clus4[c].sprite.blank()
	// }
	// xPos = Math.round(board.cells[0].length/2)
	// yPos = Math.round(board.cells[0].length/4)
	// var clus4 = blankCluster(xPos,yPos,"vertical",randomInt(4,5))
	// for (var c=0;c<clus4.length;c++) {
	// 	clus4[c].sprite.blank()
	// }
	xPos = Math.round(board.cells[0].length/2.5)
	yPos = Math.round(board.cells[0].length/2.25)
	var clus4 = blankCluster(xPos,yPos,"horizontal",randomInt(3,4))
	for (var c=0;c<clus4.length;c++) {
		clus4[c].sprite.blank()
	}
}
function fillBoard() {
    selectedCell = undefined
	var dir = "across"
	var count = 1
	for (var i=0;i<board.wordLengths.length/4;i++) {
		var word = board.wordLengths[i]
		selectedCell = board.cells[word.pos.y][word.pos.x]
		if (selectedCell.wordData[dir]) {
			console.log("finding " + word.string)
			findAppropriateWord(dir)
			scanForInvalidWords()
			if (dir === "across") {
				dir = "down"
			} else {
				dir = "across"
			}
			if (!boardLegitimate) {
				console.log("SHIT")
			}

			
			count++
		}

	}
}
function expandShortWords() {
    for (var w=0;w<wordLengths.length;w++) {
        var word = wordLengths[w]
        if (word.string.length === 2) {
            if (word.direction === "across") {

            } else {

            }d
        }
    }
}
var sortedWordList = []
function sortByScrabbleScore() {
    for (group in sortedWords) {
        shuffle(sortedWords[group])
        sortedWords[group].sort(function(a,b){
            return scrabbleScore(a)-scrabbleScore(b)
        })
        console.log("last word " + sortedWords[group][sortedWords[group].length-4] + " of length " + group)
        
    }
}
function sortArrayByScrabbleScore(array) {
    array.sort(function(a,b){
        return scrabbleScore(a)-scrabbleScore(b)
    })   
}
function convertList() {
    
    for (group in sortedWords) {
        sortedWordList[group] = []
        var arr = sortedWords[group]
        console.log("created group " + group)
        for (var w=0;w<arr.length;w++) {
            var scrabScore = scrabbleScore(arr[w])
            sortedWordList[group][w] = {word:arr[w],score:scrabScore}       
            console.log("added " + sortedWordList[group][w].word + " with score " + sortedWordList[group][w].score)
        }
        
    }
}
scrabbleScores = {
    a:1,
    b:3,
    c:3,
    d:2,
    e:1,
    f:4,
    g:2,
    h:4,
    i:1,
    j:8,
    k:5,
    l:1,
    m:3,
    n:1,
    o:1,
    p:3,
    q:10,
    r:1,
    s:1,
    t:1,
    u:1,
    v:4,
    w:4,
    x:8,
    y:4,
    z:10
}
function scrabbleScore(word) {
    score = 0
    for (var c=0;c<word.length;c++) {
        var char = word[c]
        score += scrabbleScores[char]
    }
    return score
}

removeMatchesFromArray = function(arr,query) {
    for (var w=0;w<arr.length;w++) {
        var match = false
        var word = arr[w]
        for (var c=0;c<word.length;c++) {
            var char = word[c]
            if (query[c] !== "*" && query[c] === word[c]) {
                // console.log("removing " + word + " for violating " + query)
                arr.splice(w,1)
                match = true
            }
        }
        
        
    }
}

function replaceCharacter(old,replacement) {
    for (section in sortedWords) {
        var group = sortedWords[section]
        for (var w=0;w<group.length;w++) {
            var word = group[w]
            for (var c=0;c<word.length;c++) {
                var char = word[c]
                if (letters.indexOf(char) === -1) {
                    console.log("bad char in " + word)
                    if (char === old) {
                        console.log("found a " + char + " at spot " + c + " in " + word)
                        group[w] = word.substr(0,c) + replacement + word.substr((c+1),word.length)
                        var newWord = group[w]
                        console.log("changed to " + newWord)
                        sortedWords[section].splice(w,1)
                        sortedWords[newWord.length].push(newWord)
                    }
                }
               
            }
        }
    }
}
function clearAllWords() {
    for (var i=0;i<board.wordLengths.length;i++) {
        var word = board.wordLengths[i]
        printWord(word.string,word.pos.x,word.pos.y,word.direction)

    } 
    clearMarks()
}

function clearBlock(blockIndex) {
    selectedCell = doubleCells[blockIndex]
    var posX = selectedCell.pos.x
    var posY = selectedCell.pos.y
    // console.log("clearing block " + currentBlock)
    printWord("*".repeat(selectedCell.wordData.across.length),selectedCell.pos.x,selectedCell.pos.y,"across",true)
    printWord("*".repeat(selectedCell.wordData.down.length),selectedCell.pos.x,selectedCell.pos.y,"down",true)
    // console.log("covering " + selectedCell.label.text + " down and across")
    var downLength = selectedCell.wordData.down.length
    for (var t=0;t<downLength-1;t++) {
        selectedCell = board.cells[posY][posX]
        if (selectedCell.label) {
            printWord("*".repeat(selectedCell.wordData.across.length),selectedCell.pos.x,selectedCell.pos.y,"across",true)
            // console.log("covering " + selectedCell.label.text + " across")
        } 
        posY++   
    }
}

function findIntersectingWords(startX,startY,first) {
    selectedCell = board.cells[startY][startX]
    
    if (first) {
        var posX = startX
        var posY = first
    } else {
        var posX = startX
        var posY = startY
    }   
    
    if (first) {
        firstIndex = first
        // console.log("starting ints of " + selectedCell.label.text + " at index " + firstIndex)    
    } else {
        var firstIndex = 0
        findAppropriateWord("across")
        findAppropriateWord("down")
        var wordPair = [selectedCell.wordData.across,selectedCell.wordData.down].toString()
        // console.log(wordPair)
        // console.log(triedPairs[0])
        if (triedPairs.indexOf(wordPair) > -1) {
            console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>_ " + wordPair + " already tried\n\n")
            printWord("*".repeat(selectedCell.wordData.across.length),selectedCell.pos.x,selectedCell.pos.y,"across",true)
            printWord("*".repeat(selectedCell.wordData.down.length),selectedCell.pos.x,selectedCell.pos.y,"down",true)
            findAppropriateWord("across")
            findAppropriateWord("down")
        }
        wordPair = [selectedCell.wordData.across,selectedCell.wordData.down].toString()
        triedPairs.push(wordPair)
        debug.text = ("tried " + triedPairs.length + " pairs for " + selectedCell.label.text)
        // console.log("starting ints of " + selectedCell.label.text + " at index " + firstIndex)
        console.log("Printing " + selectedCell.wordData.across.toUpperCase() + " and " + selectedCell.wordData.down.toUpperCase())
        
    }
    
    
    
    var downLength = selectedCell.wordData.down.length
    
    for (var t=firstIndex;t<downLength-1;t++) {
        
        posY++
        selectedCell = board.cells[posY][posX]
        // console.log("checking if cell at " + posX + ", " + posY + " has label")
        if (selectedCell.label) {
            // console.log("cell at " + posX + ", " + posY + " indeed has a label")
            // console.log("finding " + selectedCell.label.text)
            findAppropriateWord("across")
            if (!boardLegitimate) {
                tries++
                // undoLastPrint()
                clearBlock(currentBlock)
                if (tries === 1000) {
                    console.log("TIME OUT <<<<<<<<<<<<<<<")
                    debug.text = ("timed out after trying " + tries + " times among " + triedPairs.length + " pairs for " + selectedCell.label.text)
                    triedPairs.length = 0
                    return
                } else {
                    console.log("quit at " + board.cells[posY][posX].label.text + " ------------------------------")
                    // console.log("No good word found for " + board.cells[posY][posX].label.text + ". Starting over ---------------\n")
                    return findIntersectingWords(startX,startY)    
                }
                
            } else {
                // console.log("Printed " + selectedCell.wordData.across.toUpperCase() + " at " + selectedCell.label.text + " across")
            }
        } else {
            
        }
    }
    triedPairs.length = 0
    console.log("done ------------------ ")
    

}

