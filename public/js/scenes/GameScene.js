

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function()
    {		

		GameScene.scene = this.scene.get('GameScene')
		gameFunctions.current_scene = this.scene.get('GameScene');

		GameScene.loading_screen = new loading_screen({scene: GameScene.scene, launch_uiscene: "GameUIScene"})
		GameScene.game_setup = new game_setup({scene: GameScene.scene, scene_container: GameScene})

    },


    create: function()
    {
		GameScene.game_setup.loadSound();
		GameScene.game_setup.setupTable();
    },

    update: function (time, delta)
    {

		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);		
		GameScene.game_setup.musicHandler(); 
		GameScene.game_setup.updateMarker(); 
		GameScene.controls.update(delta);
		
		
		if(GameScene.selected_unit.length > 0 && GameScene.multi_select_pause === false){
			// let selected_unit = GameScene.selected_unit[0];
			GameScene.selected_unit.forEach((selected_unit) => {

				// ██      ███████ ███████ ████████        ██████ ██      ██  ██████ ██   ██ 
				// ██      ██      ██         ██          ██      ██      ██ ██      ██  ██  
				// ██      █████   █████      ██    █████ ██      ██      ██ ██      █████   
				// ██      ██      ██         ██          ██      ██      ██ ██      ██  ██  
				// ███████ ███████ ██         ██           ██████ ███████ ██  ██████ ██   ██ 

				if(GameScene.left_click === true && GameUIScene.mode_check_state === 0){

					switch(gameFunctions.mode) {
						case "move":
							
							if(GameScene.online === false){

								//USED FOR MULTIPLE SELECTIONS TO APPLY MOVEMENT
								let used_pointer = worldPoint
								if(GameScene.mouse_selection){
									if(GameScene.mouse_selection.selection_info){
										let info = GameScene.mouse_selection.selection_info[selected_unit.id];
										used_pointer.x += info.offset.x
										used_pointer.y += info.offset.y
									}
								}

								selected_unit.findPath({pointer: used_pointer});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "findPath",
										function_parameter: {pointer: worldPoint}
									},
									message: "set move"
								}
								connFunctions.messageServer(data)
							}
						break;
						case "shoot":

							if(GameScene.online === false){
								selected_unit.findTarget({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "findTarget",
										function_parameter: {pointer: worldPoint}
									},
									message: "set shot target"
								}
								connFunctions.messageServer(data)
							}
						break;
						case "charge":

							if(GameScene.online === false){
								selected_unit.findPath({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "findPath",
										function_parameter: {pointer: worldPoint}
									},
									message: "set charge"
								}
								connFunctions.messageServer(data)
							}						
						break;		
						case "fight":

							if(GameScene.online === false){
								selected_unit.findFightTarget({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "findFightTarget",
										function_parameter: {pointer: worldPoint}
									},
									message: "set fight target"
								}
								connFunctions.messageServer(data)
							}
							
						break;					
						default:
						// code block
					}		
				}

				// ██████  ██  ██████  ██   ██ ████████        ██████ ██      ██  ██████ ██   ██ 
				// ██   ██ ██ ██       ██   ██    ██          ██      ██      ██ ██      ██  ██  
				// ██████  ██ ██   ███ ███████    ██    █████ ██      ██      ██ ██      █████   
				// ██   ██ ██ ██    ██ ██   ██    ██          ██      ██      ██ ██      ██  ██  
				// ██   ██ ██  ██████  ██   ██    ██           ██████ ███████ ██  ██████ ██   ██ 			
				
				if(GameScene.right_click === true && GameUIScene.mode_check_state === 0){
					
					GameScene.sfx['clear'].play();
					switch(gameFunctions.mode) {
						case "move":

							if(GameScene.online === false){
								selected_unit.resetMove();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "resetMove",
									},
									message: "reset path"
								}
								connFunctions.messageServer(data)
							}
							
						break;
						case "shoot":

							if(GameScene.online === false){
								selected_unit.removeTarget();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "removeTarget",
									},
									message: "remove target"
								}
								connFunctions.messageServer(data)
							}						
						break;
						case "charge":

							if(GameScene.online === false){
								selected_unit.resetMove();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "resetMove",
									},
									message: "reset path"
								}
								connFunctions.messageServer(data)
							}						
						break;
						case "fight":

							if(GameScene.online === false){
								selected_unit.removeFightTarget();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.id, 
										function: "removeFightTarget",
									},
									message: "remove fight target"
								}
								connFunctions.messageServer(data)
							}
						break;	
						default:
						// code block
					}
				}

			})
			
		}

		GameScene.multi_select_pause = false;
		GameScene.left_click = false;
		GameScene.right_click = false;		

		// ██    ██ ██████  ██████   █████  ████████ ███████       ███████ ██      ███████ ███    ███ ███████ ███    ██ ████████ ███████ 
		// ██    ██ ██   ██ ██   ██ ██   ██    ██    ██            ██      ██      ██      ████  ████ ██      ████   ██    ██    ██      
		// ██    ██ ██████  ██   ██ ███████    ██    █████   █████ █████   ██      █████   ██ ████ ██ █████   ██ ██  ██    ██    ███████ 
		// ██    ██ ██      ██   ██ ██   ██    ██    ██            ██      ██      ██      ██  ██  ██ ██      ██  ██ ██    ██         ██ 
		//  ██████  ██      ██████  ██   ██    ██    ███████       ███████ ███████ ███████ ██      ██ ███████ ██   ████    ██    ███████ 
																																	  
		//CHECK BULLET DEATH
		let bullets = [];
		if(GameScene.bullets){
			GameScene.bullets.forEach((bullet) => {
				bullet.checkRange();
				if(bullet.delete === false){
					bullets.push(bullet)
				}
			})
		}
		
		GameScene.bullets = bullets;
		
		if(gameFunctions.units){
			gameFunctions.units.forEach((unit) => {
				if(unit.side === gameFunctions.current_side){

					if(unit.is_moving === true){
						// unit.draw_health()
						unit.updateUnitElements(unit.sprite);
					}
				}
			})
		}

		GameScene.pathfinder.update();
	}
});



// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

GameScene.clickHandler = function(pointer){


	if (pointer.leftButtonReleased())
	{	
		GameScene.left_click = true;
	}		
	if (pointer.rightButtonReleased())
	{	
		GameScene.right_click = true;
	}			
};

GameScene.resetTempSprites = () => {
	// console.log(live_tiles)
	if (!GameScene.scene.temp_sprites){
		GameScene.scene.temp_sprites = [];
	}
	else{
		GameScene.scene.temp_sprites.forEach((sprite) => {
			sprite.destroy();
		})
	}		
}

GameScene.showMessage = (text) => {
	let options = {
		scene: GameScene.scene,
		pos: {
			x: GameScene.rectangle.x,
			y: GameScene.rectangle.y
		},
		text: text
	}
	new popup(options)	
}




GameScene.checkCollision = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
	if (tile){
    	return tile.properties.collide == true;		
	}
	else{
		return
	}
};


GameScene.advanceClickState = (state, max) => {
	state += 1
	if(state > max){
		state = 0
	}
	
	return state;
}


GameScene.getTileID = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
    return tile.index;
};

