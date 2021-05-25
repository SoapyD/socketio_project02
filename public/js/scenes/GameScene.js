

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });			
    },

    preload: function()
    {
		
		// this.scene.launch("ArmySetupUIScene");
		this.scene.launch("GameUIScene");
		
		switch(instance_type){
			case "DEV":
				GameScene.master_volume = 0;
				GameScene.online = false;
				break;
			case "DEV-ONLINE":
				// GameScene.master_volume = 0;
				GameScene.master_volume = 0.05;
				GameScene.online = true;
				break;				
			default:
				GameScene.master_volume = 0.2;
				GameScene.online = true;
				break;
		}
		
		GameScene.master_sfx_volume = 0.3;
		

		GameScene.active_actions = 0;
		GameScene.bullets = [];
		GameScene.selected_unit;
		GameScene.left_click = false;
		GameScene.left_click_state = 0;
		GameScene.right_click = false;
		GameScene.right_click_state = 0;
		
		GameScene.scene = this.scene.get('GameScene')
		gameFunctions.current_scene = this.scene.get('GameScene');
		
		GameScene.tile_size = 32;
		
		GameScene.rectangle = this.add.rectangle(0, 0, 10, 10, 0x6666ff);
		GameScene.rectangle.depth = 100;
		GameScene.rectangle.alpha = 0;
		
		
		// gameFunctions.units = []

		let max_sides = 6;
		GameScene.unit_collisions = []
		for(let i=0; i<max_sides; i++){
			GameScene.unit_collisions.push(GameScene.scene.add.group());
		}

	
		this.load.image('tileset', './img/maps/gridtiles.png');
		// this.load.tilemapTiledJSON('map', '../../img/maps/map.json');
		this.load.tilemapTiledJSON('map', '../../img/maps/map2.json');
		
		//UNIT SPRITES
		this.load.image('general', '../../img/units/general.png');
		this.load.image('squad_leader', '../../img/units/squad_leader.png');
		this.load.image('heavy', '../../img/units/heavy.png');	
		this.load.image('special', '../../img/units/special.png');			
		this.load.image('unit', '../../img/units/unit.png');
		this.load.image('tank', '../../img/units/tank.png');
		this.load.image('dread', '../../img/units/dread.png');		
		
		
		//PARTICLE SPRITES
		this.load.image('bullet', '../../img/particles/bullet.png');	
		this.load.image('marker', '../../img/particles/marker.png');			
        this.load.spritesheet('explosion', '../../img/particles/explosion7.png', { frameWidth: 256, frameHeight: 256 }); //WEAPON BLAST
        this.load.spritesheet('punch', '../../img/particles/explosion23.png', { frameWidth: 256, frameHeight: 256 });	//CLOSE COMBAT BLAST
        this.load.spritesheet('special_blast', '../../img/particles/explosion65.png', { frameWidth: 256, frameHeight: 256 });	//SPECIAL WEAPON BLAST
        this.load.spritesheet('heavy_blast', '../../img/particles/explosion102.png', { frameWidth: 256, frameHeight: 256 });	//HEAVY WEAPON BLAST				
		
        this.load.spritesheet('symbols', '../../img/symbols.png', { frameWidth: 190, frameHeight: 200 }); 
		
		
		this.load.setPath('../../sfx');		
		this.load.audio('select', [ 'select.mp3' ])
		this.load.audio('clear', [ 'clear.mp3' ])
		this.load.audio('button', [ 'button.mp3' ])
		
		this.load.audio('action', [ 'action.mp3' ])	
		this.load.audio('end_path', [ 'end_path.mp3' ])	
		this.load.audio('end_turn', [ 'end_turn.mp3' ])	
		
		this.load.audio('movement', [ 'movement.mp3' ])	
		this.load.audio('sword', [ 'sword.mp3' ])
		this.load.audio('shot', [ 'shot.mp3' ])
		this.load.audio('blast', [ 'blast.mp3' ])	
		
		this.load.audio('death_man', [ 'death_man.mp3' ])
		this.load.audio('death_machine', [ 'death_machine.mp3' ])
		
		
		GameScene.music_playing = false;
		
		GameScene.music_track = 0;
		this.load.setPath('../../music');
		this.load.audio('song1', [ 'song1.mp3' ])
		this.load.audio('song2', [ 'song2.mp3' ])
		this.load.audio('song3', [ 'song3.mp3' ])
    },


    create: function()
    {
		//SFX can only be set in the creation method once theyve been pre-loaded
		GameScene.sfx = {}		
		GameScene.sfx.select = this.sound.add('select', {volume: 0.1 * GameScene.master_sfx_volume});
		GameScene.sfx.clear = this.sound.add('clear', {volume: 1 * GameScene.master_sfx_volume});
		GameScene.sfx.button = this.sound.add('button', {volume: 1 * GameScene.master_sfx_volume});
		
		GameScene.sfx.action = this.sound.add('action', {volume: 0.1 * GameScene.master_sfx_volume});
		GameScene.sfx.end_path = this.sound.add('end_path', {volume: 0.04 * GameScene.master_sfx_volume});
		GameScene.sfx.end_turn = this.sound.add('end_turn', {volume: 0.5 * GameScene.master_sfx_volume});
		
		GameScene.sfx.movement = this.sound.add('movement', {volume: 0.1 * GameScene.master_sfx_volume});
		GameScene.sfx.sword = this.sound.add('sword', {volume: 0.5 * GameScene.master_sfx_volume});
		GameScene.sfx.blast = this.sound.add('blast', {volume: 0.2 * GameScene.master_sfx_volume});
		GameScene.sfx.shot = this.sound.add('shot', {volume: 0.2 * GameScene.master_sfx_volume});
		
		GameScene.sfx.death_man = this.sound.add('death_man', {volume: 0.3 * GameScene.master_sfx_volume});
		GameScene.sfx.death_machine = this.sound.add('death_machine', {volume: 0.3 * GameScene.master_sfx_volume});
		
		
		
		
		GameScene.music = []
		GameScene.music.push(this.sound.add('song1', {volume: GameScene.master_volume}));
		GameScene.music.push(this.sound.add('song2', {volume: GameScene.master_volume}));
		GameScene.music.push(this.sound.add('song3', {volume: GameScene.master_volume}));

		
		GameScene.music.forEach((track) => {
			track.on('complete', () => {

				GameScene.music_track += 1
				if(GameScene.music_track >= GameScene.music.length){
					GameScene.music_track = 0
				}
				GameScene.music_playing = false;
			});				
		})
		
		

		
		this.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.input.keyboard.createCursorKeys();		
				
		// Handles the clicks on the map to make the character move
		this.input.on('pointerup',GameScene.clickHandler);
		
		GameScene.setupMap();
		GameScene.setupCamera();
		
		if(gameFunctions.units_preload.length === 0){
			// GameScene.seed();
			

			switch(instance_type){
				case "DEV":
					GameScene.seed3();
					break;
				case "DEV-ONLINE":
					// if(gameFunctions.params.max_players > 2){
					// 	GameScene.seed2();
					// }else{
					// 	GameScene.seed();
					// }
					GameScene.seed2();
					break;
				default:
					if(gameFunctions.params.max_players > 2){
						GameScene.seed2();
					}else{
						GameScene.seed();
					}
					break;
			}			
			
		}
		if(gameFunctions.units_preload.length > 0){
			
			let options = {
				unit_list: gameFunctions.units,
				scene: GameScene.scene,
				player: 0,
				side: 0,
				angle : 90,
				tile_size: GameScene.tile_size,
				unit_types: GameScene.unit_types,
				projectile_weapon_types: GameScene.projectile_weapon_types,
				combat_weapon_types: GameScene.combat_weapon_types,
				armour_types: GameScene.armour_types
			}
			GameScene.unit_setup = new unit_setup(options)
			
			// gameFunctions.units = [];
			gameFunctions.units_preload.forEach((unit) => {

				options.player = unit.player;
				options.side = unit.side;
				options.x = unit.x;
				options.y = unit.y;
				options.unit_name = unit.unit_name;
				options.shoot_name = unit.shoot_name;
				options.fight_name = unit.fight_name;
				options.armour_name = unit.armour_name;

				let created_unit = GameScene.unit_setup.placeFunction(options, "pos")

				created_unit.player = unit.player;
				created_unit.side = unit.side;
				created_unit.squad = unit.squad;
				created_unit.drawTint()
				
				created_unit.health = unit.health;
				created_unit.alive = unit.alive;
				created_unit.in_combat = unit.in_combat;

				created_unit.sprite.angle = Phaser.Math.RadToDeg(unit.rotation);
				created_unit.sprite.x -= GameScene.tile_size * created_unit.sprite_offset;
				created_unit.sprite.y -= GameScene.tile_size * created_unit.sprite_offset;
				
				if(created_unit.sprite_ghost){
					created_unit.sprite_ghost.angle = Phaser.Math.RadToDeg(unit.rotation);
					created_unit.sprite_ghost.x -= GameScene.tile_size * created_unit.sprite_offset;
					created_unit.sprite_ghost.y -= GameScene.tile_size * created_unit.sprite_offset;
				}

				// created_unit.drawHealth()
				created_unit.updateUnitElements()
				
			})			
		}
		

		GameScene.advanceSide()

		
		// GameScene.text_array = []
		// GameScene.grid.forEach((row, y) => {
		// 	GameScene.text_array.push([]);
		// 	row.forEach((column, x) => {
		// 		let text = this.add.text(32 * x, 32 * y, GameScene.grid[y][x], { fill: '#00ff00' }).setDepth(20);
		// 		GameScene.text_array[y].push(text)
		// 	})
		// })
    	// text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);
		

		
    },

    update: function (time, delta)
    {
		
		
		// setTimeout(() => { 
			GameScene.musicHandler(); 
		// }, 1000);

		GameScene.rectangle.x = GameScene.camera.midPoint.x
		GameScene.rectangle.y = GameScene.camera.midPoint.y		

		GameScene.controls.update(delta);
		
		/**/
        // controls.update(delta);
		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

		// Rounds down to nearest tile
		var pointerTileX = GameScene.map.worldToTileX(worldPoint.x);
		var pointerTileY = GameScene.map.worldToTileY(worldPoint.y);
		GameScene.marker.x = GameScene.map.tileToWorldX(pointerTileX);
		GameScene.marker.y = GameScene.map.tileToWorldY(pointerTileY);
		GameScene.marker.setVisible(!GameScene.checkCollision(pointerTileX,pointerTileY));  
		
		
		if(GameScene.selected_unit){
		
			if(GameScene.left_click === true){

				switch(gameFunctions.mode) {
					case "move":
						
						if(GameScene.online === false){
							GameScene.selected_unit.findPath({pointer: worldPoint});
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
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
							GameScene.selected_unit.findTarget({pointer: worldPoint});
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
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
							GameScene.selected_unit.findPath({pointer: worldPoint});
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
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
							GameScene.selected_unit.findFightTarget({pointer: worldPoint});
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
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
			
			if(GameScene.right_click === true){
				
				GameScene.sfx['clear'].play();
				switch(gameFunctions.mode) {
					case "move":

						if(GameScene.online === false){
							GameScene.selected_unit.resetMove();
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
									function: "resetMove",
								},
								message: "reset path"
							}
							connFunctions.messageServer(data)
						}
						
					break;
					case "shoot":

						if(GameScene.online === false){
							GameScene.selected_unit.removeTarget();
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
									function: "removeTarget",
								},
								message: "remove target"
							}
							connFunctions.messageServer(data)
						}						
					break;
					case "charge":

						if(GameScene.online === false){
							GameScene.selected_unit.resetMove();
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
									function: "resetMove",
								},
								message: "reset path"
							}
							connFunctions.messageServer(data)
						}						
					break;
					case "fight":

						if(GameScene.online === false){
							GameScene.selected_unit.removeFightTarget();
						}else{

							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "runUnitFunction", //test
								returnParameters: {
									id: GameScene.selected_unit.id, 
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
			
		}

		
		GameScene.left_click = false;
		GameScene.right_click = false;		
		
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
    }
});

