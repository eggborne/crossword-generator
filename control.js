function handleInputs() {
	// if (joystick) {
	// 	if (!frog.dead) {
	// 		joystick.monitorForTouchInput()
	// 	}
	// 	extendAdjunctsForXPosition(joystick.root.x)
	// }
	if (pressingUp) {
		newDirection = "up"
		
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingDown) {
		newDirection = "down"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingLeft) {
		newDirection = "left"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}
	if (pressingRight) {
		newDirection = "right"
		if (pressingDirections.length < 2 && pressingDirections.indexOf(newDirection) === -1) {
			pressingDirections.push(newDirection)
		}
	}	
}

function stopPressing(direction) {
	if (direction === "up") {
		pressingUp = false
	}
	if (direction === "down") {
		pressingDown = false
	}
	if (direction === "left") {
		pressingLeft = false
	}
	if (direction === "right") {
		pressingRight = false
	}
	
	lastLiftedDirection = direction
	stoppedPressing = counter
	pressingDirections.splice(pressingDirections.indexOf(direction),1)
}
function setInputs() {
	document.onmousedown = function(event) {
		if (event.button === 0) {
			LMBDown = true
			clickedAt = counter
		}
		if (event.button === 2) {
			RMBDown = true
			rightClickedAt = counter
		}
		if (event.button === 1) {
			MMBDown = true
			middleClickedAt = counter
		}
	}
	document.onmousemove = function(event) {
		cursor.x = event.clientX
		cursor.y = event.clientY
	}
	
	document.onmouseup = function(event) {
		if (event.button === 0) {
			LMBDown = false
		}
		if (event.button === 2) {
			RMBDown = false
						
		}
		if (event.button === 1) {
			MMBDown = false
						
		}
		
	}
	document.onkeydown = function(event) {
		if (event.keyCode == 69) {
			pressingE = true
		};
		
		if (pressingDirections.length < 2) {
			if (event.keyCode == 87 || event.keyCode == 38) {
				pressingUp = true
				
			};
			if (event.keyCode == 83 || event.keyCode == 40) {
				pressingDown = true
				pressedDownAt = counter
				
			};
			if (pressingRight === false && event.keyCode == 65 || event.keyCode == 37) {
				pressingLeft = true
				pressedLeftAt = counter
				
				
			};
			if (pressingLeft === false && event.keyCode == 68 || event.keyCode == 39) {
				pressingRight = true
				pressedRightAt = counter
				
			};		
		}
		if (!pressingSpace && event.keyCode == 32) {
			pressingSpace = true
			pressedSpaceAt = counter
			if (gameStarted < 0) {
				gameStarted = counter
			}
			
		};
	};
    document.onkeyup = function(event) {		
		if (event.keyCode == 69) {
			pressingE = false
		};
		if (event.keyCode == 87 || event.keyCode == 38) {
			stopPressing("up")
		};
		if (event.keyCode == 83 || event.keyCode == 40) {
			stopPressing("down")
		};
		if (event.keyCode == 65 || event.keyCode == 37) {
			stopPressing("left")
		};
		if (event.keyCode == 68 || event.keyCode == 39) {
			stopPressing("right")
		};
		if (event.keyCode == 32) {
			pressingSpace = false
		}		
    };
	stage.interactive = true
	stage.onDragStart = function(event)
    {
		
        var e = event || window.event;
        this.data = e.data;
        var touch = {
            id: this.data.identifier || 0,
            pos: this.data.getLocalPosition(this)
        };
		if (touches.length === 0) {
			touches.push(touch);
			touchedAt = counter
		}
        
	}
    stage.onDragMove = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i=0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                touches[i].pos = this.data.getLocalPosition(this);
            }
        };
    }
    stage.onDragEnd = function (event)
    {
        for (var i = 0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                
                touches.splice(i,1);
            }
        };
        if (touches.length === 0) {
			pressingDirections = []
			
        }
		
    }
    stage.on("touchstart",stage.onDragStart)
    stage.on("touchmove",stage.onDragMove)
    stage.on("touchend",stage.onDragEnd)
    stage.on("touchendoutside",stage.onDragEnd)
}

function setStyles() {
	buttonFontSize = Math.round(background.topBrainHeight/5)
	messageFontSize = Math.round(background.topBrainHeight/2.3)
	
	buttonStyle = {
		align: 'left',
		font : '  ' + buttonFontSize +'px Helvetica',
		fill : '#efefef',
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : messageFontSize/12
	};
	messageStyle = {
		align: 'center',
		fontFamily : 'Helvetica',
		fontSize : messageFontSize + 'px',
		// fontStyle : 'italic',
		fontWeight : 'bold',
		fill : '#F7EDCA',
		stroke : '#224422',
		strokeThickness : messageFontSize/4,
		dropShadow : true,
		dropShadowColor : '#000000',
		dropShadowAngle : Math.PI / 6,
		dropShadowDistance : messageFontSize/7,
		wordWrap : true,
		wordWrapWidth : (viewWidth)
	};
	startStyle = {
		align: 'center',
		font : ' bold ' + Math.round(viewHeight/15) +'px Helvetica',
		fill : '#ffffff',
	};
	// scoreStyle = {
		// align: 'right',
		// font : ' bold ' + (cellSize*1.5) +'px Silkworm, Helvetica',
		// fill : '#79ceec',
	// };
}