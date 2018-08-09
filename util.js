
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
function mergeArrays(array1, array2) {
    var result = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while(len--) {
        var item = arr[len];

        if(!assoc[item]) 
        { 
            result_array.unshift(item);
            assoc[item] = true;
        }
    }

    return result;
}

function fullscreen() {
	// fullscreen = true
    var el = document.body
    if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else {
        el.mozRequestFullScreen()
    }
}
function exitFullscreen() {
	// fullscreen = false
    if (document.exitFullScreen) {
        document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
};
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function saveWord(newWord) {
	var len = newWord.length
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/saveword.php", 
        data: {word:newWord,len:len},
        success : function(data)
        {
            // console.log("saved new word!")
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function saveClue(word,clue) {
	var len = word.length
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/saveclue.php", 
        data: {word:word,len:len,clue:clue},
        success : function(data)
        {
            defineButton.sprite.tint = 0x22aa22
		    defineButton2.sprite.tint = 0x22aa22
            console.log("saved " + word)
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function getClue(word) {
    var len = word.length
    // console.log("word " + word + " length " + len)
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/getdefinition.php", 
        data: {word:word,len:len},
        success : function(data)
        {
            currentClue = data
            // console.log(data)
            newClue = prompt(word.toUpperCase() +"\n \n" + data + "\n \nNew clue:")
            if (newClue !== null) {
                // console.log("saving new clue " + newClue)
                saveClue(word,newClue)
            } else {
                defineButton.sprite.tint = 0x22aa22
		        defineButton2.sprite.tint = 0x22aa22
            }
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}





