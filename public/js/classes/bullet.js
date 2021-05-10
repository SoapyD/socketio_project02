
const bullet = class {
	// constructor(scene, spritesheet, x, y, angle, range, side, player) {
	constructor(options) {	
	
		// this.x = x;
		// this.y = y;
		this.id = GameScene.bullets.length;
		this.delete = false;
		this.unit = options.unit;
		this.side = options.unit.side;
		this.player = options.unit.player;
		this.range = options.unit.shoot_range;
		this.speed = 200;
		this.damage =  options.unit.shoot_damage;
		
		this.origin = {
			x: options.unit.sprite.x,
			y: options.unit.sprite.y
		}
		this.angle = options.angle;
		this.target = options.target;
		
		this.sprite = options.scene.physics.add.image(options.unit.sprite.x,options.unit.sprite.y,options.spritesheet)

		this.sprite.setDepth(20);
		this.sprite.setOrigin(0.5,0.5);	
		this.sprite.body.setSize(5, 5); //set the size of the bounding box
		this.sprite.parent = this;
		
        this.sprite.rotation = options.angle;
		
		this.sprite.enableBody(true, options.unit.sprite.x, options.unit.sprite.y, true, true);

		options.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(options.angle), this.speed, this.sprite.body.velocity);	
		
		
		GameScene.unit_collisions.forEach((collider, i) => {
			if(i !== this.side){
				options.scene.physics.add.collider(this.sprite, GameScene.unit_collisions[i], this.checkHit)
			}
		})

		//PLAY SHOT SOUND
		GameScene.sfx['shot'].play();

		
	}

	checkHit(bullet, unit) {
		
		//run kill function on bullet
		bullet.parent.kill();
		// unit.parent.wound(bullet.parent.damage);

		if(bullet.parent.player !== unit.parent.player){
			// unit.setTint(0xff0000);
			// bullet.parent.kill();
			unit.parent.wound(bullet.parent.damage);
		}		
	}
	
	kill(){
		
		let options = {
			scene: GameScene.scene,
			key: "boom"+this.id,
			spritesheet: "explosion",
			framerate: 30,
			sfx: "blast",
			alpha: 0.75,
			scale: 0.75,
			pos: {
				x: this.sprite.x,
				y: this.sprite.y
			}
		}
		new particle(options)
		
		
		this.sprite.destroy();
		this.delete = true;


		
		// this.sprite.disableBody(true, true);
	}
	
	checkRange(bullet){
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		
		// console.log(current_range, this.sprite.x, this.sprite.y, this)
		if (current_range >= this.range){
			this.kill();
		}
		
		let gridX = Math.floor(this.sprite.x/GameScene.tile_size);
		let gridY = Math.floor(this.sprite.y/GameScene.tile_size);	
		
		let cell = GameScene.grid[gridY][gridX]
		

		if(!GameScene.pathfinder.acceptable_tiles.includes(cell)){
			// this.sprite.disableBody(true, true);
			// GameScene.bullets = [];
			
			this.kill();
		}
	}
}
