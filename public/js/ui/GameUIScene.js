var GameUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'GameUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
		
		GameUIScene.scene = this.scene.get('GameUIScene')
		GameUIScene.text = this.add.text(0, 0, "", { fill: '#00ff00' }).setDepth(20);
		
		GameUIScene.mode_state = -1;
		GameUIScene.mode_check_state = 0;
    },

    create: function()
    {
		
		let callbackParams = {};
		
		gameFunctions.btn_sprite = [];		
		

		switch(instance_type){
			case "DEV":
				// GameUIScene.loadFullButtons(this)
				GameUIScene.loadSingleButton(this)
				break;
			case "DEV-ONLINE":
				GameUIScene.loadFullButtons(this)
				break;
			default:
				GameUIScene.loadSingleButton(this)
				break;
		}		
		
		
		
		// gameFunctions.btn_sprite.forEach(btn => {
		// 	gameFunctions.buttonPress(btn, btn.clickAction, btn.callbackParams);                    
		// })		
		
		gameFunctions.current_uiscene = this.scene.get('GameUIScene');
		
		
    },

    update: function (time, delta)
    {
        // switch( gameFunctions.config.game_state) {
        //     case 0:

        //     break;

        //     default:
        //     // code block
        // }	         
		
		switch(GameUIScene.mode_check_state){
			case 2:
				if(GameScene.active_actions === 0){
					GameUIScene.advanceMode()
					GameUIScene.mode_check_state = 0;
				}
				break;
			case 1:
				// if(GameScene.active_actions > 1){
					GameUIScene.mode_check_state = 2;
				// }
				break;
		}
		
		
		let text = "Current Player: "+gameFunctions.current_player+'\n'
		text += "Phase: "+gameFunctions.mode+'\n'
		text += "Check: "+GameUIScene.mode_check_state+'\n'
		
		if(GameScene.active_actions){
			text += "Active Actions: "+GameScene.active_actions+'\n'			
		}

		GameUIScene.text.setText(text)		
    }
});

GameUIScene.loadSingleButton = (scene) => {
	let callbackParams;
	let options;
	
	options = {
		scene: scene, 
		x: gameFunctions.config.width,
		y: 25,
		height: 50,
		width: 150,
		label:  "+",
		clickAction: GameUIScene.advanceMode,
		callbackParams: callbackParams,
		array: gameFunctions.btn_sprite
	}
	
	// gameFunctions.createButton(scene, gameFunctions.config.width - 50, 25, "+", GameUIScene.advanceMode, callbackParams, gameFunctions.btn_sprite);		
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	GameUIScene.advanceMode();	
}

GameUIScene.loadFullButtons = (scene) => {
	let callbackParams;
	let options;
	
	options = {
		scene: scene, 
		x: gameFunctions.config.width - 150,
		y: 25,
		height: 50,
		width: 50,
		label:  "+",
		clickAction: GameUIScene.selectMode,
		callbackParams: {mode:"move"},
		array: gameFunctions.btn_sprite,
		// sprite: "buttons"
	}
	// gameFunctions.createButton(options);
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width;
	options.width = 150;
	options.label = "move";
	options.clickAction = GameUIScene.activateMovement;
	options.callbackParams = {};
	// gameFunctions.createButton(options);
	gameFunctions.btn_sprite.push(new button(options))
	
	
	options.x = gameFunctions.config.width - 150;
	options.y = 75;
	options.width = 50;
	options.label = "+";
	options.clickAction = GameUIScene.selectMode;
	options.callbackParams = {mode:"shoot"};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width;
	options.width = 150;
	options.label = "shoot";
	options.clickAction = GameUIScene.activateShooting;
	options.callbackParams = {};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width - 150;
	options.y = 125;
	options.width = 50;
	options.label = "+";
	options.clickAction = GameUIScene.selectMode;
	options.callbackParams = {mode:"charge"};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width;
	options.width = 150;
	options.label = "charge";
	options.clickAction = GameUIScene.activateCharging;
	options.callbackParams = {};
	// gameFunctions.createButton(options);		
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width - 150;
	options.y = 175;
	options.width = 50;
	options.label = "+";
	options.clickAction = GameUIScene.selectMode;
	options.callbackParams = {mode:"fight"};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width;
	options.width = 150;
	options.label = "fight";
	options.clickAction = GameUIScene.activateFighting;
	options.callbackParams = {};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
	
	options.x = gameFunctions.config.width;
	options.y = 225;
	options.width = 150;
	options.label = "End Turn";
	options.clickAction = GameUIScene.nextPlayer;
	options.callbackParams = {};
	// gameFunctions.createButton(options);	
	gameFunctions.btn_sprite.push(new button(options))
		
	
	// callbackParams = {mode:"move"};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 150, 25, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
	// callbackParams = {};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 50, 25, "move", GameUIScene.activateMovement, callbackParams, gameFunctions.btn_sprite);

	// callbackParams = {mode:"shoot"};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 150, 75, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
	// callbackParams = {};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.activateShooting, callbackParams, gameFunctions.btn_sprite);

	// callbackParams = {mode:"charge"};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 150, 125, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
	// callbackParams = {};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 50, 125, "charge", GameUIScene.activateCharging, callbackParams, gameFunctions.btn_sprite);

	// callbackParams = {mode:"fight"};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 150, 175, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
	// callbackParams = {};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 50, 175, "fight", GameUIScene.activateFighting, callbackParams, gameFunctions.btn_sprite);		

	// callbackParams = {};
	// gameFunctions.createButton(scene, gameFunctions.config.width - 150, 225, "End Turn", GameUIScene.nextPlayer, callbackParams, gameFunctions.btn_sprite);	
}


