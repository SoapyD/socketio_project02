
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
		let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, pointer);
		GameScene.bullets.push(new bullet(scene, "bullet", this.x, this.y, angle))
	}
}
