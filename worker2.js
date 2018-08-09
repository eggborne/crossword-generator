importScripts('generate.js','puzzle.js','exec.js','board.js','util.js')

onmessage = function(e) {
    console.log("worker recieved cands " + e.data[0])
    var candidates = e.data
    var tried = 0
    // candidates = shuffle(candidates)
    var candIndex = randomInt(0,Math.ceil(candidates.length/6))
    printWord(candidates[candIndex],selectedCell.pos.x,selectedCell.pos.y,"across")
    console.log("initial random word " + candidates[candIndex] + " - 1 of " + candidates.length + " - score " + scrabbleScore(candidates[candIndex]))
    
    scanForInvalidWords()
    if (!boardLegitimate) {
        
        var toCheck = candidates.length
        console.log("checking " + toCheck + " words...")
        for (var c=1;c<toCheck;c++) {
            var cand = candidates[c]
            if (cand !== origWord && currentAttempts.indexOf(cand) === -1) {
                console.log("trying " + cand + " - " + c  + " of " + candidates.length + " - score " + scrabbleScore(cand))
                
                printWord(cand,selectedCell.pos.x,selectedCell.pos.y,"across",true)
                scanForInvalidWords()
            } else {
                console.log("already tried " + cand)
            }
            
            if (boardLegitimate) {
                console.log("exiting loop with word " + cand)

                // currentAttempts.push(cand)
                break
            }
            
        }
        
        
        
    }
    // while (candidates[candIndex] && !boardLegitimate) {  
    //     console.log(candidates[candIndex] + " is no good")
    //     // if (candIndex !== rando) {
    //         console.log("trying " + candidates[candIndex] + " - " + candIndex + " of " + candidates.length)
    //         // debug.text = "trying " + candidates[candIndex] + " - " + candIndex + " of " + candidates.length
            
    //         printWord(candidates[candIndex],selectedCell.pos.x,selectedCell.pos.y,direction,true)
    //         scanForInvalidWords()
            
    //     // }
    //     candIndex++
    // }
    if (boardLegitimate) {
        // currentAttempts.push(printList[printList.length-1].word)
        // debug.text = "Printed word " + (printList[printList.length-1].word + " after trying " + (tried) + " out of " + candidates.length + " words")

    } else {
        
        console.log("NO APPROPRIATE WORD")
        // var sugg = prompt("Suggest a word:")
        // if (sugg) {
        //     printWord(sugg,selectedCell.pos.x,selectedCell.pos.y,direction)
        // } else {
            // console.log("NO GOOD SOLUTION to " + selectedCell.label.text + " " + direction + "\ntried " + candidates.length + " words")
            // undoLastPrint()
            // board.updateWordData()
            printWord(origWord,selectedCell.pos.x,selectedCell.pos.y,"across",true)
            board.updateWordData()
            // printList = printList.splice(0,printList.length-(candIndex+1))
            // var prev = printList[printList.length-1]
            // console.log(prev)
            setWordMark(true,selectedCell.wordData["across"],selectedCell.pos.x,selectedCell.pos.y,"across")
            // setWordMark(true,prev.word,prev.startX,prev.startY,prev.direction,0x0000ff)
            
        // }
    }
    
    // var score = scrabbleScore("sockmashsdjzzz")
    // postMessage(cands)
}