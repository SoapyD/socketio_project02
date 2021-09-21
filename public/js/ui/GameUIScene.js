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
		
		GameUIScene.mode_state = 0;
		GameUIScene.mode_state_max = 9;
		
		GameUIScene.mode_check_state = 0;
		GameUIScene.mode_check_timer = 0;	
		
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
				// GameUIScene.loadFullButtons(this)
				GameUIScene.loadSingleButton(this)
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

    update: async function (time, delta)
    {
        // switch( gameFunctions.config.game_state) {
        //     case 0:

        //     break;

        //     default:
        //     // code block
        // }
		
		// console.log(GameUIScene.mode_check_state)
		
		switch(GameUIScene.mode_check_state){
			case 2:
				if(GameUIScene.mode_check_timer === 0){
					GameUIScene.mode_check_state = 3;
				}
				
				// await GameUIScene.delay(2000)
				// GameUIScene.mode_check_state = 3;
				break;
			case 3:
				if(GameScene.active_actions === 0){
					
					if(GameScene.online === false){
						GameUIScene.runAdvanceMode()
					}else{
						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							returnFunctionGroup: "GameUIScene",
							returnFunction: "runAdvanceMode",
							message: "advancing mode"
						}

						connFunctions.messageServer(data)
					}
					GameUIScene.mode_check_state = 0;
				}
				break;				
			case 1:
				GameUIScene.mode_check_state = 2;
				GameUIScene.mode_check_timer = 200;
				// if(GameScene.active_actions === 0){
				// 	GameUIScene.mode_state++;
				// 	GameUIScene.advanceMode()
				// 	GameUIScene.mode_check_state = 0;
				// }				
				break;
			default:
				// console.log("zero")
				break;
		}
		if(GameUIScene.mode_check_timer > 0){
			GameUIScene.mode_check_timer--;
		}
		
		
		let text = "Current Side: "+gameFunctions.current_side+'\n'
		
		if(GameScene.selected_unit){
			text += "Selected Unit: "+GameScene.selected_unit.id+'\n'	
		}

		text += "Phase: "+gameFunctions.mode+'\n'

		text += "Mode State: "+GameUIScene.mode_state+'\n'		
		text += "Check: "+GameUIScene.mode_check_state+'\n'
		
		
		
		
		if(GameScene.active_actions){
			text += "Active Actions: "+GameScene.active_actions+'\n'			
		}

		GameUIScene.text.setText(text)		
    }
});

GameUIScene.delay =	async(ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}	

GameUIScene.loadSingleButton = (scene) => {
	let callbackParams;
	let options;

	console.log("create button")
	
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

	GameScene.advanceSide()
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
		
	
}


GameUIScene.runAdvanceMode = () => {
	GameUIScene.mode_state++;
	if(GameUIScene.mode_state > GameUIScene.mode_state_max){
		GameUIScene.mode_state = 0;
	}
	
	GameUIScene.advanceMode()	
}

