
GameScene.seed = () => {

	let player = -1;
	let side = -1;
	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 0){
			player = force.player_number;
			side = force.side;
		}
	})	
	
	let options;
	
	if (player !== -1 && side !== -1){
		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : 90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)


		options = {x: 3, y:2}
		GameScene.unit_setup.placeSquad(options)

		options = {x: 14, y:2}
		GameScene.unit_setup.placeTank(options)

		options = {x: 14, y:5}
		GameScene.unit_setup.placeGeneral(options)		

		options = {x: 17, y:2}
		GameScene.unit_setup.placeSquad(options)			
	}

	
	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 1){
			player = force.player_number;
			side = force.side;
		}
	})		
	
	if (player !== -1 && side !== -1){	

		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : -90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)	


		options = {x: 3, y:35}
		GameScene.unit_setup.placeSquad(options)

		options = {x: 14, y:37}
		GameScene.unit_setup.placeTank(options)	

		options = {x: 14, y:34}
		GameScene.unit_setup.placeGeneral(options)		

		options = {x: 17, y:35}
		GameScene.unit_setup.placeSquad(options)		
	}

	
}



GameScene.seed2 = () => {

	let player = -1;
	let side = -1;
	let options;
	
	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 0){
			player = force.player_number;
			side = force.side;
		}
	})
	
	if (player !== -1 && side !== -1){
		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : 90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)


		options = {x: 2, y:2}
		GameScene.unit_setup.placeSquad(options)

		options = {x: 12, y:2}
		GameScene.unit_setup.placeTank(options)
	}
	

	player = -1;
	side = -1;	
	
	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 1){
			player = force.player_number;
			side = force.side;
		}
	})	

	if (player !== -1 && side !== -1){
		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : 90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)


		options = {x: 17, y:2}
		GameScene.unit_setup.placeTank(options)		

		options = {x: 19, y:2}
		GameScene.unit_setup.placeSquad(options)
	}

	player = -1;
	side = -1;	

	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 2){
			player = force.player_number;
			side = force.side;
		}
	})	

	if (player !== -1 && side !== -1){	
		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : -90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)	


		options = {x: 2, y:35}
		GameScene.unit_setup.placeSquad(options)

		options = {x: 13, y:37}
		GameScene.unit_setup.placeTank(options)	
	}

	
	player = -1;
	side = -1;	
	
	gameFunctions.params.forces.forEach((force) => {
		if(force.start === 3){
			player = force.player_number;
			side = force.side;
		}
	})	
	
	if (player !== -1 && side !== -1){	
		options = {
			unit_list: gameFunctions.units,
			scene: GameScene.scene,
			player: player,
			side: side,
			angle : -90,
			tile_size: gameFunctions.tile_size,
			unit_types: GameScene.unit_types,
			projectile_weapon_types: GameScene.projectile_weapon_types,
			combat_weapon_types: GameScene.combat_weapon_types,
			armour_types: GameScene.armour_types
		}
		GameScene.unit_setup = new unit_setup(options)	


		options = {x: 17, y:37}
		GameScene.unit_setup.placeTank(options)		

		options = {x: 19, y:35}
		GameScene.unit_setup.placeSquad(options)
	}
}




GameScene.seed3 = () => {

	
	let options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 0,
		side: 0,
		angle : 90,
		tile_size: gameFunctions.tile_size,
		unit_types: GameScene.unit_types,
		projectile_weapon_types: GameScene.projectile_weapon_types,
		combat_weapon_types: GameScene.combat_weapon_types,
		armour_types: GameScene.armour_types
	}
	GameScene.unit_setup = new unit_setup(options)

	// options = {x: 5, y:2}
	// GameScene.unit_setup.placeSquad(options)
	
	// options = {x: 15, y:2}
	// GameScene.unit_setup.placeSquad(options)	


	options = {x: 3, y:2}
	GameScene.unit_setup.placeSquad(options)

	// options = {x: 14, y:2}
	// GameScene.unit_setup.placeTank(options)

	// options = {x: 14, y:5}
	// GameScene.unit_setup.placeGeneral(options)		

	// options = {x: 17, y:2}
	// GameScene.unit_setup.placeSquad(options)


	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 1,
		side: 1,
		angle : 90,
		tile_size: gameFunctions.tile_size,
		unit_types: GameScene.unit_types,
		projectile_weapon_types: GameScene.projectile_weapon_types,
		combat_weapon_types: GameScene.combat_weapon_types,
		armour_types: GameScene.armour_types
	}
	GameScene.unit_setup = new unit_setup(options)

	options = {x: 14, y:2}
	GameScene.unit_setup.placeSquad(options)
	
	// options = {x: 16, y:2}
	// GameScene.unit_setup.placeGeneral(options)	
	
	// options = {x: 16, y:2}
	// GameScene.unit_setup.placeDread(options)		

}
