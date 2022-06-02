
const game_setup = class {
	constructor(options) {	

        this.scene = options.scene;
        this.scene_container = options.scene_container


		// ██████   █████  ██████   █████  ███    ███ ███████ 
		// ██   ██ ██   ██ ██   ██ ██   ██ ████  ████ ██      
		// ██████  ███████ ██████  ███████ ██ ████ ██ ███████ 
		// ██      ██   ██ ██   ██ ██   ██ ██  ██  ██      ██ 
		// ██      ██   ██ ██   ██ ██   ██ ██      ██ ███████ 
														   
		
		switch(instance_type){
			case "DEV":
				this.scene_container.master_volume = 0;
				this.scene_container.online = false;
				gameFunctions.params.player_side = 0;
				break;
			case "DEV-ONLINE":
				// this.scene_container.master_volume = 0;
				this.scene_container.master_volume = 0.05;
				this.scene_container.online = true;
				break;				
			default:
				this.scene_container.master_volume = 0.2;
				this.scene_container.online = true;
				break;
		}
		
		this.scene_container.master_sfx_volume = 0.3;
		
		this.scene_container.game_state = 0;
		this.scene_container.offline_force = 0;

		this.scene_container.active_actions = 0;
		this.scene_container.bullets = [];
		this.scene_container.barriers = [];
		this.scene_container.selected_unit = [];
		this.scene_container.left_click = false;
		this.scene_container.left_click_state = 0;
		this.scene_container.right_click = false;
		this.scene_container.right_click_state = 0;
		

		this.scene_container.rectangle = this.scene.add.rectangle(0, 0, 10, 10, 0x6666ff);
		this.scene_container.rectangle.depth = 100;
		this.scene_container.rectangle.alpha = 0;
		
		this.scene_container.startX = 0
		this.scene_container.startY = 0
		this.scene_container.endX = 0
		this.scene_container.endY = 0

		this.hovered_unit_id = -1;
		
		this.scene_container.multi_select_pause = false;	


		let max_sides = 6;
		this.scene_container.unit_collisions = []
		for(let i=0; i<max_sides; i++){
			this.scene_container.unit_collisions.push(this.scene.add.group());
		}

		// ██       ██████   █████  ██████         █████  ███████ ███████ ███████ ████████ ███████ 
		// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██      ██      ██         ██    ██      
		// ██      ██    ██ ███████ ██   ██ █████ ███████ ███████ ███████ █████      ██    ███████ 
		// ██      ██    ██ ██   ██ ██   ██       ██   ██      ██      ██ ██         ██         ██ 
		// ███████  ██████  ██   ██ ██████        ██   ██ ███████ ███████ ███████    ██    ███████ 
																								

	
		this.scene.load.image('tileset', './img/maps/gridtiles.png');
		// this.scene.load.tilemapTiledJSON('map', '../../img/maps/map.json');
		this.scene.load.tilemapTiledJSON('map', '../../img/maps/map2.json');
		
		//UNIT SPRITES
		this.scene.load.image('general', '../../img/units/general.png');
		this.scene.load.image('squad_leader', '../../img/units/squad_leader.png');
		this.scene.load.image('heavy', '../../img/units/heavy.png');	
		this.scene.load.image('special', '../../img/units/special.png');			
		this.scene.load.image('unit', '../../img/units/unit.png');
		this.scene.load.image('tank', '../../img/units/tank.png');
		this.scene.load.image('dread', '../../img/units/dread.png');		


		this.scene.load.image('white', '../../img/white_texture.jpg');
		
		
		//PARTICLE SPRITES
		this.scene.load.image('bullet', '../../img/particles/bullet.png');	
		this.scene.load.image('smoke', '../../img/particles/smoke.png');
		this.scene.load.image('barrier', '../../img/particles/barrier.png');	
		this.scene.load.image('marker', '../../img/particles/marker.png');			
        this.scene.load.spritesheet('explosion', '../../img/particles/explosion7.png', { frameWidth: 256, frameHeight: 256 }); //WEAPON BLAST
        this.scene.load.spritesheet('punch', '../../img/particles/explosion23.png', { frameWidth: 256, frameHeight: 256 });	//CLOSE COMBAT BLAST
        this.scene.load.spritesheet('special_blast', '../../img/particles/explosion65.png', { frameWidth: 256, frameHeight: 256 });	//SPECIAL WEAPON BLAST
        this.scene.load.spritesheet('heavy_blast', '../../img/particles/explosion102.png', { frameWidth: 256, frameHeight: 256 });	//HEAVY WEAPON BLAST				
		
        this.scene.load.spritesheet('symbols', '../../img/symbols.png', { frameWidth: 190, frameHeight: 200 }); 
		
		
		this.scene.load.setPath('../../sfx');		
		this.scene.load.audio('select', [ 'select.mp3' ])
		this.scene.load.audio('clear', [ 'clear.mp3' ])
		this.scene.load.audio('button', [ 'button.mp3' ])
		
		this.scene.load.audio('action', [ 'action.mp3' ])	
		this.scene.load.audio('end_path', [ 'end_path.mp3' ])	
		this.scene.load.audio('end_turn', [ 'end_turn.mp3' ])	
		
		this.scene.load.audio('movement', [ 'movement.mp3' ])	
		this.scene.load.audio('sword', [ 'sword.mp3' ])
		this.scene.load.audio('shot', [ 'shot.mp3' ])
		this.scene.load.audio('blast', [ 'blast.mp3' ])	

		this.scene.load.audio('blunt', [ 'blunt.mp3' ])	
		this.scene.load.audio('poison', [ 'poison.mp3' ])	
		this.scene.load.audio('shield', [ 'shield.mp3' ])							
		
		this.scene.load.audio('death_man', [ 'death_man.mp3' ])
		this.scene.load.audio('death_machine', [ 'death_machine.mp3' ])
		
		
		this.scene_container.music_playing = false;
		
		this.scene_container.music_track = 0;
		this.scene.load.setPath('../../music');
		this.scene.load.audio('song1', [ 'song1.mp3' ])
		this.scene.load.audio('song2', [ 'song2.mp3' ])
		this.scene.load.audio('song3', [ 'song3.mp3' ])

		

    }

    loadSound = () => {
		// ███    ███ ██    ██ ███████ ██  ██████          ██          ███████ ███████ ██   ██ 
		// ████  ████ ██    ██ ██      ██ ██               ██          ██      ██       ██ ██  
		// ██ ████ ██ ██    ██ ███████ ██ ██      █████ ████████ █████ ███████ █████     ███   
		// ██  ██  ██ ██    ██      ██ ██ ██            ██  ██              ██ ██       ██ ██  
		// ██      ██  ██████  ███████ ██  ██████       ██████         ███████ ██      ██   ██ 
																							
		
		//SFX can only be set in the creation method once theyve been pre-loaded
		this.scene_container.sfx = {}		
		this.scene_container.sfx.select = this.scene.sound.add('select', {volume: 0.1 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.clear = this.scene.sound.add('clear', {volume: 1 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.button = this.scene.sound.add('button', {volume: 1 * this.scene_container.master_sfx_volume});
		
		this.scene_container.sfx.action = this.scene.sound.add('action', {volume: 0.1 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.end_path = this.scene.sound.add('end_path', {volume: 0.04 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.end_turn = this.scene.sound.add('end_turn', {volume: 0.5 * this.scene_container.master_sfx_volume});
		
		this.scene_container.sfx.movement = this.scene.sound.add('movement', {volume: 0.1 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.sword = this.scene.sound.add('sword', {volume: 0.5 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.blast = this.scene.sound.add('blast', {volume: 0.2 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.shot = this.scene.sound.add('shot', {volume: 0.2 * this.scene_container.master_sfx_volume});
		
		this.scene_container.sfx.shield = this.scene.sound.add('shield', {volume: 0.05 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.poison = this.scene.sound.add('poison', {volume: 0.2 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.blunt = this.scene.sound.add('blunt', {volume: 0.2 * this.scene_container.master_sfx_volume});				

		this.scene_container.sfx.death_man = this.scene.sound.add('death_man', {volume: 0.3 * this.scene_container.master_sfx_volume});
		this.scene_container.sfx.death_machine = this.scene.sound.add('death_machine', {volume: 0.3 * this.scene_container.master_sfx_volume});
		
		
		this.scene_container.music = []
		this.scene_container.music.push(this.scene.sound.add('song1', {volume: this.scene_container.master_volume}));
		this.scene_container.music.push(this.scene.sound.add('song2', {volume: this.scene_container.master_volume}));
		this.scene_container.music.push(this.scene.sound.add('song3', {volume: this.scene_container.master_volume}));

		
		this.scene_container.music.forEach((track) => {
			track.on('complete', () => {

				this.scene_container.music_track += 1
				if(this.scene_container.music_track >= this.scene_container.music.length){
					this.scene_container.music_track = 0
				}
				this.scene_container.music_playing = false;
			});				
		})
    }

	// ███████  ██████  ██    ██ ███    ██ ██████        ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  ███████ 
	// ██      ██    ██ ██    ██ ████   ██ ██   ██       ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ ██      
	// ███████ ██    ██ ██    ██ ██ ██  ██ ██   ██ █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  ███████ 
	//      ██ ██    ██ ██    ██ ██  ██ ██ ██   ██       ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██      ██ 
	// ███████  ██████   ██████  ██   ████ ██████        ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ ███████ 

	sfxHandler = (sfx) => {
		
		if (!this.scene_container.scene.sound.locked)
		{
			// already unlocked so play
			this.scene_container.sfx[sfx].play();
		}
		else
		{
			// wait for 'unlocked' to fire and then play
			this.scene_container.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				this.scene_container.sfx[sfx].play();
			})
		}
	}

	musicHandler = () => {
		
		if(this.scene_container.music_playing === false){
					
			if (!this.scene_container.scene.sound.locked)
			{
				// already unlocked so play
				this.scene_container.music[this.scene_container.music_track].play();
			}
			else
			{
				// wait for 'unlocked' to fire and then play
				this.scene_container.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
					this.scene_container.music[this.scene_container.music_track].play();
				})
			}				
			
			this.scene_container.music_playing = true;
		}
	}

    setupTable = () => {

		// ███████ ███████ ████████ ██    ██ ██████        ████████  █████  ██████  ██      ███████ 
		// ██      ██         ██    ██    ██ ██   ██          ██    ██   ██ ██   ██ ██      ██      
		// ███████ █████      ██    ██    ██ ██████  █████    ██    ███████ ██████  ██      █████   
		// 	    ██ ██         ██    ██    ██ ██               ██    ██   ██ ██   ██ ██      ██      
		// ███████ ███████    ██     ██████  ██               ██    ██   ██ ██████  ███████ ███████ 
																								 
		
		this.scene.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.scene.input.keyboard.createCursorKeys();		
				
		// Handles the clicks on the map to make the character move
		this.scene.input.on('pointerup',this.clickHandler);
		
		this.setupMap();
		this.setupCamera();
	        
    }

    //  #####  ####### ####### #     # ######        #     #    #    ######  
    // #     # #          #    #     # #     #       ##   ##   # #   #     # 
    // #       #          #    #     # #     #       # # # #  #   #  #     # 
    //  #####  #####      #    #     # ######  ##### #  #  # #     # ######  
    //       # #          #    #     # #             #     # ####### #       
    // #     # #          #    #     # #             #     # #     # #       
    //  #####  #######    #     #####  #             #     # #     # #       

    setupMap = () => {
        // Display map
        this.scene_container.map = this.scene.make.tilemap({ key: 'map'});
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = this.scene_container.map.addTilesetImage('tiles', 'tileset');
        this.scene_container.map.createStaticLayer(0, tiles, 0,0);		
    
        // Marker that will follow the mouse
        this.scene_container.marker = this.scene.add.graphics();
        this.scene_container.marker.lineStyle(3, 0xffffff, 1);
        this.scene_container.marker.strokeRect(0, 0, this.scene_container.map.tileWidth, this.scene_container.map.tileHeight);
    
        // ### Pathfinding stuff ###
        // We create the 2D array representing all the tiles of our map
        var grid = [];
        for(var y = 0; y < this.scene_container.map.height; y++){
            var col = [];
            for(var x = 0; x < this.scene_container.map.width; x++){
                // In each cell we store the ID of the tile, which corresponds
                // to its index in the tileset of the map ("ID" field in Tiled)
                col.push(this.getTileID(x,y));
            }
            grid.push(col);
        }
        this.scene_container.grid = grid;
    
    
        this.scene_container.tileset = this.scene_container.map.tilesets[0];
        let properties = this.scene_container.tileset.tileProperties;
        let acceptable_tiles = [];
    
        
        // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
        // and see what properties have been entered in Tiled.
        for(let i = this.scene_container.tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
            if(!properties.hasOwnProperty(i)) {
                // If there is no property indicated at all, it means it's a walkable tile
                acceptable_tiles.push(i+1);
                continue;
            }
            if(!properties[i].collide) acceptable_tiles.push(i+1);
        }
    
        this.scene_container.acceptable_tiles = acceptable_tiles;
    
        // acceptable_tiles.push(1);
		this.scene_container.pathfinder = new pathfinder(grid, acceptable_tiles);	
		this.scene_container.u_collisions = new collisions({scene: this.scene});		
    }
    
	getTileID = function(x,y){
		var tile = this.scene_container.map.getTileAt(x, y);
		return tile.index;
	};

    //  #####  ####### ####### #     # ######         #####     #    #     # ####### ######     #    
    // #     # #          #    #     # #     #       #     #   # #   ##   ## #       #     #   # #   
    // #       #          #    #     # #     #       #        #   #  # # # # #       #     #  #   #  
    //  #####  #####      #    #     # ######  ##### #       #     # #  #  # #####   ######  #     # 
    //       # #          #    #     # #             #       ####### #     # #       #   #   ####### 
    // #     # #          #    #     # #             #     # #     # #     # #       #    #  #     # 
    //  #####  #######    #     #####  #              #####  #     # #     # ####### #     # #     # 

    setupCamera = () => {
        //Create a camera controller using the arraow keys
        let cursors = this.scene.input.keyboard.createCursorKeys();
    
        this.scene_container.camera = this.scene.cameras.main;
        
        let controlConfig = {
            camera: this.scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.0009,
            maxSpeed: 0.5
        };
    
        this.scene_container.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    
        //SET BOUNDS TO THE CAMERA MOVEMENT
        let offset = 200;
        this.scene.cameras.main.setBounds(
            -offset, 
            -offset, 
            this.scene_container.map.width * gameFunctions.tile_size + (offset * 2), 
            this.scene_container.map.height * gameFunctions.tile_size + (offset * 2));	
        
        
        this.scene.cameras.main.zoom = 1.75;
        this.scene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            this.scene.cameras.main.zoom -= (deltaY / 100) * 0.1;
    
            if(this.scene.cameras.main.zoom <= 1.5){
                this.scene.cameras.main.zoom = 1.5
            }	
            if(this.scene.cameras.main.zoom >= 2.5){
                this.scene.cameras.main.zoom = 2.5
            }	
        });	
        
        let width = gameFunctions.config.width / 4;
        let height = gameFunctions.config.height / 4;	
        this.scene_container.minimap = this.scene.cameras.add(gameFunctions.config.width - width, gameFunctions.config.height - height, width, height).setZoom(0.3).setName('mini');
        this.scene_container.minimap.setBackgroundColor(0x002244);	
        
    
        this.scene_container.minimap.startFollow(this.scene_container.rectangle);	
    }


	//  #####  ####### ####### #     # ######         #####   #####  #     #    #    ######   #####  
	// #     # #          #    #     # #     #       #     # #     # #     #   # #   #     # #     # 
	// #       #          #    #     # #     #       #       #     # #     #  #   #  #     # #       
	//  #####  #####      #    #     # ######  #####  #####  #     # #     # #     # #     #  #####  
	// 	  	 # #          #    #     # #                   # #   # # #     # ####### #     #       # 
	// #     # #          #    #     # #             #     # #    #  #     # #     # #     # #     # 
	//  #####  #######    #     #####  #              #####   #### #  #####  #     # ######   #####  


	setupSquads = () => {
		let options = {
			scene: this.scene,
			unit_list: gameFunctions.units,
			forces: gameFunctions.params.forces,
			tile_size: gameFunctions.tile_size
		}
		this.scene_container.squad_setup = new squad_setup(options)

		//SETUP THE SQUADS IF THE GAME ISN'T BEING LOADED FROM A PREVIOUS SAVE
		if(gameFunctions.units_preload.length === 0){
			this.scene_container.squad_setup.placeSquads();	
		}else{
			this.scene_container.squad_setup.reloadSquads();
		}
	}




    // ███    ███  █████  ██████  ██   ██ ███████ ██████  
    // ████  ████ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██ ████ ██ ███████ ██████  █████   █████   ██████  
    // ██  ██  ██ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██      ██ ██   ██ ██   ██ ██   ██ ███████ ██   ██ 
    updateMarker = () => {

        var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

		this.scene_container.rectangle.x = this.scene_container.camera.midPoint.x
		this.scene_container.rectangle.y = this.scene_container.camera.midPoint.y		

		// Rounds down to nearest tile
		var pointerTileX = this.scene_container.map.worldToTileX(worldPoint.x);
		var pointerTileY = this.scene_container.map.worldToTileY(worldPoint.y);
		this.scene_container.marker.x = this.scene_container.map.tileToWorldX(pointerTileX);
		this.scene_container.marker.y = this.scene_container.map.tileToWorldY(pointerTileY);
		this.scene_container.marker.setVisible(!this.checkCollision(pointerTileX,pointerTileY));          
    }

	checkCollision = function(x,y){
		var tile = this.scene_container.map.getTileAt(x, y);
		if (tile){
			return tile.properties.collide == true;		
		}
		else{
			return
		}
	};
	

    getSideColour = (side) => {
        let colour = {};
        colour.colour = 0xFFFFFF;
        switch(side){
            case 0:
                colour.colour = 0xff3333; //red
                break;
            case 1:
                colour.colour = 0x3399ff; //blue
                break;
            case 2:
                colour.colour = 0x00FF00; //lime
                break;
            case 3:
                colour.colour = 0xFFFF00; //yellow
                break;				
        }
    
        colour.colour_gray = 0x808080;
    
        colour.colour_info = Phaser.Display.Color.ValueToColor(colour.colour)
        colour.colour_info.dest = {r: 255, g: 255, b: 255};
        colour.colour_info.r_itt = (colour.colour_info.dest.r - colour.colour_info.r) / 255
        colour.colour_info.g_itt = (colour.colour_info.dest.g - colour.colour_info.g) / 255									
        colour.colour_info.b_itt = (colour.colour_info.dest.b - colour.colour_info.b) / 255
        
        return colour
    }

	//  #####  #       ###  #####  #    #       #     #    #    #     # ######  #       ####### ######  
	// #     # #        #  #     # #   #        #     #   # #   ##    # #     # #       #       #     # 
	// #       #        #  #       #  #         #     #  #   #  # #   # #     # #       #       #     # 
	// #       #        #  #       ###    ##### ####### #     # #  #  # #     # #       #####   ######  
	// #       #        #  #       #  #         #     # ####### #   # # #     # #       #       #   #   
	// #     # #        #  #     # #   #        #     # #     # #    ## #     # #       #       #    #  
	//  #####  ####### ###  #####  #    #       #     # #     # #     # ######  ####### ####### #     # 

	clickHandler = function(pointer){


		if (pointer.leftButtonReleased())
		{	
			GameScene.left_click = true;
		}		
		if (pointer.rightButtonReleased())
		{	
			GameScene.right_click = true;
		}			
	};


	checkUnitClicks = () => {

		var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);	

		if(this.scene_container.selected_unit.length > 0 && this.scene_container.multi_select_pause === false){
			// let selected_unit = this.scene_container.selected_unit[0];
			this.scene_container.selected_unit.forEach((selected_unit) => {

				// ██      ███████ ███████ ████████        ██████ ██      ██  ██████ ██   ██ 
				// ██      ██      ██         ██          ██      ██      ██ ██      ██  ██  
				// ██      █████   █████      ██    █████ ██      ██      ██ ██      █████   
				// ██      ██      ██         ██          ██      ██      ██ ██      ██  ██  
				// ███████ ███████ ██         ██           ██████ ███████ ██  ██████ ██   ██ 

				if(this.scene_container.left_click === true){

					switch(gameFunctions.mode) {
						case "move":
							
							if(this.scene_container.online === false){

								//USED FOR MULTIPLE SELECTIONS TO APPLY MOVEMENT
								let used_pointer = worldPoint
								if(this.scene_container.mouse_selection){
									if(this.scene_container.mouse_selection.selection_info){
										let info = this.scene_container.mouse_selection.selection_info[selected_unit.core.id];
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
										id: selected_unit.core.id, 
										function: "findPath",
										function_parameter: {pointer: worldPoint}
									},
									message: "set move"
								}
								connFunctions.messageServer(data)
							}
						break;
						case "shoot":

							if(this.scene_container.online === false){
								selected_unit.findTarget({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
										function: "findTarget",
										function_parameter: {pointer: worldPoint}
									},
									message: "set shot target"
								}
								connFunctions.messageServer(data)
							}
						break;
						case "charge":

							if(this.scene_container.online === false){
								selected_unit.findPath({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
										function: "findPath",
										function_parameter: {pointer: worldPoint}
									},
									message: "set charge"
								}
								connFunctions.messageServer(data)
							}						
						break;		
						case "fight":

							if(this.scene_container.online === false){
								selected_unit.findFightTarget({pointer: worldPoint});
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
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
				
				if(this.scene_container.right_click === true) {
					
					this.scene_container.sfx['clear'].play();
					switch(gameFunctions.mode) {
						case "move":

							if(this.scene_container.online === false){
								selected_unit.resetMove();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
										function: "resetMove",
									},
									message: "reset path"
								}
								connFunctions.messageServer(data)
							}
							
						break;
						case "shoot":

							if(this.scene_container.online === false){
								selected_unit.removeTarget();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
										function: "removeTarget",
									},
									message: "remove target"
								}
								connFunctions.messageServer(data)
							}						
						break;
						case "charge":

							if(this.scene_container.online === false){
								selected_unit.resetMove();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
										function: "resetMove",
									},
									message: "reset path"
								}
								connFunctions.messageServer(data)
							}						
						break;
						case "fight":

							if(this.scene_container.online === false){
								selected_unit.removeFightTarget();
							}else{

								let data = {
									functionGroup: "socketFunctions",  
									function: "messageAll",
									room_name: gameFunctions.params.room_name,
									returnFunctionGroup: "connFunctions",
									returnFunction: "runUnitFunction", //test
									returnParameters: {
										id: selected_unit.core.id, 
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

		this.scene_container.multi_select_pause = false;
		this.scene_container.left_click = false;
		this.scene_container.right_click = false;				
	}



	// ██    ██ ██████  ██████   █████  ████████ ███████       ███████ ██      ███████ ███    ███ ███████ ███    ██ ████████ ███████ 
	// ██    ██ ██   ██ ██   ██ ██   ██    ██    ██            ██      ██      ██      ████  ████ ██      ████   ██    ██    ██      
	// ██    ██ ██████  ██   ██ ███████    ██    █████   █████ █████   ██      █████   ██ ████ ██ █████   ██ ██  ██    ██    ███████ 
	// ██    ██ ██      ██   ██ ██   ██    ██    ██            ██      ██      ██      ██  ██  ██ ██      ██  ██ ██    ██         ██ 
	//  ██████  ██      ██████  ██   ██    ██    ███████       ███████ ███████ ███████ ██      ██ ███████ ██   ████    ██    ███████ 


	checkCollisionsBarriers = () => {
		this.scene_container.barriers.forEach((barrier) => {
			barrier.checkCollisions();
		})
	}

	updateBarriers = () => {
		let new_list = []
		this.scene_container.barriers.forEach((barrier) => {
			barrier.checkDeath();
			if(barrier.alive === true){
				new_list.push(barrier)
			}
		})
		this.scene_container.barriers = new_list;
	}

	updateElements = (worldPoint) => {
																																	  
		//CHECK BULLET DEATH
		let bullets = [];
		if(this.scene_container.bullets){
			this.scene_container.bullets.forEach((bullet) => {

				bullet.checkRange();
				if(bullet.delete === false){
					bullets.push(bullet)
				}

				this.scene_container.barriers.forEach((barrier) => {
					if(barrier.side != bullet.side){
						barrier.checkAction(bullet)
					}
				})
			})
		}
		
		this.scene_container.bullets = bullets;
		

		let click_circle = new u_circle({
			x: worldPoint.x,
			y: worldPoint.y,
			r: 1
		});


		let touching_unit = false;
		if(gameFunctions.units){
			gameFunctions.units.forEach((unit) => {
				if(unit.core.side === gameFunctions.current_side){

					if(unit.is_moving === true){
						// unit.draw_health()
						unit.updateUnitElements(unit.sprite);
					}
				}

				let unit_circle = new u_circle({
					x: unit.sprite.x,
					y: unit.sprite.y,
					r: unit.sprite.width / 2
				});
				let clash = GameScene.u_collisions.circleCircle(click_circle, unit_circle);

				if(clash === true){
					touching_unit = true;
					if(this.scene_container.hovered_unit_id !== unit.core.id){
						this.scene_container.hovered_unit_id = unit.core.id
						GameUIScene.setUnitHUD(unit)

						if(this.scene_container.selected_unit.length > 0){
							let selected_unit = this.scene_container.selected_unit[0];
							if(selected_unit.core.side !== unit.core.side){
								GameUIScene.setChanceHUD(selected_unit, unit)
							}
						}						
					}
				}
			})
		}		

		if(touching_unit === false){
			GameUIScene.hideUnitHUD();
			GameUIScene.hideChanceHUD();
			this.scene_container.hovered_unit_id = -1;
		}
	}

// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

	checkAllCombat = () => {
		try{	
			// RESET ALL COMBAT STATUS'
			gameFunctions.units.forEach((unit) => {
				unit.core.in_combat = false;
				if(unit.sprite.body){
					unit.sprite.body.enable = true; //
				}
				// unit.sprite_action.visible = false;
				unit.drawSymbol();
			})
	
			//RERUN COMBAT CHECKS
			gameFunctions.units.forEach((unit) => {
				unit.checkCombat()
			})
		}catch(e){
	
			let options = {
				"class": "GameSetup",
				"function": "checkAllCombat",
				"e": e
			}
			errorHandler.log(options)
		}			
	}

}