GameScene.sfxHandler = (sfx) => {
	
	if (!GameScene.scene.sound.locked)
	{
		// already unlocked so play
		GameScene.sfx[sfx].play();
	}
	else
	{
		// wait for 'unlocked' to fire and then play
		GameScene.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			GameScene.sfx[sfx].play();
		})
	}
}

GameScene.musicHandler = () => {
	
	if(GameScene.music_playing === false){
				
		if (!GameScene.scene.sound.locked)
		{
			// already unlocked so play
			GameScene.music[GameScene.music_track].play();
		}
		else
		{
			// wait for 'unlocked' to fire and then play
			GameScene.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				GameScene.music[GameScene.music_track].play();
			})
		}				
		
		GameScene.music_playing = true;
	}
}

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

GameScene.selectMode = (options) => {
	
	if(options.parameters){
		options = options.parameters.options
	}
	// console.log("returned",options)	
	
	if(options.mode){
		gameFunctions.mode = options.mode
		GameScene.selected_unit = undefined;
		
		//RESET ALL PLAYER ACTIONS
		if(gameFunctions.units){
			gameFunctions.units.forEach((unit) => {
				if(unit.side === gameFunctions.current_side){
					unit.resetActions();
				}
			})
		}
	}	
}


// GameScene.advancePlayer = () => {

