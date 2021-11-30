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
		
		GameUIScene.mode_check_state = 0;
		GameUIScene.mode_check_timer = 0;
		// GameUIScene.scene = this.scene.get('GameUIScene')
	
		// this.load.html('in_game_ui', './html/in_game_ui.html');    
    },

    create: function()
    {
		// in_game_ui = this.add.dom((gameFunctions.config.width / 2), 0).createFromCache('in_game_ui');
		// in_game_ui.setScrollFactor(0);

		GameUIScene.setupHUD();


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
				
		gameFunctions.current_uiscene = this.scene.get('GameUIScene');
    },

    update: async function (time, delta)
    {

 		//  █████   ██████ ████████ ██  ██████  ███    ██       ████████ ██ ███    ███ ███████ ██████  
		// ██   ██ ██         ██    ██ ██    ██ ████   ██          ██    ██ ████  ████ ██      ██   ██ 
		// ███████ ██         ██    ██ ██    ██ ██ ██  ██ █████    ██    ██ ██ ████ ██ █████   ██████  
		// ██   ██ ██         ██    ██ ██    ██ ██  ██ ██          ██    ██ ██  ██  ██ ██      ██   ██ 
		// ██   ██  ██████    ██    ██  ██████  ██   ████          ██    ██ ██      ██ ███████ ██   ██ 

		switch(GameUIScene.mode_check_state){
			case 2:
				if(GameUIScene.mode_check_timer === 0){
					GameUIScene.mode_check_state = 3;
				}
				break;
			case 3:
				if(GameScene.active_actions === 0){
					
					GameUIScene.runAdvanceMode()
					GameUIScene.mode_check_state = 0;
				}
				break;				
			case 1:
				
				GameUIScene.mode_check_state = 2;
				GameUIScene.mode_check_timer = 200;
				break;
			default:

				break;
		}
		let all_ready = connFunctions.checkReadyUp();
		if(GameUIScene.mode_check_timer > 0 && all_ready === true){
			GameUIScene.mode_check_timer--;
		}
		

    }
});

GameUIScene.delay =	async(ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}	

// ██       ██████   █████  ██████        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██      
// ██      ██    ██ ███████ ██   ██ █████ ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██ 
// ███████  ██████  ██   ██ ██████        ██████   ██████     ██       ██     ██████  ██   ████ ███████ 

GameUIScene.loadSingleButton = (scene) => {
	let callbackParams;
	let options;
	
	options = {
		scene: scene, 
		x: gameFunctions.config.width,
		y: 25,
		height: 50,
		width: 250,
		label:  "+",
		clickAction: GameUIScene.advanceMode,
		callbackParams: callbackParams,
		array: gameFunctions.btn_sprite
	}
	
	gameFunctions.btn_sprite.push(new button(options))

	if(gameFunctions.units_preload.length === 0){
		GameUIScene.advanceSide()
	}
	else{
		GameUIScene.checkButtonVisability();
		GameUIScene.advanceMode(); //NEEDED TO SHOW THE RIGHT MENU AFTER A RELOAD		
	}
	// GameUIScene.advanceMode();	
}



// ███████ ███████ ██      ███████  ██████ ████████       ███    ███  ██████  ██████  ███████ 
// ██      ██      ██      ██      ██         ██          ████  ████ ██    ██ ██   ██ ██      
// ███████ █████   ██      █████   ██         ██    █████ ██ ████ ██ ██    ██ ██   ██ █████   
//      ██ ██      ██      ██      ██         ██          ██  ██  ██ ██    ██ ██   ██ ██      
// ███████ ███████ ███████ ███████  ██████    ██          ██      ██  ██████  ██████  ███████                                                                                                                            

GameUIScene.selectMode = (options) => {
	
	// GameScene.sfx['button'].play();
	if(GameScene.online === false){
		GameUIScene.runSelectMode(options);
	}else{

		let data = {
			functionGroup: "socketFunctions",  
			function: "messageAll",
			room_name: gameFunctions.params.room_name,
			returnFunctionGroup: "GameUIScene",
			returnFunction: "runSelectMode", //selectMode
			message: "select mode",
			returnParameters: {
				options: options
			}
		}
		connFunctions.messageServer(data)
	}	

}

