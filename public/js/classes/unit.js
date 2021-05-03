
const unit = class {
	constructor(options) {
		
		this.id = GameScene.units.length;
		this.side = options.side; //this can be used if each side has multiple players
		this.player = options.player; //this is the specific owner of the unit
		this.squad = options.squad;; //this can be used for squad checks like unit cohesion
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
		
		this.path = [];

		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.health = 100;		
		this.cohesion_check = true;		
		this.movement = options.movement;
		this.shoot_range = 200;
		this.shoot_damage = 50;
		this.max_targets = 3;
		this.targets = [];
		
		this.in_combat = false;
		
		this.sprite_offset = options.sprite_offset;
		
		let x = options.x + GameScene.tile_size * this.sprite_offset;
		let y = options.y + GameScene.tile_size * this.sprite_offset;
		
		
		//SPRITES
		this.spritesheet = options.spritesheet;
		this.sprite = options.scene.physics.add.image(x,y,options.spritesheet).setInteractive();
		this.sprite.setImmovable(true)
		this.sprite.setDepth(1);
		this.sprite.angle = options.angle;
		
		let colour = 0xFFFFFF;
		switch(options.player){
			case 0:
				colour = 0xFF0000; //red
				break;
			case 1:
				colour = 0x4863A0; //blue
				break;
			case 2:
				colour = 0x00FF00; //lime
				break;
			case 3:
				colour = 0xFFFF00; //yellow
				break;				
		}
		
		this.sprite.setTint(colour)
		this.sprite.parent = this
		GameScene.unit_collisions.add(this.sprite)
		this.sprite.on('pointerup', this.selectHander)			
		
		
		this.sprite_ghost = options.scene.add.image(x,y,options.spritesheet);
		this.sprite_ghost.alpha = 0.5;
		this.sprite_ghost.setTint(colour)
		this.sprite_ghost.angle = options.angle;

		
		//SETUP GRAPHICS THAT CAN BE USED TO DRAW ACTIONS
		this.graphics = [];
		for(let i=0;i<2;i++){
			this.graphics.push(options.scene.add.graphics());				
		}

		
		// this.drawPath = this.drawPath.bind(this);
		this.selectHander = this.selectHander.bind(this);
	}

	kill(){
		this.sprite.destroy();
		this.sprite_ghost.destroy();
		// this.sprite.disableBody(true, true);
		// this.sprite_ghost.destroy(true);
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
					GameScene.selected_unit.resetColours();					
					GameScene.selected_unit.unselectHandler();
				}
				GameScene.selected_unit = this.parent;
				
				if(GameScene.mode === "move"){
					if(this.cohesion > 0){
						this.parent.cohesionCheck();	
					}
				}
				this.parent.resetGhost();
				
				GameScene.left_click = false;
			}

		}
	}
	
	unselectHandler() {
		GameScene.selected_unit = undefined;
	}
	
	resetColours(){
		if(this.path.length > 0){
			let colours = {
				line_colour: 0x808080,
				fill_colour: 0x2ECC40,
				line_alpha: 0.5,
				circle_alpha: 0.15,
				fill_alpha: 0.15	
			}
			if(this.cohesion_check === false){
				colours.fill_colour = 0xFF0000; //0x6666ff				
			}
			this.drawPath(colours)
		}
		
	}
	
	resetGhost() {
		this.sprite_ghost.x = this.sprite.x;
		this.sprite_ghost.y = this.sprite.y;
		this.sprite_ghost.angle = this.sprite.angle;
		this.sprite_ghost.alpha = 0.5;		
	}		
	
	// updateGrid(x, y, value){
		/*
		GameScene.grid[y][x] = value;
		
		//SET THE TEXT ARRAY POSITION SO WE CAN SEE IT'S EFFECT
		let text = GameScene.text_array[y][x];
		text.setText(value)
		*/
	// }
	
	checkSpriteOverlap(spriteA, spriteB, adjacent=false){
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		let intersection =  Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);	
		
		let check = false;
		if(intersection.width > 0 && intersection.height > 0 && adjacent===false){
			check = true;
		}
		if(adjacent===true){
			if(intersection.width > 0 || intersection.height > 0){
				check = true;
			}					
		}

		return check;
	}
	
	findPath(scene, pointer) {
		// var x = scene.camera.scrollX + pointer.x;
		// var y = scene.camera.scrollY + pointer.y;
		var x = pointer.x;
		var y = pointer.y;		
		var toX = Math.floor(x/GameScene.tile_size);
		var toY = Math.floor(y/GameScene.tile_size);	
		
		
		if(toX < GameScene.map.width && toY < GameScene.map.height
		  && toX >= 0 && toY >= 0){

			var fromX = Math.floor(this.sprite.x/GameScene.tile_size);
			var fromY = Math.floor(this.sprite.y/GameScene.tile_size);		

			let path = GameScene.pathfinder.findPath(this, fromX, fromY, toX, toY, this.size)
			
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

			
			//OFFSET PATH SO THEY'RE IN THE MIDDLE OF EACH TILE
			this.path.forEach((pos) => {
				pos.x += this.sprite_offset;
				pos.y += this.sprite_offset;
			})
			
			
			//UPDATE THE POSITIONAL DATA
			if(this.path.length > 1){
				let pos = this.path[this.path.length - 1];

				this.sprite_ghost.alpha = 0.5;
				this.sprite_ghost.x = pos.x * GameScene.tile_size;
				this.sprite_ghost.y = pos.y * GameScene.tile_size;
				// this.resetGhost();
				
				let angle = this.checkAngle(this.path[this.path.length - 2], this.path[this.path.length - 1])
				this.sprite_ghost.angle = angle;
			}			
			
			
			//SKIP PATH IF THE UNIT PLACEMENT OVERLAPS ANOTHER UNIT
			let skip = false
			GameScene.units.forEach((unit) => {

				if(unit.id !== this.id){
					let check = false;
					check = this.checkSpriteOverlap(unit.sprite, this.sprite_ghost)
					if(check === true){
						skip = true;
					}
					check = this.checkSpriteOverlap(unit.sprite_ghost, this.sprite_ghost)
					if(check === true){
						skip = true;
					}	
				}
			})
			//SKIP IF THE UNIT IS IN COMBAT
			// if(this.in_combat === true){
			// 	skip = true;
			// }
			// if(this.moves !== 0 && GameScene.mode === "move"){
			// 	skip = true;
			// }
			// if(this.fights !== 0 && GameScene.mode === "fight"){
			// 	skip = true;
			// }
			
			//IF THE GHOST CLASHES WITH ANOTHER SPRITE OR GHOST, CANCEL THE MOVE
			if(skip === true || this.path.length === 0){
				this.resetGhost();
				this.path = [];
				this.graphics[0].clear();
			}
			else{
			
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
	}

	cohesionCheck() {
		
		//LOOP THROUGH UNITS, IF UNIT IS SAME PLAYER AND SQUAD BUT ISN'T THIS UNIT
		GameScene.units.forEach((unit) => {
			if(unit.player === this.player && unit.squad === this.squad) //unit.id !== this.id && 
			{
				//LOOP THROUGH UNITS AGAIN AND CHECK COHESION
				let cohesion_check = false;
				let squad_count = 0;
				GameScene.units.forEach((unit2) => {
					if(unit2.id !== unit.id && unit2.player === this.player && unit2.squad === this.squad)
					{
						squad_count++;
						
						let unit_pos = {
							x: unit.sprite.x,
							y: unit.sprite.y,								
						}
						if(unit.path.length > 0){
							unit_pos = {
								x: unit.path[unit.path.length - 1].x * GameScene.tile_size,
								y: unit.path[unit.path.length - 1].y * GameScene.tile_size,
							}
						}
						let unit_pos2 = {
							x: unit2.sprite.x,
							y: unit2.sprite.y,								
						}
						if(unit2.path.length > 0){
							// console.log(unit2)
							unit_pos2 = {
								x: unit2.path[unit2.path.length - 1].x * GameScene.tile_size,
								y: unit2.path[unit2.path.length - 1].y * GameScene.tile_size,
							}								
						}							

						let distance = gameFunctions.twoPointDistance(unit_pos, unit_pos2);
						if(distance <= unit.cohesion){
							cohesion_check = true;
						}
					}
				})
				if(squad_count === 0){
					cohesion_check = true;
				}

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
				
				if(unit.id !== this.id){
					colours.line_colour = 0x808080;
					colours.line_alpha = 0.5;
				}

				// console.log(unit.path)
				unit.drawPath(colours)							
			}
		})		
		
	}
	
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawPath(colours) {
		
		let last_pos = {
			x: this.sprite.x / GameScene.tile_size,
			y: this.sprite.y / GameScene.tile_size
		}
		
		//RESET THE DRAW GRAPHICS
		this.graphics[0].clear();
		this.graphics[1].clear();
		
		if (this.path && this.path.length > 1){
			
			this.graphics[0].lineStyle(5, colours.line_colour, colours.line_alpha);	
			this.graphics[0].beginPath();

			this.path.forEach((pos, i) => {
	
				if (i !== 0){
					this.graphics[0].lineTo(pos.x * GameScene.tile_size, pos.y * GameScene.tile_size);
				}
				else{
					this.graphics[0].moveTo(pos.x * GameScene.tile_size, pos.y * GameScene.tile_size);
				}
				
				last_pos = pos;
			})				
			
			this.graphics[0].strokePath();				
	
		}
		
		this.graphics[1].lineStyle(5, colours.line_colour, colours.circle_alpha);
		this.graphics[1].fillStyle(colours.fill_colour, colours.fill_alpha);
		let circle = new Phaser.Geom.Circle(last_pos.x * GameScene.tile_size, last_pos.y * GameScene.tile_size, this.cohesion);
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
	
	move(endFunction="move") {
		
		this.graphics[1].clear()
		
		if (this.path){
			let tweens = []
			for(let i = 0; i < this.path.length-1; i++){
				let next_pos = this.path[i+1];
				let ex = next_pos.x;
				let ey = next_pos.y;
				
				let pos = this.path[i]
				
				let angle = this.checkAngle(pos, next_pos)				
				
				let tween_data = {
					targets: [this.sprite, this.sprite_base],
					// targets: [this.sprite],
					x: {value: ex*GameScene.map.tileWidth, duration: 200},
					y: {value: ey*GameScene.map.tileHeight, duration: 200},
					angle: {value: angle, duration: 0},
					onComplete: function ()
					{
						
						let end_path = this.path[this.path.length - 1];
						
						//WHEN THE END OF THE PATH IS REACHED
						if(this.sprite.x / GameScene.tile_size === end_path.x && this.sprite.y / GameScene.tile_size === end_path.y){
							this.graphics[0].clear()
							this.path = [];
							
							if(endFunction){
								switch(endFunction){
									case "move":
										this.moves = 1;
										break;
									case "checkCombat":
										this.checkCombat(this.fight);
										break;
									default:
								}
							}

							// if (callBack){
							// 	console.log(arguments)
							// }
							
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
		
		//GET BASE POSITIONAL DATA
		let pos = {
			start_x: this.sprite.x,
			start_y: this.sprite.y,			
			end_x: Math.floor(pointer.x / GameScene.tile_size) * GameScene.tile_size + (GameScene.tile_size / 2),
			end_y: Math.floor(pointer.y / GameScene.tile_size) * GameScene.tile_size + (GameScene.tile_size / 2),
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
			let grid_x = Math.floor(cell.x / GameScene.tile_size);
			let grid_y = Math.floor(cell.y / GameScene.tile_size);					
			
			// this.temp_sprites.push(scene.physics.add.image(cell.x,cell.y,"marker").setDepth(2))	
			// this.temp_sprites.push(scene.physics.add.image(grid_x * GameScene.tile_size,grid_y * GameScene.tile_size,"marker").setTint(0xff0000).setDepth(3));
			
			//RETURN THE GRID CELL POSITION SO WE CAN CHECK IT'S EMPTY
			let grid_cell = GameScene.grid[grid_y][grid_x]
			dest.x = cell.x
			dest.y = cell.y
			
			if (!GameScene.pathfinder.acceptable_tiles.includes(grid_cell)){
				obj_check = true;
			}
		})		
		
		//ONLY ADD SHOT IF THE TARGETS ARRAY IS UNDER MAX SHOTS
		if(dest.x && dest.y && obj_check === false && this.targets.length <= this.max_targets){
			
			this.targets.push(dest);
			this.drawTarget();
		}
		
	}

	removeTarget() {
		this.targets.pop();
		this.drawTarget()
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

				// this.graphics[0].beginPath();
				// console.log(this)
				this.graphics[0].moveTo(this.sprite.x, this.sprite.y);
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += this.sprite_offset;
				pos.y += this.sprite_offset;	
				// console.log(pos)
				
				this.graphics[0].lineTo(pos.x, pos.y);
			})			

			this.graphics[0].strokePath();		
		}
	}	
	
	shoot() {
		
		if(this.targets){
			// console.log(this.targets)
			this.targets.forEach((target) => {

				let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, target);
				if(angle){
					this.sprite.angle = Phaser.Math.RadToDeg(angle);
					this.sprite_ghost.angle = this.sprite.angle;

					let options = {
						scene: GameScene.scene,
						spritesheet: "bullet",
						angle: angle,
						unit: this,
						target: target
					}

					GameScene.bullets.push(new bullet(options))
					//BULLET DEATH KILLS THE GRAPHIC
				}				
				
			})
			this.shots = 1;
			this.targets = [];
		}		
		
	}
	
	checkCombat(endFunction) {

		
		let in_combat_range = false
		GameScene.units.forEach((unit) => {
			let clash = false;
			if(unit.id !== this.id && unit.player !== this.player && unit.side !== this.side){
				
				if(this.path.length > 0){
					//check to see if movement ends in an attack
					clash = this.checkSpriteOverlap(this.sprite_ghost, unit.sprite, true)
				}else{
					clash = this.checkSpriteOverlap(this.sprite, unit.sprite, true)
				}

				if(clash === true){
					// this.in_combat = true;
					// unit.in_combat = true;
					
					in_combat_range = true;
					
					// if(callBack){
					// 	callBack(this, unit)
					// }
					if(endFunction){
						switch(endFunction){
							case "fight":
								this.fight(this,unit);
								break;
							default:
								break;
						}
					}
				}
			}
		})
		
		return in_combat_range;
	}
	
	fight(attacker, defender){
		attacker.fights = 1;
		defender.wound(100);
	}
	
}
