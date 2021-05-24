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
    },

    create: function()
    {
		
		let callbackParams = {};
		
		gameFunctions.btn_sprite = [];		
		

		switch(instance_type){
			case "DEV":
				GameUIScene.loadFullButtons(this)
				break;
			case "DEV-ONLINE":
				GameUIScene.loadFullButtons(this)
				break;
			default:
				GameUIScene.loadSingleButton(this)
				break;
		}		
		
		
		
		gameFunctions.btn_sprite.forEach(btn => {
			gameFunctions.buttonPress(btn, btn.clickAction, btn.callbackParams);                    
		})		
		
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
		
		let text = "Current Player: "+gameFunctions.current_player+'\n'
		text += "Phase: "+gameFunctions.mode+'\n'		
		
		GameUIScene.text.setText(text)		
    }
});

GameUIScene.loadSingleButton = (scene) => {
	let callbackParams;
	
	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 50, 25, "+", GameUIScene.advanceMode, callbackParams, gameFunctions.btn_sprite);		
	GameUIScene.advanceMode();	
}

GameUIScene.loadFullButtons = (scene) => {
	let callbackParams;
	
	callbackParams = {mode:"move"};
	gameFunctions.createButton(scene, gameFunctions.config.width - 150, 25, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 50, 25, "move", GameUIScene.activateMovement, callbackParams, gameFunctions.btn_sprite);

	callbackParams = {mode:"shoot"};
	gameFunctions.createButton(scene, gameFunctions.config.width - 150, 75, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.activateShooting, callbackParams, gameFunctions.btn_sprite);

	callbackParams = {mode:"charge"};
	gameFunctions.createButton(scene, gameFunctions.config.width - 150, 125, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 50, 125, "charge", GameUIScene.activateCharging, callbackParams, gameFunctions.btn_sprite);

	callbackParams = {mode:"fight"};
	gameFunctions.createButton(scene, gameFunctions.config.width - 150, 175, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 50, 175, "fight", GameUIScene.activateFighting, callbackParams, gameFunctions.btn_sprite);		

	callbackParams = {};
	gameFunctions.createButton(scene, gameFunctions.config.width - 150, 225, "End Turn", GameUIScene.nextPlayer, callbackParams, gameFunctions.btn_sprite);	
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
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText(options.mode);
			btn.text.x = btn.x - (btn.text.width / 2)
			btn.text.y = btn.y	- (btn.text.height / 2)				
			break;
		case 1:
			//activate movement
			GameUIScene.activateMovement();

			btn = gameFunctions.btn_sprite[0]
			btn.text.setText("next");			
			break;
			
		case 2:
			//setup shoot
			options.mode = "shoot"
			GameUIScene.selectMode(options);
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText(options.mode);
			btn.text.x = btn.x - (btn.text.width / 2)
			btn.text.y = btn.y	- (btn.text.height / 2)				
			break;
		case 3:
			//activate shoot
			GameUIScene.activateShooting();
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText("next");
			break;
			
		case 4:
			//setup shoot
			options.mode = "charge"
			GameUIScene.selectMode(options);
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText(options.mode);
			btn.text.x = btn.x - (btn.text.width / 2)
			btn.text.y = btn.y	- (btn.text.height / 2)				
			break;
		case 5:
			//activate shoot
			GameUIScene.activateCharging();
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText("next");
			break;			
			
		case 6:
			//setup fight
			options.mode = "fight"
			GameUIScene.selectMode(options);
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText(options.mode);
			btn.text.x = btn.x - (btn.text.width / 2)
			btn.text.y = btn.y	- (btn.text.height / 2)				
			break;
		case 7:
			//activate fight
			GameUIScene.activateFighting();
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText("next");
			break
		case 8:
			//setup end turn
			options.mode = "end turn"
			GameUIScene.selectMode(options);
			btn = gameFunctions.btn_sprite[0]
			btn.text.setText(options.mode);
			btn.text.x = btn.x - (btn.text.width / 2)
			btn.text.y = btn.y	- (btn.text.height / 2)				
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