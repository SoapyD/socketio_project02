
const barrier = class {
	constructor(options) {	
	
        this.id = GameScene.barriers.length;
        this.scene = options.scene
        this.delete = false;
        this.life = 2;

        this.text = this.life
        this.style =  { 
            font: "16px Arial",
            fill: "#ff0044",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        }

        this.text = options.scene.add.text(options.x, options.y, this.text, this.style).setDepth(20);
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;

		this.blast_spritesheet = options.blast_spritesheet;
		this.blast_radius = options.blast_radius;	
		
		this.origin = {
			x: options.x,
			y: options.y
		}
		// this.angle = options.angle;
		// this.target = options.target;
         

        this.sprite = options.scene.physics.add.image(this.origin.x,this.origin.y,options.blast_spritesheet)
        this.sprite.setDepth(20);
        this.sprite.setAlpha(0.5)

        if(options.blast_radius){
            this.sprite.displayWidth = options.blast_radius * (gameFunctions.tile_size * 3);
            this.sprite.displayHeight = options.blast_radius * (gameFunctions.tile_size * 3);
        }


        this.sprite.parent = this;


		GameScene.barriers.push(this)
    }
    
    updateText() {
        this.text.x += (this.text.width / 2)
        this.text.y += (this.text.height / 2)

        this.text.setText(this.life)     
        this.text.x -= (this.text.width / 2)
        this.text.y -= (this.text.height / 2)        
        
    }

	checkDeath() {
        this.checkCollisions();

        this.life--;
        this.updateText()
        if (this.life <= 0){
            this.delete = true;
            this.sprite.destroy();
            this.text.destroy();
        }
    }
    
    checkCollisions = () => {
		if(this.blast_radius > 0){
			gameFunctions.units.forEach((unit) => {
				
				let val = Math.pow(this.sprite.x - unit.sprite.x, 2) + Math.pow(this.sprite.y - unit.sprite.y, 2)
                let dist = Math.round(Math.sqrt(val),0)
                
                let blast_size = (this.blast_radius+0.5) * gameFunctions.tile_size

				if(dist <= blast_size){
                    
					let options = {
						damage: 1,
						ap: 0,
						bonus: 0,	
						random_roll: -1,
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
								room_name: gameFunctions.params.room_name,
								returnFunctionGroup: "connFunctions",
								returnFunction: "woundUnit",
								returnParameters: options,
								message: "Wound Unit"
							}				
							connFunctions.messageServer(data)
						}
					}					
					/**/
				}
			})	
		}        
    }

}
