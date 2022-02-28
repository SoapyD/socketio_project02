
const unit = class {
	constructor(options) {
		
		// super(options);
		this.scene = options.scene;
		
		this.id = gameFunctions.units.length;
		this.side = options.side; //this can be used if each side has multiple players
		this.player = options.player; //this is the specific owner of the unit
		this.squad = options.squad;; //this can be used for squad checks like unit cohesion
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
		this.cost = options.cost;

		this.upgrade_id = options.upgrade_id;
		// this.setup = false;

		this.alive = options.alive;
		this.killed_by = -1;
		
		this.path = [];
		this.is_moving = false;


		this.moved = false;
		this.shot = false;
		this.fought = false;
		
		this.unit_name = options.unit_name;
		this.health = options.health;
		this.max_health = options.health;
		this.death_sfx = options.death_sfx;
		this.shooting_bonus = options.shooting_bonus,
		this.fighting_bonus =  options.fighting_bonus,
		
		
		this.cohesion_check = true;		
		this.movement = options.movement;
		
		this.shoot_name = options.shoot_name;
		this.shoot_range = options.shoot_range;
		this.shoot_damage = options.shoot_damage;
		this.shoot_ap = options.shoot_ap;
		this.blast_spritesheet = options.blast_spritesheet;
		this.blast_radius = options.blast_radius;		
		this.max_targets = options.max_targets;
		this.targets = [];
		
		this.fight_name = options.fight_name;
		this.fight_range = options.fight_range ; //* (options.size + 1);
		this.fight_ap = options.fight_ap;
		this.fight_damage = options.fight_damage;
		this.in_combat = false;
		if(options.in_combat){
			this.in_combat = options.in_combat;
		}

		this.in_combat_with = [];
		this.fight_max_targets = options.fight_max_targets;		
		this.fight_targets = [];
		
		this.armour_name = options.armour_name;
		this.armour = options.armour;
		

		this.sprite_offset = options.sprite_offset;
		
		let x = options.x;
		let y = options.y;
		if(options.loaded){
			//don't add offset
		}else{
			x += gameFunctions.tile_size * this.sprite_offset;
			y += gameFunctions.tile_size * this.sprite_offset;			
		}

		this.depth_sprite_flash = 6;		
		this.depth_sprite = 4;
		this.depth_sprite_ghost = 5;
		this.depth_sprite_symbol = 10;
		this.depth_path = 9;
		this.depth_explosion = 1;
		this.depth_health = 2;
		this.depth_cohesion = 1;
		this.depth_fight_radius = 1.5;
		this.depth_text = 20;
		this.depth_text_box = 10;
		
		
		
		//SPRITES
		this.spritesheet = options.spritesheet;
		this.sprite = options.scene.physics.add.image(x,y,options.spritesheet).setScale(0.8); //.setInteractive();
		this.sprite.setImmovable(true)
		this.sprite.setDepth(this.depth_sprite);
		this.sprite.angle = options.angle;
		this.sprite.parent = this

		// this.sprite.enableBody(true, this.sprite.x, this.sprite.y, true, true);
		GameScene.unit_collisions[this.side].add(this.sprite)
		// this.sprite.on('pointerup', this.selectHander)
		
		
		// if(GameScene.online === false || (GameScene.online === true && this.player === gameFunctions.params.player_number)){
			this.sprite_ghost = options.scene.add.image(x,y,options.spritesheet).setInteractive().setScale(0.8);
			this.sprite_ghost.alpha = 1; //0.5;
			this.sprite_ghost.angle = options.angle;
			this.sprite_ghost.parent = this;
			this.sprite_ghost.is_ghost = true;
			this.sprite_ghost.setDepth(this.depth_sprite_ghost);
			this.sprite_ghost.on('pointerup', this.selectHander)
		// }

		this.symbol_id = options.symbol_id;
		this.sprite_symbol = options.scene.add.image(x,y,"symbols").setScale(0.05 * (this.size + 1))
		this.sprite_symbol.x += (this.sprite.displayWidth / 2) - (this.sprite_symbol.displayWidth / 2)
		this.sprite_symbol.y -= (this.sprite.displayHeight / 2) + (this.sprite_symbol.displayHeight / 2)
		this.sprite_symbol.setFrame(options.symbol_id).setDepth(this.depth_sprite_symbol);
		this.sprite_symbol.alpha = 0.5
		

		//action sprite
		this.sprite_action = options.scene.add.image(x,y,"symbols").setScale(0.08 * (this.size + 1))		
		this.sprite_action.setFrame(0).setDepth(this.depth_sprite_symbol);
		this.sprite_action.alpha = 0.4
		this.sprite_action.visible = false
		
		//THIS EXPLOSION
		options.scene.anims.create({
		key: 'hit',
		frames: options.scene.anims.generateFrameNumbers('punch'),
		frameRate: 50
		})			
		
		
		//SETUP GRAPHICS THAT CAN BE USED TO DRAW ACTIONS
		this.bar_graphic = options.scene.add.graphics().setDepth(this.depth_health);
		this.bar_back_graphic = options.scene.add.graphics().setDepth(this.depth_health);

		this.fight_graphic = options.scene.add.graphics().setDepth(this.depth_fight_radius);
		// GameScene.fight_collisions[this.side].add(this.sprite)

		this.path_graphic = options.scene.add.graphics().setDepth(this.depth_path);
		this.cohesion_graphic = options.scene.add.graphics().setDepth(this.depth_cohesion);
		this.blast_graphics = [];
		for(let i=0; i<10; i++){
			this.blast_graphics.push(options.scene.add.graphics().setDepth(this.depth_explosion));
		}
		

		this.text_style = { 
			font: "8px Arial",
			fill: "#000000",
			align: "center",
			stroke: "#000000",
			strokeThickness: 1
		},		
		this.text = options.scene.add.text(this.sprite.x, this.sprite.y - (this.sprite.displayHeight / 2), "", this.text_style).setDepth(this.depth_text);
		this.text_graphic = options.scene.add.graphics().setDepth(this.depth_text_box);
		
				
		this.drawTint()
		this.drawFlash()
		this.drawFightRadius()

		this.updateElements(this.sprite);
	


		this.selectHander = this.selectHander.bind(this);
	}


//  #####  ####### #       #######  #####  ####### ####### ######   #####  
// #     # #       #       #       #     #    #    #     # #     # #     # 
// #       #       #       #       #          #    #     # #     # #       
//  #####  #####   #       #####   #          #    #     # ######   #####  
// 	     # #       #       #       #          #    #     # #   #         # 
// #     # #       #       #       #     #    #    #     # #    #  #     # 
//  #####  ####### ####### #######  #####     #    ####### #     #  #####  	

selectUnit(single_unit=false) {

	let skip = false
	if(GameScene.online === true){
		if(this.player !== gameFunctions.params.player_number){
			skip = true;
		}
	}

	if (this.side === gameFunctions.current_side && skip === false){
		//TURN OLD SELECTED PLAYER MARKER, WHITE

		if(GameScene.selected_unit){

			GameScene.selected_unit.forEach((selected_unit) => {
				selected_unit.resetColours();
				if(gameFunctions.mode === "fight"){
					selected_unit.resetFightRadius();
				}
				if(single_unit === true){
					selected_unit.unselectHandler();
				}
			})
		}

		if(single_unit === true){
			GameScene.selected_unit = []
			if(gameFunctions.mode === 'move' || gameFunctions.mode === 'charge'){
				this.cohesionCheck();
				this.setupDrawLiveTiles();
			}			
		}
		GameScene.selected_unit.push(this);
		
		GameScene.selected_unit.forEach((selected_unit) => {
			selected_unit.drawFlash(false)
		})		
		
		//RESET GHOST & COHESION IF THE GHOST SPRITE ISN'T SELECTED
		if(!this.is_ghost){
			this.resetGhost();
		}
		
		// if(gameFunctions.mode === "fight"){
		// 	this.drawFightRadius()
		// }
	}
}


//THIS CODE IS RUN IF THE UNIT IS SELECTED DIRECTLY INSTEAD OF SELECTED EN-MASSE
selectHander (pointer) {

	if (pointer.leftButtonReleased())
	{
		this.parent.selectUnit(true);
		GameScene.sfx['select'].play();		
		GameScene.left_click = false;
	}
}


unselectHandler() {
	
	// GameScene.selected_unit.drawFlash(true)
	// GameScene.selected_unit = undefined;
	this.drawFlash(true)
	
	if(gameFunctions.mode === "move" || gameFunctions.mode === "charge"){
		if(this.cohesion > 0){
			this.cohesionCheck();	
		}
	}
}




// ######  #######  #####  ####### #######  #####  
// #     # #       #     # #          #    #     # 
// #     # #       #       #          #    #       
// ######  #####    #####  #####      #     #####  
// #   #   #             # #          #          # 
// #    #  #       #     # #          #    #     # 
// #     # #######  #####  #######    #     #####  	
	
	resetColours(){
		if(this.path.length > 0){
			let colours = {
				line_colour: 0x808080,
				fill_colour: 0x2ECC40,
				line_alpha: 0.5,
				circle_alpha: 0.15,
				fill_alpha: 0.15,
				width: 5
			}
			if(this.cohesion_check === false){
				colours.fill_colour = 0xFF0000; //0x6666ff				
			}
			this.drawPath(colours)
		}
		
	}
	
	resetLocks() {
		this.moved = false;
		this.shot = false;
		this.fought = false;		


		this.checkCombat()
		if(this.in_combat === false){
			this.sprite_action.visible = false;
			this.sprite.body.enable = true;
		}		
	}
	
	resetCohesionGraphic() {
		this.cohesion_graphic.clear()
	}
	
	resetActions() {
		this.path = [];
		this.targets = [];
		this.fight_targets = [];	

		
		// this.resetGhost();
		if(this.sprite_ghost){
			this.sprite_ghost.x = this.sprite.x;
			this.sprite_ghost.y = this.sprite.y;
			this.sprite_ghost.angle = this.sprite.angle;
			this.sprite_ghost.alpha = 1;			
		}

				
		this.path_graphic.clear();
		this.cohesion_graphic.clear();
		this.resetDrawInfo();
		
		this.blast_graphics.forEach((graphic) => {
			graphic.clear();
		})
	}
	
	resetMove() {
		
		this.path = [];
		this.path_graphic.clear();		
		this.resetGhost();
		this.updateElements(this.sprite_ghost);
		
		//CHECK TO SEE IF THE RESET AFFECTS ANY OTHER UNITS THAT'VE MOVED
		//IF SO, RESET THOSE UNIT MOVES AS WELL
		gameFunctions.units.forEach((unit) => {
			if(unit.id !== this.id && unit.path.length > 0){
				let check = this.checkSpriteOverlap(this.sprite_ghost, unit.sprite_ghost)
				// console.log(check,unit.id,this.id)
				
				if(check === true){
					unit.resetMove();
				}
				/**/
			}
		})
		
	}
	
	resetFightRadius() {
		this.fight_graphic.clear();	
	}
	
	resetGhost() {
		if(this.sprite_ghost){
			this.sprite_ghost.x = this.sprite.x;
			this.sprite_ghost.y = this.sprite.y;
			this.sprite_ghost.angle = this.sprite.angle;
			this.sprite_ghost.alpha = 1;
		}
		this.sprite.setTint(this.colour)
		this.sprite.alpha = 1;
		this.drawFightRadius();
		
		if(gameFunctions.mode === "move" || gameFunctions.mode === "charge"){
			if(this.cohesion > 0){
				this.cohesionCheck();	
			}
		}
	}
	
	removeTarget() {
		this.targets.pop();
		this.blast_graphics.forEach((graphic) => {
			graphic.clear();
		})		
		this.drawTarget(this.targets, this.blast_radius);
		// this.drawInfo(this.sprite);
		this.updateElements(this.sprite);
	}
	
	removeFightTarget() {
		this.fight_targets.pop();	
		this.drawTarget(this.fight_targets, 0);
		// this.drawInfo(this.sprite);
		this.updateElements(this.sprite);
	}	
	
	resetDrawInfo(){
		this.text.setText("");
		this.text_graphic.clear();
	}	
	
	
	


	// ██     ██  ██████  ██    ██ ███    ██ ██████  ██ ███    ██  ██████  
	// ██     ██ ██    ██ ██    ██ ████   ██ ██   ██ ██ ████   ██ ██       
	// ██  █  ██ ██    ██ ██    ██ ██ ██  ██ ██   ██ ██ ██ ██  ██ ██   ███ 
	// ██ ███ ██ ██    ██ ██    ██ ██  ██ ██ ██   ██ ██ ██  ██ ██ ██    ██ 
	//  ███ ███   ██████   ██████  ██   ████ ██████  ██ ██   ████  ██████ 

	wound(options){
	
		let hit_chance = this.armour - (options.ap + options.bonus);
		// let random_roll = this.getRandomInt(20);

		if(gameFunctions.units[options.attacker_id].cohesion_check === false){
			options.random_roll = Math.round(options.random_roll / 2,0);
		}
		
		let result = ""
		if(options.random_roll >= hit_chance){
			result = "pass"
		}
		if(options.random_roll < hit_chance){
			result = "fail"
		}		
		if(options.random_roll === 20){
			result = "critical success"
		}
		if(options.random_roll === 1){
			result = "critical fail"
		}
		
		
		let print_text = "";
		let target;
		switch(result){
			case "critical success":
				options.damage *= 2;
				print_text = "crit success!\n-"+options.damage;
				target = this;	
			break;
			case "pass":
				print_text = "-"+options.damage;
				target = this;
			break;
			case "fail":
				print_text = "miss";
				options.damage = 0;
				target = this;
			break;
			case "critical fail":
				options.damage = 0;
				print_text = "crit fail!";
				target = this;
			break;
		}
		
		let part_options = {
			scene: GameScene.scene,
			text: print_text,
			text_style: { 
				font: "16px Arial",
				fill: "#ff0044",
				align: "center",
				stroke: "#000000",
				strokeThickness: 2
			},
			pos: {
				x: target.sprite.x,
				y: target.sprite.y
			},
			tween:true
		}
		new particle(part_options)		
		
		target.health -= options.damage;
		target.drawHealth(this.sprite)
		if(target.health <= 0){
			this.killed_by = options.attacker_id;
			GameUIScene.updatePointsHUD();
			target.kill();
		}
	}	
	
	kill(){	
		this.alive = false;

		GameScene.sfx[this.death_sfx].play();
		this.sprite.destroy();
		if(this.sprite_ghost){
			this.sprite_ghost.destroy();
		}
		this.sprite_action.destroy();
		this.sprite_symbol.destroy();
		this.text_graphic.destroy();
		this.text.destroy();

		this.bar_graphic.destroy();
		this.bar_back_graphic.destroy();
		this.path_graphic.destroy();
		this.cohesion_graphic.destroy();
		this.fight_graphic.destroy();
		this.blast_graphics.forEach((graphic) => {
			graphic.destroy();
		})
		this.delete = true;

		GameUIScene.checkGameEnd();
	}		
	
// ######  ######     #    #     # 
// #     # #     #   # #   #  #  # 
// #     # #     #  #   #  #  #  # 
// #     # ######  #     # #  #  # 
// #     # #   #   ####### #  #  # 
// #     # #    #  #     # #  #  # 
// ######  #     # #     #  ## ##  	
	
	drawTint(){

		let colour = GameScene.game_setup.getSideColour(this.side);
		this.colour = colour.colour
		this.colour_gray = colour.colour_gray;
		this.colour_info = colour.colour_info;
		// this.colour_info = Phaser.Display.Color.ValueToColor(this.colour)
		// this.colour_info.dest = {r: 255, g: 255, b: 255};
		// this.colour_info.r_itt = (this.colour_info.dest.r - this.sprite_ghost.parent.colour_info.r) / 255
		// this.colour_info.g_itt = (this.colour_info.dest.g - this.sprite_ghost.parent.colour_info.g) / 255									
		// this.colour_info.b_itt = (this.colour_info.dest.b - this.sprite_ghost.parent.colour_info.b) / 255


		this.sprite.setTint(this.colour)
		if(this.sprite_ghost){
			this.sprite_ghost.setTint(this.colour)					
		}

	}

	drawFlash(active=true, gray_out=false){
		if(active === true && this.player === gameFunctions.params.player_number){
			this.flash_tween = this.scene.tweens.addCounter({
				targets: this, 
				from: 0,
				to: 255,
				yoyo: 1,
				repeat: -1,
				onUpdate: function (tween) {
					if(this.sprite_ghost){
						const value = Math.floor(tween.getValue());
	
						let colour_info = this.sprite_ghost.parent.colour_info
	
						this.sprite_ghost.setTint(Phaser.Display.Color.GetColor(
							colour_info.r + (value * colour_info.r_itt), 
							colour_info.g + (value * colour_info.g_itt), 
							colour_info.b + (value * colour_info.b_itt)
							));	
					}
				}
			})
			// tween.sprite = this.sprite
			this.flash_tween.sprite_ghost = this.sprite_ghost				
		}else{
			if (this.flash_tween){
				this.flash_tween.stop();
				if(gray_out === false){
					this.sprite_ghost.setTint(this.colour)
				}else{
					this.sprite_ghost.setTint(this.colour_gray)
				}
			}
		}
	}
	
	
	updateElements(sprite){
		this.updateUnitElements(sprite);
		this.drawInfo(sprite);
		this.drawHealth(sprite);
		this.drawFightRadius();
	}
	
	updateUnitElements(sprite){
		this.drawHealth(sprite);
		this.sprite_symbol.x = sprite.x + (this.sprite.displayWidth / 2) - (this.sprite_symbol.displayWidth / 2)
		this.sprite_symbol.y = sprite.y - (this.sprite.displayHeight / 2) + (this.sprite_symbol.displayHeight / 2)

		this.sprite_action.x = sprite.x //+ (this.sprite.displayWidth / 2)
		this.sprite_action.y = sprite.y //+ (this.sprite.displayHeight / 2)

	}	
	
	
	drawInfo(sprite)
	{
		let string = ""
		switch(gameFunctions.mode){
			case "shoot":
				string = this.targets.length + "/" + this.max_targets
				break;
			case "fight":
				string = this.fight_targets.length + "/" + this.fight_max_targets
				break;				
		}

		if(string !== ""){

			this.text.setText(string);
			this.text.x = sprite.x - this.text.width + (this.sprite.displayWidth / 2)
			this.text.y = sprite.y - this.text.height + (this.sprite.displayHeight / 2)

			this.text_graphic.clear();
			this.text_graphic.fillStyle(0xFFFFFF).setDepth(this.depth_text_box);
			this.text_graphic.fillRect(this.text.x, this.text.y, this.text.width, this.text.height);
		}

	}
	

	drawBacking(sprite, width){

		let radius_graphic = this.bar_back_graphic;
		this.bar_back_graphic.clear();

		radius_graphic.lineStyle(1, 0x000000, 0.5);
		radius_graphic.fillStyle(0x000000, 0.5);
		let circle = new Phaser.Geom.Circle(sprite.x, sprite.y, (width / 2)+5);
		radius_graphic.fillCircleShape(circle).setDepth(this.depth_health - 0.5);

		radius_graphic.strokePath();		
	}	

    drawHealth(sprite)
    {
        this.bar_graphic.clear();

		let width = gameFunctions.tile_size * (this.size * 3)
		if(width === 0){
			width = gameFunctions.tile_size
		}
		if(this.sprite_offset === 0){
			width = gameFunctions.tile_size * (this.size * 2)
		}
		width *= 0.8
		
		
		let pos = {
			x: sprite.x,
			y: sprite.y
		}		
		
		//  Without this the arc will appear closed when stroked
		this.bar_graphic.beginPath();

		
		let angle = (270 / this.max_health) * this.health;
		
		let fill_colour = 0x2ECC40; //green
        if (this.health < this.max_health / 2) 
        {

            fill_colour = 0xffdb00; //yellow
        }
		if (this.health < this.max_health / 4)
        {
            fill_colour = 0xff0000; //red
        }
	
		
		// arc (x, y, radius, startAngle, endAngle, anticlockwise)
		this.drawBacking(sprite, width);

		this.bar_graphic.lineStyle(7, fill_colour, 0.75);
		this.bar_graphic.arc(pos.x, pos.y, width / 2, Phaser.Math.DegToRad(angle), Phaser.Math.DegToRad(0), true) //.setStartAngle(90);
		this.bar_graphic.strokePath();
    }
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawPath(colours) {
		
		//UPDATE THE POSITIONAL DATA AND ANGLE OF THE SPRITE GHOST
		if(this.path.length > 1){
			let pos = this.path[this.path.length - 1];

			let angle = this.checkAngle(this.path[this.path.length - 2], this.path[this.path.length - 1])

			if(this.sprite_ghost){
				this.sprite_ghost.x = pos.x * gameFunctions.tile_size;
				this.sprite_ghost.y = pos.y * gameFunctions.tile_size;
				this.sprite_ghost.angle = angle;

				this.updateElements(this.sprite_ghost)

				// if(gameFunctions.mode === "charge"){
					this.drawFightRadius();
				// }
			}
		}
		
		
		let last_pos = {
			x: this.sprite.x / gameFunctions.tile_size,
			y: this.sprite.y / gameFunctions.tile_size
		}
		
		//RESET THE DRAW GRAPHICS
		this.path_graphic.clear();
		this.cohesion_graphic.clear();
		
		if (this.path && this.path.length > 1){
			
			this.path_graphic.lineStyle(colours.width, colours.line_colour, colours.line_alpha);
			this.path_graphic.beginPath();

			this.path.forEach((pos, i) => {
	
				if (i !== 0){
					this.path_graphic.lineTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
				else{
					this.path_graphic.moveTo(pos.x * gameFunctions.tile_size, pos.y * gameFunctions.tile_size);
				}
				
				last_pos = pos;
			})				
			
			this.path_graphic.strokePath();				
	
			this.sprite.setTint(0x808080) //turn unit grey if it has a ghost path
			this.sprite.alpha = 0 //.25;
			
		}
		
		this.cohesion_graphic.lineStyle(colours.line_width, colours.line_colour, colours.circle_alpha);
		this.cohesion_graphic.fillStyle(colours.fill_colour, colours.fill_alpha);
		let circle = new Phaser.Geom.Circle(last_pos.x * gameFunctions.tile_size, last_pos.y * gameFunctions.tile_size, this.cohesion / 2);
		this.cohesion_graphic.fillCircleShape(circle);

		this.cohesion_graphic.strokePath();		
		
	}		
	
	
	//CALLED AS PART OF CALLBACK IN "FINDPATH"
	drawTarget(targets, blast_radius) {	
		
		if (targets){
			
			//RESET THE DRAW GRAPHICS
			this.path_graphic.clear()
			this.path_graphic.lineStyle(8, 0x00cccc, 0.5);	
			this.path_graphic.beginPath();
			
			
			targets.forEach((target, i) => {
				
				let pos = {x:0,y:0};
				if(target.x && target.y){
					pos.x = target.x;
					pos.y = target.y;
				}else{
					pos.x = gameFunctions.units[target].sprite.x;
					pos.y = gameFunctions.units[target].sprite.y;
				}
				this.path_graphic.moveTo(this.sprite.x, this.sprite.y);
				
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += this.sprite_offset;
				pos.y += this.sprite_offset;	
				
				this.path_graphic.lineTo(pos.x, pos.y);
				
				if(blast_radius > 1){
					let blast_graphic = this.blast_graphics[i];
					blast_graphic.fillStyle(0x0000FF, 0.5);
					let circle = new Phaser.Geom.Circle(pos.x, pos.y, (blast_radius / 2) * gameFunctions.tile_size);
					blast_graphic.fillCircleShape(circle).setDepth(this.depth_explosion);

					blast_graphic.strokePath();
				}
				
			})

			this.path_graphic.strokePath();		
		}
	}		
	
	
	drawFightRadius(){

		
		this.fight_graphic.clear();
		let radius_graphic = this.fight_graphic;
		radius_graphic.lineStyle(2, this.colour, 0.5);
		radius_graphic.fillStyle(this.colour, 0.05);
		let circle = new Phaser.Geom.Circle(this.sprite_ghost.x, this.sprite_ghost.y, (this.fight_range));
		radius_graphic.fillCircleShape(circle).setDepth(this.depth_fight_radius);

		radius_graphic.strokePath();		
		/**/
	}	


	// ██████  ██████   █████  ██     ██       ██      ██ ██    ██ ███████       ████████ ██ ██      ███████ ███████ 
	// ██   ██ ██   ██ ██   ██ ██     ██       ██      ██ ██    ██ ██               ██    ██ ██      ██      ██      
	// ██   ██ ██████  ███████ ██  █  ██ █████ ██      ██ ██    ██ █████   █████    ██    ██ ██      █████   ███████ 
	// ██   ██ ██   ██ ██   ██ ██ ███ ██       ██      ██  ██  ██  ██               ██    ██ ██      ██           ██ 
	// ██████  ██   ██ ██   ██  ███ ███        ███████ ██   ████   ███████          ██    ██ ███████ ███████ ███████ 

	getSpiralMatrix = (n, x_start, y_start) => {
        const results = [];
        // for(let i=0;i<n;i++){
        // 	results.push([])
        // }

        let counter = 1;
        let startRow = 0;
        let endRow = n - 1;
        let startColumn = 0;
        let endColumn = n - 1;

        while(startColumn <= endColumn && startRow <= endRow){
			//COUNT TOP ROW FROM LEFT TO RIGHT
        	for(let i= startColumn; i <= endColumn; i++){
				// results[startRow][i] = counter;
				results.push({
					id: counter,
					pointer: {
					x: (x_start + i) * GameScene.map.tileWidth,
					y: (y_start + startRow) * GameScene.map.tileHeight
					}
				})
        		counter++;
        	}
        	startRow++;

			//COUNT RIGHT COLUMN FROM TOP TO BOTTOM
        	for(let i=startRow; i<= endRow; i++){
				// results[i][endColumn] = counter;
				results.push({
					id: counter,
					pointer: {
					x: (x_start + endColumn) * GameScene.map.tileWidth,
					y: (y_start + i) * GameScene.map.tileHeight
					}
				})				
        		counter++;
        	}
        	endColumn--;
			
			//BOTTOM ROW
        	for(let i=endColumn; i>= startColumn; i--){
				// results[endRow][i] = counter;
				results.push({
					id: counter,
					pointer: {
					x: (x_start + i) * GameScene.map.tileWidth,
					y: (y_start + endRow) * GameScene.map.tileHeight
					}
				})						
        		counter++;
        	}
        	endRow--;

        	for(let i=endRow; i>=startRow; i--){
				// results[i][startColumn] = counter;
				results.push({
					id: counter,
					pointer: {
					x: (x_start + startColumn) * GameScene.map.tileWidth,
					y: (y_start + i) * GameScene.map.tileHeight
					}
				})					
        		counter++;
        	}
        	startColumn++;			
		}
		
		return results;
    }
			

	setupDrawLiveTiles() {

		this.live_tiles = [];
		this.check_tiles = [];
		this.check_tiles_position = 0;
		let gridX = Math.floor(this.sprite.x/gameFunctions.tile_size);
		let gridY = Math.floor(this.sprite.y/gameFunctions.tile_size);	

		let startX = gridX - this.movement
		let startY = gridY - this.movement
		let endX = gridX + this.movement
		let endY = gridY + this.movement
		if(startX < 0) startX = 0
		if(startY < 0) startY = 0
		if(endX > GameScene.map.width) endX = GameScene.map.width
		if(endY > GameScene.map.height) endY = GameScene.map.height

		//WE NEED TO CHECK MOVEMENT POSITIONS AS A SPIRAL MOVING INWARDS TO GET THE MOST EFFICIENT MOVEMENT CHECKS
		this.check_tiles = this.getSpiralMatrix((endX - startX) + 1, startX, startY);

		// for(let y=startY;y<=endY;y++){
		// 	for(let x=startX;x<=endX;x++){
		// 		let options = {
		// 			pointer: {
		// 			x: x * GameScene.map.tileWidth,
		// 			y: y * GameScene.map.tileHeight
		// 			}
		// 		}
		// 		this.check_tiles.push(options)
		// 	}
		// }

		this.tiles_checked = 0;
		this.runDrawLiveTiles()
	}

	runDrawLiveTiles() {
		// console.log('during: ',this.check_tiles_position)
		this.generatePath(this.check_tiles[this.check_tiles_position], "saveDrawLiveTiles", "saveDrawLiveTiles")
	}
	
	saveDrawLiveTiles(process) {
		
		//only use process data if it exists
		if(process){
			if(process.path_found === true){
				// console.log("path found")
	
				//ADD THE PATH ELEMENTS TO THE LIVE TILES LIST
				if(process.path){
					if(process.path.length){
						let found = false;
						process.path.forEach((pos) => {
							found = this.live_tiles.some(i => i.x === pos.x && i.y === pos.y);
							if(found === false){
								this.live_tiles.push(pos);
							}
						})
	
					}
				}
	
			}else{
				// console.log("no path")
				//no path found
			}
		}

		this.check_tiles_position++;

		
		//loop through the remaining check tiles until one not found on the lives tiles list is found
		let checking_tile = false
		for(this.check_tiles_position; this.check_tiles_position<this.check_tiles.length;this.check_tiles_position++){

			try{
				let check_tile = this.check_tiles[this.check_tiles_position]
				let check_x = (check_tile.pointer.x / GameScene.map.tileWidth) + this.sprite_offset
				let check_y = (check_tile.pointer.y / GameScene.map.tileHeight) + this.sprite_offset
					
				let found = this.live_tiles.some(i => i.x === check_x && i.y === check_y);
	
				//NO NEED TO CHECK POSITIONS THAT AREN'T CLOSE ENOUGH TO REACH
				let distance = gameFunctions.twoPointDistance({x: this.sprite.x / gameFunctions.tile_size, y: this.sprite.y / gameFunctions.tile_size}, {x: check_x,y: check_y});
	
				let cell = GameScene.grid[check_y - this.sprite_offset][check_x - this.sprite_offset];
				let acceptable_tile = false
				if(GameScene.acceptable_tiles.includes(cell)){
					acceptable_tile = true;
				}			
	
				if(found === false && distance <= this.movement && acceptable_tile === true){
					checking_tile = true;
					// console.log('before: ',this.check_tiles_position)
					this.runDrawLiveTiles();
	
					this.tiles_checked++;
					break;
				}else{
					// console.log("found")
				}
			}catch(error){
				console.log("error in saveDrawLiveTiles method")
				console.log(error)
			}
		}

		if(checking_tile === false){
			GameScene.resetTempSprites();

			/*
			//PATH TO DESTINATION
			if(process.path){
				process.path.forEach((tile)=> {
					this.scene.temp_sprites.push(
						this.scene.physics.add.image(
							tile.x * GameScene.map.tileWidth,
							tile.y * GameScene.map.tileHeight,"white").setTint(0xff3333).setDepth(0)
					)
				})				
			}

			//DESTINATION
			this.scene.temp_sprites.push(
				this.scene.physics.add.image(
					process.pointer.x + 16,
					process.pointer.y + 16,"white").setTint(0x00FF00).setDepth(0)
			);

			let test;
			*/
			this.live_tiles.forEach((tile)=> {
				this.scene.temp_sprites.push(
					this.scene.physics.add.image(
						tile.x * GameScene.map.tileWidth,
						tile.y * GameScene.map.tileHeight,"marker").setDepth(0)
				)
			})			
		}


		// if(checking_tile === false){
		// 	console.log("tiles checked:",this.tiles_checked)
		// }
	}


	

// ####### #     # #     #  #####  ####### ### ####### #     #  #####  
// #       #     # ##    # #     #    #     #  #     # ##    # #     # 
// #       #     # # #   # #          #     #  #     # # #   # #       
// #####   #     # #  #  # #          #     #  #     # #  #  #  #####  
// #       #     # #   # # #          #     #  #     # #   # #       # 
// #       #     # #    ## #     #    #     #  #     # #    ## #     # 
// #        #####  #     #  #####     #    ### ####### #     #  #####  	

	
	getRandomInt(max) {
  		return Math.floor(Math.random() * max) + 1;
	}
	
	async delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}		
	
	checkSpriteOverlap(spriteA, spriteB, adjacent=false){
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();

		let intersection =  Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);	
		let min_length = 16

		let check = false;
		if(intersection.width > min_length && intersection.height > min_length && adjacent===false){
			// console.log("intersection")
			check = true;
		}
		if(adjacent===true){
			// if(intersection.width > min_length || intersection.height > min_length){
			if(intersection.width > 0 || intersection.height > 0){
				check = true;
			}					
		}

		return check;
	}
	
	checkSpriteandPos(pointer){
		var bounds = this.sprite.getBounds();

		
		let check = false;
		if(bounds.contains(pointer.x, pointer.y)){
			check = true;
		}
		// if(adjacent===true){
		// 	if(intersection.width > 0 || intersection.height > 0){
		// 		check = true;
		// 	}					
		// }

		return check;
	}
	
	checkAngle(start_pos, end_pos) {

		let angle = 0
		if(start_pos.x < end_pos.x){
			angle = 0;
		}
		if(start_pos.x > end_pos.x){
			angle = 180;
		}				
		if(start_pos.y < end_pos.y){
			angle = 90;
		}
		if(start_pos.y > end_pos.y){
			angle = -90;
		}		
		
		return angle;
	}	
	
	
