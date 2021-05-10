
const particle = class {
	constructor(options) {	

		//THIS EXPLOSION
		options.scene.anims.create({
		key: options.key,
		frames: options.scene.anims.generateFrameNumbers(options.spritesheet),
		frameRate: options.framerate
		})
		
		if(options.sfx){
			GameScene.sfx[options.sfx].play();
		}
		
		
		this.sprite = options.scene.add.sprite(options.pos.x, options.pos.y, options.spritesheet) //.setScale(4);
		this.sprite.setScale(options.scale).setDepth(2).setAlpha(options.alpha);
		this.sprite.anims.play(options.key);
		
		this.sprite.once('animationcomplete', (sprite)=>{
			sprite.destroy()
		})		
	}
	
}