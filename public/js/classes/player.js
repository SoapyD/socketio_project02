
const player = class {
	constructor(scene, spritesheet, x, y) {
		// this.selected = false;
		this.moves = 0;
		this.shots = 0;
		this.fights = 0;
		
		this.x = x;
		this.y = y;
		
		
		
		this.sprite = scene.add.image(this.x,this.y,spritesheet).setInteractive();
		this.sprite.setDepth(1);
		this.sprite.setOrigin(0,0.5);		
		this.sprite.parent = this
		
		this.sprite_base = scene.add.image(this.x,this.y,"base");
		this.sprite_base.setOrigin(-0,0.4);	
		this.sprite_base.setDepth(0.5);
		// this.sprite_base.setVisible(false);
		
		
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
			// this.parent.selected = true;
			// console.log(this)
			GameScene.selected_player = this.parent;
			GameScene.left_click = false;
			// this.parent.sprite_base.setVisible(true);			
		}
	}
	
	
	findPath(scene, pointer) {
		var x = scene.camera.scrollX + pointer.x;
		var y = scene.camera.scrollY + pointer.y;
		var toX = Math.floor(x/32);
		var toY = Math.floor(y/32);

		var fromX = Math.floor(this.x/32);
		var fromY = Math.floor(this.y/32);		
		
		GameScene.finder.findPath(fromX, fromY, toX, toY, this.drawPath);			
		GameScene.finder.calculate(); // don't forget, otherwise nothing happens			
	}
	
	drawPath(path) {


		if (path){
			this.path = path.slice(0,9)

			this.graphics.clear()
			this.graphics.lineStyle(10, 0x2ECC40);	
			this.graphics.beginPath();

			this.path.forEach((pos, i) => {
				if (i !== 0){
					this.graphics.lineTo(pos.x * 32 + 16, pos.y * 32 + 16);
				}
				else{
					this.graphics.moveTo(pos.x * 32 + 16, pos.y * 32 + 16);
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
						
						if(this.x / 32 === end_path.x && this.y / 32 === end_path.y){
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
			
			GameScene.selected_player = undefined;
		}
	}
}
