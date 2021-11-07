

const squad_setup = class {
	constructor(options) {	
		
		this.scene = options.scene;
		this.unit_list = options.unit_list;
		this.forces = options.forces;
		this.tile_size = options.tile_size;
	}


	placeSquads = () => {

		//LOOP THROUGH ALL FORCES
		this.forces.forEach((force, force_id) => {
			force.army[0].squads.forEach((squad_data, squad_id) => {
				let squad = squad_data.squad;
				for(let i=0;i<squad_data.size; i++){
					this.addUnit({
						force: force,
						squad: squad,
						squad_id: squad_id,
						x: (3 + (2*i)) * this.tile_size,
						y: 3 * this.tile_size,
						angle: 0,
					})
				}
			})
		})
	}

	reloadSquads = () => {

		gameFunctions.units_preload.forEach((unit) => {

			let force = gameFunctions.params.forces[unit.player];
			let squad = force.army[0].squads[unit.squad].squad;

			if(unit.alive === true){
				this.addUnit({
					force: force,
					squad: squad,
					squad_id: unit.squad,
					x: unit.x,
					y: unit.y,
					angle: unit.rotation,
					in_combat: unit.in_combat,
					health: unit.health
				})
			}
		})		
	}

	addUnit = (options) => {
		let unit_data = {

			id: gameFunctions.units.length,
			
			side: options.force.side, //this can be used if each side has multiple players
			player: options.force.player_number, //this is the specific owner of the unit
			squad: options.squad_id, //this can be used for squad checks like unit cohesion
			scene: this.scene,
			angle: options.angle,
			x: options.x,
			y: options.y,
			
			size: options.squad.unit.size, //the grid size of the object used when plotting movement
			unit_name: options.squad.unit.name,
			death_sfx: options.squad.unit.death_sfx,
			symbol_id: options.squad.unit.symbol_id,
			spritesheet: options.squad.unit.spritesheet,
			sprite_offset: options.squad.unit.sprite_offset,
			health: options.squad.unit.health,
			max_health: options.squad.unit.max_health,
			movement: options.squad.unit.movement,
			cohesion: options.squad.unit.cohesion, //the maximum distance a unit can be from another member of it's squad						
			fighting_bonus: options.squad.unit.fighting_bonus,
			shooting_bonus: options.squad.unit.shooting_bonus,
			
			armour_name: options.squad.armour.name,
			armour: options.squad.armour.value,
			
			fight_name: options.squad.melee.name,
			fight_range: options.squad.melee.range,
			fight_ap: options.squad.melee.ap,
			fight_damage: options.squad.melee.damage,		
			fight_max_target: options.squad.melee.max_targets,
			
			shoot_name: options.squad.gun.name,
			shoot_range: options.squad.gun.range,
			shoot_damage: options.squad.gun.damage,
			shoot_ap: options.squad.gun.ap,
			blast_spritesheet: options.squad.gun.blast_spritesheet,
			blast_radius: options.squad.gun.blast_radius,
			max_targets: options.squad.gun.max_targets,
		}

		if(options.in_combat){
			unit_data.in_combat = options.in_combat;
		}
		if(options.health){
			unit_data.health = options.health;
		}		


		this.unit_list.push(new unit(unit_data));
	}


}