GameUIScene.advanceMode = () => {

	
	if(GameUIScene.mode_state !== -1){
		GameScene.sfxHandler("button")
	}
	
	GameUIScene.mode_state++;
	// if(GameUIScene.mode_state >= 2){
	// 	GameUIScene.mode_state = 0;
	// }
	// console.log("mode advanced")
	
	
	let options = {}
	let btn;
	switch(GameUIScene.mode_state){
		case 0:
			//setup movement
			options.mode = "move"
			GameUIScene.selectMode(options);	
			gameFunctions.btn_sprite[0].updateText("trigger move")

			break;
		case 1:
			//activate movement
			GameUIScene.activateMovement();

			// btn = gameFunctions.btn_sprite[0]
			// btn.text.setText("next");	
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			break;
			
		case 2:
			//setup shoot
			options.mode = "shoot"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger shoot")
			gameFunctions.btn_sprite[0].showButton();
			break;
		case 3:
			//activate shoot
			GameUIScene.activateShooting();
			// btn = gameFunctions.btn_sprite[0]
			// btn.text.setText("next");
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;			
			break;
			
		case 4:
			//setup shoot
			options.mode = "charge"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger charge")
			gameFunctions.btn_sprite[0].showButton();			
			break;
		case 5:
			//activate shoot
			GameUIScene.activateCharging();
			// btn = gameFunctions.btn_sprite[0]
			// btn.text.setText("next");
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;			
			break;			
			
		case 6:
			//setup fight
			options.mode = "fight"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger fight")
			gameFunctions.btn_sprite[0].showButton();			
			break;
		case 7:
			//activate fight
			GameUIScene.activateFighting();
			// btn = gameFunctions.btn_sprite[0]
			// btn.text.setText("next");
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			break
		case 8:
			//setup end turn
			options.mode = "end turn"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("end turn")
			gameFunctions.btn_sprite[0].showButton();
			break;
		case 9:
			//activate end turn
			GameScene.sfxHandler("end_turn")
			GameUIScene.nextPlayer();
			GameUIScene.mode_state = -1;
			GameUIScene.advanceMode()
			break;			
	}
}


GameUIScene.selectMode = (options) => {
	
	// GameScene.sfx['button'].play();
	if(GameScene.online === false){
		GameScene.selectMode(options);
	}else{

		let data = {
			functionGroup: "socketFunctions",  
			function: "messageAll",
			returnFunctionGroup: "GameScene",
			returnFunction: "selectMode", //selectMode
			message: "select mode",
			returnParameters: {
				options: options
			}
		}
		connFunctions.messageServer(data)
	}	

}

GameUIScene.activateMovement = () => {
	
	let cohesion_check = true
	gameFunctions.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;		
		}
	})		
	
	if(cohesion_check === true){
		gameFunctions.units.forEach((unit) => {
			if(unit.player === gameFunctions.current_player){
				//unit.path.length > 0 &&
				
				if(GameScene.online === false){
					unit.move();
				}else{
					let data = {
						functionGroup: "socketFunctions",  
						function: "messageAll",
						returnFunctionGroup: "connFunctions",
						returnFunction: "runUnitFunction",
						returnParameters: {
							id: unit.id, 
							path: unit.path,
							function: "move"
						},
						message: "move units"
					}

					connFunctions.messageServer(data)
				}
					
			}
		})	
	}
}

GameUIScene.activateShooting = () => {
	gameFunctions.units.forEach((unit) => {
		
		if(GameScene.online === false){
			unit.shoot();
		}else{

			if(unit.targets.length > 0 && unit.player === gameFunctions.current_player){
				let data = {
					functionGroup: "socketFunctions",  
					function: "messageAll",
					returnFunctionGroup: "connFunctions",
					returnFunction: "runUnitFunction",
					returnParameters: {
						id: unit.id, 
						targets: unit.targets,
						function: "shoot"
					},
					message: "shoot units"
				}

				// console.log(data)
				connFunctions.messageServer(data)			
			}			
		}

	})	
}


