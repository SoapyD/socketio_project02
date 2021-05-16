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
		
		
		if(instance_type === "DEV"){
			callbackParams = {mode:"move"};
			gameFunctions.createButton(this, gameFunctions.config.width - 150, 25, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "move", GameUIScene.activateMovement, callbackParams, gameFunctions.btn_sprite);

			callbackParams = {mode:"shoot"};
			gameFunctions.createButton(this, gameFunctions.config.width - 150, 75, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.activateShooting, callbackParams, gameFunctions.btn_sprite);

			callbackParams = {mode:"charge"};
			gameFunctions.createButton(this, gameFunctions.config.width - 150, 125, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 50, 125, "charge", GameUIScene.activateCharging, callbackParams, gameFunctions.btn_sprite);

			callbackParams = {mode:"fight"};
			gameFunctions.createButton(this, gameFunctions.config.width - 150, 175, "+", GameUIScene.selectMode, callbackParams, gameFunctions.btn_sprite);	
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 50, 175, "fight", GameUIScene.activateFighting, callbackParams, gameFunctions.btn_sprite);		

			
			
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 150, 225, "End Turn", GameUIScene.nextPlayer, callbackParams, gameFunctions.btn_sprite);
			
		}else{
			callbackParams = {};
			gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "+", GameUIScene.advanceMode, callbackParams, gameFunctions.btn_sprite);		
			GameUIScene.advanceMode();			
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
		
		let text = "Current Player: "+GameScene.current_player+'\n'
		text += "Phase: "+GameScene.mode+'\n'		
		
		GameUIScene.text.setText(text)		
    }
});

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
	
	if(options.mode){
		GameScene.mode = options.mode
		GameScene.selected_unit = undefined;
		
		//RESET ALL PLAYER ACTIONS
		if(GameScene.units){
			GameScene.units.forEach((unit) => {
				if(unit.player === GameScene.current_player){
					unit.resetActions();
				}
			})
		}
	}
}

GameUIScene.activateMovement = () => {
	
	let cohesion_check = true
	GameScene.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;		
		}
	})		
	
	if(cohesion_check === true){
		GameScene.units.forEach((unit) => {
			if(unit.path.length > 0 && unit.player === GameScene.current_player){
				
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
	GameScene.units.forEach((unit) => {
		
		if(GameScene.online === false){
			unit.shoot();
		}else{

			if(unit.targets.length > 0 && unit.player === GameScene.current_player){
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
	
	GameScene.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;
		}
	})
	
	if(cohesion_check === true){
		GameScene.units.forEach((unit) => {
			if(unit.player === GameScene.current_player &&
			   unit.cohesion_check === true){
				let in_combat_range = unit.checkCombat()
				
				if(in_combat_range === true){
					in_combat = true;
				}
			}
		})		
	}
	
	if(cohesion_check === true && in_combat === true){
		GameScene.units.forEach((unit) => {
			
			if(unit.player === GameScene.current_player){

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
	
	GameScene.units.forEach((unit) => {

		if(unit.player === GameScene.current_player){

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
						path: unit.path,
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


GameUIScene.nextPlayer = () => {
	
	GameScene.mode = ""
	GameScene.units.forEach((unit) => {
		if(unit.player === GameScene.current_player){
			unit.resetActions();
		}
	})
	// GameScene.sfx["end_turn"].play();
	GameScene.sfxHandler("end_turn")
	
	if(GameScene.online === false){
		GameScene.advancePlayer()
	}else{
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
	
	GameScene.units.forEach((unit) => {
		if(unit.cohesion_check === false && unit.cohesion > 0){
			cohesion_check = false;
		}
	})
	
	if(cohesion_check === true){
		GameScene.units.forEach((unit) => {
			if(unit.player === GameScene.current_player &&
			   unit.cohesion_check === true){
				let in_combat_range = unit.checkCombat()
				
				if(in_combat_range === true){
					in_combat = true;
				}
			}
		})		
	}

	
	if(cohesion_check === true && in_combat === true){
		GameScene.units.forEach((unit) => {
			
			if(unit.player === GameScene.current_player){

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