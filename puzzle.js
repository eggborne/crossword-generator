clues = {
	"across":{

	},
	"down":{

	}
}
wordObjects = {

}
neededWords = {}
articles = [
	"a",
	"an",
	"the",
	"for",
	"to",
	".",
	"of",
	"and"
]
letters = [
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
]
rejected = 0
wordCollection = []
compiledWordList = []
rawWiki = undefined
currentDefinition = undefined
selectedWord = undefined
// for (var w=0;w<wordList.length;w++) {
// 	var word = wordList[w]
// 	if (word.length < 2) {
// 		wordList.splice(w,1)
// 		rejected++
// 	}
// 	// if (word.length > 12) {
// 	// 	wordList.splice(w,1)
// 	// 	rejected++
// 	// }
// }
function defineFollowerPhrase(wordObj) {
	var fol = wordObj.followers[0]
	if (fol === undefined) {
		return
	}
	var searchString = wordObj.string + "+" + fol
	// debug.text += ("\n" + wordObj.string + " " + fol + " - ")
	$.getJSON(
	    "http://api.datamuse.com/words?ml=" + searchString + "&max=10",
	    function(data) {
        for (var c=0;c<data.length;c++) {
          // debug.text += (data[c].word + ", ")
        }
	    }
	);
}
function checkIfMatchExists(arr,query,cell,direction) {
	// console.log("CHECKING IF MATCH EXISTS FOR " + query)
	for (var c=0;c<arr.length;c++) {
		var cand = arr[c]
		var matches = true
		for (var k=0;k<cand.length;k++) {
			var char = cand[k]
			if (query[k] !== "*" && char.toUpperCase() !== query[k].toUpperCase()) {
				matches = false
				break
			}
		}
		if (matches) {
			// console.log(query + " HAS AT LEAST ONE MATCH")
			return true
		}
	}
	// console.log("NO MATCH FOR " + query)
	return false
}
function getMatchesFromArray(arr,query,checkForOne) {
	var matches = []
	// sortArrayByScrabbleScore(arr)
	if (query.indexOf("*") === -1) {
		// console.log("searching query " + query)
	} 
	
	for (var c=0;c<arr.length;c++) {
		var cand = arr[c]
		var match = true
		for (var k=0;k<cand.length;k++) {
			var char = cand[k]
			if (query[k] !== "*" && char.toUpperCase() !== query[k].toUpperCase()) {
				if (checkForOne) {
					
				}
				match = false
				break
			}
		}
		if (match) {
			matches.push(cand)
			if (checkForOne) {
				// console.log("first match found is " + cand + ". breaking loop")
				break
			}
		}
	}
	return matches
}
function getWordCandidates(query) {
	var randomInit = letters[randomInt(0,letters.length-1)]
	console.log("orig " + query)
	var actualQuery = query
	for (var p=0;p<actualQuery.length;p++) {
		var char = actualQuery[p]
		if (char === "*" && query[p+1] === "*") {
			actualQuery = actualQuery.substr(0,p) + actualQuery.substr(p+1,actualQuery.length-1)
		}
		if (p === query.length-1) {
			if (char === "*" && actualQuery[p-1] === "*") {
				actualQuery = actualQuery.substr(0,actualQuery.length-2)
			}
		}
	}
	// console.log("actual " + actualQuery)
	$.getJSON(
	    "http://api.datamuse.com/words?sp=" + query + "&max=1000",
	    function(data)
	    {
			// console.log(data)
			
			for (var c=0;c<data.length;c++) {
				var cand = data[c].word
				if (cand.indexOf(" ") !== -1) {
					// console.log("rejecting words " + cand)
				}
				if ((cand.indexOf(" ") > -1 && cand.length === query.length+1) || (cand.indexOf(" ") === -1 && cand.length === query.length)) {
					
					candidates.push(cand)
				}
			}
			candidates = getMatchesFromArray(candidates,query)
			// console.log(candidates)
			// printWord(candidates[randomInt(0,candidates.length-1)],0,0,"vertical")
			return candidates
	    }
	);
}
function findWord(word) {
	console.log("checking " + word)
	$.getJSON(
	    "http://api.datamuse.com/words?sp=" + word,
	    function(data)
	    {
			console.log(data)
						
	    }
	);
}
function wordDefinition(word) {
	
	$.getJSON(
	    "http://api.datamuse.com/words?sp=" + word + "&md=p,d&max=10",
	    function(data) {
        if (data[0] && data[0].defs) {
          var definition = data[0].defs[data[0].defs.length-1]
          var pos = data[0].tags[0]
          if (!pos) {
            pos = data[0].tags[1]
          }
          var leadChars = pos.length

          definition = definition.substr(leadChars,definition.length-1).trim()
          definition = trimmedDefinition(definition)
          definition = definition[0].toUpperCase() + definition.substr(1,definition.length-1)
          
          wordObjects[word].definition = definition
          wordObjects[word].rating = data[0].score
          if (pos) {
            wordObjects[word].partOfSpeech = pos
          }
          debug.text += "\n" + definition + ": " + word.toUpperCase()
        }
			
	    }
	);
}

