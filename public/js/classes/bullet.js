
const bullet = class {
	constructor(scene, spritesheet, x, y) {
		
		this.x = x;
		this.y = y;
		
		this.sprite = scene.add.image(this.x,this.y,spritesheet)
		this.sprite.setDepth(1);
		this.sprite.setOrigin(0,0.5);		
		this.sprite.parent = this
	}

}
