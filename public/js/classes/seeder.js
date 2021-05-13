

const seeder = class {
	constructor(options) {	
		
		this.unit_list = options.unit_list
		this.scene = options.scene,
		this.player = options.player,
		this.side = options.side,
		this.angle = options.angle,
		this.squad = 0,
			
		this.tile_size = options.tile_size,
		this.unit_types = options.unit_types,
		this.projectile_weapon_types = options.projectile_weapon_types,
		this.combat_weapon_types = options.combat_weapon_types,
		this.armour_types = options.armour_types			
	}
	
	// setUnitData(options) {
	// 	this.unit_types = options.unit_types
	// 	this.projectile_weapon_info = options.projectile_weapon_info
	// 	this.combat_weapon_info = options.combat_weapon_info
	// 	this.armour_info = options.armour_info		
	// }
	
	copyObject(return_obj, object) {
		for (const element in object){
			return_obj[element] = object[element];
		}
	}	

	placeUnit(options){
		
		let unit_options;

		let unit_info = this.unit_types.find((e) => e.name===options.unit)	
		let projectile_weapon_info = this.projectile_weapon_types.find((e) => e.name===options.projectile_weapon)	
		let combat_weapon_info = this.combat_weapon_types.find((e) => e.name===options.combat_weapon)	
		let armour_info = this.armour_types.find((e) => e.name===options.armour)			


		unit_options = {}
		this.copyObject(unit_options, this)
		this.copyObject(unit_options, unit_info)
		this.copyObject(unit_options, projectile_weapon_info)
		this.copyObject(unit_options, combat_weapon_info)
		this.copyObject(unit_options, armour_info)	

		unit_options.x = options.x * this.tile_size;
		unit_options.y = options.y * this.tile_size;		

		this.unit_list.push(new unit(unit_options));		
		
	}
	
	placeSquad(options){
		
		let unit_options = {
			unit: "marine",
			projectile_weapon: "bolter",
			combat_weapon: "sword",
			armour: "basic",
		}
		
		let leader_options = {
			unit: "squad_leader",
			projectile_weapon: "bolter",
			combat_weapon: "sword",
			armour: "basic",
		}		
		
		let special_options = {
			unit: "special",
			projectile_weapon: "bolter",
			combat_weapon: "sword",
			armour: "basic",
		}				
		
		let heavy_options = {
			unit: "heavy",
			projectile_weapon: "bolter",
			combat_weapon: "sword",
			armour: "basic",
		}		
		

		let x_start = options.x;		
		let y_start = options.y;
		let id = 0

		for(let y=y_start; y<y_start+4; y+=2){
			for(let x=x_start; x<x_start+6; x+=2){
				

				switch(id){
					case 3:
						special_options.x = x
						special_options.y = y
						this.placeUnit(special_options)
						break;
					case 4:
						heavy_options.x = x
						heavy_options.y = y
						this.placeUnit(heavy_options)
						break;
					case 5:
						leader_options.x = x
						leader_options.y = y
						this.placeUnit(leader_options)
						break;
					default:
						unit_options.x = x
						unit_options.y = y
						this.placeUnit(unit_options)
					break;
				}
				
				
				id++;
			}			
		}
		
		this.squad++;
	}
	
}




