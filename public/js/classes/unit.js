
const unit = class {
	constructor(options) {
		
		this.id = GameScene.units.length;
		this.side = options.side; //this can be used if each side has multiple players
		this.player = options.player; //this is the specific owner of the unit
		this.squad = options.squad;; //this can be used for squad checks like unit cohesion
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
		
		this.path = [];
		this.cohesion_check = true;
		// this.selected = false;
		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.movement = options.movement;
		this.shoot_range = 200;
		this.health = 100;
		
		this.x = options.x + (gameFunctions.tile_size / 2);
		this.y = options.y + (gameFunctions.tile_size / 2);
		this.updateGrid(options.x / gameFunctions.tile_size, options.y / gameFunctions.tile_size, '#')
		
		this.spritesheet = options.spritesheet;
		this.sprite = options.scene.physics.add.image(this.x,this.y,options.spritesheet).setInteractive();
		this.sprite.setImmovable(true)
		this.sprite.setDepth(1);
		this.sprite.parent = this
		GameScene.unit_collisions.add(this.sprite)
		
		this.sprite_ghost = options.scene.add.image(this.x,this.y,options.spritesheet);
		this.sprite_ghost.alpha = 0;
		
		// this.sprite_base = scene.add.image(this.x,this.y,"base");
		// this.sprite_base.setDepth(0.5);
		
		this.sprite.on('pointerup', this.selectHander)		

		
		this.graphics = [];
		for(let i=0;i<2;i++){
			this.graphics.push(options.scene.add.graphics());				
		}

		this.targets = [];
		
		// this.drawPath = this.drawPath.bind(this);
		this.selectHander = this.selectHander.bind(this);
	}

	kill(){
		this.sprite.disableBody(true, true);
		// this.sprite_base.destroy(true);		
	}	
	
	wound(damage){
		this.health -= damage;
		if(this.health <= 0){
			this.kill();
		}
	}
	
	selectHander(pointer) {

		// console.log(this.parent)
		if (pointer.leftButtonReleased())
		{
			if (this.parent.player === GameScene.current_player){
				//TURN OLD SELECTED PLAYER MARKER, WHITE
				if(GameScene.selected_unit){
					// GameScene.selected_unit.sprite_base.setTint(0xffffff)
				}		

				//TURN ENW SELECTED MARKER, RED
				// this.parent.sprite_base.setTint(0xff0000);

				if(GameScene.selected_unit){
					GameScene.selected_unit.unselectHandler();
				}
				GameScene.selected_unit = this.parent;
				
				if(GameScene.mode === "move"){
					if(this.cohesion > 0){
						this.parent.cohesionCheck();	
					}
				}

				
				GameScene.left_click = false;						
			}

		}
	}
	
	unselectHandler() {
		// this.sprite_base.setTint(0xffffff)
		GameScene.selected_unit = undefined;
		
		
		// let colours = {
		// 	line_colour: 0xCCCCCC,
		// 	fill_colour: 0x999999,
		// 	line_alpha: 0.3,
		// 	fill_alpha: 0.15				
		// }
		// this.drawPath(this.path, colours)		
		
	}
	
	updateGrid(x, y, value){
		/*
		GameScene.grid[y][x] = value;
		
		//SET THE TEXT ARRAY POSITION SO WE CAN SEE IT'S EFFECT
		let text = GameScene.text_array[y][x];
		text.setText(value)
		*/
	}
	
	findPath(scene, pointer) {
		var x = scene.camera.scrollX + pointer.x;
		var y = scene.camera.scrollY + pointer.y;
		var toX = Math.floor(x/gameFunctions.tile_size);
		var toY = Math.floor(y/gameFunctions.tile_size);

		
		//CHECK CLICK POSITION TO SEE IF THERE'S ANYONE ALREADY THERE
		let skip = false
		GameScene.units.forEach((unit) => {
			// if(unit.sprite.x )
			if ((unit.sprite.getBounds().contains((toX + 0.5) * gameFunctions.tile_size, (toY + 0.5) * gameFunctions.tile_size))) {
				skip = true;
			}
			if ((unit.sprite_ghost.getBounds().contains((toX + 0.5) * gameFunctions.tile_size, (toY + 0.5) * gameFunctions.tile_size))) {
				skip = true;
			}			
		})
		
		
		if(toX < GameScene.map.width && toY < GameScene.map.height
		  && toX >= 0 && toY >= 0 && skip === false){

			var fromX = Math.floor(this.x/gameFunctions.tile_size);
			var fromY = Math.floor(this.y/gameFunctions.tile_size);		

			let path = GameScene.pathfinder.findPath(fromX, fromY, toX, toY, this.size)

			//REMOVE THE OLD NOTIONAL POSITION OF THE THERE WAS ONE AND THE NEW PATH ISN'T A PATH OF 1 POSITION
			// if(this.path.length > 0 && path.length > 0){
			// 	let pos = {
			// 		x: this.path[this.path.length - 1].x - 0.5,
			// 		y: this.path[this.path.length - 1].y - 0.5
			// 	}
			// 	this.updateGrid(pos.x, pos.y, 1)
			// }						
			
			
			this.path = []
			path.forEach((pos) => {
				let p = {
					x: pos.x,
					y: pos.y
				}
				this.path.push(p)
			})			
			
			//STRIP PATH BACK TO MAX MOVEMENT LENGTH
			this.path = this.path.slice(0,this.movement - 1)			

			
			//UPDATE THE POSITIONAL DATA
			if(this.path.length > 1){
				let pos = this.path[this.path.length - 1];
				// this.updateGrid(pos.x, pos.y, "#")
				this.sprite_ghost.alpha = 0.5;
				this.sprite_ghost.x = (pos.x + 0.5) * gameFunctions.tile_size;
				this.sprite_ghost.y = (pos.y + 0.5) * gameFunctions.tile_size;
				
				let angle = this.checkAngle(this.path[this.path.length - 2], this.path[this.path.length - 1])
				this.sprite_ghost.angle = angle;
			}			
			
			
			//OFFSET PATH SO THEY'RE IN THE MIDDLE OF EACH TILE
			this.path.forEach((pos) => {
				pos.x += 0.5;
				pos.y += 0.5;
			})

			//if there's any cohesion needed, check it, otherwise just draw path
			if(this.cohesion > 0){
				this.cohesionCheck()
			}
			else{
				// console.log(this)
				let colours = {
					line_colour: 0x2ECC40,
					fill_colour: 0x2ECC40,
					line_alpha: 0.75,
					circle_alpha: 0.15,
					fill_alpha: 0.15	
				}

				// console.log(unit.path)
				this.drawPath(colours)					
			}
			
		}
	}

	cohesionCheck() {
		
		//LOOP THROUGH UNITS, IF UNIT IS SAME PLAYER AND SQUAD BUT ISN'T THIS UNIT
		GameScene.units.forEach((unit) => {
			if(unit.player === this.player && unit.squad === this.squad) //unit.id !== this.id && 
			{
				//LOOP THROUGH UNITS AGAIN AND CHECK COHESION
				let cohesion_check = false;
				GameScene.units.forEach((unit2) => {
					if(unit2.id !== unit.id && unit2.player === this.player && unit2.squad === this.squad)
					{

						let unit_pos = {
							x: unit.sprite.x,
							y: unit.sprite.y,								
						}
						if(unit.path.length > 0){
							unit_pos = {
								x: unit.path[unit.path.length - 1].x * gameFunctions.tile_size,
								y: unit.path[unit.path.length - 1].y * gameFunctions.tile_size,
							}
						}
						let unit_pos2 = {
							x: unit2.sprite.x,
							y: unit2.sprite.y,								
						}
						if(unit2.path.length > 0){
							// console.log(unit2)
							unit_pos2 = {
								x: unit2.path[unit2.path.length - 1].x * gameFunctions.tile_size,
								y: unit2.path[unit2.path.length - 1].y * gameFunctions.tile_size,
							}								
						}							

						let distance = gameFunctions.twoPointDistance(unit_pos, unit_pos2);
						if(distance <= unit.cohesion){
							cohesion_check = true;
						}
					}
				})

				// console.log(this)
				let colours = {
					line_colour: 0x2ECC40,
					fill_colour: 0x2ECC40,
					line_alpha: 0.75,
					circle_alpha: 0.15,
					fill_alpha: 0.15	
				}
				unit.cohesion_check = true
				
				if(cohesion_check === false){
					colours.line_colour = 0xFF0000;
					colours.fill_colour = 0xFF0000; //0x6666ff	
					unit.cohesion_check = false;
				}

				// console.log(unit.path)
				unit.drawPath(colours)							
			}
		})		
		
	}
	
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawPath(colours) {
		
		let last_pos = {
			x: this.sprite.x / gameFunctions.tile_size,
			y: this.sprite.y / gameFunctions.tile_size
		}
		
		//RESET THE DRAW GRAPHICS
		this.graphics[0].clear();
		this.graphics[1].clear();		
		
		if (this.path && this.path.length > 1){
			
			this.graphics[0].lineStyle(5, colours.line_colour, colours.line_alpha);	
			this.graphics[0].beginPath();

			this.path.forEach((pos, i) => {
	
				if (i !== 0){
					this.graphics[0].lineTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
				else{
					this.graphics[0].moveTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
				
				last_pos = pos;
			})				
			
			this.graphics[0].strokePath();				
	
		}
		// console.log(this)
		
		this.graphics[1].lineStyle(5, colours.line_colour, colours.circle_alpha);
		this.graphics[1].fillStyle(colours.fill_colour, colours.fill_alpha);
		let circle = new Phaser.Geom.Circle(last_pos.x * gameFunctions.tile_size, last_pos.y * gameFunctions.tile_size, this.cohesion);
		this.graphics[1].fillCircleShape(circle);

		this.graphics[1].strokePath();		
		
	}
	
	checkAngle(start_pos, end_pos) {

		let angle = 0
		if(start_pos.x < end_pos.x){
			angle = 0;
		}
		if(start_pos.x > end_pos.x){
			angle = 180;
		}				
		if(start_pos.y < end_pos.y){
			angle = 90;
		}
		if(start_pos.y > end_pos.y){
			angle = -90;
		}		
		
		return angle;
	}
	
	move() {
		
		this.graphics[1].clear()
		
		if (this.path){
			let tweens = []
			for(let i = 0; i < this.path.length-1; i++){
				let next_pos = this.path[i+1];
				let ex = next_pos.x;
				let ey = next_pos.y;
				
				let pos = this.path[i]
				
				let angle = this.checkAngle(pos, next_pos)
				
				// console.log(pos, next_pos, angle)				
				
				let tween_data = {
					targets: [this.sprite, this.sprite_base],
					// targets: [this.sprite],
					x: {value: ex*GameScene.map.tileWidth, duration: 200},
					y: {value: ey*GameScene.map.tileHeight, duration: 200},
					angle: {value: angle, duration: 0},
					onComplete: function ()
					{
						this.x = this.sprite.x
						this.y = this.sprite.y
						
						let end_path = this.path[this.path.length - 1];
						
						if(this.x / gameFunctions.tile_size === end_path.x && this.y / gameFunctions.tile_size === end_path.y){
							this.graphics[0].clear()
							this.path = [];
						}
					}.bind(this)			
				}
				
				tweens.push(tween_data);
				
			}

			GameScene.scene.tweens.timeline({
				tweens: tweens
			});					
			
			GameScene.selected_unit = undefined;
		}
	}
	
	findTarget (scene, pointer) {
		
		this.targets = [];
		
		//GET BASE POSITIONAL DATA
		let pos = {
			start_x: this.sprite.x,
			start_y: this.sprite.y,			
			end_x: Math.floor(pointer.x / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
			end_y: Math.floor(pointer.y / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
		}
		//GET DIFFERENCE INFO
		pos.x_diff = pos.end_x - pos.start_x;
		pos.y_diff = pos.end_y - pos.start_y;
		
		pos.x_dir = (pos.x_diff < 0) ? -1:1;
		pos.y_dir = (pos.y_diff < 0) ? -1:1;		

		//FIND OUT WHICH NORMALISED DIFF IS HIGHER
		pos.x_norm = (pos.x_diff < 0) ? pos.x_diff * -1:pos.x_diff;
		pos.y_norm = (pos.y_diff < 0) ? pos.y_diff * -1:pos.y_diff;


		//ITTERATE ALONG THE LONGEST SIDE AND CALCULATE THE POSITION
		pos.cells = [];
		if(pos.x_norm > pos.y_norm){
			for (let x=0; x<pos.x_norm; x+=1){
				let cell = {
					x: pos.start_x + (x * pos.x_dir),
					y: pos.start_y + (x * (pos.y_diff / pos.x_norm)),	
				}
				pos.cells.push(cell)
				
				let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
				if(current_range >= this.shoot_range){ break; }				
			}
		}else{
			for (let y=0; y<pos.y_norm; y+=1){
				let cell = {
					x: pos.start_x + (y * (pos.x_diff / pos.y_norm)),	
					y: pos.start_y + (y * pos.y_dir),
				}
				pos.cells.push(cell)
				
				// let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
				let current_range = gameFunctions.twoPointDistance(this.sprite, cell)
				if(current_range >= this.shoot_range){ break; }						
			}			
		}

		
		if (!this.temp_sprites){
			this.temp_sprites = []			
		}
		else{
			this.temp_sprites.forEach((sprite) => {
				sprite.destroy();
			})
		}		
		
		let dest = {}
		let obj_check = false;
		pos.cells.forEach((cell) => {
			let grid_x = Math.floor(cell.x / gameFunctions.tile_size);
			let grid_y = Math.floor(cell.y / gameFunctions.tile_size);					
			
			// this.temp_sprites.push(scene.physics.add.image(cell.x,cell.y,"marker").setDepth(2))	
			// this.temp_sprites.push(scene.physics.add.image(grid_x * gameFunctions.tile_size,grid_y * gameFunctions.tile_size,"marker").setTint(0xff0000).setDepth(3));
			
			//RETURN THE GRID CELL POSITION SO WE CAN CHECK IT'S EMPTY
			let grid_cell = GameScene.grid[grid_y][grid_x]
			dest.x = cell.x
			dest.y = cell.y			
			
			if (grid_cell !== 1){
				obj_check = true;
			}
		})		
		
		if(obj_check === false){
			this.targets.push(dest);
			this.drawTarget();
		}
		
	}
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawTarget() {

		// console.log(this)		
		
		if (this.targets){

			//RESET THE DRAW GRAPHICS
			this.graphics[0].clear()
			this.graphics[0].lineStyle(10, 0x2ECC40);	
			this.graphics[0].beginPath();


			this.targets.forEach((pos, i) => {

				this.graphics[0].beginPath();
				// console.log(this)
				this.graphics[0].moveTo(this.x, this.y);
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += 0.5;
				pos.y += 0.5;	
				// console.log(pos)
				
				this.graphics[0].lineTo(pos.x, pos.y);
			})			

			this.graphics[0].strokePath();		
		}
	}	
	
	shoot() {
		
		if(this.targets){
			this.targets.forEach((target) => {

				let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, target);
				if(angle){
					this.sprite.angle = Phaser.Math.RadToDeg(angle);

					GameScene.bullets.push(new bullet(GameScene.scene, "bullet", angle, this))
					//BULLET DEATH KILLS THE GRAPHIC
				}				
				
			})
			unit.targets = [];
		}		
		
	}
	
	
}
