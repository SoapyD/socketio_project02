

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
		this.load.tilemapTiledJSON('map', '../../img/map.json');
		this.load.image('phaserguy', '../../img/phaserguy.png');		
		
		
		this.scene.launch("ArmySetupUIScene");
    },


    create: function()
    {
		this.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.input.keyboard.createCursorKeys();		
		

		
		// Handles the clicks on the map to make the character move

		this.input.on('pointerup',GameScene.handleClick);


		GameScene.camera = this.cameras.main;
		GameScene.camera.setBounds(0, 0, 20*32, 20*32);

		
		GameScene.selected = 0
		this.input.keyboard.on('keydown-SPACE', function (event) {
			if (GameScene.players){
				GameScene.selected++;
				if (GameScene.selected >= GameScene.players.length){
					GameScene.selected = 0
				}
			}
		});		
		

		
		GameScene.players = []		
		var phaserGuy;
		
		phaserGuy = this.add.image(32,32,'phaserguy');
		phaserGuy.setDepth(1);
		phaserGuy.setOrigin(0,0.5);
		// GameScene.camera.startFollow(phaserGuy);		
		GameScene.players.push(phaserGuy);

		phaserGuy = this.add.image(32,32,'phaserguy');
		phaserGuy.setDepth(1);
		phaserGuy.setOrigin(0,0.5);		
		GameScene.players.push(phaserGuy);

		
		
		
		// Display map
		GameScene.scene = this.scene.get('GameScene')
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
		GameScene.finder = new EasyStar.js();		
		
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
		GameScene.finder.setGrid(grid);

		var tileset = GameScene.map.tilesets[0];
		var properties = tileset.tileProperties;
		var acceptableTiles = [];

		// We need to list all the tile IDs that can be walked on. Let's iterate over all of them
		// and see what properties have been entered in Tiled.
		for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
			if(!properties.hasOwnProperty(i)) {
				// If there is no property indicated at all, it means it's a walkable tile
				acceptableTiles.push(i+1);
				continue;
			}
			if(!properties[i].collide) acceptableTiles.push(i+1);
			if(properties[i].cost) GameScene.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
		}
		GameScene.finder.setAcceptableTiles(acceptableTiles);		
		
		
		gameFunctions.current_scene = this.scene.get('GameScene');		
		
		gameFunctions.graphics = this.add.graphics();

		
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

		
		text.setText([
			'selected: ' + GameScene.selected
		]);				
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

GameScene.getTileID = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
    return tile.index;
};

GameScene.handleClick = function(pointer){
	
	if (pointer.leftButtonReleased())
	{	
		let player = GameScene.players[GameScene.selected]
		var x = GameScene.camera.scrollX + pointer.x;
		var y = GameScene.camera.scrollY + pointer.y;
		var toX = Math.floor(x/32);
		var toY = Math.floor(y/32);


		var fromX = Math.floor(player.x/32);
		var fromY = Math.floor(player.y/32);
		// console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

		GameScene.finder.findPath(fromX, fromY, toX, toY, function( path ) {
		if (path === null) {
		console.warn("Path was not found.");
		} else {		
			player.path = path.slice(0,9)

			gameFunctions.graphics.clear()
			gameFunctions.graphics.lineStyle(10, 0x2ECC40);	
			gameFunctions.graphics.beginPath();
			GameScene.players.forEach((player) => {
				//IF THERE'S A PATH, DRAW IT
				if(player.path){
					player.path.forEach((pos, i) => {
						if (i !== 0){
							gameFunctions.graphics.lineTo(pos.x * 32 + 16, pos.y * 32 + 16);
						}
						else{
							gameFunctions.graphics.moveTo(pos.x * 32 + 16, pos.y * 32 + 16);
						}
					})			
				}

			})
			gameFunctions.graphics.strokePath();					
		}
		});
		GameScene.finder.calculate(); // don't forget, otherwise nothing happens		
	}
	
	
	if (pointer.rightButtonReleased())
	{
		GameScene.players.forEach((player) =>{
			if(player.path){
				GameScene.moveCharacter(player, player.path);							
			}
		})
	}	
	
};

GameScene.moveCharacter = function(player, path){
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for(var i = 0; i < path.length-1; i++){
        var ex = path[i+1].x;
        var ey = path[i+1].y;
        tweens.push({
            targets: player,
            x: {value: ex*GameScene.map.tileWidth, duration: 200},
            y: {value: ey*GameScene.map.tileHeight, duration: 200},
			onComplete: function ()
			{
				// 
			}			
        });
    }

	GameScene.scene.tweens.timeline({
        tweens: tweens
    });
};
