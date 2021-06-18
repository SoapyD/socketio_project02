
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

		//IF TARGET IS CLOSER THAN TOTAL RANGE, ADJUST THE RANGE
		let val = Math.pow(options.unit.sprite.x - options.target.x, 2) + Math.pow(options.unit.sprite.y - options.target.y, 2)		
		let path_range = Math.sqrt(val)


		if(path_range < this.range){
			this.range = path_range
		}
		
		this.speed = 200;
		this.damage =  options.unit.shoot_damage;
		this.blast_spritesheet = options.unit.blast_spritesheet;
		this.blast_radius = options.unit.blast_radius;	
		
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


		//DEAL DAMAGE IF IT'S NOT A BLAST WEAPON
		if(bullet.parent.blast_radius === 1){
			if(bullet.parent.player !== unit.parent.player){

				let options = {
					damage: bullet.parent.damage,
					ap: bullet.parent.unit.shoot_ap,
					bonus: bullet.parent.unit.shooting_bonus,
					// attacker: bullet.parent.unit,
					random_roll: gameFunctions.getRandomInt(20),
					defender_id: unit.parent.player
				}				
				
				
				if(GameScene.online === false){
					unit.parent.wound(options);
				}else{
					//ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
					if(gameFunctions.params.player_number === bullet.parent.unit.player){
						let data = {
							functionGroup: "socketFunctions",  
							function: "messageAll",
							returnFunctionGroup: "connFunctions",
							returnFunction: "woundUnit",
							returnParameters: options,
							message: "Wound Unit"
						}				
						connFunctions.messageServer(data)
					}
				}
			}
		}

	}
	
	kill(){
		
		if(this.blast_radius > 1){
			gameFunctions.units.forEach((unit) => {
				
				let val = Math.pow(this.sprite.x - unit.sprite.x, 2) + Math.pow(this.sprite.y - unit.sprite.y, 2)
				let dist = Math.sqrt(val)
				if(dist <= (this.blast_radius / 2) * GameScene.tile_size){
										
					// let options = {
					// 	damage: this.damage,
					// 	ap: this.unit.shoot_ap,
					// 	bonus: this.unit.shooting_bonus,	
					// 	attacker: this.unit
					// }			
					// unit.wound(options);
					
					
					let options = {
						damage: this.damage,
						ap: this.unit.shoot_ap,
						bonus: this.unit.shooting_bonus,	
						// attacker: this.unit,
						random_roll: gameFunctions.getRandomInt(20),
						defender_id: unit.id
					}


					if(GameScene.online === false){
						unit.wound(options);
					}else{
						//ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
						if(gameFunctions.params.player_number === this.unit.player){
							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								returnFunctionGroup: "connFunctions",
								returnFunction: "woundUnit",
								returnParameters: options,
								message: "Wound Unit"
							}				
							connFunctions.messageServer(data)
						}
					}					
					
				}
			})	
		}
		
		
		let options = {
			scene: GameScene.scene,
			key: "boom"+this.id,
			spritesheet: this.blast_spritesheet,
			width: this.blast_radius,
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
		GameScene.active_actions--;
		this.delete = true;

		// this.sprite.disableBody(true, true);
	}
	
	checkRange(bullet){
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		

		if (current_range >= this.range){
			this.kill();
		}
		
		let gridX = Math.floor(this.sprite.x/GameScene.tile_size);
		let gridY = Math.floor(this.sprite.y/GameScene.tile_size);	
		
		let cell = GameScene.grid[gridY][gridX]
		

		if(!GameScene.pathfinder.acceptable_tiles.includes(cell) && this.delete === false){
			// this.sprite.disableBody(true, true);
			// GameScene.bullets = [];
			
			this.kill();
		}
	}
}
