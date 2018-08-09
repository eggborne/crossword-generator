viewWidth = window.innerWidth;
viewHeight = window.innerHeight;
if (window.innerWidth > window.innerHeight) {
	landscape = true
} else {
	landscape = false
}
currentClue = ""
HWRatio = viewHeight/viewWidth
// isTouchDevice = 'ontouchstart' in document.documentElement;
isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints
console.log("TOUCH " + isTouchDevice)
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = window.devicePixelRatio
renderer = PIXI.autoDetectRenderer();
renderer.resize(viewWidth,viewHeight)
document.body.appendChild(renderer.view);
screenVertical = false
cellSize = Math.round(window.innerHeight/33)
viewHeight = window.innerHeight
viewWidth = window.innerWidth
if (window.innerWidth < window.innerHeight) {
	screenVertical = true
	cellSize = window.innerWidth/50
}
if (viewWidth > window.innerWidth) {
	viewWidth = window.innerWidth
}
if (viewHeight > window.innerHeight) {
	viewHeight = window.innerHeight
}
pixelHeight = 196
pixelSize = viewHeight/196
fingerOnScreen = false;
fullscreen = false
touchingAt = undefined
stoppedPressing = -99
touchedAt = -99
LMBDown = RMBDown = MMBDown = pressingUp = pressingSpace = pressingDown = pressingLeft = pressingRight = pressingE = false
pressingDirections = []
cursor = {x:0,y:0}
touches = []
bestDistance = 0
pressedDownAt = pressedRightAt = pressedLeftAt = -99
currentAttempts = []
lastInvalidWord = {char:undefined,index:undefined}
rootCells = []
doomedQuery = undefined
offendingCell = undefined
offendingIndex = undefined
offendingLetter = undefined
tries = 0
function setVariables() {
	enemies = []
	gameStarted = -99
	gameInitiated = -99
	pressedSpaceAt = -99
	rightClickedAt = clickedAt = middleClickedAt = -99
	gravityPower = 180
	gapDropped = 0
	changingSpeedDuration = 0
	speedAdjustment = 0
	counter = 0
	padding = 10
	scrollSpeed = 0
	pillarsPending = 0
	totalDistance = 0
	gapPlanned = false
	sendingMines = false
	minesSent = 0
	alienHeadsAttacking = 0
	lastMine = 0
	lastGap = 0
}

lastCursor = {x:0,y:0}
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
pixelText = PIXI.Texture.fromImage("assets/pixel.bmp")
stage = new PIXI.Container();

bg = new PIXI.Sprite(pixelText)
bg.width = viewWidth
bg.height = viewHeight
bg.tint = 0xaaaaaa

stage.addChild(bg)

setInputs()

renderer.render(stage);

resets = 0
joystick = undefined

changedWords = []

lastBadWord = lastBadWordIntersectorIndex = undefined
lastInvalidIndex = undefined
currentBlock = 0
doubleCells = []
triedPairs = []