// 	gameFunctions.current_player += 1
// 	if(gameFunctions.current_player >= gameFunctions.params.max_players){
// 		gameFunctions.current_player = 0
// 	}
	
// 	if(GameScene.online === true){
// 		if(gameFunctions.params.player_number === gameFunctions.current_player){
// 			GameUIScene.showButtons()			
// 		}else{
// 			GameUIScene.hideButtons()
// 		}
// 	}
	
// 	gameFunctions.units.forEach((unit) => {
// 		unit.moves = 0;
// 		unit.fights = 0;
// 		unit.shots = 0;
// 	})
// }

GameScene.advanceSide = () => {

	gameFunctions.current_side += 1
	if(gameFunctions.current_side >= gameFunctions.params.max_sides){
		gameFunctions.current_side = 0
	}
	
	if(GameScene.online === true){
		if(gameFunctions.params.player_side === gameFunctions.current_side){
			GameUIScene.showButtons()			
		}else{
			GameUIScene.hideButtons()
		}
	}
	
	gameFunctions.units.forEach((unit) => {
		unit.moves = 0;
		unit.fights = 0;
		unit.shots = 0;
	})
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



GameScene.setupMap = () => {
	// Display map
	GameScene.map = GameScene.scene.make.tilemap({ key: 'map'});
	// The first parameter is the name of the tileset in Tiled and the second parameter is the key
	// of the tileset image used when loading the file in preload.
	var tiles = GameScene.map.addTilesetImage('tiles', 'tileset');
	GameScene.map.createStaticLayer(0, tiles, 0,0);		

	// Marker that will follow the mouse
	GameScene.marker = GameScene.scene.add.graphics();
	GameScene.marker.lineStyle(3, 0xffffff, 1);
	GameScene.marker.strokeRect(0, 0, GameScene.map.tileWidth, GameScene.map.tileHeight);

	// ### Pathfinding stuff ###
	// We create the 2D array representing all the tiles of our map
	var grid = [];
	for(var y = 0; y < GameScene.map.height; y++){
		var col = [];
		for(var x = 0; x < GameScene.map.width; x++){
			// In each cell we store the ID of the tile, which corresponds
			// to its index in the tileset of the map ("ID" field in Tiled)
			col.push(GameScene.getTileID(x,y));
		}
		grid.push(col);
	}
	GameScene.grid = grid;


	GameScene.tileset = GameScene.map.tilesets[0];
	let properties = GameScene.tileset.tileProperties;
	let acceptable_tiles = [];

	
	// We need to list all the tile IDs that can be walked on. Let's iterate over all of them
	// and see what properties have been entered in Tiled.
	for(let i = GameScene.tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
		if(!properties.hasOwnProperty(i)) {
			// If there is no property indicated at all, it means it's a walkable tile
			acceptable_tiles.push(i+1);
			continue;
		}
		if(!properties[i].collide) acceptable_tiles.push(i+1);
	}
	/**/
	// acceptable_tiles.push(1);
	GameScene.pathfinder = new pathfinder(grid, acceptable_tiles);			
}

GameScene.setupCamera = () => {
	//Create a camera controller using the arraow keys
	let cursors = GameScene.scene.input.keyboard.createCursorKeys();

	GameScene.camera = GameScene.scene.cameras.main;
	
	let controlConfig = {
		camera: GameScene.scene.cameras.main,
		left: cursors.left,
		right: cursors.right,
		up: cursors.up,
		down: cursors.down,
		acceleration: 0.04,
		drag: 0.0009,
		maxSpeed: 0.5
	};

	GameScene.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

	//SET BOUNDS TO THE CAMERA MOVEMENT
	let offset = 200;
	GameScene.scene.cameras.main.setBounds(
		-offset, 
		-offset, 
		GameScene.map.width * GameScene.tile_size + (offset * 2), 
		GameScene.map.height * GameScene.tile_size + (offset * 2));	
	
	
	GameScene.scene.cameras.main.zoom = 1.75;
	GameScene.scene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
		GameScene.scene.cameras.main.zoom -= (deltaY / 100) * 0.1;

		if(GameScene.scene.cameras.main.zoom <= 1.5){
			GameScene.scene.cameras.main.zoom = 1.5
		}	
		if(GameScene.scene.cameras.main.zoom >= 2.5){
			GameScene.scene.cameras.main.zoom = 2.5
		}	
	});	
	
	let width = gameFunctions.config.width / 4;
	let height = gameFunctions.config.height / 4;	
	GameScene.minimap = GameScene.scene.cameras.add(gameFunctions.config.width - width, gameFunctions.config.height - height, width, height).setZoom(0.3).setName('mini');
	GameScene.minimap.setBackgroundColor(0x002244);	
	

	GameScene.minimap.startFollow(GameScene.rectangle);	
	
}


