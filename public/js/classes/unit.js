
const unit = class {
	constructor(options) {
		
		// super(options);
		
		this.id = GameScene.units.length;
		this.side = options.side; //this can be used if each side has multiple players
		this.player = options.player; //this is the specific owner of the unit
		this.squad = options.squad;; //this can be used for squad checks like unit cohesion
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
		
		this.alive = true;
		
		this.path = [];
		this.is_moving = false;


		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.health = options.health;
		this.max_health = options.health;
		this.death_sfx = options.death_sfx;
		
		this.armour = options.armour;
		
		this.cohesion_check = true;		
		this.movement = options.movement;
		
		this.shoot_range = options.shoot_range;
		this.shoot_damage = options.shoot_damage;
		this.max_targets = options.max_targets;
		this.targets = [];
		
		this.fight_damage = options.fight_damage;
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
		GameScene.unit_collisions[this.side].add(this.sprite)
		this.sprite.on('pointerup', this.selectHander)
		
		
		this.sprite_ghost = options.scene.add.image(x,y,options.spritesheet);
		this.sprite_ghost.alpha = 0.5;
		this.sprite_ghost.setTint(colour)
		this.sprite_ghost.angle = options.angle;

		
		//THIS EXPLOSION
		options.scene.anims.create({
		key: 'hit',
		frames: options.scene.anims.generateFrameNumbers('punch'),
		frameRate: 50
		})			
		
		
		//SETUP GRAPHICS THAT CAN BE USED TO DRAW ACTIONS
		this.bar_graphic = options.scene.add.graphics();
		this.path_graphic = options.scene.add.graphics();
		this.cohesion_graphic = options.scene.add.graphics();		
		
		// this.group = options.scene.add.group();		
		// this.group.add(this.sprite)
		// this.group.add(this.bar_graphic)
		
		this.draw_health();
		
		
		this.selectHander = this.selectHander.bind(this);
	}

	resetColours(){
		if(this.path.length > 0){
			let colours = {
				line_colour: 0x808080,
				fill_colour: 0x2ECC40,
				line_alpha: 0.5,
				circle_alpha: 0.15,
				fill_alpha: 0.15,
				width: 5
			}
			if(this.cohesion_check === false){
				colours.fill_colour = 0xFF0000; //0x6666ff				
			}
			this.drawPath(colours)
		}
		
	}
	
	resetActions() {
		this.path = [];
		this.targets = [];		
		
		this.resetGhost();
		this.path_graphic.clear();
		this.cohesion_graphic.clear();
	}
	
	resetMove() {
		this.path = [];
		this.path_graphic.clear();		
		this.resetGhost();
	}
	
	resetGhost() {
		this.sprite_ghost.x = this.sprite.x;
		this.sprite_ghost.y = this.sprite.y;
		this.sprite_ghost.angle = this.sprite.angle;
		this.sprite_ghost.alpha = 0.5;
		
		
		if(GameScene.mode === "move" || GameScene.mode === "fight"){
			if(this.cohesion > 0){
				this.cohesionCheck();	
			}
		}
	}	
	
	kill(){	
		this.alive = false;

		GameScene.sfx[this.death_sfx].play();
		this.sprite.destroy();
		this.sprite_ghost.destroy();
		this.bar_graphic.destroy();
	}	
	
	wound(damage){
		this.health -= damage;
		this.draw_health()
		if(this.health <= 0){
			this.kill();
		}
	}	
	
	
	
    draw_health()
    {
        this.bar_graphic.clear();
		let width = this.sprite.width;
		let height = this.sprite.height;
		
		
		///////////////////////////////////////////////////////////////DRAW A BAR
		// let edge = 2;
		// let pos = {
		// 	x: this.sprite.x - (width / 2) - edge,
		// 	y: this.sprite.y + (height / 2)
		// }
		
		/*
        //  BG
        this.bar_graphic.fillStyle(0x000000);
        this.bar_graphic.fillRect(pos.x, pos.y, width + (edge * 2), 16);

        //  Health

        this.bar_graphic.fillStyle(0xffffff);
        this.bar_graphic.fillRect(pos.x + edge, pos.y + edge, width, 12);

        if (this.health < 30)
        {
            this.bar_graphic.fillStyle(0xff0000);
        }
        else
        {
            this.bar_graphic.fillStyle(0x00ff00);
        }

		
        var d = Math.floor((this.health / 100) * width);
        this.bar_graphic.fillRect(pos.x + edge, pos.y + edge, d, 12);
		*/
		///////////////////////////////////////////////////////////////		
		
		
		let pos = {
			x: this.sprite.x,
			y: this.sprite.y
		}		
		
		//  Without this the arc will appear closed when stroked
		this.bar_graphic.beginPath();

		
		let angle = (360 / this.max_health) * this.health;
		
		let fill_colour = 0x00ff00;
        if (this.health < 30)
        {
            fill_colour = 0xff0000;
        }
	
		
		// arc (x, y, radius, startAngle, endAngle, anticlockwise)
		
		this.bar_graphic.lineStyle(7, fill_colour, 0.5);
		this.bar_graphic.arc(pos.x, pos.y, width / 2, Phaser.Math.DegToRad(angle), Phaser.Math.DegToRad(0), true) //.setStartAngle(90);
		this.bar_graphic.strokePath();
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
				
				this.parent.resetGhost();
				
				GameScene.sfx['select'].play();
				
				GameScene.left_click = false;
			}

		}
	}
	
	unselectHandler() {
		GameScene.selected_unit = undefined;
	}
	
	
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
			
			//DON'T ALLOW FIGHTING IF THERE'S NO FIGHT DAMAGE
			if(this.fight_damage === 0 && GameScene.mode === "fight"){
				skip = true;
			}
			
			if(this.path.length === 0){
				skip = true;
			}
			
			if(skip === true){
				GameScene.sfx['clear'].play();				
			}
			
			//SKIP IF THE POINTER IS OVER THE SHOOTING UNITS, put here so it doesn't play the clear sound
			if (this.sprite.getBounds().contains(pointer.x, pointer.y)) {
				skip = true;
			}
			
			
			//IF THE GHOST CLASHES WITH ANOTHER SPRITE OR GHOST, CANCEL THE MOVE
			if(skip === true){
				// this.resetGhost();
				// this.path = [];
				// this.path_graphic.clear();
				
				this.resetMove();
				// if(this.path.length === 0){
				// 	GameScene.sfx['clear'].play();
				// }
				
			}
			else{
			
				//if there's any cohesion needed, check it, otherwise just draw path
				if(this.cohesion > 0){
					this.cohesionCheck()
					GameScene.sfx['action'].play();
				}
				else{
					// console.log(this)
					let colours = {
						line_colour: 0x2ECC40,
						fill_colour: 0x2ECC40,
						line_alpha: 0.75,
						circle_alpha: 0.15,
						fill_alpha: 0.15,
						width: 5
					}

					// console.log(unit.path)
					this.drawPath(colours)
					
					GameScene.sfx['action'].play();
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
					fill_alpha: 0.15,
					width: 5
				}
				unit.cohesion_check = true
				
				if(cohesion_check === false){
					colours.line_colour = 0xFF0000;
					colours.fill_colour = 0xFF0000; //0x6666ff	
					colours.width = 2.5;
					
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
		this.path_graphic.clear();
		this.cohesion_graphic.clear();
		
		if (this.path && this.path.length > 1){
			
			this.path_graphic.lineStyle(colours.width, colours.line_colour, colours.line_alpha);	
			this.path_graphic.beginPath();

			this.path.forEach((pos, i) => {
	
				if (i !== 0){
					this.path_graphic.lineTo(pos.x * GameScene.tile_size, pos.y * GameScene.tile_size);
				}
				else{
					this.path_graphic.moveTo(pos.x * GameScene.tile_size, pos.y * GameScene.tile_size);
				}
				
				last_pos = pos;
			})				
			
			this.path_graphic.strokePath();				
	
		}
		
		this.cohesion_graphic.lineStyle(colours.width, colours.line_colour, colours.circle_alpha);
		this.cohesion_graphic.fillStyle(colours.fill_colour, colours.fill_alpha);
		let circle = new Phaser.Geom.Circle(last_pos.x * GameScene.tile_size, last_pos.y * GameScene.tile_size, this.cohesion);
		this.cohesion_graphic.fillCircleShape(circle);

		this.cohesion_graphic.strokePath();		
		
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
		
		this.cohesion_graphic.clear()
		this.is_moving = true;
		
		if (this.path){
			
			GameScene.sfx['movement'].play();
			let tweens = []
			for(let i = 0; i < this.path.length-1; i++){
				let next_pos = this.path[i+1];
				let ex = next_pos.x;
				let ey = next_pos.y;
				
				let pos = this.path[i]
				
				let angle = this.checkAngle(pos, next_pos)				
				
				let tween_data = {
					targets: [this.sprite],
					// targets: this.group.getChildren(),
					x: {value: ex*GameScene.map.tileWidth, duration: 200},
					y: {value: ey*GameScene.map.tileHeight, duration: 200},
					angle: {value: angle, duration: 0},
					delay: 0,
					onComplete: function ()
					{
						
						let end_path = this.path[this.path.length - 1];
						
						//WHEN THE END OF THE PATH IS REACHED
						if(this.sprite.x / GameScene.tile_size === end_path.x && this.sprite.y / GameScene.tile_size === end_path.y){
							this.path_graphic.clear()
							this.path = [];
							this.is_moving = false;
							
							if(endFunction){
								switch(endFunction){
									case "move":
										this.moves = 1;
										this.combat_check = this.checkCombat();
										GameScene.sfx["end_path"].play();
										 
										break;
									case "checkCombat":
										this.checkCombat("fight");
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

		//CHECK THE BULLET PATH TO MAKE SURE THERE'S NO OBJECTS BLOCKING SIGHT
		let dest = {}
		let skip = false;
		pos.cells.forEach((cell) => {
			let grid_x = Math.floor(cell.x / GameScene.tile_size);
			let grid_y = Math.floor(cell.y / GameScene.tile_size);					
			
			// this.temp_sprites.push(scene.physics.add.image(cell.x,cell.y,"marker").setDepth(0))	
			// this.temp_sprites.push(scene.physics.add.image(grid_x * GameScene.tile_size,grid_y * GameScene.tile_size,"marker").setTint(0xff0000).setDepth(0.5));
			
			//RETURN THE GRID CELL POSITION SO WE CAN CHECK IT'S EMPTY
			let grid_cell = GameScene.grid[grid_y][grid_x]
			dest.x = cell.x
			dest.y = cell.y
			
			if (!GameScene.pathfinder.acceptable_tiles.includes(grid_cell)){
				skip = true;
			}
		})		
		
		//SKIP IF IN COMBAT
		if(this.in_combat === true){
			//DOUBLE CHECK THE UNIT IS STILL IN COMBAT
			this.in_combat = this.checkCombat();

			if(this.in_combat === true){
				skip = true;
			}
		}
		
		if(skip === true){
			GameScene.sfx['clear'].play();
		}
		
		
		//SKIP IF THE POINTER IS OVER THE SHOOTING UNITS, put here so it doesn't play the clear sound
		if (this.sprite.getBounds().contains(pointer.x, pointer.y)) {
			skip = true;
		}				
		
		//ONLY ADD SHOT IF THE TARGETS ARRAY IS UNDER MAX SHOTS
		if(dest.x && dest.y && skip === false && this.targets.length < this.max_targets){
			this.targets.push(dest);
			this.drawTarget();
			GameScene.sfx['action'].play();
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
			this.path_graphic.clear()
			this.path_graphic.lineStyle(10, 0x2ECC40);	
			this.path_graphic.beginPath();


			this.targets.forEach((pos, i) => {

				// this.path_graphic.beginPath();
				// console.log(this)
				this.path_graphic.moveTo(this.sprite.x, this.sprite.y);
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += this.sprite_offset;
				pos.y += this.sprite_offset;	
				// console.log(pos)
				
				this.path_graphic.lineTo(pos.x, pos.y);
			})			

			this.path_graphic.strokePath();		
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
			if(unit.alive === true && unit.id !== this.id && unit.player !== this.player && unit.side !== this.side){
				
				if(this.path.length > 0){
					//check to see if movement ends in an attack
					clash = this.checkSpriteOverlap(this.sprite_ghost, unit.sprite, true)
				}else{
					clash = this.checkSpriteOverlap(this.sprite, unit.sprite, true)
				}

				if(clash === true){
					
					in_combat_range = true;
					
					// if(callBack){
					// 	callBack(this, unit)
					// }

					if(endFunction){
						switch(endFunction){
							case "fight":
								//SET BOTH UNITS AS FIGHTING EACH OTHER
								this.in_combat = true;
								unit.in_combat = true;
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
		
		//generate, play then destroy attack cloud
		// let sprite_hit = GameScene.scene.add.sprite(this.sprite.x, this.sprite.y, 'punch') //.setScale(4);
		// sprite_hit.setScale(0.75).setDepth(2).setAlpha(0.75);			
		// sprite_hit.x = defender.sprite.x;
		// sprite_hit.y = defender.sprite.y;
		// sprite_hit.anims.play('hit');		
		// sprite_hit.once('animationcomplete', (sprite_hit)=>{
		// 	sprite_hit.destroy()
		// })
		// GameScene.sfx['sword'].play();
		
		
		let options = {
			scene: GameScene.scene,
			key: "sword"+this.id+"_"+defender.id,
			spritesheet: "punch",
			framerate: 30,
			sfx: "sword",
			alpha: 0.75,
			scale: 0.5,
			pos: {
				x: defender.sprite.x,
				y: defender.sprite.y
			}
		}
		new particle(options)		
		
		
		defender.wound(this.fight_damage);
	}
	
}
