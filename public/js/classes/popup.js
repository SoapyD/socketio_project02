
const popup = class {
	constructor(options) {	
		
		let text_style = { 
			font: "16px Arial",
			fill: "#ff0044",
			align: "center",
			stroke: "#000000",
			strokeThickness: 2
		}

		this.text = options.scene.add.text(options.pos.x, options.pos.y, options.text, text_style).setDepth(100);
		this.text.x -= this.text.width / 2;

		this.rectangle = options.scene.add.rectangle(options.pos.x, options.pos.y + (this.text.height / 2), this.text.width, this.text.height, 0xffffff).setDepth(99);
		
		// console.log(this.text)
		
		// let target;
		// if(this.text){
		// 	target = this.text
		// }			

		options.scene.tweens.add({
			targets: [this.rectangle, this.text],
			duration: 3000,
			alpha: 0,
			ease: 'Power3',
			onComplete: function ()
			{
				// target.destroy();
				if(this.text){
					this.text.destroy();
				}
				if(this.rectangle){
					this.rectangle.destroy();
				}

			}
		}); 
		
	}
	
}