

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

					let core = {
						id: gameFunctions.units.length,
						side: force.side, //this can be used if each side has multiple players
						player: force.player_number, //this is the specific owner of the unit
						squad: squad_id, //this can be used for squad checks like unit cohesion
						
						angle: 0,
						x: 1 * this.tile_size,
						y: -2 * this.tile_size,
						
						alive: false,
						// cost: cost,
						// health: unit_class.health,
		
						killed_by: -1,
						in_combat: false,
						in_combat_with: [],
						
						poison: false,
						poison_caused_by: -1,
						poison_timer: 0,
		
						moved: false,
						charged: false,		
						shot: false,
						fought: false,
					}


					this.addUnit({
						core: core,
						squad: squad,
						universal_upgrades: universal_upgrades,
						single_upgrade: single_upgrade
					})

				}
			})
		})
	}

	reloadSquads = () => {

		gameFunctions.units_preload.forEach((core) => {

			let force = gameFunctions.params.forces[core.player];
			let squad_data = force.army[0].squads[core.squad];
			let squad = squad_data.squad;

			//CHECK TO SEE IF ANY OF THE UPPGRADES NEED TO GET APPLIED TO ALL UNITS IN THE SQUAD
			let universal_upgrades = [];
			let single_upgrades = [];
			squad_data.upgrades.forEach((upgrade) => {
				if(upgrade.upgrades_all_in_squad === false){
					single_upgrades.push(upgrade);
				}else{
					universal_upgrades.push(upgrade);
				}
			})  

			//THIS NEEDS TO BE LOOKED INTO AS UPGRADE_ID IS NOT LONGER SAVED
			let single_upgrade;
			if(core.upgrade_id !== -1){
				single_upgrade = single_upgrades[core.upgrade_id];
			}

			//UPGRADES, SINGLE AND UNIVERSAL NEED ADDING BACK IN

			if(core.alive === true){

				this.addUnit({
					loaded: true,
					core: core,
					squad: squad,
					universal_upgrades: universal_upgrades,
					single_upgrade: single_upgrade
				})				
			}
		})		
	}

	addUnit = (options) => {

		let armour_class = {...options.squad.armour};
		let gun_class = {...options.squad.gun};
		let melee_class = {...options.squad.melee};
		let unit_class = {...options.squad.unit};

		let special_rules = [];
		options.squad.special_rules.forEach((rule) => {
			special_rules.push(rule.name)
		})

		if(options.universal_upgrades) {
			options.universal_upgrades.forEach((upgrade) => {
				if(upgrade.armour){
					armour_class = {...upgrade.armour};
				}
				if(upgrade.gun){
					gun_class = {...upgrade.gun};
				}
				if(upgrade.melee){
					melee_class = {...upgrade.melee};
				}
				if(upgrade.unit){
					unit_class = {...upgrade.unit};
				}					
			})
		}	

		//OVERWRITE MULTIPLE UPGRADES WITH SINGLE SPECIFIC UPGRADE
		if(options.single_upgrade){
			let single_upgrade = options.single_upgrade;
			if(single_upgrade.armour){
				armour_class = {...single_upgrade.armour};
			}
			if(single_upgrade.gun){
				gun_class = {...single_upgrade.gun};
			}
			if(single_upgrade.melee){
				melee_class = {...single_upgrade.melee};
			}
			if(single_upgrade.unit){
				unit_class = {...single_upgrade.unit};
			}									
		}

		let cost = 0;
		cost += armour_class.cost;
		cost += gun_class.cost;
		cost += melee_class.cost;
		cost += unit_class.cost;		
		
		if(!options.loaded){
			options.core.health = unit_class.health
			options.core.cost = cost
		}


		let unit_data = {
			scene: this.scene,

			core: options.core,

			special_rules: special_rules,
			unit_class: unit_class,
			armour_class: armour_class,
			melee_class: melee_class,
			gun_class: gun_class,				
		}


		this.unit_list.push(new unit(unit_data));
	}


}

