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

	

		let options = {
			x: 0,
			y: gameFunctions.config.height,
			width: 300,
			height: 100,
			scene: GameUIScene.scene
		}

		GameUIScene.debug_console = new debug_console(options);	

		// GameUIScene.text = this.add.text(0, gameFunctions.config.height - height, "", { fill: '#000000' })
		// .setDepth(120);

		// GameUIScene.text_box = GameUIScene.scene.add.rectangle(
		// 	(width / 2), gameFunctions.config.height - (height / 2), 
		// 	width, height, 0xffffff)
		// .setDepth(100);

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

		let console_text = "";
		console_text += 'Mode: '+gameFunctions.mode_state+'\r'
		console_text += 'Actions: '+GameScene.active_actions+'\r\r'

		// console_text += 'Forces:\r'
		// gameFunctions.params.forces.forEach((force, id) => {
		// 	console_text += id+') | Side: '+force.side+' | Ready: '+force.ready+'\r'		
		// })

		// console_text += 'Ready:\r'
		// gameFunctions.units.forEach((unit, id) => {
		// 	console_text += id+') | ready: '+unit.sprite.body.enable+'\r'
		// })		

		GameUIScene.debug_console.updateText(console_text)


		GameUIScene.advanceMode();

    }
});

// GameUIScene.delay =	async(ms) => {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }	

// ██       ██████   █████  ██████        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██      
// ██      ██    ██ ███████ ██   ██ █████ ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██ 
// ███████  ██████  ██   ██ ██████        ██████   ██████     ██       ██     ██████  ██   ████ ███████ 

GameUIScene.loadSingleButton = (scene) => {
	try{	
		let callbackParams;
		let options;
		
		options = {
			scene: scene, 
			x: gameFunctions.config.width,
			y: 25,
			height: 50,
			width: 250,
			label:  "+",
			clickAction: GameUIScene.readyAdvanceMode,
			callbackParams: callbackParams,
			array: gameFunctions.btn_sprite
		}
		
		gameFunctions.btn_sprite.push(new button(options))


		// GameUIScene.resetReady();

		if(gameFunctions.units_preload.length === 0){
			GameUIScene.advanceSide()
		}
		else{
			GameUIScene.checkButtonVisability();
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "loadSingleButton",
			"e": e
		}
		errorHandler.log(options)
	}
}



// ███████ ███████ ██      ███████  ██████ ████████       ███    ███  ██████  ██████  ███████ 
// ██      ██      ██      ██      ██         ██          ████  ████ ██    ██ ██   ██ ██      
// ███████ █████   ██      █████   ██         ██    █████ ██ ████ ██ ██    ██ ██   ██ █████   
//      ██ ██      ██      ██      ██         ██          ██  ██  ██ ██    ██ ██   ██ ██      
// ███████ ███████ ███████ ███████  ██████    ██          ██      ██  ██████  ██████  ███████                                                                                                                            

GameUIScene.selectMode = (options) => {

	try{	
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
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "selectMode",
			"e": e
		}
		errorHandler.log(options)
	}
}

// GameScene.selectMode = (options) => {
GameUIScene.runSelectMode = (options) => {
	try{		
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

									if (unit.shot === true && unit.checkSpecialRule("swift") === false){
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
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "runSelectMode",
			"e": e
		}
		errorHandler.log(options)
	}			
}


// ███    ███  ██████  ██████  ███████       ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  
// ████  ████ ██    ██ ██   ██ ██            ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ 
// ██ ████ ██ ██    ██ ██   ██ █████   █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  
// ██  ██  ██ ██    ██ ██   ██ ██            ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██ 
// ██      ██  ██████  ██████  ███████       ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ 


GameUIScene.runAdvanceMode = () => {
	try{	
		gameFunctions.mode_state++;
		if(gameFunctions.mode_state > 27){
			gameFunctions.mode_state = 0;
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "runAdvanceMode",
			"e": e
		}
		errorHandler.log(options)
	}		
} 

