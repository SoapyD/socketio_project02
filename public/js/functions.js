
gameFunctions.copyObject = (return_obj, object) => {
	for (const element in object){
		return_obj[element] = object[element];
	}
}

gameFunctions.twoPointDistance = (pos_start, pos_end) => {
	// console.log(pos_start, pos_end)
	return Math.sqrt(Math.pow(pos_start.x - pos_end.x, 2) + Math.pow(pos_start.y - pos_end.y, 2))
}

gameFunctions.createButton = (game, x, y, label, clickAction, callbackParams, array) => {
    const btn = game.add.sprite(x, y, "buttons").setInteractive()
    var style = { font: "18px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: btn.width, align: "center" }; //, backgroundColor: "#ffff00"

    btn.click = false
    btn.clickAction = clickAction;
    btn.callbackParams = callbackParams;

    btn.text = game.add.text(0, 0, label, style);
    btn.text.x = btn.x - (btn.text.width / 2)
    btn.text.y = btn.y	- (btn.text.height / 2)	
	btn.text.setScrollFactor(0); //make buttons non-scrollable
	
	btn.depth = 100;
	btn.text.depth = 110;
	btn.setScrollFactor(0); //make buttons non-scrollable
	
    array.push(btn);	

    return btn
}


gameFunctions.buttonPress = (sprite, callback, callbackParams) => {
	sprite.on('pointerover', function (event) {
		this.setFrame(1);
	});			
	sprite.on('pointerout', function (event) {
		this.setFrame(0)
	});						

    //PRESSING THE MOUSE BUTTON
	sprite.on('pointerup', function (event) {
		this.setFrame(1)
		//NEED TO SET THIS AS A SOCKET MESSAGE
		if (sprite.click === false){
			sprite.click = true;
			callback(callbackParams);
		}
    })			
    
    //RELEASING THE MOUSE BUTTON    
	sprite.on('pointerdown', function (event) {
		this.setFrame(2)
		if (sprite.click === true){
			sprite.click = false;
		}
	})			
}