GameUIScene.advanceMode = () => {

	
	// if(GameUIScene.mode_state !== -1){
	// 	if(GameScene.sfx){
	// 		GameScene.sfxHandler("button")	
	// 	}
		
	// }

	// let mode_triggered = false;
		
	
	let options = {}
	let btn;
	let activated = false;
	switch(GameUIScene.mode_state){
		case 0:
			//setup movement
			options.mode = "move"
			GameUIScene.selectMode(options);	
			gameFunctions.btn_sprite[0].updateText("trigger move")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}			
			GameUIScene.mode_state++;
			break;
		case 1:
			//activate movement
			GameScene.sfxHandler("button");
			activated = GameUIScene.activateMovement();

			if(activated === true){
				GameScene.resetTempSprites();
				gameFunctions.btn_sprite[0].hideButton()
				GameUIScene.mode_check_state = 1;
				// mode_triggered = true;
			}
			break;
			
		case 2:
			//setup shoot
			console.log("SAVE RUNNING")
			connFunctions.saveGame();

			options.mode = "shoot"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger shoot")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}
			GameUIScene.mode_state++;
			break;
		case 3:
			//activate shoot
			GameScene.sfxHandler("button");			
			GameUIScene.activateShooting();

			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			break;
			
		case 4:
			//setup shoot
			options.mode = "charge"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger charge")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				GameScene.resetTempSprites();				
				gameFunctions.btn_sprite[0].showButton();
			}
			GameUIScene.mode_state++;
			break;
		case 5:
			//activate shoot
			GameScene.sfxHandler("button");			
			activated = GameUIScene.activateCharging();

			if(activated === true){
				gameFunctions.btn_sprite[0].hideButton()
				GameUIScene.mode_check_state = 1;
			}
			break;
			
		case 6:
			//setup fight
			options.mode = "fight"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger fight")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}
			GameUIScene.mode_state++;
			break;
		case 7:
			//activate fight
			GameScene.sfxHandler("button");	
			GameUIScene.activateFighting();
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			break
		case 8:
			//setup end turn
			options.mode = "end turn"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("end turn")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}
			GameUIScene.mode_state++;
			break;
		case 9:
			//activate end turn
			GameScene.sfxHandler("end_turn")
			GameUIScene.mode_check_state = 1;
			// GameUIScene.mode_state = 0;
			// GameUIScene.advanceMode();
			GameUIScene.nextSide();			
			break;
	}
	
	// if(mode_triggered === true){
	// 	GameUIScene.mode_state++;	
	// }
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
	
	let activated = false;
	if(cohesion_check === true){
		gameFunctions.units.forEach((unit) => {
			if(unit.path.length > 0 && unit.side === gameFunctions.current_side){
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
				
				// if(unit.path.length > 1){
				// 	GameScene.active_actions++;	
				// }
					
			}
		})
		activated = true;
	}else{
		let options = {
			scene: GameScene.scene,
			pos: {
				x: GameScene.rectangle.x,
				y: GameScene.rectangle.y
			},
			text: "Cannot move unless all unit coherency is met."
		}
		new popup(options)
		activated = false;
	}
	
	
	return activated;
}

GameUIScene.activateShooting = () => {
	gameFunctions.units.forEach((unit) => {
		
		if(GameScene.online === false){
			unit.shoot();
		}else{

			if(unit.targets.length > 0 && unit.side === gameFunctions.current_side){
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
			
			// if(unit.targets.length > 1){
			// 	GameScene.active_actions+=unit.targets.length;	
			// }			
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
	// 		if(unit.side === gameFunctions.current_side &&
	// 		   unit.cohesion_check === true){
	// 			let in_combat_range = unit.checkCombat()
				
	// 			if(in_combat_range === true){
	// 				in_combat = true;
	// 			}
	// 		}
	// 	})		
	// }
	let activated = true;
	if(cohesion_check === true){ // && in_combat === true){
		gameFunctions.units.forEach((unit) => {
			
			if(unit.path.length > 0 && unit.side === gameFunctions.current_side){

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
				
				// if(unit.path.length > 1){
				// 	GameScene.active_actions++;	
				// }
			}

		})
		
	}else{
		let options = {
			scene: GameScene.scene,
			pos: {
				x: GameScene.rectangle.x,
				y: GameScene.rectangle.y
			},
			text: "Cannot charge unless all unit coherency is met."
		}
		new popup(options)
		activated = false;
	}
	
	//TRIGGER COMBAT WHEN UNITS HAVE MOVED
	
	return activated;
}


GameUIScene.activateFighting = () => {
	
	gameFunctions.units.forEach((unit) => {

		if(unit.fight_targets.length > 0 && unit.side === gameFunctions.current_side){

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
			
			// if(unit.fight_targets.length > 1){
			// 	GameScene.active_actions+=unit.fight_targets.length;	
			// }	
		}

	})
	
	//TRIGGER COMBAT WHEN UNITS HAVE MOVED
}

GameUIScene.hideButtons = () => {
	gameFunctions.btn_sprite.forEach((btn) => {
		btn.hideButton();
		btn.text.visible = false;
	})
}

GameUIScene.showButtons = () => {
	gameFunctions.btn_sprite.forEach((btn) => {
		btn.showButton();
		btn.text.visible = true;	
	})
}

GameUIScene.nextSide = () => {
	
	gameFunctions.mode = ""
	gameFunctions.units.forEach((unit) => {
		if(unit.side === gameFunctions.current_side){
			unit.resetActions();
			unit.resetLocks();
		}
	})
	// GameScene.sfx["end_turn"].play();
	GameScene.sfxHandler("end_turn")
	
	if(GameScene.online === false){
		GameScene.advanceSide()
	}else{
		
		connFunctions.saveGame();
		
		let data = {
			functionGroup: "socketFunctions",  
			function: "messageAll",
			returnFunctionGroup: "GameScene",
			returnFunction: "advanceSide",
			returnParameters: {},
			message: "next player"
		}

		connFunctions.messageServer(data)		
	}
}

