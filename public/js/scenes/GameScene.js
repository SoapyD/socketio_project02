

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
		this.load.image('phaserguy', '../../img/phaserguy.png');
		this.load.image('base', '../../img/base.png');
		
		this.load.image('bullet', '../../img/bullet.png');	
		this.load.image('marker', '../../img/marker.png');	
		
		
		// this.scene.launch("ArmySetupUIScene");
		this.scene.launch("GameUIScene");
    },


    create: function()
    {
		this.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.input.keyboard.createCursorKeys();		
				
				
		
		// Handles the clicks on the map to make the character move
		this.input.on('pointerup',GameScene.handleClick);


		GameScene.camera = this.cameras.main;
		GameScene.camera.setBounds(0, 0, 20*gameFunctions.tile_size, 20*gameFunctions.tile_size);
		


		GameScene.scene = this.scene.get('GameScene')		

		
		// Display map

		// console.log(scene)
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
		// Initializing the pathfinder
		// GameScene.finder = new EasyStar.js();		
		
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
		
		
		gameFunctions.current_scene = this.scene.get('GameScene');		
		
		
		GameScene.pathfinder = new pathfinder(grid);
		
		
		//ADD IN SOME UNITS
		GameScene.unit_collisions = this.add.group();
		GameScene.units = []		
		GameScene.units.push(new unit(this, "phaserguy", gameFunctions.tile_size * 11, gameFunctions.tile_size * 12,1,1));
		
		GameScene.units.push(new unit(this, "phaserguy", gameFunctions.tile_size * 11, gameFunctions.tile_size * 14,0,0));
		GameScene.units.push(new unit(this, "phaserguy", gameFunctions.tile_size * 14, gameFunctions.tile_size * 14,0,0));		
		
    	text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);							
		
    },

    update: function (time, delta)
    {
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
			
			
			// if(GameScene.left_click === true){
			// 	GameScene.left_click_state = GameScene.advanceClickState(GameScene.left_click_state, 1)	
			// }

			// if(GameScene.left_click_state === 0){
			// 	GameScene.selected_unit.shoot(this, pointer);
			// 	GameScene.selected_unit.unselectHandler();
			// }		
			
			// let angle = Phaser.Math.Angle.BetweenPoints(GameScene.selected_unit.sprite, pointer);
			// console.log(angle);
		}

		// if(GameScene.right_click === true){
		// 	GameScene.units.forEach((unit) => {
		// 		if(unit.path){
		// 			unit.move();		
		// 		}
		// 	})
		// }
		
		GameScene.left_click = false;
		GameScene.right_click = false;		
		
		if(GameScene.bullets){
			GameScene.bullets.forEach((bullet) => {
				bullet.checkRange();
			})
		}
    }
});


GameScene.checkCollision = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
	if (tile){
    	return tile.properties.collide == true;		
	}
	else{
		return
	}
};


GameScene.mode = '';
GameScene.current_player = 0;
GameScene.bullets = [];
GameScene.selected_unit;
GameScene.left_click = false;
GameScene.left_click_state = 0;
GameScene.right_click = false;
GameScene.right_click_state = 0;
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


