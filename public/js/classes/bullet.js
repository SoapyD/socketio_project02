
const bullet = class {
	// constructor(scene, spritesheet, x, y, angle, range, side, player) {
	constructor(scene, spritesheet, angle, unit) {	
	
	
		// this.x = x;
		// this.y = y;
		this.unit = unit;
		this.side = unit.side;
		this.player = unit.player;
		this.range = unit.range;
		this.speed = 200;
		this.damage = 50;
		
		this.origin = {
			x: unit.x,
			y: unit.y
		}
		
		this.sprite = scene.physics.add.image(unit.x,unit.y,spritesheet)
		this.sprite.setDepth(10);
		this.sprite.setOrigin(0.5,0.5);		
		this.sprite.parent = this;
		
        this.sprite.rotation = angle;
		
		this.sprite.enableBody(true, unit.x, unit.y, true, true);

		scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), this.speed, this.sprite.body.velocity);	
		
		
		scene.physics.add.collider(this.sprite, GameScene.unit_collisions,(bullet, unit) => {
			// console.log("TEST")
			
			// console.log(unit)
			if(bullet.parent.player !== unit.parent.player){
				bullet.parent.kill();
				// unit.setTint(0xff0000);
				unit.parent.wound(bullet.parent.damage);
			}

		})
	}

	kill(){
		// console.log(this)
		this.unit.graphics.clear()
		this.sprite.disableBody(true, true);
	}
	
	checkRange(){
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		
		if (current_range >= this.range){
			this.kill();
		}
		// console.log(current_range)
		
		
		let gridX = Math.floor(this.sprite.x/gameFunctions.tile_size);
		let gridY = Math.floor(this.sprite.y/gameFunctions.tile_size);	
		
		let cell = GameScene.grid[gridY][gridX]
		// console.log(cell)
		if(cell !== 1){
			this.sprite.disableBody(true, true);
			// console.log(gridX, gridY, cell)
			GameScene.bullets = [];
		}
		// console.log(cell)
	}
}