function init() {
	// sortWords(wordList)
	setVariables()
	// setStyles()
	// if (screenVertical || isTouchDevice) {
	// 	bg.tint = 0x00ff00
	// }

	board = new Board(16,16)
	board.populate()
	
	debug = new PIXI.Text("",{fontFamily : 'Arial', fontSize: cellSize*0.75, fill : 0x000000})
	debug.x = board.bg.x
	debug.y = cellSize
	stage.addChild(debug)

	acrossButton = new Button("ACROSS",function() {
		if (acrossButton.sprite.tint === 0xdd0000) {
			if (selectedCell && selectedCell.wordData.across.length) {
				printWord("*".repeat(selectedCell.wordData.across.length),selectedCell.pos.x,selectedCell.pos.y,"across")
				acrossButton.sprite.tint = 0x88ff88
			}
		} else {
			if (selectedCell && selectedCell.wordData.across.length) {
				var candidates = getMatchesFromArray(sortedWords[selectedCell.wordData.across.length],selectedCell.wordData.across)
				if (candidates.length) {
					printWord(candidates[randomInt(0,candidates.length-1)],selectedCell.pos.x,selectedCell.pos.y,"across")
					acrossButton.sprite.tint = 0xdd0000
				} else {
					console.log("NOTHING FOUND")
				}
			}
		}
	})
	acrossButton.container.x = board.bg.x+board.bg.width+cellSize*3.5
	acrossButton.container.y = board.bg.y
	defineButton = new Button("RANDOM WORD",function(){
		var len = randomInt(3,11)
		defineButton.sprite.tint = 0xaaaa22
		defineButton2.sprite.tint = 0xaaaa22
		getClue(sortedWords[len][randomInt(0,sortedWords[len].length-1)])
		
	})
	defineButton.container.y = board.bg.y+board.bg.height*1.2
	defineButton2 = new Button("ENTER WORD",function(){
		defineButton.sprite.tint = 0xaaaa22
		defineButton2.sprite.tint = 0xaaaa22
		var word = prompt("Enter word:")
		getClue(word)
	})
	defineButton2.container.y = defineButton.container.y+defineButton.container.height*1.24
	defineButton.sprite.width = defineButton2.sprite.width = board.bg.width
	defineButton.container.x = defineButton2.container.x = board.bg.x+(board.bg.width/2)
	downButton = new Button("DOWN",function(){
		if (downButton.sprite.tint === 0xdd0000) {
			if (selectedCell && selectedCell.wordData.down.length) {
				
				printWord("*".repeat(selectedCell.wordData.down.length),selectedCell.pos.x,selectedCell.pos.y,"down")
				downButton.sprite.tint = 0x88ff88
			}
		} else {
			if (selectedCell.wordData.down.length) {
				var candidates = getMatchesFromArray(sortedWords[selectedCell.wordData.down.length],selectedCell.wordData.down)
				if (candidates.length) {
					printWord(candidates[randomInt(0,candidates.length-1)],selectedCell.pos.x,selectedCell.pos.y,"down")
					downButton.sprite.tint = 0xdd0000
				} else {
					console.log("NOTHING FOUND")
				}
			}
		}
	})
	downButton.container.x = board.bg.x+board.bg.width+cellSize*3.5
	downButton.container.y = board.bg.y+acrossButton.sprite.height+cellSize
	populateButton = new Button("POPULATE",function(){
		// fillBoard()
		var cell = doubleCells[currentBlock]
		var started =  Date.now()
		findIntersectingWords(cell.pos.x,cell.pos.y)
		console.log("solved block " + (currentBlock) + " in " + ((Date.now()-started)/1000))
		clearMarks()
		doubleCells[currentBlock].sprite.alpha = 1
		doubleCells[currentBlock+1].sprite.alpha = 0.3
		currentBlock++
		// findIntersectingWords(0,0)	
	})
	populateButton.container.x = board.bg.x+board.bg.width+cellSize*3.5
	populateButton.container.y = board.bg.y+(acrossButton.sprite.height*2)+(cellSize*2)
	clearAllButton = new Button("CLEAR ALL",clearAllWords)
	clearAllButton.container.x = board.bg.x+board.bg.width+cellSize*3.5
	clearAllButton.container.y = board.bg.y+(acrossButton.sprite.height*4)+(cellSize*4)
	randomizeButton = new Button("RANDOMIZE",function(){
		board.container.destroy()
		var rando = randomInt(14,20)
		board = new Board(rando,rando)
		board.populate()
		randomizeBlanks()
		board.labelNumberedCells()
		board.compileWordSpaces()
		for (var i=0;i<board.wordLengths.length;i++) {
			var word = board.wordLengths[i]
			printWord(word.string,word.pos.x,word.pos.y,word.direction)
		}
		board.updateWordData()
	})
	randomizeButton.container.x = board.bg.x+board.bg.width+cellSize*3.5
	randomizeButton.container.y = board.bg.y+(acrossButton.sprite.height*4)+(cellSize*6)
	randomizeBlanks()
	board.labelNumberedCells()
	board.compileWordSpaces()
	
	for (var i=0;i<board.wordLengths.length;i++) {
		var word = board.wordLengths[i]
		printWord(word.string,word.pos.x,word.pos.y,word.direction)

	}
	
	board.updateWordData()

	clueArea = new PIXI.Text("",{fontFamily : 'Helvetica', wordWrap:true, wordWrapWidth:(cellSize*15),fontWeight:"bold", fontSize: (cellSize*0.5), fill : 0x000000})
	clueArea.x = board.bg.x
	clueArea.y = board.bg.y+board.bg.height+cellSize*3.5
	stage.addChild(clueArea)


    requestAnimationFrame(update);
};



