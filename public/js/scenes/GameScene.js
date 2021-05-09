

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
		
		
		GameScene.online = true;		
		GameScene.mode = '';
		GameScene.current_player = 0;
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
		
		
		GameScene.units = []

		let max_sides = 6;
		GameScene.unit_collisions = []
		for(let i=0; i<max_sides; i++){
			GameScene.unit_collisions.push(GameScene.scene.add.group());
		}

	
		this.load.image('tileset', './img/gridtiles.png');
		// this.load.tilemapTiledJSON('map', '../../img/map.json');
		this.load.tilemapTiledJSON('map', '../../img/map2.json');
		// this.load.image('phaserguy', '../../img/phaserguy.png');
		
		this.load.image('unit', '../../img/unit.png');
		this.load.image('tank', '../../img/tank.png');
		this.load.image('dread', '../../img/dread.png');		
		this.load.image('base', '../../img/base.png');
		
		this.load.image('bullet', '../../img/bullet.png');	
		this.load.image('marker', '../../img/marker.png');			
		
		
    },


    create: function()
    {
		this.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.input.keyboard.createCursorKeys();		
				
		// Handles the clicks on the map to make the character move
		this.input.on('pointerup',GameScene.handleClick);
		
		GameScene.setupMap();
		GameScene.setupCamera();
		// GameScene.seeds();
		GameScene.seeds2();
		
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
				switch(GameScene.mode) {
					case "move":
						GameScene.selected_unit.findPath(GameScene, worldPoint);
					break;
					case "shoot":
						GameScene.selected_unit.findTarget(this, worldPoint);
					break;
					case "fight":
						GameScene.selected_unit.findPath(GameScene, worldPoint);
					break;					
					default:
					// code block
				}		
			}
			
			if(GameScene.right_click === true){
				switch(GameScene.mode) {
					// case "move":
					// 	GameScene.selected_unit.findPath(GameScene, pointer);
					// break;
					case "shoot":
						GameScene.selected_unit.removeTarget();
					break;
					// case "fight":
					// 	GameScene.selected_unit.findPath(GameScene, pointer);
					// break;					
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
		
		if(GameScene.units){
			GameScene.units.forEach((unit) => {
				if(unit.player === GameScene.current_player){

					if(unit.is_moving === true){
						unit.draw_health()
					}
				}
			})
		}
    }
});


