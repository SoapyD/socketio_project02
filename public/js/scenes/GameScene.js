

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
		
		GameScene.text = this.add.text(0, 0, "", { fill: '#00ff00' }).setDepth(20);
		
		
    },


    create: function()
    {

		this.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.input.keyboard.createCursorKeys();		
				
				
		
		// Handles the clicks on the map to make the character move
		this.input.on('pointerup',GameScene.handleClick);


		GameScene.camera = this.cameras.main;
		GameScene.camera.setBounds(0, 0, 20*GameScene.tile_size, 20*GameScene.tile_size);
		


		// Display map
		GameScene.map = GameScene.scene.make.tilemap({ key: 'map'});
		// The first parameter is the name of the tileset in Tiled and the second parameter is the key
		// of the tileset image used when loading the file in preload.
		var tiles = GameScene.map.addTilesetImage('tiles', 'tileset');
		GameScene.map.createStaticLayer(0, tiles, 0,0);		
		
		// Marker that will follow the mouse
		GameScene.marker = this.add.graphics();
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
		
		
		// GameScene.finder.setGrid(grid);

		// var tileset = GameScene.map.tilesets[0];
		// var properties = tileset.tileProperties;
		// var acceptableTiles = [];

		// // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
		// // and see what properties have been entered in Tiled.
		// for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
		// 	if(!properties.hasOwnProperty(i)) {
		// 		// If there is no property indicated at all, it means it's a walkable tile
		// 		acceptableTiles.push(i+1);
		// 		continue;
		// 	}
		// 	if(!properties[i].collide) acceptableTiles.push(i+1);
		// 	if(properties[i].cost) GameScene.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
		// }
		// GameScene.finder.setAcceptableTiles(acceptableTiles);		
		
		GameScene.pathfinder = new pathfinder(grid);		
	
		
	
		
		// GameScene.text_array = []
		// GameScene.grid.forEach((row, y) => {
		// 	GameScene.text_array.push([]);
		// 	row.forEach((column, x) => {
		// 		let text = this.add.text(32 * x, 32 * y, GameScene.grid[y][x], { fill: '#00ff00' }).setDepth(20);
		// 		GameScene.text_array[y].push(text)
		// 	})
		// })
    	// text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);
		
		GameScene.seeds();		
		
    },

    update: function (time, delta)
    {
		
		GameScene.text.setText("Current Player: "+GameScene.current_player)
		
        // controls.update(delta);
		var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

		// Rounds down to nearest tile
		var pointerTileX = GameScene.map.worldToTileX(worldPoint.x);
		var pointerTileY = GameScene.map.worldToTileY(worldPoint.y);
		GameScene.marker.x = GameScene.map.tileToWorldX(pointerTileX);
		GameScene.marker.y = GameScene.map.tileToWorldY(pointerTileY);
		GameScene.marker.setVisible(!GameScene.checkCollision(pointerTileX,pointerTileY));  
		
		var pointer = this.input.activePointer;
	
		
		
		if(GameScene.selected_unit){
	
			
			if(GameScene.left_click === true){
				switch(GameScene.mode) {
					case "move":
						GameScene.selected_unit.findPath(GameScene, pointer);
					break;
					case "shoot":
						GameScene.selected_unit.findTarget(this, pointer);
					break;
					case "fight":
						GameScene.selected_unit.findPath(GameScene, pointer);
					break;					
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
	
	
		
		//PLAYER 1
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
	
	
	
	
	
	

		// options.spritesheet = "tank";
		// options.size = 1;
		// options.cohesion = 0;
		// options.movement = 20;
		// options.squad = 1;
		// options.x = GameScene.tile_size * 14
		// options.y = GameScene.tile_size * 14		
		
		// GameScene.units.push(new unit(options));			
		
		
		// options.spritesheet = "dread";
		// options.sprite_offset = 0;
		// options.size = 1;
		// options.cohesion = 0;
		// options.movement = 20;
		// options.squad = 1;
		// options.x = GameScene.tile_size * 14
		// options.y = GameScene.tile_size * 14		
		
		// GameScene.units.push(new unit(options));				
	
}



