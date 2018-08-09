onmessage = function(e){
    var matches = []
    var arr = e.data[0]
    var query = e.data[1]
    var checkForOne = e.data[2]
    for (var c=0;c<arr.length;c++) {
        var cand = arr[c]
        var match = true
        for (var k=0;k<cand.length;k++) {
            var char = cand[k]
            if (char.toUpperCase() !== query[k].toUpperCase() && query[k] !== "*") {
                // console.log("in " + cand + ", " + k + " is " + char + " and query equiv is " + query[k])
                match = false
                break
            }
        }
        if (match) {
            if (checkForOne) {
                
            }
            matches.push(cand)
            if (checkForOne) {
                // console.log("ending getMatches")
                return matches
            }
        }
    }
    postMessage(matches)
}