GameScene.advancePlayer = () => {
	let max_player = 2;
	GameScene.current_player += 1
	if(GameScene.current_player >= max_player){
		GameScene.current_player = 0
	}
	
	GameScene.units.forEach((unit) => {
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

GameScene.handleClick = function(pointer){

	if (pointer.leftButtonReleased())
	{	
		GameScene.left_click = true;
	}		
	if (pointer.rightButtonReleased())
	{	
		GameScene.right_click = true;
	}			
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


	let tileset = GameScene.map.tilesets[0];
	let properties = tileset.tileProperties;
	let acceptable_tiles = [];

	/*
	// We need to list all the tile IDs that can be walked on. Let's iterate over all of them
	// and see what properties have been entered in Tiled.
	for(let i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
		if(!properties.hasOwnProperty(i)) {
			// If there is no property indicated at all, it means it's a walkable tile
			acceptable_tiles.push(i+1);
			continue;
		}
		if(!properties[i].collide) acceptable_tiles.push(i+1);
	}
	*/
	acceptable_tiles.push(1);
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
	let offset = 100;
	GameScene.scene.cameras.main.setBounds(
		-offset, 
		-offset, 
		GameScene.map.width * GameScene.tile_size + (offset * 2), 
		GameScene.map.height * GameScene.tile_size + (offset * 2));	
	
	
	GameScene.scene.cameras.main.zoom = 1.5;
	GameScene.scene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
		GameScene.scene.cameras.main.zoom -= (deltaY / 100) * 0.1;

		if(GameScene.scene.cameras.main.zoom <= 0.8){
			GameScene.scene.cameras.main.zoom = 0.8
		}	
		if(GameScene.scene.cameras.main.zoom >= 2){
			GameScene.scene.cameras.main.zoom = 2
		}	
	});	
	
	let width = gameFunctions.config.width / 4;
	let height = gameFunctions.config.height / 4;	
	GameScene.minimap = GameScene.scene.cameras.add(gameFunctions.config.width - width, gameFunctions.config.height - height, width, height).setZoom(0.3).setName('mini');
	GameScene.minimap.setBackgroundColor(0x002244);	
	

	GameScene.minimap.startFollow(GameScene.rectangle);	
	
}


GameScene.seeds = () => {

	let unit_info;
	let projectile_weapon_info;
	let combat_weapon_info;	
	let armour_info;	
	
	let core_data = {
		scene: GameScene.scene, 
		x: GameScene.tile_size * 3, 
		y: GameScene.tile_size * 2, 
		side: 0, 
		player: 0,
		squad: 0,
		angle: 90		
	}
	
	let options;
	
	unit_info =GameScene.unit_types.find((e) => e.name==="marine")	
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")			
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	


	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 5
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 4
	options.y = GameScene.tile_size * 3
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	core_data.squad = 1;
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 14
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 16
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 15
	options.y = GameScene.tile_size * 3
	
	GameScene.units.push(new unit(options));	
	
	
	core_data.squad = 2;	
	unit_info =GameScene.unit_types.find((e) => e.name==="tank")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 12
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	

	core_data.squad = 3;	
	unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 8
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));		
	
	
	//PLAYER 1
	core_data.player = 1;
	core_data.side = 1;
	core_data.angle = -90;	
	
	unit_info =GameScene.unit_types.find((e) => e.name==="marine")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 3
	options.y = GameScene.tile_size * 17
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 5
	options.y = GameScene.tile_size * 17
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 4
	options.y = GameScene.tile_size * 16
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	core_data.squad = 1;
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 14
	options.y = GameScene.tile_size * 17
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 16
	options.y = GameScene.tile_size * 17
	
	GameScene.units.push(new unit(options));
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 15
	options.y = GameScene.tile_size * 16
	
	GameScene.units.push(new unit(options));	
	
	
	core_data.squad = 2;	
	unit_info =GameScene.unit_types.find((e) => e.name==="tank")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 12
	options.y = GameScene.tile_size * 17
	
	GameScene.units.push(new unit(options));
	

	core_data.squad = 3;	
	unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 8
	options.y = GameScene.tile_size * 18
	
	GameScene.units.push(new unit(options));	
	
}

GameScene.seeds2 = () => {

	let unit_info;
	let projectile_weapon_info;
	let combat_weapon_info;	
	let armour_info;
	
	let core_data = {
		scene: GameScene.scene, 
		x: GameScene.tile_size * 3, 
		y: GameScene.tile_size * 2, 
		side: 0, 
		player: 0,
		squad: 0,
		angle: 90		
	}
	
	let options;
	
	options = {}
	unit_info = GameScene.unit_types.find((e) => e.name==="marine")	
	gameFunctions.copyObject(options, unit_info)
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	gameFunctions.copyObject(options, projectile_weapon_info)	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	gameFunctions.copyObject(options, combat_weapon_info)	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")	
	gameFunctions.copyObject(options, armour_info)		
	
	gameFunctions.copyObject(options, core_data)

	GameScene.units.push(new unit(options));
	
	
	options = {}
	core_data.player = 1;
	core_data.side = 1;	
	core_data.x =GameScene.tile_size * 3;
	core_data.y =GameScene.tile_size * 5;	
	unit_info = GameScene.unit_types.find((e) => e.name==="marine")	
	gameFunctions.copyObject(options, unit_info)
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	gameFunctions.copyObject(options, projectile_weapon_info)	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	gameFunctions.copyObject(options, combat_weapon_info)	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")	
	gameFunctions.copyObject(options, armour_info)		
	
	gameFunctions.copyObject(options, core_data)

	GameScene.units.push(new unit(options));	
	
	
	
	core_data.squad = 3;	
	unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 7
	options.y = GameScene.tile_size * 5
	
	GameScene.units.push(new unit(options));		
	
}


