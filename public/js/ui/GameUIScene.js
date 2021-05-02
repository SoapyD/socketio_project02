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
    },

    create: function()
    {
		
		let callbackParams = {};
		
		gameFunctions.btn_sprite = [];		
		
		callbackParams = {mode:"move"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 25, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);
		callbackParams = {};
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "move", GameUIScene.activate_movement, callbackParams, gameFunctions.btn_sprite);
		
		callbackParams = {mode:"shoot"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 75, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);
		callbackParams = {};
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.activate_shooting, callbackParams, gameFunctions.btn_sprite);

		callbackParams = {mode:"fight"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 125, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);	
		callbackParams = {};
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 125, "fight", GameUIScene.activate_fighting, callbackParams, gameFunctions.btn_sprite);

		
		callbackParams = {};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 175, "End Turn", GameScene.advancePlayer, callbackParams, gameFunctions.btn_sprite);				
		
		
		
		
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
    }
});


GameUIScene.select_mode = (options) => {
	if(options.mode){
		GameScene.mode = options.mode
	}
}

GameUIScene.activate_movement = () => {
	
	let cohesion_check = true
	GameScene.units.forEach((unit) => {
		if(unit.cohesion_check === false){
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

GameUIScene.activate_shooting = () => {
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

				connFunctions.messageServer(data)			
			}			
		}

	})	
}


GameUIScene.activate_fighting = () => {
	
	
	//CHECK COHESION FOR UNITS THAT'RE CHARGING
	let cohesion_check = true
	//ALSO CHECK ALL CHARGING UNITS ARE NEXT TO AN ENEMY UNITS
	let in_combat = false;
	
	GameScene.units.forEach((unit) => {
		if(unit.cohesion_check === false){
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