// #     # ####### #     # ####### 
// ##   ## #     # #     # #       
// # # # # #     # #     # #       
// #  #  # #     # #     # #####   
// #     # #     #  #   #  #       
// #     # #     #   # #   #       
// #     # #######    #    ####### 	
	
	generatePath(options, callback, fail_callback) {
		let scene = this.scene;
		let pointer = options.pointer;

		var x = pointer.x;
		var y = pointer.y;		
		var toX = Math.floor(x/gameFunctions.tile_size);
		var toY = Math.floor(y/gameFunctions.tile_size);
		
		// console.log(toX,toY)
		
		if(toX < GameScene.map.width && toY < GameScene.map.height
		  && toX >= 0 && toY >= 0){

			var fromX = Math.floor(this.sprite.x/gameFunctions.tile_size);
			var fromY = Math.floor(this.sprite.y/gameFunctions.tile_size);		

			// let path = GameScene.pathfinder.findPath(this, fromX, fromY, toX, toY, this.size)

			GameScene.pathfinder.setup({
				parent:this, 
				pointer: options.pointer,
				x_start: fromX, 
				y_start: fromY, 
				x_end: toX, 
				y_end: toY, 
				obj_size: this.size,
				callback: callback,
				fail_callback: fail_callback
			})

		}
		else{
			if(callback){
				this[callback]()
			}
		}
	}
	
	findPath(options) {

		this.generatePath(options,  "usePath");
	}

	usePath(process){

		// console.log(process)
		if(process){

			if(process.path && process.pointer){
	
				let path = process.path
				let pointer = process.pointer
				
				this.path = []
				path.forEach((pos) => {
					let p = {
						x: pos.x,
						y: pos.y
					}
					this.path.push(p)
				})		
				
				
				if(this.path.length > 0){
					
					//SKIP PATH IF THE UNIT PLACEMENT OVERLAPS ANOTHER UNIT
					let skip = false
					let last_path_pos = 0
					
					//CHECK THROUGH THE PATH AND KEEP TRACK OF THE LAST SPACE THAT DOESN'T INTERSECT ANOTHER PLAYER
					this.path.forEach((pos, i) => {
						let check = false;				
						gameFunctions.units.forEach((unit) => {
							
							if(unit.id !== this.id && unit.alive === true){
								
								this.sprite_ghost.x = pos.x * gameFunctions.tile_size;
								this.sprite_ghost.y = pos.y * gameFunctions.tile_size;
	
								let temp_check = false
	
								temp_check = this.checkSpriteOverlap(unit.sprite_ghost, this.sprite_ghost)
								if(temp_check === true){
									check = temp_check
								}
								
							}
	
						})
						
						// 
						if(check === false){
							last_path_pos = i;
						}
					})
					
					// console.log(this.path.length, last_path_pos + 1)
					
					//UPDATE THE PATH IF IT'S LENGTH INTERSECTS ANOTHER UNIT
					if(this.path.length >= last_path_pos + 1){
						this.path = this.path.slice(0,last_path_pos + 1)
					}
	
					
					//SKIP IF IN CHARGE MODE AND UNIT HAD ALREADY SHOT
					if(this.shot === true && gameFunctions.mode === "charge"){
						skip = true;
						GameScene.showMessage("cannot charge, unit has shot")
					}
					
					if(this.path.length === 0){
						skip = true;
					}
				
					
					let on_unit = false;
					//SKIP IF THE POINTER IS OVER THE SHOOTING UNITS, put here so it doesn't play the clear sound
					if (this.sprite.getBounds().contains(pointer.x, pointer.y)) {
						skip = true;
						on_unit = true;
					}
				
					if(skip === true && on_unit === false){
						GameScene.sfx['clear'].play();				
					}			
					
					// console.log("skip: ",skip,"path: ",this.path)
					
					//IF THE GHOST CLASHES WITH ANOTHER SPRITE OR GHOST, CANCEL THE MOVE
					if(skip === true){
						this.resetMove();
						
					}
					else{
						
						//if there's any cohesion needed, check it, otherwise just draw path
						if(this.cohesion > 0){
							this.cohesionCheck()
							GameScene.sfx['action'].play();
						}
						else{
	
							let colours = {
								line_colour: 0x00cccc,
								fill_colour: 0x2ECC40,
								line_alpha: 0.75,
								circle_alpha: 0.15,
								fill_alpha: 0.15,
								width: 5
							}
	
							this.drawPath(colours)
							
							GameScene.sfx['action'].play();
						}
						
					}	
				}
			}
		}
	}
	
	
	cohesionCheck2() {
		
		//GET THE UNITS IN THE SQUAD
		let open = [];
		gameFunctions.units.forEach((unit) => {
			if(unit.alive === true && unit.id !== this.id && unit.player === this.player && unit.squad === this.squad) //
			{
				open.push(unit);
			}
		})
		
		let closed = [];
		closed.push(this)
		
		for(let i=0; i<1000; i++){
			
			let new_open = []
			let closed_add = []
			let any_closed = false;
			open.forEach((open_unit) => {
				
				let add_closed = false;
				closed.forEach((closed_unit) => {
					if(this.sprite_ghost){
						let distance = gameFunctions.twoPointDistance(open_unit.sprite_ghost, closed_unit.sprite_ghost);
						if(distance <= open_unit.cohesion){
							add_closed = true;
						}
					}
				})
				
				if(add_closed === true){
					closed_add.push(open_unit)
					any_closed = true;
				}
				else{
					new_open.push(open_unit)
				}
			})
			
			//
			if(any_closed === false){
				return false;
				// break;
			}
			if(new_open.length === 0){
				return true;
				// break;				
			}
			
			// closed.concat(closed_add)
			closed = closed_add
			open = new_open
				
			
		}
	}
	
	cohesionCheck() {
		
		let units_check = 0;
		gameFunctions.units.forEach((unit) => {
			if(unit.alive === true && unit.player === this.player && unit.squad === this.squad) //unit.id !== this.id && 
			{		
		
				unit.cohesion_check = unit.cohesionCheck2();

				let colours = {
					line_colour: 0x00cccc,
					fill_colour: 0x2ECC40,
					line_alpha: 0.75,
					circle_alpha: 0.75,
					fill_alpha: 0.75,
					width: 5,
					line_width: 5
				}
				// this.cohesion_check = true

				if(unit.cohesion_check === false){
					colours.line_colour = 0x00cccc;
					colours.fill_colour = 0xFF0000; //0x6666ff	
					// colours.width = 1.0;
					colours.line_width = 1.0;
					colours.fill_alpha = 0.5;
				}

				if(unit.id !== this.id || GameScene.selected_unit.length === 0){
					colours.circle_alpha = 0.4,
					colours.fill_alpha = 0.35,
					colours.line_colour = 0x808080; //grey
					colours.line_alpha = 0.35;
				}
				
				if(GameScene.selected_unit.length === 0){
					colours.fill_alpha = 0.15;
					colours.line_alpha = 0.15;
				}

				unit.drawPath(colours)
				units_check++;
			}
		})

		//IF ALL OTHER UNITS IN THE SQUAD ARE DEAD, AUTO-PASS THE CHECK
		if(units_check === 1){
			this.cohesion_check = true
		}
		
	}

	
	move(endFunction="move") {
		
		// this.cohesion_graphic.clear()
		this.resetCohesionGraphic();
		this.sprite.setTint(this.colour)
		this.sprite.alpha = 1;
		
		if(this.sprite_ghost){
			this.sprite_ghost.alpha = 0.5;
		}
		
		if (this.path.length > 1 && this.is_moving === false){
			
			// GameScene.active_actions++;
			// if(unit.player === gameFunctions.params.player){
			// 	GameScene.active_actions++;	
			// }
			
			this.is_moving = true;
			
			
			GameScene.sfx['movement'].play();
			let tweens = []
			for(let i = 0; i < this.path.length-1; i++){
				let next_pos = this.path[i+1];
				let ex = next_pos.x;
				let ey = next_pos.y;
				
				let pos = this.path[i]
				
				let angle = this.checkAngle(pos, next_pos)				
				
				let tween_data = {
					targets: [this.sprite],
					// targets: this.group.getChildren(),
					x: {value: ex*GameScene.map.tileWidth, duration: 200},
					y: {value: ey*GameScene.map.tileHeight, duration: 200},
					angle: {value: angle, duration: 0},
					delay: 0,
					onComplete: function ()
					{
						
						let end_path = this.path[this.path.length - 1];

						//CHECK IF THE UNIT PASSES AN ENEMY UNIT
						let old_status = this.in_combat
						this.in_combat = this.checkCombat();
						

						
						if(this.in_combat === false && old_status === true){

							if(this.in_combat_with){
								this.in_combat_with.forEach((unit) => {
									//allow allow that unit to strike if it has any combat damage to give
									if(unit.fight_damage > 0){
										unit.fight_targets.push(this.sprite.parent.id)
										unit.fight(true);
									}
								})
								
								this.in_combat_with = [];
							}
						}
						/**/
					
						
						
						//WHEN THE END OF THE PATH IS REACHED
						try{
							if(this.sprite.x / gameFunctions.tile_size === end_path.x && this.sprite.y / gameFunctions.tile_size === end_path.y){
								this.path_graphic.clear()
								this.path = [];
								this.is_moving = false;

								GameScene.active_actions--;
								if(GameScene.active_actions === 0){
									GameUIScene.readyAdvanceMode();
								}
								
								if(endFunction){
									switch(endFunction){
										case "move":
											this.moved = true;
											this.combat_check = this.checkCombat();
											GameScene.sfx["end_path"].play();
											 
											break;
										default:
									}
								}							
							}
						}
						catch (error){
							console.log("ERROR FINISHING PATH")
							console.log(error)
							console.log(end_path)
							console.log(this.path)
							console.log(this.path.length - 1)
							console.log("//////////////////////////////")
						}
					}.bind(this)			
				}
				
				tweens.push(tween_data);
				
			}

			GameScene.scene.tweens.timeline({
				tweens: tweens
			});
			
		}
	}
	
	