function getFollowers(word) {
	$.getJSON(
	    "http://api.datamuse.com/words?rel_bga=" + word + "&max=10",
	    function(data)
	    {
			if (data && data[0]) {
				// console.log(data)
				for (var a=0;a<data.length;a++) {
					var foll = data[a].word
					if (selectedWord.rating > 10000 && foll.length >= 3) {
						wordObjects[word].followers.push(foll)
						
					}
					if (foll.length >= 3 && wordList.indexOf(foll) === -1) {
						wordList.push(foll)
						console.log("ADDING " + foll)
					}
					
				}
				console.log("LIST LENGTH " + wordList.length)
			}
			
	    	
	    }
		
	);
}
function getDescribedWords(word) {
	$.getJSON(
	    "http://api.datamuse.com/words?rel_jjb=" + word + "&max=20",
	    function(data)
	    {
			if (data && data[0]) {
				for (var a=0;a<data.length;a++) {
					var desc = data[a].word
					wordObjects[word].describing.push(desc)
				}
			}
			
	    	
	    }
		
	);
}
function getDescribingWords(word) {
	$.getJSON(
	    "http://api.datamuse.com/words?rel_jja=" + word + "&max=20",
	    function(data)
	    {
			if (data && data[0]) {
				for (var a=0;a<data.length;a++) {
					var desc = data[a].word
					wordObjects[word].describedBy.push(desc)
				}
			}
			
	    	
	    }
		
	);
}

function getSynonyms(word) {
	$.getJSON(
	    "http://api.datamuse.com/words?rel_syn=" + word + "&max=10",
	    function(data)
	    {
			if (data && data[0]) {
				// console.log("found syns for " + word)
				for (var a=0;a<data.length;a++) {
					var syn = data[a].word
					wordObjects[word].synonyms.push(syn)
					
				}
			}
	    }
		
	);
}

function getAntonyms(word) {
	var ant = undefined
	$.getJSON(
	    "http://api.datamuse.com/words?rel_ant=" + word,
	    function(data)
	    {
			var ants = []
			if (data && data[0]) {
				
				for (var a=0;a<data.length;a++) {
					var ant = data[a].word
					wordObjects[word].antonyms.push(ant)
				}
			}	    	
	    }
		
	);
	
}



function trimmedDefinition(def) {
	var newDef = def
	var parenth = 0
	for (var c=0;c<def.length;c++) {
		var char = def[c]
		if (parenth) {
			if (char === ")") {
				newDef = newDef.substr(parenth+2,newDef.length-parenth)
			} else {
				parenth++
			}
		}
		if (c === 0 & char === "(") {
			parenth++
		} else if (char === ";") {
			newDef = newDef.substr(0,c)
		}
	}
	return newDef
}

function randomWord() {
	return wordList[randomInt(0,wordList.length-1)]
}

function sortWords(arr) {
	
	for (var w=0;w<arr.length;w++) {
		var word = arr[w]
		var len = word.length
		if (!sortedWords[len]) {
			sortedWords[len] = []
		}
		sortedWords[len].push(word)
		console.log("adding " + word)
	}
	for (var s=0;s<sortedWords.length;s++) {
		sortedWords[s].sort()
	}
}

function removeArticles(arr) {
	for (var a=0;a<articles.length;a++) {
		var art = articles[a]
		if (arr.indexOf(art) > -1) {
			arr.splice(arr.indexOf(art),1)
		}
	}
}

function wordsWithXAtPositionY(x,y,arr,len) {
	var arr = []
	for (w=0;w<wordList.length;w++) {
		var word = wordList[w]
		var letter = word[y]
		if (letter && letter === x && len === word.length) {
			arr.push(word)
		}
	}
	return arr
}

function WordObject(word) {
	this.string = word
	this.rating = 0
	this.definitions = []
	this.antonyms = []
	this.synonyms = []
	this.describing = []
	this.describedBy = []
	this.phrases = []
	this.related = []
	this.pos = ""
	this.autoClue = ""
	this.researched = false
	this.drawn = counter

	wordObjects[word] = this


}

function sortAllWords() {
	for (section in sortedWords) {
		sortedWords[section].sort()
		console.log(section + "-letter words: " + sortedWords[section].length)
	}
}