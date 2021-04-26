
const unit = class {
	constructor(scene, spritesheet, x, y, side, player) {
		
		this.side = side,
		this.player = player,			
		
		// this.selected = false;
		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.max_movement = 10;
		this.shoot_range = 200;
		this.health = 100;
		
		this.x = x + (gameFunctions.tile_size / 2);
		this.y = y + (gameFunctions.tile_size / 2);
		
		this.sprite = scene.physics.add.image(this.x,this.y,spritesheet).setInteractive();
		this.sprite.setImmovable(true)
		this.sprite.setDepth(1);
		this.sprite.parent = this
		GameScene.unit_collisions.add(this.sprite)
		
		this.sprite_base = scene.add.image(this.x,this.y,"base");
		this.sprite_base.setDepth(0.5);
		
		this.sprite.on('pointerup', this.selectHander)		

		
		this.graphics = scene.add.graphics();		
		this.path;
		this.targets = [];
		
		this.drawPath = this.drawPath.bind(this);
		this.selectHander = this.selectHander.bind(this);
	}

	kill(){
		this.sprite.disableBody(true, true);
		this.sprite_base.destroy(true);		
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
					GameScene.selected_unit.sprite_base.setTint(0xffffff)
				}		

				//TURN ENW SELECTED MARKER, RED
				this.parent.sprite_base.setTint(0xff0000);

				GameScene.selected_unit = this.parent;
				GameScene.left_click = false;
				// this.parent.sprite_base.setVisible(true);							
			}

		}
	}
	
	unselectHandler() {
		this.sprite_base.setTint(0xffffff)
		GameScene.selected_unit = undefined;
	}
	
	findPath(scene, pointer) {
		var x = scene.camera.scrollX + pointer.x;
		var y = scene.camera.scrollY + pointer.y;
		var toX = Math.floor(x/gameFunctions.tile_size);
		var toY = Math.floor(y/gameFunctions.tile_size);

		if(toX < GameScene.map.width && toY < GameScene.map.height
		  && toX >= 0 && toY >= 0){

			var fromX = Math.floor(this.x/gameFunctions.tile_size);
			var fromY = Math.floor(this.y/gameFunctions.tile_size);		

			GameScene.finder.findPath(fromX, fromY, toX, toY, this.drawPath);			
			GameScene.finder.calculate(); // don't forget, otherwise nothing happens						
			
		}
		

	}
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawPath(path) {

		if (path){
			
			//STRIP PATH BACK TO MAX MOVEMENT LENGTH
			this.path = path.slice(0,this.max_movement - 1)
			
			//RESET THE DRAW GRAPHICS
			this.graphics.clear()
			this.graphics.lineStyle(10, 0x2ECC40);	
			this.graphics.beginPath();

			this.path.forEach((pos, i) => {
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += 0.5;
				pos.y += 0.5;	
				// console.log(pos)
				
				if (i !== 0){
					this.graphics.lineTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
				else{
					this.graphics.moveTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
			})			

			this.graphics.strokePath();		
		}
	}
	
	move() {
		if (this.path){
			let tweens = []
			for(let i = 0; i < this.path.length-1; i++){
				let ex = this.path[i+1].x;
				let ey = this.path[i+1].y;
				
				let tween_data = {
					// targets: this.sprite,
					targets: [this.sprite, this.sprite_base],
					x: {value: ex*GameScene.map.tileWidth, duration: 200},
					y: {value: ey*GameScene.map.tileHeight, duration: 200},
					onComplete: function ()
					{
						this.x = this.sprite.x
						this.y = this.sprite.y
						
						let end_path = this.path[this.path.length - 1];
						
						if(this.x / gameFunctions.tile_size === end_path.x && this.y / gameFunctions.tile_size === end_path.y){
							this.graphics.clear()
							this.path = undefined;
						}
					}.bind(this)			
				}
				
				tweens.push(tween_data);
				
				// tween_data.targets = this.sprite_base;
				// tweens.push(tween_data);
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
				
				let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
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
			// let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, dest);
			// if(angle){
			// 	GameScene.bullets.push(new bullet(scene, "bullet", this.x, this.y, angle, this.shoot_range, this.side, this.player))				
			// }

		}
		
	}
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawTarget() {

		// console.log(this)		
		
		if (this.targets){

			//RESET THE DRAW GRAPHICS
			this.graphics.clear()
			this.graphics.lineStyle(10, 0x2ECC40);	
			this.graphics.beginPath();


			this.targets.forEach((pos, i) => {

				this.graphics.beginPath();
				// console.log(this)
				this.graphics.moveTo(this.x, this.y);
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += 0.5;
				pos.y += 0.5;	
				// console.log(pos)
				
				this.graphics.lineTo(pos.x, pos.y);
			})			

			this.graphics.strokePath();		
		}
	}	
	
	shoot() {
		
		if(this.targets){
			this.targets.forEach((target) => {

				let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, target);
				if(angle){
					// GameScene.bullets.push(new bullet(GameScene.scene, "bullet", this.x, this.y, angle, this.shoot_range, this.side, this.player))
					GameScene.bullets.push(new bullet(GameScene.scene, "bullet", angle, this))
					//BULLET DEATH KILLS THE GRAPHIC
				}				
				
			})
			unit.targets = [];
		}		
		
	}
	
	
}
