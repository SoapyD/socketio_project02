
const bullet = class {
	constructor(scene, spritesheet, x, y, angle, range) {
		
		// this.x = x;
		// this.y = y;
		this.range = range;
		this.speed = 200;
		
		this.origin = {
			x: x,
			y: y
		}
		
		this.sprite = scene.physics.add.image(x,y,spritesheet)
		this.sprite.setDepth(10);
		this.sprite.setOrigin(0.5,0.5);		
		this.sprite.parent = this;
		
        this.sprite.rotation = angle;
		
		this.sprite.enableBody(true, x, y, true, true);

		scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), this.speed, this.sprite.body.velocity);		
	}

	checkRange(){
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		
		if (current_range >= this.range){
			this.sprite.disableBody(true, true);
		}
		// console.log(current_range)
		
		
		let gridX = Math.floor(this.sprite.x/gameFunctions.tile_size);
		let gridY = Math.floor(this.sprite.y/gameFunctions.tile_size);	
		
		let cell = GameScene.grid[gridY][gridX]
		// console.log(cell)
		if(cell !== 1){
			this.sprite.disableBody(true, true);
			console.log(gridX, gridY, cell)
			GameScene.bullets = [];
		}
		// console.log(cell)
	}
}
