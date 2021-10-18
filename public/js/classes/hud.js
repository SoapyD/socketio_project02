
const hud = class {
	constructor(options) {	

		this.x = options.x;
		this.y = options.y;		
		this.width = options.width;
		this.height = options.height;		
		this.x_itts = this.width / options.x_itts;
		this.y_itts = this.height / options.y_itts;
		this.x_indent = options.x_indent
		this.y_indent = options.y_indent

        this.graphics = options.scene.add.graphics();

		this.graphics.fillStyle(options.fill_colour, options.fill_alpha);
        this.graphics.fillRoundedRect(options.x, options.y, options.width, options.height, options.radius);

		if(options.border){
			this.graphics.lineStyle(options.border.width, options.border.colour, options.border.alpha);
			this.graphics.strokeRoundedRect(this.x, this.y, this.width, this.height, options.radius);
		}


		
		let style = { font: "28px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: options.width, align: "left" };
		let style_center = { font: "28px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: options.width, align: "center" };

		this.text = [];

		options.text.forEach((item) => {

			let text_item = {};
			
			text_item.id = item.id;
			text_item.label = item.label;

			if (item.box){
				text_item.text = options.scene.add.text(0, 0, item.label, style_center).setDepth(200);
				text_item.text.x = this.x+(item.x*this.x_itts + ((item.box.width / 2) * this.x_itts) - (text_item.text.width / 2)) + this.x_indent
				text_item.text.y = this.y+(item.y*this.y_itts + ((item.box.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent	

				text_item.graphics = options.scene.add.graphics();
				text_item.graphics.fillStyle(item.box.fill_colour, item.box.fill_alpha);
				text_item.graphics.fillRoundedRect(
					(item.x*this.x_itts)+this.x_indent, 
					(item.y*this.y_itts)+this.y_indent, 
					item.box.width * this.x_itts, 
					item.box.height * this.y_itts, 
					item.box.radius);			
				
			}else{
				text_item.text = options.scene.add.text(0, 0, item.label, style).setDepth(200);
				text_item.text.x = this.x+(item.x*this.x_itts) + this.x_indent
				text_item.text.y = this.y+(item.y*this.y_itts + ((item.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent	
				
			}

			this.text.push(text_item)

			if(options.grid === true){
				this.graphics.lineStyle(2, 0x00aa00);
		
				this.graphics.beginPath();			
				
				/*
				for(let x=0; x<this.width; x+=this.x_itts){
					this.graphics.moveTo(x+this.x_indent, 0+this.x_indent);
					this.graphics.lineTo(x+this.y_indent, this.height);
				}				
			
				for(let y=0; y<this.height; y+=this.y_itts){
					this.graphics.moveTo(0+this.x_indent, y+this.x_indent);
					this.graphics.lineTo(this.width, y+this.y_indent);
				}				
				*/
				for(let x=this.x; x<this.x+this.width; x+=this.x_itts){
					this.graphics.moveTo(x+this.x_indent, this.y+this.y_indent);
					this.graphics.lineTo(x+this.x_indent, this.y+this.height);
				}				
			
				for(let y=this.y; y<this.y+this.height; y+=this.y_itts){
					this.graphics.moveTo(this.x+this.x_indent, y+this.y_indent);
					this.graphics.lineTo(this.x+this.width, y+this.y_indent);
				}	

				this.graphics.closePath();
				this.graphics.strokePath();	
			}

		})


	}
}