/*

GameScene.seeds = () => {

	let unit_info;
	let projectile_weapon_info;
	let combat_weapon_info;	
	let armour_info;	
	
	let core_data = {
		scene: GameScene.scene, 
		x: GameScene.tile_size * 3, 
		y: GameScene.tile_size * 2, 
		side: 0, 
		player: 0,
		squad: 0,
		angle: 90		
	}
	
	let options;
	
	unit_info =GameScene.unit_types.find((e) => e.name==="marine")	
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")			
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	


	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 5
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 4
	options.y = GameScene.tile_size * 3
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	core_data.squad = 1;
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 14
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 16
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 15
	options.y = GameScene.tile_size * 3
	
	GameScene.units.push(new unit(options));	
	
	
	core_data.squad = 2;	
	unit_info =GameScene.unit_types.find((e) => e.name==="tank")
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="none")
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 12
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));
	

	core_data.squad = 3;	
	unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 8
	options.y = GameScene.tile_size * 2
	
	GameScene.units.push(new unit(options));		
	
	
	//PLAYER 1
	core_data.player = 1;
	core_data.side = 1;
	core_data.angle = -90;	
	
	unit_info =GameScene.unit_types.find((e) => e.name==="marine")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 3
	options.y = GameScene.tile_size * 37
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 5
	options.y = GameScene.tile_size * 37
	
	GameScene.units.push(new unit(options));
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 4
	options.y = GameScene.tile_size * 36
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	core_data.squad = 1;
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 14
	options.y = GameScene.tile_size * 37
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 16
	options.y = GameScene.tile_size * 37
	
	GameScene.units.push(new unit(options));
	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 15
	options.y = GameScene.tile_size * 36
	
	GameScene.units.push(new unit(options));	
	

	core_data.squad = 3;	
	unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 8
	options.y = GameScene.tile_size * 38
	
	GameScene.units.push(new unit(options));	
	
	
	core_data.squad = 2;	
	unit_info =GameScene.unit_types.find((e) => e.name==="tank")
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="none")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 12
	options.y = GameScene.tile_size * 37
	
	GameScene.units.push(new unit(options));	
	
}

GameScene.seeds2 = () => {

	let unit_info;
	let projectile_weapon_info;
	let combat_weapon_info;	
	let armour_info;
	
	let core_data = {
		scene: GameScene.scene, 
		x: GameScene.tile_size * 3, 
		y: GameScene.tile_size * 2, 
		side: 0, 
		player: 0,
		squad: 0,
		angle: 90		
	}
	
	let options;
	
	options = {}
	unit_info = GameScene.unit_types.find((e) => e.name==="marine")	
	gameFunctions.copyObject(options, unit_info)
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	gameFunctions.copyObject(options, projectile_weapon_info)	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	gameFunctions.copyObject(options, combat_weapon_info)	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")	
	gameFunctions.copyObject(options, armour_info)		
	gameFunctions.copyObject(options, core_data)

	GameScene.units.push(new unit(options));

	
	options = {}
	core_data.x =GameScene.tile_size * 5;
	core_data.y =GameScene.tile_size * 2;	
	unit_info = GameScene.unit_types.find((e) => e.name==="marine")	
	gameFunctions.copyObject(options, unit_info)
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	gameFunctions.copyObject(options, projectile_weapon_info)	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	gameFunctions.copyObject(options, combat_weapon_info)	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")	
	gameFunctions.copyObject(options, armour_info)			
	gameFunctions.copyObject(options, core_data)	
	
	GameScene.units.push(new unit(options));	
	
	
	options = {}
	core_data.player = 1;
	core_data.side = 1;	
	core_data.x =GameScene.tile_size * 3;
	core_data.y =GameScene.tile_size * 5;	
	unit_info = GameScene.unit_types.find((e) => e.name==="marine")	
	gameFunctions.copyObject(options, unit_info)
	projectile_weapon_info = GameScene.projectile_weapon_types.find((e) => e.name==="bolter")	
	gameFunctions.copyObject(options, projectile_weapon_info)	
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="sword")	
	gameFunctions.copyObject(options, combat_weapon_info)	
	armour_info = GameScene.armour_types.find((e) => e.name==="basic")	
	gameFunctions.copyObject(options, armour_info)		
	gameFunctions.copyObject(options, core_data)

	GameScene.units.push(new unit(options));	
	
	
	
	// core_data.squad = 3;	
	// unit_info =GameScene.unit_types.find((e) => e.name==="dread")
	// options = {}
	// gameFunctions.copyObject(options, core_data)
	// gameFunctions.copyObject(options, unit_info)
	// gameFunctions.copyObject(options, projectile_weapon_info)
	// gameFunctions.copyObject(options, combat_weapon_info)
	// gameFunctions.copyObject(options, armour_info)	
	// options.x = GameScene.tile_size * 7
	// options.y = GameScene.tile_size * 5
	
	// GameScene.units.push(new unit(options));		
	
	core_data.squad = 2;	
	unit_info =GameScene.unit_types.find((e) => e.name==="tank")
	combat_weapon_info = GameScene.combat_weapon_types.find((e) => e.name==="none")	
	options = {}
	gameFunctions.copyObject(options, core_data)
	gameFunctions.copyObject(options, unit_info)
	gameFunctions.copyObject(options, projectile_weapon_info)
	gameFunctions.copyObject(options, combat_weapon_info)
	gameFunctions.copyObject(options, armour_info)	
	options.x = GameScene.tile_size * 7
	options.y = GameScene.tile_size * 5
	
	GameScene.units.push(new unit(options));		
	
	
}


*/
