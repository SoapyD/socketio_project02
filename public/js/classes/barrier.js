
const barrier = class {
	constructor(options) {	
	
        this.id = GameScene.barriers.length;
        this.type = "barrier"
        this.unit = options.unit
        this.side = options.unit.side
        this.scene = options.scene
        this.alive = true;
        this.life = options.life;

        // this.effects = [
        //     "blunt"
        // ];
        this.effects = options.effects

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
         

        this.sprite = options.scene.physics.add.image(this.origin.x,this.origin.y,options.blast_spritesheet)
        this.sprite.setDepth(20);
        this.sprite.setAlpha(0.5);

        this.sprite.setTint(this.unit.colour)

        if(options.blast_radius){
            let size = options.blast_radius  * gameFunctions.tile_size;
            // console.log("barrier size:",size)
            this.sprite.displayWidth = size;
            this.sprite.displayHeight = size;
            // this.sprite.displayWidth = options.blast_radius * (gameFunctions.tile_size * 2.5);
            // this.sprite.displayHeight = options.blast_radius * (gameFunctions.tile_size * 2.5);
        }


		// this.colliders = [];

		// GameScene.unit_collisions.forEach((collider, i) => {
		// 	if(i !== this.unit.side){
		// 		this.colliders.push(options.scene.physics.add.collider(this.sprite, GameScene.unit_collisions[i], this.checkHit))
		// 	}
		// })


        this.sprite.parent = this;


		GameScene.barriers.push(this)
    }

    // checkHit(barrier, unit) {
    //     console.log("hits "+unit.parent.id)
    // }
    
    updateText() {
        this.text.x += (this.text.width / 2)
        this.text.y += (this.text.height / 2)

        this.text.setText(this.life)     
        this.text.x -= (this.text.width / 2)
        this.text.y -= (this.text.height / 2)        
        
    }

	checkDeath() {
        // if(this.type === 'unit'){
            this.checkCollisions();
        // }

        this.life--;
        this.updateText()
        if (this.life <= 0){
            this.alive = false;
            this.sprite.destroy();
            this.text.destroy();
        }
    }

    checkCollisions = () => {
		if(this.blast_radius > 0){
			gameFunctions.units.forEach((unit) => {
                this.checkAction(unit)
			})	
		}        
    }    

    checkEffects(name) {
        let has_rule = false;
        if (this.effects.find((rule) => rule === name)){
            has_rule = true;
        }	
    
        return has_rule
    }

    checkAction = (obj) => {

        let val = Math.pow(this.sprite.x - obj.sprite.x, 2) + Math.pow(this.sprite.y - obj.sprite.y, 2)
        let dist = Math.round(Math.sqrt(val),0)
        
        let blast_size = (this.blast_radius*0.5) * gameFunctions.tile_size

        if(dist <= blast_size){    
            // this.applyDamage();
            // obj.kill()

            if(obj.type === 'bullet'){
                if(this.checkEffects("blunt") === true && obj.blunt === false){
    
                    let part_options = {
                        scene: GameScene.scene,
                        text: 'blunt',
                        text_style: { 
                            font: "16px Arial",
                            fill: "#ff0044",
                            align: "center",
                            stroke: "#000000",
                            strokeThickness: 2
                        },
                        pos: {
                            x: obj.sprite.x,
                            y: obj.sprite.y
                        },
                        tween:true
                    }
                    new particle(part_options)
    
                    obj.blunt = true;
                    GameScene.sfx['sword'].play();
                }
            }

            if(obj.type === 'unit'){
                if(this.checkEffects("poison") === true && obj.poison_timer < 2){

                    if(obj.poison === false){
                        obj.drawTextParticle("poisoned!")
                    }

                    obj.poison = true;
                    obj.poison_timer = 2;
                    GameScene.sfx['sword'].play();

                    // this.createPopup(obj.sprite, "poison")
                }
            }

        }
    }

    createPopup = (obj, string) => {
		let part_options = {
			scene: GameScene.scene,
			text: string,
			text_style: { 
				font: "16px Arial",
				fill: "#ff0044",
				align: "center",
				stroke: "#000000",
				strokeThickness: 2
			},
			pos: {
				x: obj.x,
				y: obj.y
			},
			tween:true
		}
		new particle(part_options)        
    }
    
    applyDamage = (unit) => {
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
    }

}