GameUIScene.checkGameEnd = () => {

	try{	
		// let force_check = [];
		let max_sides = 0;
		gameFunctions.params.forces.forEach((force) => {
			// let info = {
			// 	player: force.player_number,
			// 	side: force.side,
			// 	live_units: 0			
			// }
			// force_check.push(info)
			if(force.side > max_sides){
				max_sides = force.side
			}
		})

		let sides = [];
		for(i=0;i<=max_sides;i++){
			sides.push(0)
		}

		//loop through units and count live units per force / side
		gameFunctions.units.forEach((unit) => {
			// let force = force_check[unit.player]
			if(unit.alive === true){
				// force.live_units++;
				sides[unit.side] += 1;  
			}
		})

		//
		sides.forEach((side) => {
			if(side === 0){
				let options = {
					scene: gameFunctions.current_scene,
					pos: {
						x: gameFunctions.config.width / 2,
						y: gameFunctions.config.height / 2
					},
					text: "side "+side+" is defeated!"
				}
				new popup(options)	
			}
		})
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "checkGameEnd",
			"e": e
		}
		errorHandler.log(options)
	}
}

GameUIScene.readyAdvanceMode = (actions=-1) => {

	try{	
		let cohesion_check = true;

		// switch(gameFunctions.mode){
		// 	case "move":
		// 	case "charge":
		// 		gameFunctions.units.forEach((unit) => {
		// 			if(gameFunctions.params.player_side === gameFunctions.current_side){
		// 				if(unit.cohesion_check === false && unit.cohesion > 0){
		// 					cohesion_check = false;		
		// 				}
		// 			}
		// 		})				
		// 	break;
		// }	


		if(cohesion_check === true){
			gameFunctions.btn_sprite[0].hideButton();
		

			if(GameScene.online === false){
				if(actions>-1){
					GameScene.active_actions = actions;
				}
				// else{	
				// }
				GameUIScene.runAdvanceMode();
			}else{		
				let options = {
					completion_function_group: "GameUIScene",
					completion_function: 'runAdvanceMode',
					current_mode: gameFunctions.mode_state		
				}
				if(actions > -1){
					options.actions = actions
				}
		
				connFunctions.sendReadyUp(options);
			}
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
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "readyAdvanceMode",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.advanceMode = () => {
	try{	
		let options = {}
		let check_side_only = false;
		let all_ready = false;	
		// let btn;
		let activated = false;
		let actions = 0;
		switch(gameFunctions.mode_state){

			// #     # ####### #     # ####### 
			// ##   ## #     # #     # #       
			// # # # # #     # #     # #       
			// #  #  # #     # #     # #####   
			// #     # #     #  #   #  #       
			// #     # #     #   # #   #       
			// #     # #######    #    ####### 

			case 0:
				//CREATE THE "MOVE" BUTTON
				options.mode = "move"
				GameUIScene.selectMode(options);
				gameFunctions.btn_sprite[0].updateText("trigger move")
				if(gameFunctions.params.player_side === gameFunctions.current_side){
					gameFunctions.btn_sprite[0].showButton();				
				}
				else{
					GameUIScene.readyAdvanceMode();
				}
				gameFunctions.mode_state++;
				GameScene.game_setup.checkCollisionsBarriers();	
				break;

			case 1:
				//WAIT FOR PLAYERS TO READY UP
				break;

			case 2:
				//PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
				gameFunctions.mode = ""; //RESET MODE SO ACTIONS CAN'T BE SET WHILE THEY PLAY
				actions = 0;
				gameFunctions.units.forEach((unit) => {
					if(unit.path.length > 0){
						//unit.path.length > 0 &&
						if(unit.player === gameFunctions.params.player_number){
							actions++;
						}
					}
				})	
				GameUIScene.readyAdvanceMode(actions);
				gameFunctions.mode_state++;			
				break;

			case 3:
				//WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
				break;

			
			case 4:
				//activate movement
				GameScene.game_setup.sfxHandler("button");
				activated = GameUIScene.activateMovement();

				if(activated !== 0){
					GameScene.resetTempSprites();
					gameFunctions.btn_sprite[0].hideButton()

					if(activated === -1){
						GameUIScene.readyAdvanceMode();
					}

					gameFunctions.mode_state++;
				}
				// console.log("move: ",activated)
				break;

			
			case 5:
				//WAIT FOR PLAYERS TO READY UP
				break;

			//  #####  #     # ####### ####### ####### 
			// #     # #     # #     # #     #    #    
			// #       #     # #     # #     #    #    
			//  #####  ####### #     # #     #    #    
			// 	     # #     # #     # #     #    #    
			// #     # #     # #     # #     #    #    
			//  #####  #     # ####### #######    #   

			case 6:
				//setup shoot
				options.mode = "shoot"

				GameUIScene.selectMode(options);
				gameFunctions.btn_sprite[0].updateText("trigger shoot")
				if(gameFunctions.params.player_side === gameFunctions.current_side){
					gameFunctions.btn_sprite[0].showButton();				
				}else{
					GameUIScene.readyAdvanceMode();
				}		
				
				//THIS IS CAUSING BODY RESETS
				GameUIScene.checkAllCombat();
				
				connFunctions.saveGame("shoot");

				gameFunctions.mode_state++;
				GameScene.game_setup.checkCollisionsBarriers();
				break;

			case 7:
				//WAIT FOR PLAYERS TO READY UP
				break;			

			case 8:
				//PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
				gameFunctions.mode = ""; //RESET MODE SO ACTIONS CAN'T BE SET WHILE THEY PLAY
				actions = 0;
				gameFunctions.units.forEach((unit) => {
					if(unit.targets.length > 0){
						//unit.path.length > 0 &&
						if(unit.player === gameFunctions.params.player_number){
							actions += unit.targets.length;
						}
					}
				})	
				GameUIScene.readyAdvanceMode(actions);
				gameFunctions.mode_state++;			
				break;

			case 9:
				//WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
				break;

			case 10:
				//activate shoot
				GameScene.game_setup.sfxHandler("button");			
				activated = GameUIScene.activateShooting();
				
				if(activated !== 0){
					gameFunctions.btn_sprite[0].hideButton()
					gameFunctions.mode_state++;

					if(activated === -1){
						GameUIScene.readyAdvanceMode();	
					}				
				}

				break;

			case 11:
				//WAIT FOR PLAYERS TO READY UP
				break;	

			//  #####  #     #    #    ######   #####  ####### 
			// #     # #     #   # #   #     # #     # #       
			// #       #     #  #   #  #     # #       #       
			// #       ####### #     # ######  #  #### #####   
			// #       #     # ####### #   #   #     # #       
			// #     # #     # #     # #    #  #     # #       
			//  #####  #     # #     # #     #  #####  ####### 

			case 12:
				//setup charge
				options.mode = "charge"
				GameUIScene.selectMode(options);
				gameFunctions.btn_sprite[0].updateText("trigger charge")
				if(gameFunctions.params.player_side === gameFunctions.current_side){
					gameFunctions.btn_sprite[0].showButton();
				}else{
					GameUIScene.readyAdvanceMode();
				}		

				connFunctions.saveGame("charge");			
				gameFunctions.mode_state++;
				GameScene.game_setup.checkCollisionsBarriers();
				break;

			case 13:
				//WAIT FOR PLAYERS TO READY UP
				break;	

			case 14:
				//PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
				gameFunctions.mode = ""; //RESET MODE SO ACTIONS CAN'T BE SET WHILE THEY PLAY
				actions = 0;
				gameFunctions.units.forEach((unit) => {
					if(unit.path.length > 0){
						//unit.path.length > 0 &&
						if(unit.player === gameFunctions.params.player_number){
							actions++;
						}
					}
				})	
				GameUIScene.readyAdvanceMode(actions);
				gameFunctions.mode_state++;			
				break;

			case 15:
				//WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
				break;

			case 16:
				//activate charge
				GameScene.game_setup.sfxHandler("button");			
				activated = GameUIScene.activateCharging();
				
				if(activated !== 0){
					GameScene.resetTempSprites();
					gameFunctions.btn_sprite[0].hideButton()

					if(activated === -1){
						GameUIScene.readyAdvanceMode();	
					}
					
					gameFunctions.mode_state++;
				}
				// console.log("charge: ",activated)
				break;			

			case 17:
				//WAIT FOR PLAYERS TO READY UP
				break;	

			// ####### ###  #####  #     # ####### 
			// #        #  #     # #     #    #    
			// #        #  #       #     #    #    
			// #####    #  #  #### #######    #    
			// #        #  #     # #     #    #    
			// #        #  #     # #     #    #    
			// #       ###  #####  #     #    #    

			
			case 18:
				//setup fight
				options.mode = "fight"
				GameUIScene.selectMode(options);
				gameFunctions.btn_sprite[0].updateText("trigger fight")
				if(gameFunctions.params.player_side === gameFunctions.current_side){
					gameFunctions.btn_sprite[0].showButton();				
				}else{
					GameUIScene.readyAdvanceMode();
				}	
				
				// GameUIScene.setOthersReady();			
				GameUIScene.checkAllCombat();
				connFunctions.saveGame("fight");
				gameFunctions.mode_state++;
				GameScene.game_setup.checkCollisionsBarriers();
				break;

			case 19:
				//WAIT FOR PLAYERS TO READY UP
				break;				

			case 20:
				//PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
				gameFunctions.mode = ""; //RESET MODE SO ACTIONS CAN'T BE SET WHILE THEY PLAY
				actions = 0;
				gameFunctions.units.forEach((unit) => {
					if(unit.fight_targets.length > 0){
						//unit.path.length > 0 &&
						if(unit.player === gameFunctions.params.player_number){
							actions += unit.fight_targets.length;
						}
					}
				})	
				GameUIScene.readyAdvanceMode(actions);
				gameFunctions.mode_state++;			
				break;

			case 21:
				//WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
				break;

			case 22:
				//activate fight
				GameScene.game_setup.sfxHandler("button");	
				
				activated = GameUIScene.activateFighting();

				if(activated !== 0){
					gameFunctions.btn_sprite[0].hideButton()

					if(activated === -1){
						GameUIScene.readyAdvanceMode();
					}

					// GameUIScene.setOthersReady();		
					gameFunctions.mode_state++;
				}

				break

			case 23:
				//WAIT FOR PLAYERS TO READY UP
				break;

			// ####### #     # ######        ####### #     # ######  #     # 
			// #       ##    # #     #          #    #     # #     # ##    # 
			// #       # #   # #     #          #    #     # #     # # #   # 
			// #####   #  #  # #     # #####    #    #     # ######  #  #  # 
			// #       #   # # #     #          #    #     # #   #   #   # # 
			// #       #    ## #     #          #    #     # #    #  #    ## 
			// ####### #     # ######           #     #####  #     # #     # 

			
			case 24:
				//setup end turn
				options.mode = "end turn"
				GameUIScene.selectMode(options);
				gameFunctions.btn_sprite[0].updateText("end turn")
				if(gameFunctions.params.player_side === gameFunctions.current_side){
					gameFunctions.btn_sprite[0].showButton();				
				}else{
					GameUIScene.readyAdvanceMode();
				}		
				
				GameUIScene.checkAllCombat();
				connFunctions.saveGame("end turn");
				gameFunctions.mode_state++;
				GameScene.game_setup.checkCollisionsBarriers();
				break;

			case 25:
				//WAIT FOR PLAYERS TO READY UP
				break;

			case 26:
				//activate end turn
				GameScene.game_setup.sfxHandler("end_turn")
				gameFunctions.mode_state++;			
				GameUIScene.readyAdvanceMode();

				GameScene.game_setup.updateBarriers();
				GameUIScene.nextSide();
				break;

			case 27:
				//WAIT FOR PLAYERS TO READY UP
				break;			

			/**/
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "advanceMode",
			"e": e
		}
		errorHandler.log(options)
	}		
}




//  █████   ██████ ████████ ██ ██    ██  █████  ████████ ███████        █████   ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██   ██ ██         ██    ██ ██    ██ ██   ██    ██    ██            ██   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// ███████ ██         ██    ██ ██    ██ ███████    ██    █████   █████ ███████ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██   ██ ██         ██    ██  ██  ██  ██   ██    ██    ██            ██   ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██   ██  ██████    ██    ██   ████   ██   ██    ██    ███████       ██   ██  ██████    ██    ██  ██████  ██   ████ ███████ 

// #     # ####### #     # ####### 
// ##   ## #     # #     # #       
// # # # # #     # #     # #       
// #  #  # #     # #     # #####   
// #     # #     #  #   #  #       
// #     # #     #   # #   #       
// #     # #######    #    ####### 


GameUIScene.activateMovement = () => {
	
	try{	
		let cohesion_check = true
		// gameFunctions.units.forEach((unit) => {
		// 	if(unit.cohesion_check === false && unit.cohesion > 0){
		// 		cohesion_check = false;		
		// 	}
		// })		
		
		let activated = 0;
		if(cohesion_check === true){
			activated = -1;
			gameFunctions.units.forEach((unit) => {
				if(unit.path.length > 0){
					//unit.path.length > 0 &&
					if(unit.player === gameFunctions.params.player_number){
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
					}

					activated = 1;
				}
			})
			
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
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "activateMovement",
			"e": e
		}
		errorHandler.log(options)
	}		
}

//  #####  #     # ####### ####### ####### 
// #     # #     # #     # #     #    #    
// #       #     # #     # #     #    #    
//  #####  ####### #     # #     #    #    
//       # #     # #     # #     #    #    
// #     # #     # #     # #     #    #    
//  #####  #     # ####### #######    #  

GameUIScene.activateShooting = () => {

	try{	
		let activated = -1;
		gameFunctions.units.forEach((unit) => {
			
			if(unit.targets.length > 0){
				if(unit.player === gameFunctions.params.player_number){

					if(GameScene.online === false){
						unit.shoot();
					}else{

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
				activated = 1
			}
		})	

		return activated;
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "activateShooting",
			"e": e
		}
		errorHandler.log(options)
	}		
}

//  #####  #     #    #    ######   #####  ####### 
// #     # #     #   # #   #     # #     # #       
// #       #     #  #   #  #     # #       #       
// #       ####### #     # ######  #  #### #####   
// #       #     # ####### #   #   #     # #       
// #     # #     # #     # #    #  #     # #       
//  #####  #     # #     # #     #  #####  ####### 

GameUIScene.activateCharging = () => {
	
	try{	
		//CHECK COHESION FOR UNITS THAT'RE CHARGING
		let cohesion_check = true
		//ALSO CHECK ALL CHARGING UNITS ARE NEXT TO AN ENEMY UNITS
		let in_combat = false;
		
		// gameFunctions.units.forEach((unit) => {
		// 	if(unit.cohesion_check === false && unit.cohesion > 0){
		// 		cohesion_check = false;
		// 	}
		// })
		
		let activated = 0;
		if(cohesion_check === true){ // && in_combat === true){
			activated = -1;

			gameFunctions.units.forEach((unit) => {
				
				if(unit.path.length > 0){
					if(unit.player === gameFunctions.params.player_number){
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
					}
					
					// if(unit.path.length > 1){
					// 	GameScene.active_actions++;	
					// }
					activated = 1;
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
		}
		
		//TRIGGER COMBAT WHEN UNITS HAVE MOVED
		
		return activated;
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "activateCharging",
			"e": e
		}
		errorHandler.log(options)
	}		
}

// ####### ###  #####  #     # ####### 
// #        #  #     # #     #    #    
// #        #  #       #     #    #    
// #####    #  #  #### #######    #    
// #        #  #     # #     #    #    
// #        #  #     # #     #    #    
// #       ###  #####  #     #    #  

GameUIScene.activateFighting = () => {

	try{
		let activated = -1;
		
		gameFunctions.units.forEach((unit) => {

			if(unit.fight_targets.length > 0){
				if(unit.player === gameFunctions.params.player_number){
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

				activated = 1;
			}

		})
		
		//TRIGGER COMBAT WHEN UNITS HAVE MOVED

		return activated
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "selectUnit",
			"e": e
		}
		errorHandler.log(options)
	}		
}


// #     # ####### #     # #######        #####  ### ######  ####### 
// ##    # #        #   #     #          #     #  #  #     # #       
// # #   # #         # #      #          #        #  #     # #       
// #  #  # #####      #       #    #####  #####   #  #     # #####   
// #   # # #         # #      #                #  #  #     # #       
// #    ## #        #   #     #          #     #  #  #     # #       
// #     # ####### #     #    #           #####  ### ######  ####### 

GameUIScene.nextSide = () => {
	try{	
		gameFunctions.mode = ""
		gameFunctions.units.forEach((unit) => {
			if(unit.alive === true){
				unit.checkStatus();
				if(unit.player === gameFunctions.params.player_number){ //unit.side === gameFunctions.current_side){
					unit.resetActions();
					unit.resetLocks();
				}
			}
		})
		// GameScene.sfx["end_turn"].play();
		GameScene.game_setup.sfxHandler("end_turn")
		
		GameUIScene.advanceSide()

		// if(GameScene.online === false){
		// 	GameUIScene.advanceSide()
		// }else{

		// 	let data = {
		// 		functionGroup: "socketFunctions",  
		// 		function: "updateRoom",
		// 		type: "end turn",
		// 		room_name: gameFunctions.params.room_name,
		// 		player_number: gameFunctions.params.player_number,
		// 		player_side: gameFunctions.params.player_side
		// 		// params: {
		// 		// }
		// 	}

		// 	connFunctions.messageServer(data)		
		// }
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "nextSide",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.advanceSide = () => {

	try{	
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
			// gameFunctions.params.player_side += 1
			// if(gameFunctions.params.player_side >= sides){
			// 	gameFunctions.params.player_side = 0
			// }	
			GameScene.offline_force++;
			if(GameScene.offline_force >= gameFunctions.params.forces.length){
				GameScene.offline_force = 0;
			}	
			gameFunctions.params.player_number = GameScene.offline_force;
			gameFunctions.params.player_side = gameFunctions.params.forces[GameScene.offline_force].side;
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

		GameUIScene.checkButtonVisability();
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "selectUnit",
			"e": e
		}
		errorHandler.log(options)
	}		
}



//  #####  ####### ####### #     # ######        #     # #     # ######  
// #     # #          #    #     # #     #       #     # #     # #     # 
// #       #          #    #     # #     #       #     # #     # #     # 
//  #####  #####      #    #     # ######  ##### ####### #     # #     # 
// 	     # #          #    #     # #             #     # #     # #     # 
// #     # #          #    #     # #             #     # #     # #     # 
//  #####  #######    #     #####  #             #     #  #####  ######  

GameUIScene.setupHUD = () => {
	try{
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
				{id: 'r1_h',label: '', x: 0, y: 2, height: 1, text_width: 5, align: "left", 
				font: {height: 16}
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
				{id: 'r2_h',label: 'guns', x: 0, y: 4, height: 1, text_width: 5, align: "left", 
				font: {height: 16},
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
				{id: 'r3_h',label: 'melee', x: 0, y: 6, height: 1, text_width: 5, align: "left",
				font: {height: 16},
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
				//
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
		GameUIScene.hud_special = new hud({
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
				{id: 'h_special',label: 'Special Rules:', x: 0, y: 0, height: 3,
				font: {height: 16},
				},
				{id: 'f_special',label: 'melee', x: 3, y: 0, height: 1, text_width: 5, align: "left",
				font: {height: 16},
				},
				
				{id: 'h_status',label: 'Status Effects:', x: 0, y: 4, height: 3,
				font: {height: 16},
				},
				{id: 'f_status',label: 'melee', x: 3, y: 4, height: 1, text_width: 5, height: 3, align: "left",
				font: {height: 16},
				},				
			]
		});


		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_chance = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2+350,
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
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setupHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}


GameUIScene.setUnitHUD = (unit) => {
	try{	
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

		if(unit.alive === true){
			element = GameUIScene.hud_special
			element.setVisible(true);		
	
			element.setText("f_special",unit.special_rules)
	
			let status = ''
			if(unit.poison){
				status += 'poisoned'
			}
	
			element.setText("f_status",status)
		}

	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setUnitHUD",
			"e": e
		}
		errorHandler.log(options)
	}	
}

GameUIScene.hideUnitHUD = () => {
	try{	
		let element = GameUIScene.hud_unit
		element.setVisible(false);

		element = GameUIScene.hud_special
		element.setVisible(false);
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "hideUnitHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}


GameUIScene.setChanceHUD = (selected_unit, target_unit) => {
	try{	
		let element = GameUIScene.hud_chance
		element.setVisible(true);

		let mel_chance = target_unit.armour - (selected_unit.fight_ap + selected_unit.fighting_bonus);
		let gun_chance = target_unit.armour - (selected_unit.shoot_ap + selected_unit.shooting_bonus);

		let max_roll_value = 20
		if(selected_unit.cohesion_check === false && selected_unit.cohesion > 0){
			max_roll_value = 10;
		}

		mel_chance = Math.round(100-((mel_chance / max_roll_value) * 100),2) + '%'
		gun_chance = Math.round(100-((gun_chance / max_roll_value) * 100),2) + '%'

		element.setText("f_mel_chance",mel_chance)
		element.setText("f_gun_chance",gun_chance)
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setChanceHUD",
			"e": e
		}
		errorHandler.log(options)
	}
}

GameUIScene.hideChanceHUD = () => {
	try{	
		let element = GameUIScene.hud_chance
		element.setVisible(false);
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "hideChanceHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.setForcesHUD = (i, text, is_visible, is_gray) => {
	try{	
		if(GameUIScene.forces_hud){
			let element = GameUIScene.forces_hud[i]["footer"]
			element.setText(i,text)
			element.setVisible(is_visible);
			element.setGray(is_gray)
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setForcesHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.setAllWaitingHUD = () => {
	try{	
		gameFunctions.params.forces.forEach((force, i) => {
			if(force.side === gameFunctions.current_side){
				GameUIScene.setForcesHUD(i, "unready", true, true)
			}else{
				GameUIScene.setForcesHUD(i, "unready", false, true)
			}
		})
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setAllWaitingHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.updatePointsHUD = () => {
	try{	
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
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "updatePointsHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}



// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

GameUIScene.checkAllCombat = () => {
	try{	
		// RESET ALL COMBAT STATUS'
		gameFunctions.units.forEach((unit) => {
			unit.in_combat = false;
			if(unit.sprite.body){
				unit.sprite.body.enable = true; //
			}
			unit.sprite_action.visible = false;
		})

		//RERUN COMBAT CHECKS
		gameFunctions.units.forEach((unit) => {
			unit.checkCombat()
		})
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "checkAllCombat",
			"e": e
		}
		errorHandler.log(options)
	}			
}


GameUIScene.checkButtonVisability = () => {
	try{	
		if(GameScene.online === true){
			if(gameFunctions.params.player_side === gameFunctions.current_side){
				// if(start_check === true){
					gameFunctions.showButtons()	
				// }
			}else{
				gameFunctions.hideButtons()
			}
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "checkButtonVisability",
			"e": e
		}
		errorHandler.log(options)
	}		
}



