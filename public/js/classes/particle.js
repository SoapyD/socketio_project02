
const particle = class {
	constructor(options) {	

		
		if(options.sfx){
			GameScene.sfx[options.sfx].play();
		}
		
		if(options.spritesheet){
			this.sprite = options.scene.add.sprite(options.pos.x, options.pos.y, options.spritesheet) //.setScale(4);
			this.sprite.setDepth(2).setAlpha(options.alpha); //.setScale(options.scale).
			
			
			if(options.width){
				this.sprite.displayWidth = options.width * (GameScene.tile_size * 2.5);
				this.sprite.displayHeight = options.width * (GameScene.tile_size * 2.5);
			}
		}
		
		if(options.key){
			this.key = options.key;
			//THIS EXPLOSION
			options.scene.anims.create({
			key: options.key,
			frames: options.scene.anims.generateFrameNumbers(options.spritesheet),
			frameRate: options.framerate
			})					
			
			this.sprite.anims.play(options.key);			
			
			this.sprite.once('animationcomplete', (sprite)=>{
				sprite.destroy()
			})				
			
		}
		
		if(options.text && options.text_style){
			this.text = options.scene.add.text(options.pos.x, options.pos.y, options.text, options.text_style).setDepth(20);
			this.text.x -= this.text.width / 2;
		}
		
		if(options.tween){
			
			let target;
			if(this.sprite){
				target = this.sprite
			}
			if(this.text){
				target = this.text
			}			
			
			options.scene.tweens.add({
				targets: target,
				y: options.pos.y - 30,
				duration: 3000,
				// alpha: 0,
				ease: 'Power3',
                onComplete: function ()
                {
					// target.destroy();
					options.scene.tweens.add({
						targets: target,
						duration: 1000,
						alpha: 0,
						onComplete: function ()
						{						
							target.destroy();
						}
					})
                }
			}); 
		}
		
	}
	
}