//  #####  #     # ####### ####### ####### 
// #     # #     # #     # #     #    #    
// #       #     # #     # #     #    #    
//  #####  ####### #     # #     #    #    
//       # #     # #     # #     #    #    
// #     # #     # #     # #     #    #    
//  #####  #     # ####### #######    #   	
	
	findTarget (options) {
		
		let scene = this.scene;
		let pointer = options.pointer;		
		
		//GET BASE POSITIONAL DATA
		let pos = {
			start_x: this.sprite.x,
			start_y: this.sprite.y,			
			end_x: Math.floor(pointer.x / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
			end_y: Math.floor(pointer.y / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
		}
		//GET DIFFERENCE INFO
		pos.x_diff = pos.end_x - pos.start_x;
		pos.y_diff = pos.end_y - pos.start_y;
		
		pos.x_dir = (pos.x_diff < 0) ? -1:1;
		pos.y_dir = (pos.y_diff < 0) ? -1:1;		

		//FIND OUT WHICH NORMALISED DIFF IS HIGHER
		pos.x_norm = (pos.x_diff < 0) ? pos.x_diff * -1:pos.x_diff;
		pos.y_norm = (pos.y_diff < 0) ? pos.y_diff * -1:pos.y_diff;


		//ITTERATE ALONG THE LONGEST SIDE AND CALCULATE THE POSITION
		pos.cells = [];
		if(pos.x_norm > pos.y_norm){
			for (let x=0; x<pos.x_norm; x+=1){
				let cell = {
					x: pos.start_x + (x * pos.x_dir),
					y: pos.start_y + (x * (pos.y_diff / pos.x_norm)),	
				}
				pos.cells.push(cell)
				
				let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
				if(current_range >= this.shoot_range){ break; }				
			}
		}else{
			for (let y=0; y<pos.y_norm; y+=1){
				let cell = {
					x: pos.start_x + (y * (pos.x_diff / pos.y_norm)),	
					y: pos.start_y + (y * pos.y_dir),
				}
				pos.cells.push(cell)
				
				// let current_range = Math.sqrt(Math.pow(this.sprite.x - cell.x, 2) + Math.pow(this.sprite.y - cell.y, 2))
				let current_range = gameFunctions.twoPointDistance(this.sprite, cell)
				if(current_range >= this.shoot_range){ break; }						
			}			
		}

		
		if (!this.temp_sprites){
			this.temp_sprites = []			
		}
		else{
			this.temp_sprites.forEach((sprite) => {
				sprite.destroy();
			})
		}		

		//CHECK THE BULLET PATH TO MAKE SURE THERE'S NO OBJECTS BLOCKING SIGHT
		let dest = {}
		let skip = false;
		let add_dest = true;
		pos.cells.forEach((cell) => {			

			let grid_x = Math.floor(cell.x / gameFunctions.tile_size);
			let grid_y = Math.floor(cell.y / gameFunctions.tile_size);	
			
			if(grid_x >= 0 && grid_y >= 0 && grid_x < GameScene.map.width && grid_y < GameScene.map.height){
				let grid_cell = GameScene.grid[grid_y][grid_x]
				// this.temp_sprites.push(scene.physics.add.image(cell.x,cell.y,"marker").setDepth(0))	
				// this.temp_sprites.push(scene.physics.add.image(grid_x * gameFunctions.tile_size,grid_y * gameFunctions.tile_size,"marker").setTint(0xff0000).setDepth(0.5));
	
				if (!GameScene.pathfinder.acceptable_tiles.includes(grid_cell)){
					add_dest = false;
				}
				
				//STOP THE BULLET PATH IF IT HITS A UNIT NOT ON THE SAME SIDE
				if(add_dest === true){
					gameFunctions.units.forEach((unit) => {
	
						if(unit.alive === true && unit.id !== this.id 
							&& unit.side !== this.side && unit.in_combat === false){
							let check = unit.checkSpriteandPos(cell)
							if(check === true){
								add_dest = false;
							}	
						}
					})	
				}
	
			}		


			if(add_dest === true){
				//RETURN THE GRID CELL POSITION SO WE CAN CHECK IT'S EMPTY
				dest.x = cell.x
				dest.y = cell.y
			}
		})		
		
		//SKIP IF IN COMBAT
		if(this.in_combat === true){
			//DOUBLE CHECK THE UNIT IS STILL IN COMBAT
			this.in_combat = this.checkCombat();

			if(this.in_combat === true){
				skip = true;
				GameScene.showMessage("Cannot shoot while in combat.")
			}
		}
		
		let on_unit = false;
		//SKIP IF THE POINTER IS OVER THE SHOOTING UNITS, put here so it doesn't play the clear sound
		if (this.sprite.getBounds().contains(pointer.x, pointer.y)) {
			skip = true;
			on_unit = true;
		}				
		
		if(skip === true && on_unit === false){
			GameScene.sfx['clear'].play();
		}		
		
		
		//ONLY ADD SHOT IF THE TARGETS ARRAY IS UNDER MAX SHOTS
		if(dest.x && dest.y && skip === false && this.targets.length < this.max_targets){

			this.targets.push(dest);
			this.drawTarget(this.targets, this.blast_radius);
			GameScene.sfx['action'].play();
			
			// this.drawInfo(this.sprite)
			this.updateElements(this.sprite)
		}
		
	}
	
	
	shoot() {
		
		if(this.targets){

			this.targets.forEach( async(target, i) => {

				let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, target);
				// if(angle > -1){				

					// GameScene.active_actions++;

					await this.delay(2000 * i)
				
					this.sprite.angle = Phaser.Math.RadToDeg(angle);
					
					if(this.sprite_ghost){
						this.sprite_ghost.angle = this.sprite.angle;
					}
					if(this.flash_graphic){
						this.flash_graphic.angle = this.sprite.angle;
					}					
					
					let options = {
						scene: GameScene.scene,
						spritesheet: "bullet",
						angle: angle,
						unit: this,
						target: target
					}

					GameScene.bullets.push(new bullet(options))
					//BULLET DEATH KILLS THE GRAPHIC
				// }
				// else
				// {
				// 	console.log("--------------------------")					
				// 	console.log("Shooting angle is Zero")
				// 	console.log(this.sprite)
				// 	console.log(target)
				// 	console.log("--------------------------")
				// }
			})
			if(this.targets.length > 0){
				this.shot = true;
				this.sprite_action.setFrame(2)
				this.sprite_action.visible = true
			}
			
			this.targets = [];
		}		
		
	}
	
	
// ####### ###  #####  #     # ####### 
// #        #  #     # #     #    #    
// #        #  #       #     #    #    
// #####    #  #  #### #######    #    
// #        #  #     # #     #    #    
// #        #  #     # #     #    #    
// #       ###  #####  #     #    #    		
	
	checkClickPosition (pointer) {
		let click_check = -1;

		let click_circle;

		gameFunctions.units.forEach((unit) => {

			let unit_circle = new u_circle({
				x: unit.sprite.x,
				y: unit.sprite.y,
				r: unit.sprite.width / 2
			});

			//CHECK TO SEE IF THE UNIT CLASHES WITH THE CLICK POSITION
			let clash = false;
			if(unit.alive === true && this.alive === true && unit.id !== this.id && unit.player !== this.player && unit.side !== this.side){
				
				click_circle = new u_circle({
					x: pointer.x,
					y: pointer.y,
					r: 1
				});
				clash = GameScene.u_collisions.circleCircle(click_circle, unit_circle);	

				if(clash === true){			
					//IF IT DOES, CHECK TO SEE THEY'RE IN RANGE OF THE FIGHT RADIUS

					let fight_circle = new u_circle({
						x: this.sprite.x,
						y: this.sprite.y,
						r: this.fight_range
					});
					
					clash = GameScene.u_collisions.circleCircle(fight_circle, unit_circle);

					if(clash === false){
						click_check = 0;
					}else{
						click_check = 1;
					}

				}
			}
		})

		return click_check;		
	}

	
	findFightTarget (options) {

		
		// let scene = this.scene;
		let pointer = options.pointer;		
		let skip = false
		let on_unit = false;

		//GET BASE POSITIONAL DATA
		let pos = {
			start_x: this.sprite.x,
			start_y: this.sprite.y,			
			end_x: Math.floor(pointer.x / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
			end_y: Math.floor(pointer.y / gameFunctions.tile_size) * gameFunctions.tile_size + (gameFunctions.tile_size / 2),
		}

		// let current_range = Math.sqrt(Math.pow(this.sprite.x - pos.end_x, 2) + Math.pow(this.sprite.y - pos.end_y, 2))
		
		// if(current_range > (this.fight_range) && skip === false){
		// 	skip = true;
		// 	GameScene.showMessage("target out of range")	
		// }

		let click_check = this.checkClickPosition (pointer)
		if(click_check === -1){
			skip = true;
			// GameScene.showMessage("no unit selected")
		}
		if(click_check === 0){
			skip = true;
			GameScene.showMessage("unit out of range")
		}		
		
		if(this.fight_damage === 0){
			skip = true
			GameScene.showMessage("cannot fight, unit has no fight damage")
		}

		//SKIP IF THE POINTER IS OVER THE SHOOTING UNITS, put here so it doesn't play the clear sound
		if (this.sprite.getBounds().contains(pointer.x, pointer.y)) {
			skip = true;
			on_unit = true;
		}				
		
		if(skip === true && on_unit === false){
			GameScene.sfx['clear'].play();
		}		
		
		// let dest = {
		// 	x: pos.end_x,
		// 	y: pos.end_y,
		// }

		let check = false;
		let found_unit;
		gameFunctions.units.forEach((unit) => {
			check = unit.checkSpriteandPos(pointer);
			if(unit.alive === true && check === true && unit.id !== this.id){
				found_unit = unit
				return
			}
		})
		
		//ONLY ADD SHOT IF THE TARGETS ARRAY IS UNDER MAX SHOTS
		if(found_unit && skip === false && this.fight_targets.length < this.fight_max_targets){

			this.fight_targets.push(found_unit.id);
			this.drawTarget(this.fight_targets, 0);
			GameScene.sfx['action'].play();
			
			this.updateElements(this.sprite)
		}
		
	}	

	
	checkCombat() {
		
		let in_combat_range = false

		let fight_circle;

		gameFunctions.units.forEach((unit) => {

			let unit_circle = new u_circle({
				x: unit.sprite.x,
				y: unit.sprite.y,
				r: unit.sprite.width / 2
			});


			let clash = false;
			if(unit.alive === true && this.alive === true && unit.id !== this.id && unit.player !== this.player && unit.side !== this.side){
				
				if(this.path.length > 0 && this.is_moving === false){
					//check to see if movement ends in an attack
					if(this.sprite_ghost){

						fight_circle = new u_circle({
							x: this.ghost_sprite.x,
							y: this.ghost_sprite.y,
							r: this.fight_range
						});
						clash = GameScene.u_collisions.circleCircle(fight_circle, unit_circle);						
						
					}
				}else{


					fight_circle = new u_circle({
						x: this.sprite.x,
						y: this.sprite.y,
						r: this.fight_range
					});
					clash = GameScene.u_collisions.circleCircle(fight_circle, unit_circle);					
				}

				if(clash === true){				

					const found = this.in_combat_with.some(el => el.id === unit.id);
					// if (!found) arr.push({ id, username: name });
					if(found === false){
						this.in_combat_with.push(unit)						
					}

					in_combat_range = true;
					
					//SET BOTH UNITS AS FIGHTING EACH OTHER
					//only set fighting if the opponent has any capacity to fight
					// if(unit.fight_damage > 0){
						this.in_combat = true;
						unit.in_combat = true;

						this.sprite.body.enable = false;
						if(unit.sprite.body){
							unit.sprite.body.enable = false;						
						}

						this.sprite_action.visible = true
						unit.sprite_action.visible = true
					// }
				}
			}
		})

		return in_combat_range;
	}
	/**/	
	
	
	fight(opportunity=false){

		
		this.checkCombat()	
		
		this.fight_targets.forEach( async(target, i) => {
			// GameScene.active_actions++;
			
			await this.delay(2000 * i)
			let target_unit = gameFunctions.units[target];
			
			
			let options = {
				scene: GameScene.scene,
				key: "sword"+this.id+"_"+target_unit.id,
				spritesheet: "punch",
				framerate: 30,
				sfx: "sword",
				alpha: 0.75,
				scale: 0.5,
				pos: {
					x: target_unit.sprite.x,
					y: target_unit.sprite.y
				}
			}
			new particle(options)		


			
			let roll = gameFunctions.getRandomInt(20);
			options = {
				damage: this.fight_damage,
				ap: this.fight_ap,
				bonus: this.fighting_bonus,
				// attacker: this,
				random_roll: roll,
				attacker_id: this.id,
				defender_id: target
			}			
			
			
			if(GameScene.online === false){
				let unit = gameFunctions.units[options.defender_id]			
				unit.wound(options);
			}else{
				//ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
				if(gameFunctions.params.player_number === this.player){
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
			
			if(opportunity === false){
				GameScene.active_actions--;	
				if(GameScene.active_actions === 0){
					GameUIScene.readyAdvanceMode();		
				}
			}

			

		})
		
		if(this.fight_targets.length > 0){
			this.fought = true;
		}		
		this.fight_targets = [];

		
	}
	
}