GameUIScene.activateCharging = () => {
	
	
	//CHECK COHESION FOR UNITS THAT'RE CHARGING
	let cohesion_check = true
	//ALSO CHECK ALL CHARGING UNITS ARE NEXT TO AN ENEMY UNITS
	let in_combat = false;
	
	gameFunctions.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;
		}
	})
	
	//ONLY ALLOW CHARGE IF ALL CHARGING UNTIS ARE IN COMBAT DISTANCE
	// if(cohesion_check === true){
	// 	gameFunctions.units.forEach((unit) => {
	// 		if(unit.player === gameFunctions.current_player &&
	// 		   unit.cohesion_check === true){
	// 			let in_combat_range = unit.checkCombat()
				
	// 			if(in_combat_range === true){
	// 				in_combat = true;
	// 			}
	// 		}
	// 	})		
	// }
	
	if(cohesion_check === true){ // && in_combat === true){
		gameFunctions.units.forEach((unit) => {
			
			if(unit.player === gameFunctions.current_player){

				if(GameScene.online === false){
					
					if(unit.path.length > 0){
						unit.move("checkCombat");
					}
					
				}else{
				
					if(unit.path.length > 0){

						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							returnFunctionGroup: "connFunctions",
							returnFunction: "runUnitFunction",
							returnParameters: {
								id: unit.id, 
								path: unit.path,
								function: "move",
								function_parameter: "checkCombat" 
							},
							message: "charge units"
						}

						connFunctions.messageServer(data)

					}
				}
			}

		})
	}
	
	//TRIGGER COMBAT WHEN UNITS HAVE MOVED
}


GameUIScene.activateFighting = () => {
	
	gameFunctions.units.forEach((unit) => {

		if(unit.player === gameFunctions.current_player){

			if(GameScene.online === false){

				unit.fight()
				
			}else{

				let data = {
					functionGroup: "socketFunctions",  
					function: "messageAll",
					returnFunctionGroup: "connFunctions",
					returnFunction: "runUnitFunction",
					returnParameters: {
						id: unit.id, 
						fight_targets: unit.fight_targets,
						function: "fight"
					},
					message: "fight units"
				}

				connFunctions.messageServer(data)
			}
		}

	})
	
	//TRIGGER COMBAT WHEN UNITS HAVE MOVED
}

GameUIScene.hideButtons = () => {
	gameFunctions.btn_sprite.forEach((btn) => {
		btn.setInteractive(false);
		btn.setAlpha(0);
		btn.text.setAlpha(0);
	})
}

GameUIScene.showButtons = () => {
	gameFunctions.btn_sprite.forEach((btn) => {
		btn.setInteractive(true);
		btn.setAlpha(1);
		btn.text.setAlpha(1);		
	})
}

GameUIScene.nextPlayer = () => {
	
	gameFunctions.mode = ""
	gameFunctions.units.forEach((unit) => {
		if(unit.player === gameFunctions.current_player){
			unit.resetActions();
			unit.resetLocks();
		}
	})
	// GameScene.sfx["end_turn"].play();
	GameScene.sfxHandler("end_turn")
	
	if(GameScene.online === false){
		GameScene.advancePlayer()
	}else{
		
		connFunctions.saveGame();		
		
		let data = {
			functionGroup: "socketFunctions",  
			function: "messageAll",
			returnFunctionGroup: "GameScene",
			returnFunction: "advancePlayer",
			returnParameters: {},
			message: "next player"
		}

		connFunctions.messageServer(data)		
	}
}




/*
GameUIScene.activateFighting = () => {
	
	
	//CHECK COHESION FOR UNITS THAT'RE CHARGING
	let cohesion_check = true
	//ALSO CHECK ALL CHARGING UNITS ARE NEXT TO AN ENEMY UNITS
	let in_combat = false;
	
	gameFunctions.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;
		}
	})
	
	if(cohesion_check === true){
		gameFunctions.units.forEach((unit) => {
			if(unit.player === gameFunctions.current_player &&
			   unit.cohesion_check === true){
				let in_combat_range = unit.checkCombat()
				
				if(in_combat_range === true){
					in_combat = true;
				}
			}
		})		
	}

	
	if(cohesion_check === true && in_combat === true){
		gameFunctions.units.forEach((unit) => {
			
			if(unit.player === gameFunctions.current_player){

				if(GameScene.online === false){
					
					if(unit.path.length > 0){
						unit.move("checkCombat");
					}else{
						unit.checkCombat("fight")
					}
					
				}else{				
				
					if(unit.path.length > 0){

						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							returnFunctionGroup: "connFunctions",
							returnFunction: "runUnitFunction",
							returnParameters: {
								id: unit.id, 
								path: unit.path,
								function: "move",
								function_parameter: "checkCombat" 
							},
							message: "charge units"
						}

						connFunctions.messageServer(data)

					}
					else{

						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							returnFunctionGroup: "connFunctions",
							returnFunction: "runUnitFunction",
							returnParameters: {
								id: unit.id, 
								path: unit.path,
								function: "checkCombat",
								function_parameter: "fight" 
							},
							message: "fight units"
						}

						connFunctions.messageServer(data)

					}
				}
			}

		})
	}
	
	//TRIGGER COMBAT WHEN UNITS HAVE MOVED
}
*/