// GameScene.selectMode = (options) => {
GameUIScene.runSelectMode = (options) => {	
	if(options.parameters){
		options = options.parameters.options
	}
	// console.log("returned",options)	
	
	if(options.mode){
		gameFunctions.mode = options.mode	

		GameScene.resetTempSprites();
		GameUIScene.setAllWaitingHUD();

		GameScene.selected_unit = [];
		
		//RESET ALL PLAYER ACTIONS
		if(gameFunctions.units){
			gameFunctions.units.forEach((unit) => {
				if(unit.alive === true && unit.side === gameFunctions.current_side){
					unit.resetActions();
					
					unit.drawFlash(false)
					unit.drawFlash(true)

					switch(options.mode){
						case "shoot":
							if (unit.in_combat === true){
								unit.drawFlash(false, true)
							}
							break;
							case "charge":
								if (unit.shot === true){
									unit.drawFlash(false, true)
								}
							break;	
							case "fight":
								if (unit.fight_damage === 0){
									unit.drawFlash(false, true)
								}
							break;														
					}

				}else{
					unit.drawFlash(false)//, true)
				}

			})
		}
	}	
}


// ███    ███  ██████  ██████  ███████       ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  
// ████  ████ ██    ██ ██   ██ ██            ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ 
// ██ ████ ██ ██    ██ ██   ██ █████   █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  
// ██  ██  ██ ██    ██ ██   ██ ██            ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██ 
// ██      ██  ██████  ██████  ███████       ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ 
                                                                                                    
GameUIScene.runAdvanceMode = () => {
	gameFunctions.mode_state++;
	if(gameFunctions.mode_state > gameFunctions.mode_state_max){
		gameFunctions.mode_state = 0;
	}
	
	//UNREADY ALL UNITS
	gameFunctions.params.forces.forEach((force) => {
		force.ready = false;
	})

	GameUIScene.advanceMode()	
}

GameUIScene.advanceMode = () => {
	let options = {}
	// let btn;
	let activated = false;
	switch(gameFunctions.mode_state){
		case 0:
			//setup movement
			options.mode = "move"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger move")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}			
			gameFunctions.mode_state++;
			break;
		case 1:
			//activate movement
			GameScene.game_setup.sfxHandler("button");
			activated = GameUIScene.activateMovement();

			if(activated === true){
				connFunctions.sendReadyUp("GameUIScene");
				GameScene.resetTempSprites();
				gameFunctions.btn_sprite[0].hideButton()
				GameUIScene.mode_check_state = 1;
				// mode_triggered = true;
			}
			break;
			
		case 2:
			//setup shoot
			options.mode = "shoot"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger shoot")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}		
			GameUIScene.checkAllCombat();
			connFunctions.saveGame("shoot");
			gameFunctions.mode_state++;
			break;
		case 3:
			//activate shoot
			GameScene.game_setup.sfxHandler("button");			
			GameUIScene.activateShooting();

			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			connFunctions.sendReadyUp("GameUIScene");
			break;
			
		case 4:
			//setup charge
			options.mode = "charge"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("trigger charge")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();
			}	
			connFunctions.saveGame("charge");			
			gameFunctions.mode_state++;
			break;
		case 5:
			//activate charge
			GameScene.game_setup.sfxHandler("button");			
			activated = GameUIScene.activateCharging();

			if(activated === true){
				connFunctions.sendReadyUp("GameUIScene");
				GameScene.resetTempSprites();
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
			GameUIScene.checkAllCombat();
			connFunctions.saveGame("fight");
			gameFunctions.mode_state++;
			break;
		case 7:
			//activate fight
			GameScene.game_setup.sfxHandler("button");	
			GameUIScene.activateFighting();
			gameFunctions.btn_sprite[0].hideButton()
			GameUIScene.mode_check_state = 1;
			connFunctions.sendReadyUp("GameUIScene");
			break
		case 8:
			//setup end turn
			options.mode = "end turn"
			GameUIScene.selectMode(options);
			gameFunctions.btn_sprite[0].updateText("end turn")
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				gameFunctions.btn_sprite[0].showButton();				
			}		
			GameUIScene.checkAllCombat();
			connFunctions.saveGame("end turn");
			gameFunctions.mode_state++;
			break;
		case 9:
			//activate end turn
			GameScene.game_setup.sfxHandler("end_turn")
			connFunctions.sendReadyUp("GameUIScene");
			GameUIScene.nextSide();			
			break;
	}
}




