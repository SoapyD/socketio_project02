

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });			
    },

    preload: function()
    {
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
		
		
		// this.scene.launch("ArmySetupUIScene");
		this.scene.launch("GameUIScene");
		
		
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
		GameScene.online = false;
		
		GameScene.rectangle = this.add.rectangle(0, 0, 10, 10, 0x6666ff);
		GameScene.rectangle.depth = 100;
		GameScene.rectangle.alpha = 0;
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
		GameScene.seeds();			
		
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
		if(GameScene.bullets){
			GameScene.bullets.forEach((bullet) => {
				bullet.checkRange();
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

	// // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
	// // and see what properties have been entered in Tiled.
	for(let i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
		if(!properties.hasOwnProperty(i)) {
			// If there is no property indicated at all, it means it's a walkable tile
			acceptable_tiles.push(i+1);
			continue;
		}
		if(!properties[i].collide) acceptable_tiles.push(i+1);
		// if(properties[i].cost) GameScene.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
	}

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
		gameFunctions.game.cameras.main.zoom -= (deltaY / 100) * 0.1;

		if(gameFunctions.game.cameras.main.zoom <= 0.8){
			gameFunctions.game.cameras.main.zoom = 0.8
		}	
		if(gameFunctions.game.cameras.main.zoom >= 2){
			gameFunctions.game.cameras.main.zoom = 2
		}	
	});	
	
	let width = gameFunctions.config.width / 4;
	let height = gameFunctions.config.height / 4;	
	GameScene.minimap = GameScene.scene.cameras.add(gameFunctions.config.width - width, gameFunctions.config.height - height, width, height).setZoom(0.3).setName('mini');
	GameScene.minimap.setBackgroundColor(0x002244);	
	

	GameScene.minimap.startFollow(GameScene.rectangle);	
	
}


GameScene.seeds = () => {

		//ADD IN SOME UNITS
		GameScene.unit_collisions = GameScene.scene.add.group();
		GameScene.units = []
		
		let options = {
			scene: GameScene.scene, 
			spritesheet: "unit",
			sprite_offset: 0.5,
			size: 0, 
			x: GameScene.tile_size * 3, 
			y: GameScene.tile_size * 2, 
			side: 0, 
			player: 0,
			squad: 0,
			cohesion: 75,
			movement: 10,
			angle: 90
		}
		
		
		//PLAYER 0
		GameScene.units.push(new unit(options));
		
		options.x = GameScene.tile_size * 5
		options.y = GameScene.tile_size * 2				
		GameScene.units.push(new unit(options));

		options.x = GameScene.tile_size * 4
		options.y = GameScene.tile_size * 3				
		GameScene.units.push(new unit(options));	
	
	
		options.squad = 1
		options.x = GameScene.tile_size * 14
		options.y = GameScene.tile_size * 2		
		GameScene.units.push(new unit(options));
		
		options.x = GameScene.tile_size * 16
		options.y = GameScene.tile_size * 2				
		GameScene.units.push(new unit(options));

		options.x = GameScene.tile_size * 15
		options.y = GameScene.tile_size * 3				
		GameScene.units.push(new unit(options));		
	
	
		options.spritesheet = "tank";
		options.size = 1;
		options.squad = 2;
		options.cohesion = 0;
		options.movement = 20;
		options.x = GameScene.tile_size * 12
		options.y = GameScene.tile_size * 2	
		GameScene.units.push(new unit(options));
		
		
		options.spritesheet = "dread";
		options.sprite_offset = 0;
		options.size = 1;
		options.squad = 3;
		options.x = GameScene.tile_size * 8
		options.y = GameScene.tile_size * 2			
		GameScene.units.push(new unit(options));		
	
	
	
	
		//PLAYER 1
		options.spritesheet = "unit";	
		options.sprite_offset = 0.5;
		options.cohesion = 75;
		options.size = 0;
		options.player = 1
		options.angle = -90
		options.squad = 0
		options.x = GameScene.tile_size * 3
		options.y = GameScene.tile_size * 17
		GameScene.units.push(new unit(options));
		
		options.x = GameScene.tile_size * 5
		options.y = GameScene.tile_size * 17
		GameScene.units.push(new unit(options));

		options.x = GameScene.tile_size * 4
		options.y = GameScene.tile_size * 16
		GameScene.units.push(new unit(options));	
	
	
		options.player = 1	
		options.squad = 1
		options.x = GameScene.tile_size * 14
		options.y = GameScene.tile_size * 17	
		GameScene.units.push(new unit(options));
		
		options.x = GameScene.tile_size * 16
		options.y = GameScene.tile_size * 17
		GameScene.units.push(new unit(options));

		options.x = GameScene.tile_size * 15
		options.y = GameScene.tile_size * 16
		GameScene.units.push(new unit(options));
	
}



