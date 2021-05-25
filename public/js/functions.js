
gameFunctions.copyObject = (return_obj, object) => {
	for (const element in object){
		return_obj[element] = object[element];
	}
}

gameFunctions.twoPointDistance = (pos_start, pos_end) => {
	// console.log(pos_start, pos_end)
	return Math.sqrt(Math.pow(pos_start.x - pos_end.x, 2) + Math.pow(pos_start.y - pos_end.y, 2))
}

gameFunctions.createButton = (options) => {
	//game, x, y, label, clickAction, callbackParams, array
	
	let btn;
	
	//if a spritesheet is provided, load it, otherwise, generate a rectangle
	if(options.sprite){
		btn = options.scene.add.sprite(options.x, options.y, options.sprite).setInteractive()
		btn.sprite = options.sprite;
	}else{
		let border_width = 10;
		btn = options.scene.add.rectangle((options.x - (options.width / 2)), options.y, options.width - border_width, options.height - border_width, 0xffffff).setDepth(100).setInteractive();
		btn.border = options.scene.add.rectangle(options.x - (options.width / 2), options.y, options.width, options.height, 0x404040).setDepth(99)
	}

	
    // const btn = game.add.sprite(x, y, "buttons").setInteractive()
    let style = { font: "18px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: btn.width, align: "center" }; //, backgroundColor: "#ffff00"
	

    btn.click = false
    btn.clickAction = options.clickAction;
    btn.callbackParams = options.callbackParams;

    btn.text = options.scene.add.text(0, 0, options.label, style);
    btn.text.x = btn.x - (btn.text.width / 2)
    btn.text.y = btn.y	- (btn.text.height / 2)	
	btn.text.setScrollFactor(0); //make buttons non-scrollable
	
	btn.depth = 100;
	btn.text.depth = 110;
	btn.setScrollFactor(0); //make buttons non-scrollable
	
    options.array.push(btn);	

    return btn
}


gameFunctions.buttonPress = (sprite, callback, callbackParams) => {
	sprite.on('pointerover', function (event) {
		if(sprite.sprite){
			this.setFrame(1);	
		}
		else{
			this.fillColor = 0x808080
		}		
		
	});			
	sprite.on('pointerout', function (event) {
		if(sprite.sprite){
			this.setFrame(0)	
		}
		else{
			this.fillColor = 0xffffff
		}
	});

    //PRESSING THE MOUSE BUTTON
	sprite.on('pointerup', function (event) {
		if(sprite.sprite){
			this.setFrame(0)	
		}
		else{
			this.fillColor = 0x808080
		}		
		//NEED TO SET THIS AS A SOCKET MESSAGE
		if (sprite.click === false){
			sprite.click = true;
			callback(callbackParams);
		}
    })			
    
    //RELEASING THE MOUSE BUTTON    
	sprite.on('pointerdown', function (event) {
		if(sprite.sprite){
			this.setFrame(2)	
		}
		else{
			this.fillColor = 0x595959
		}
		if (sprite.click === true){
			sprite.click = false;
		}
	})			
}