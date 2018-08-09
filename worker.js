importScripts('generate.js','puzzle.js','exec.js','board.js')

onmessage = function(e) {
    var candidates = e.data[0]
    var direction = e.data[1]
    var posX = e.data[2].x
    var posY = e.data[2].y
    
    var tried = 0
    
        
    postMessage(boardLegitimate)
}