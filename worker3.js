importScripts('puzzle.js')

onmessage = function(e) {
    var arr = e.data[0]
    var query = e.data[1]
    
    var matches = getMatchesFromArray(arr,query,true)
    
    var hasMatch = matches.length > 0
    console.log("match? " + hasMatch) 
    postMessage(matches)
}