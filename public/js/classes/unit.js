
const unit = class {
	constructor(scene, spritesheet, x, y) {
		// this.selected = false;
		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.max_movement = 10;
		
		this.x = x + (gameFunctions.tile_size / 2);
		this.y = y + (gameFunctions.tile_size / 2);
		
		this.sprite = scene.add.image(this.x,this.y,spritesheet).setInteractive();
		this.sprite.setDepth(1);
		this.sprite.parent = this
		
		this.sprite_base = scene.add.image(this.x,this.y,"base");
		this.sprite_base.setDepth(0.5);
		
		this.sprite.on('pointerup', this.selectHander)		

		
		this.graphics = scene.add.graphics();		
		this.path;
		
		this.drawPath = this.drawPath.bind(this);
		this.selectHander = this.selectHander.bind(this);
	}

	selectHander(pointer) {

		// console.log(this.parent)
		if (pointer.leftButtonReleased())
		{
			if(GameScene.selected_unit){
				GameScene.selected_unit.sprite_base.setTint(0xffffff)
			}		
			
			this.parent.sprite_base.setTint(0xff0000);
			
			GameScene.selected_unit = this.parent;
			GameScene.left_click = false;
			// this.parent.sprite_base.setVisible(true);			
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

		var fromX = Math.floor(this.x/gameFunctions.tile_size);
		var fromY = Math.floor(this.y/gameFunctions.tile_size);		
		
		GameScene.finder.findPath(fromX, fromY, toX, toY, this.drawPath);			
		GameScene.finder.calculate(); // don't forget, otherwise nothing happens			
	}
	
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
	
	shoot (scene, pointer) {
		// console.log(this.sprite.x,this.sprite.y,pointer.x,pointer.y)
		
		//GET BASE POSITIONAL DATA
		let pos = {
			start_x: Math.floor(this.sprite.x / gameFunctions.tile_size),
			start_y: Math.floor(this.sprite.y / gameFunctions.tile_size),			
			end_x: Math.floor(pointer.x / gameFunctions.tile_size),
			end_y: Math.floor(pointer.y / gameFunctions.tile_size),					
		}
		//GET DIFFERENCE INFO
		pos.x_diff = pos.end_x - pos.start_x;
		pos.y_diff = pos.end_y - pos.start_y;
			
		// pos.x_dir = (pos.x_diff < 0) ? -1:1;
		// pos.y_dir = (pos.y_diff < 0) ? -1:1;		

		//FIND OUT WHICH NORMALISED DIFF IS HIGHER
		pos.x_norm = (pos.x_diff < 0) ? pos.x_diff * -1:pos.x_diff;
		pos.y_norm = (pos.y_diff < 0) ? pos.y_diff * -1:pos.y_diff;

		//HIGHEST DISTANCE DETERMINES THE ITTS, THEN DOUBLE THEM TO MAKE SURE ALL CELLS IN BETWEEN ARE COVERED
		pos.itts = (pos.x_norm > pos.y_norm) ? pos.x_norm:pos.y_norm;	
		pos.itts *= 2;

		pos.x_itt_value = (gameFunctions.tile_size * pos.x_diff) / pos.itts;
		pos.y_itt_value = (gameFunctions.tile_size * pos.y_diff) / pos.itts;		

		//PLOT OUT THE GRID POSITIONS OF THE CELLS BUT ONLY TO RANGE OF GUN
		pos.cells = [];
		for(let i=0; i<=pos.itts ;i++){
			let cell = {
				x: (pos.start_x * gameFunctions.tile_size) + (i * pos.x_itt_value) + (gameFunctions.tile_size / 2),
				y: (pos.start_y * gameFunctions.tile_size) + (i * pos.y_itt_value) + (gameFunctions.tile_size / 2),
			}
			cell.x_pos = Math.floor(cell.x / gameFunctions.tile_size)
			cell.y_pos = Math.floor(cell.y / gameFunctions.tile_size)
			cell.x_pos_real = cell.x_pos * gameFunctions.tile_size
			cell.y_pos_real = cell.y_pos * gameFunctions.tile_size
			
			pos.cells.push(cell)
			
			//BREAK THE LOOP IF RANGE IS EQUAL OR ABOVE GUN RANGE
			let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
			if(current_range >= 100){ break; }
		}
		
		let obj_check = false;
		pos.cells.forEach((cell) => {
			// scene.physics.add.image(cell.x,cell.y,"marker")
			// scene.physics.add.image(cell.x_pos_real,cell.y_pos_real,"marker").setTint(0xff0000);
			let grid_cell = GameScene.grid[cell.y_pos][cell.x_pos]
			console.log(grid_cell)
			if (grid_cell !== 1){
				obj_check = true;
			}
		})
		console.log(pos)		
		
		if(obj_check === false){
			let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, pointer);
			GameScene.bullets.push(new bullet(scene, "bullet", this.x, this.y, angle, 100))			
		}

	}
}
