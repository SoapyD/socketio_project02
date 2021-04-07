

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
		
		/*
        let x_origin = this.cameras.main.centerX	
        let y_origin = this.cameras.main.centerY	

        this.add.grid(
            x_origin, y_origin, 
            gameFunctions.config.width,// + (gameFunctions.cardSize * 2), 
            gameFunctions.config.height,// + (gameFunctions.cardSize * 2), 
            50, 
            50, 
            0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle(0x000000);
            
            
        let startOption = this.add.text((gameFunctions.config.width / 2) - 300, 100, "Game Scene", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);

		
		
        

        // this.cameras.main.zoom = 2;
        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            gameFunctions.game.cameras.main.zoom -= (deltaY / 100) * 0.1;

            if(gameFunctions.game.cameras.main.zoom <= 0.8){
                gameFunctions.game.cameras.main.zoom = 0.8
            }	
            if(gameFunctions.game.cameras.main.zoom >= 2){
                gameFunctions.game.cameras.main.zoom = 2
            }	
        });		

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.0005,
            maxSpeed: 0.4
        };

        controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        //SET BOUNDS TO THE CAMERA MOVEMENT
        // this.cameras.main.setBounds(
        //     -gameFunctions.config.cardSize, 
        //     -gameFunctions.config.cardSize, 
        //     config.width + (gameFunctions.config.cardSize * 2), 
        //     config.height + (gameFunctions.config.cardSize * 2));	
		
        this.cameras.main.setBounds(
            -200, 
            -200, 
            gameFunctions.config.width + 400, 
            gameFunctions.config.height + 400);			
		*/
		
		// Handles the clicks on the map to make the character move

		this.input.on('pointerup',GameScene.handleClick);



		
		GameScene.camera = this.cameras.main;
		GameScene.camera.setBounds(0, 0, 20*32, 20*32);

		var phaserGuy = this.add.image(32,32,'phaserguy');
		phaserGuy.setDepth(1);
		phaserGuy.setOrigin(0,0.5);
		GameScene.camera.startFollow(phaserGuy);
		GameScene.player = phaserGuy;

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

		// text.setText([
		// 	'x: ' + pointer.worldX,
		// 	'y: ' + pointer.worldY,
		// 	'isDown: ' + pointer.isDown,
		// 	'rightButtonDown: ' + pointer.rightButtonDown()
		// ]);		
		
		// GameScene.scene.input.on('pointerup',function(pointer) {

		// 	if(pointer.leftButtonReleased()){
		// 		console.log("left")
		// 	}	
		// 	if(pointer.rightButtonReleased()){
		// 		console.log("right")
		// 	}			
		// })
    }
});


GameScene.checkCollision = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
    return tile.properties.collide == true;
};

GameScene.getTileID = function(x,y){
    var tile = GameScene.map.getTileAt(x, y);
    return tile.index;
};

GameScene.handleClick = function(pointer){
	
	
	// if (pointer.leftButtonReleased())
	// {	
	var x = GameScene.camera.scrollX + pointer.x;
	var y = GameScene.camera.scrollY + pointer.y;
	var toX = Math.floor(x/32);
	var toY = Math.floor(y/32);
	var fromX = Math.floor(GameScene.player.x/32);
	var fromY = Math.floor(GameScene.player.y/32);
	// console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

	GameScene.finder.findPath(fromX, fromY, toX, toY, function( path ) {
	if (path === null) {
	console.warn("Path was not found.");
	} else {
	// console.log(path);
			
			gameFunctions.graphics.clear()
			gameFunctions.graphics.lineStyle(10, 0x2ECC40);
			gameFunctions.graphics.beginPath();
			// let last_pos = {}
			path.forEach((pos, i) => {
				if (i !== 0){
					// new Phaser.Line(last_pos.x * 32, last_pos.y * 32, pos.x * 32, pos.y * 32);
					gameFunctions.graphics.lineTo(pos.x * 32 + 16, pos.y * 32 + 16);
				}
				else{
					gameFunctions.graphics.moveTo(pos.x * 32 + 16, pos.y * 32 + 16);
				}
				// last_pos = pos
			})
			
			gameFunctions.graphics.strokePath();
			GameScene.player.path = path
	}
	});
	GameScene.finder.calculate(); // don't forget, otherwise nothing happens		
	// }
	// console.log(pointer)
	if (pointer.rightButtonReleased())
	{
		GameScene.moveCharacter(GameScene.player.path);
	}	
	
};

GameScene.moveCharacter = function(path){
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for(var i = 0; i < path.length-1; i++){
        var ex = path[i+1].x;
        var ey = path[i+1].y;
        tweens.push({
            targets: GameScene.player,
            x: {value: ex*GameScene.map.tileWidth, duration: 200},
            y: {value: ey*GameScene.map.tileHeight, duration: 200}
        });
    }

	GameScene.scene.tweens.timeline({
        tweens: tweens
    });
};