//  █████   ██████ ████████ ██ ██    ██  █████  ████████ ███████        █████   ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██   ██ ██         ██    ██ ██    ██ ██   ██    ██    ██            ██   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// ███████ ██         ██    ██ ██    ██ ███████    ██    █████   █████ ███████ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██   ██ ██         ██    ██  ██  ██  ██   ██    ██    ██            ██   ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██   ██  ██████    ██    ██   ████   ██   ██    ██    ███████       ██   ██  ██████    ██    ██  ██████  ██   ████ ███████ 

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
			if(unit.path.length > 0 && unit.player === gameFunctions.params.player_number){
				//unit.path.length > 0 &&
				
				if(GameScene.online === false){
					unit.move();
				}else{
					let data = {
						functionGroup: "socketFunctions",  
						function: "messageAll",
						room_name: gameFunctions.params.room_name,
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

			if(unit.targets.length > 0 && unit.player === gameFunctions.params.player_number){
				let data = {
					functionGroup: "socketFunctions",  
					function: "messageAll",
					room_name: gameFunctions.params.room_name,
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
	
	let activated = true;
	if(cohesion_check === true){ // && in_combat === true){
		gameFunctions.units.forEach((unit) => {
			
			if(unit.path.length > 0 && unit.player === gameFunctions.params.player_number){

				if(GameScene.online === false){
					
					if(unit.path.length > 0){
						unit.move("checkCombat");
					}
					
				}else{
				
					if(unit.path.length > 0){

						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							room_name: gameFunctions.params.room_name,
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

		if(unit.fight_targets.length > 0 && unit.player === gameFunctions.params.player_number){

			if(GameScene.online === false){

				unit.fight()
				
			}else{

				let data = {
					functionGroup: "socketFunctions",  
					function: "messageAll",
					room_name: gameFunctions.params.room_name,
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


// #     # ####### #     # #######        #####  ### ######  ####### 
// ##    # #        #   #     #          #     #  #  #     # #       
// # #   # #         # #      #          #        #  #     # #       
// #  #  # #####      #       #    #####  #####   #  #     # #####   
// #   # # #         # #      #                #  #  #     # #       
// #    ## #        #   #     #          #     #  #  #     # #       
// #     # ####### #     #    #           #####  ### ######  ####### 

GameUIScene.nextSide = () => {
	
	gameFunctions.mode = ""
	gameFunctions.units.forEach((unit) => {
		if(unit.alive === true && unit.player === gameFunctions.params.player_number){ //unit.side === gameFunctions.current_side){
			unit.resetActions();
			unit.resetLocks();
		}
	})
	// GameScene.sfx["end_turn"].play();
	GameScene.game_setup.sfxHandler("end_turn")
	
	if(GameScene.online === false){
		GameUIScene.advanceSide()
	}else{

		let data = {
			functionGroup: "socketFunctions",  
			function: "updateRoom",
			type: "ready force",
			room_name: gameFunctions.params.room_name,
			player_number: gameFunctions.params.player_number,
			player_side: gameFunctions.params.player_side
			// params: {
			// }
		}

		connFunctions.messageServer(data)		
	}
}

GameUIScene.advanceSide = () => {

	let sides_array = []
	gameFunctions.params.forces.forEach((force) => {
		if(!sides_array.includes(force.side)){
			sides_array.push(force.side)
		}
	})
	//gameFunctions.params.max_sides
	let sides = sides_array.length;


	// CHANGE THE PARAMS SIDE IF THIS IS A LOCAL GAME
	if(GameScene.online === false && gameFunctions.current_side !== -1){
		gameFunctions.params.player_side += 1
		if(gameFunctions.params.player_side >= sides){
			gameFunctions.params.player_side = 0
		}		
	}	

	gameFunctions.current_side += 1
	if(gameFunctions.current_side >= sides){
		gameFunctions.current_side = 0

		gameFunctions.params.turn_number++;
		GameUIScene.hud_item.setText("c_Turn",gameFunctions.params.turn_number)	
	}
	

	gameFunctions.units.forEach((unit) => {
		unit.moves = 0;
		unit.fights = 0;
		unit.shots = 0;
	})


	let start_check = false;
	if(gameFunctions.current_side === -1){
		start_check = true;
	}
	if(start_check === false){
		if(gameFunctions.params.player_side === gameFunctions.current_side){
			gameFunctions.mode_state = -1
			GameUIScene.runAdvanceMode();
		}

		gameFunctions.params.forces.forEach((force) => {
			force.ready = false;
		})
		GameUIScene.setAllWaitingHUD();

	}

	GameUIScene.checkButtonVisability();
}



		//  #####  ####### ####### #     # ######        #     # #     # ######  
		// #     # #          #    #     # #     #       #     # #     # #     # 
		// #       #          #    #     # #     #       #     # #     # #     # 
		//  #####  #####      #    #     # ######  ##### ####### #     # #     # 
		// 	     # #          #    #     # #             #     # #     # #     # 
		// #     # #          #    #     # #             #     # #     # #     # 
		//  #####  #######    #     #####  #             #     #  #####  ######  

	GameUIScene.setupHUD = () => {

		let hud_width = 240;

		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_item = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2,
			x_itts: 6, y_itts: 4,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 50,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [
				{id: 'Turn',label: 'Turn:', x: 0, y: 0, height: 3},
				{id: 'c_Turn',label: gameFunctions.params.turn_number, x: 3, y: 0, box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 2, height: 3}},				
			]
		});


		//
		GameUIScene.hud_unit = new hud({
			scene: GameUIScene.scene,
			grid: false,

			x: 2, y: 2+50,
			x_itts: 24, y_itts: 8,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 200,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [

				{id: 'u_h',label: "unit", x: 0, y: 0, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 22, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				//ROW 1
				{id: 'r1_h',label: 'type', x: 0, y: 2, height: 1, 
				font: {height: 22}
				},

				{id: 'h_m',label: 'M', x: 7, y: 1, height: 1, width: 3, align: "center", 
				font: {height: 22}
				},
				{id: 'f_m',label: gameFunctions.params.turn_number, x: 7, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_sb',label: 'SB', x: 11, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_sb',label: gameFunctions.params.turn_number, x: 11, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_fb',label: 'FB', x: 15, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},	
				},
				{id: 'f_fb',label: gameFunctions.params.turn_number, x: 15, y: 2,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_a',label: 'A', x: 19, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_a',label: gameFunctions.params.turn_number, x: 19, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				


				//ROW 2
				{id: 'r2_h',label: 'gun', x: 0, y: 4, height: 1,
				font: {height: 22},
				},

				{id: 'h_gun_d',label: 'D', x: 7, y: 3, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_d',label: gameFunctions.params.turn_number, x: 7, y: 4,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_gun_ap',label: 'AP', x: 11, y: 3, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_ap',label: gameFunctions.params.turn_number, x: 11, y: 4, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				

				{id: 'h_gun_r',label: 'Range', x: 15, y: 3, height: 1, width: 7, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_r',label: gameFunctions.params.turn_number, x: 15, y: 4,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 7, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},


				//ROW 3
				{id: 'r3_h',label: 'melee', x: 0, y: 6, height: 1,
				font: {height: 22},
				},

				{id: 'h_mel_d',label: 'D', x: 7, y: 5, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_d',label: gameFunctions.params.turn_number, x: 7, y: 6, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_mel_ap',label: 'AP', x: 11, y: 5, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_ap',label: gameFunctions.params.turn_number, x: 11, y: 6,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				

				{id: 'h_mel_r',label: 'Range', x: 15, y: 5, height: 1, width: 7, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_r',label: gameFunctions.params.turn_number, x: 15, y: 6,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 7, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

			]
		});

		GameUIScene.hud_unit.setVisible(false);


		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_chance = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2+250,
			x_itts: 6, y_itts: 8,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 100,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [
				{id: 'h_mel_chance',label: 'Melee Chance:', x: 0, y: 0, height: 3,
				font: {height: 22},
				},
				{id: 'f_mel_chance',label: gameFunctions.params.turn_number, x: 4, y: 0, 
				font: {height: 22},
				box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 1.25, height: 3}},	
				
				{id: 'h_gun_chance',label: 'Shoot Chance:', x: 0, y: 4, height: 3,
				font: {height: 22},
				},
				{id: 'f_gun_chance',label: gameFunctions.params.turn_number, x: 4, y: 4, 
				font: {height: 22},
				box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 1.25, height: 3}},					

			]
		});

		// GameUIScene.hideChanceHUD(false);



		//SETUP A HUD ITEM FOR EACH FORCE AVAILABLE
		if(gameFunctions.params.forces){
			GameUIScene.forces_hud = {};
			gameFunctions.params.forces.forEach((force, i) => {
			// for (let i=0;i<4;i++){
			// let i = 0

				let colour = GameScene.game_setup.getSideColour(force.side)
				let width = 100;

				//THE HEADER CONTAINS THE PLAYER USERNAME
				GameUIScene.forces_hud[i] = {}
				GameUIScene.forces_hud[i]["header"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 50,
			
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: force.user.username, x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 18}},
						]
					})

				GameUIScene.forces_hud[i]["body"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 50+2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 25,
			
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: "points: 0", x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 12}},
						]
					})

				//THE FOOTER CONTAINS THE FORCE WAITING AND READY STATYS
				GameUIScene.forces_hud[i]["footer"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 75+2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 25,
			
						colour: colour,
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: '', x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 12}},
						]
					})					
		
				GameUIScene.forces_hud[i]["footer"].setVisible(false);
			// }
			})

			GameUIScene.setAllWaitingHUD();
		}
	}


	GameUIScene.setUnitHUD = (unit) => {
		let element = GameUIScene.hud_unit
		element.setVisible(true);

		element.setText("u_h",unit.unit_name)

		element.setText("f_m",unit.movement)
		element.setText("f_sb",unit.shooting_bonus)
		element.setText("f_fb",unit.fighting_bonus)
		element.setText("f_a",unit.armour)

		element.setText("r2_h",unit.shoot_name)
		element.setText("f_gun_d",unit.shoot_damage)
		element.setText("f_gun_ap",unit.shoot_ap)
		element.setText("f_gun_r",unit.max_targets+'x'+unit.shoot_range)

		element.setText("r3_h",unit.fight_name)
		element.setText("f_mel_d",unit.fight_damage)
		element.setText("f_mel_ap",unit.fight_ap)
		element.setText("f_mel_r",unit.fight_max_targets+'x'+unit.fight_range)		
	
	}

	GameUIScene.hideUnitHUD = () => {
		let element = GameUIScene.hud_unit
		element.setVisible(false);
	}


	GameUIScene.setChanceHUD = (selected_unit, target_unit) => {
		let element = GameUIScene.hud_chance
		element.setVisible(true);

		let mel_chance = target_unit.armour - (selected_unit.fight_ap + selected_unit.fighting_bonus);
		let gun_chance = target_unit.armour - (selected_unit.shoot_ap + selected_unit.shooting_bonus);

		mel_chance = Math.round(100-((mel_chance / 20) * 100),2) + '%'
		gun_chance = Math.round(100-((gun_chance / 20) * 100),2) + '%'

		element.setText("f_mel_chance",mel_chance)
		element.setText("f_gun_chance",gun_chance)
	}

	GameUIScene.hideChanceHUD = () => {
		let element = GameUIScene.hud_chance
		element.setVisible(false);
	}

	GameUIScene.setForcesHUD = (i, text, is_visible, is_gray) => {
		if(GameUIScene.forces_hud){
			let element = GameUIScene.forces_hud[i]["footer"]
			element.setText(i,text)
			element.setVisible(is_visible);
			element.setGray(is_gray)
		}
	}

	GameUIScene.setAllWaitingHUD = () => {
		gameFunctions.params.forces.forEach((force, i) => {
			if(force.side === gameFunctions.current_side){
				GameUIScene.setForcesHUD(i, "unready", true, true)
			}else{
				GameUIScene.setForcesHUD(i, "unready", false, true)
			}
		})
	}

	GameUIScene.updatePointsHUD = () => {
		//FOREACH FORCE
		gameFunctions.params.forces.forEach((force, i) => {
			//LOOP THROUGH EACH UNIT AND SAY WHO KILLED THEM

			let points = 0;
			gameFunctions.units.forEach((unit) => {
				if(unit.killed_by !== -1){
					let killing_unit = gameFunctions.units[unit.killed_by]
					if(killing_unit.player === force.player_number){
						points+= unit.cost;
					}
				}
			})

			let element = GameUIScene.forces_hud[i]["body"]
			element.setText(i,"points: "+points)
		})
	}



// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

GameUIScene.checkAllCombat = () => {
	// RESET ALL COMBAT STATUS'
	gameFunctions.units.forEach((unit) => {
		unit.in_combat = false;
		unit.sprite_action.visible = false;
	})

	//RERUN COMBAT CHECKS
	gameFunctions.units.forEach((unit) => {
		unit.checkCombat()
	})	
}


GameUIScene.checkButtonVisability = () => {
	if(GameScene.online === true){
		if(gameFunctions.params.player_side === gameFunctions.current_side){
			// if(start_check === true){
				gameFunctions.showButtons()	
			// }
		}else{
			gameFunctions.hideButtons()
		}
	}
}



