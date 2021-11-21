

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

				//CHECK TO SEE IF ANY OF THE UPPGRADES NEED TO GET APPLIED TO ALL UNITS IN THE SQUAD
				let universal_upgrades = [];
				let single_upgrades = [];
				squad_data.upgrades.forEach((item) => {
					if(item.upgrade.upgrades_all_in_squad === false){
						single_upgrades.push(item.upgrade);
					}else{
						universal_upgrades.push(item.upgrade);
					}
				})  

				for(let i=0;i<squad_data.size; i++){
					let single_upgrade;
					if(single_upgrades.length > i){
						single_upgrade = single_upgrades[i];
					}

					this.addUnit({
						force: force,
						squad: squad,
						squad_id: squad_id,
						x: 1 * this.tile_size, //(3 + (2*i))
						y: -2 * this.tile_size, //3
						angle: 0,
						universal_upgrades: universal_upgrades,
						single_upgrade: single_upgrade,
						upgrade_id: i,
					})
				}
			})
		})
	}

	reloadSquads = () => {

		gameFunctions.units_preload.forEach((unit) => {

			let force = gameFunctions.params.forces[unit.player];
			let squad = force.army[0].squads[unit.squad].squad;

			//CHECK TO SEE IF ANY OF THE UPPGRADES NEED TO GET APPLIED TO ALL UNITS IN THE SQUAD
			let universal_upgrades = [];
			let single_upgrades = [];
			squad.upgrades.forEach((upgrade) => {
				if(upgrade.upgrades_all_in_squad === false){
					single_upgrades.push(upgrade);
				}else{
					universal_upgrades.push(upgrade);
				}
			})  

			let single_upgrade;
			if(unit.upgrade_id !== -1){
				single_upgrade = single_upgrades[unit.upgrade_id];
			}

			//UPGRADES, SINGLE AND UNIVERSAL NEED ADDING BACK IN

			if(unit.alive === true){
				this.addUnit({
					force: force,
					squad: squad,
					squad_id: unit.squad,
					x: unit.x,
					y: unit.y,
					angle: unit.rotation,
					in_combat: unit.in_combat,
					health: unit.health,
					loaded: true,
					universal_upgrades: universal_upgrades,
					single_upgrade: single_upgrade,
					upgrade_id: unit.upgrade_id,
				})
			}
		})		
	}

	addUnit = (options) => {

		let armour_class = options.squad.armour;
		let gun_class = options.squad.gun;
		let melee_class = options.squad.melee;
		let unit_class = options.squad.unit;


		if(options.universal_upgrades) {
			options.universal_upgrades.forEach((upgrade) => {
				if(upgrade.armour){
					armour_class = upgrade.armour;
				}
				if(upgrade.gun){
					gun_class = upgrade.gun;
				}
				if(upgrade.melee){
					melee_class = upgrade.melee;
				}
				if(upgrade.unit){
					unit_class = upgrade.unit;
				}					
			})
		}	

		//OVERWRITE MULTIPLE UPGRADES WITH SINGLE SPECIFIC UPGRADE
		if(options.single_upgrade){
			let single_upgrade = options.single_upgrade;
			if(single_upgrade.armour){
				armour_class = single_upgrade.armour;
			}
			if(single_upgrade.gun){
				gun_class = single_upgrade.gun;
			}
			if(single_upgrade.melee){
				melee_class = single_upgrade.melee;
			}
			if(single_upgrade.unit){
				unit_class = single_upgrade.unit;
			}									
		}


		let unit_data = {

			id: gameFunctions.units.length,
			
			side: options.force.side, //this can be used if each side has multiple players
			player: options.force.player_number, //this is the specific owner of the unit
			squad: options.squad_id, //this can be used for squad checks like unit cohesion
			scene: this.scene,
			angle: options.angle,
			x: options.x,
			y: options.y,
			
			size: unit_class.size, //the grid size of the object used when plotting movement
			unit_name: unit_class.name,
			death_sfx: unit_class.death_sfx,
			symbol_id: unit_class.symbol_id,
			spritesheet: unit_class.spritesheet,
			sprite_offset: unit_class.sprite_offset,
			health: unit_class.health,
			max_health: unit_class.max_health,
			movement: unit_class.movement,
			cohesion: unit_class.cohesion, //the maximum distance a unit can be from another member of it's squad						
			fighting_bonus: unit_class.fighting_bonus,
			shooting_bonus: unit_class.shooting_bonus,
			
			armour_name: armour_class.name,
			armour: armour_class.value,
			
			fight_name: melee_class.name,
			fight_range: melee_class.range,
			fight_ap: melee_class.ap,
			fight_damage: melee_class.damage,		
			fight_max_targets: melee_class.max_targets,
			
			shoot_name: gun_class.name,
			shoot_range: gun_class.range,
			shoot_damage: gun_class.damage,
			shoot_ap: gun_class.ap,
			blast_spritesheet: gun_class.blast_spritesheet,
			blast_radius: gun_class.blast_radius,
			max_targets: gun_class.max_targets,
		}

		if(options.loaded){
			unit_data.loaded = options.loaded;
		}
		if(options.in_combat){
			unit_data.in_combat = options.in_combat;
		}
		if(options.health){
			unit_data.health = options.health;
		}	
		unit_data.upgrade_id = -1;	
		if(options.single_upgrade){
			unit_data.upgrade_id = options.upgrade_id
		}

		this.unit_list.push(new unit(unit_data));
	}


}