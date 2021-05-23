
GameScene.seed = () => {

	
	let options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 0,
		side: 0,
		angle : 90,
		tile_size: GameScene.tile_size,
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
	
	
	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 1,
		side: 1,
		angle : -90,
		tile_size: GameScene.tile_size,
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



GameScene.seed2 = () => {

	
	let options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 0,
		side: 0,
		angle : 90,
		tile_size: GameScene.tile_size,
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
	

	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 1,
		side: 0,
		angle : 90,
		tile_size: GameScene.tile_size,
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


	
	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 2,
		side: 1,
		angle : -90,
		tile_size: GameScene.tile_size,
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

	
	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 3,
		side: 1,
		angle : -90,
		tile_size: GameScene.tile_size,
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




GameScene.seed3 = () => {

	
	let options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 0,
		side: 0,
		angle : 90,
		tile_size: GameScene.tile_size,
		unit_types: GameScene.unit_types,
		projectile_weapon_types: GameScene.projectile_weapon_types,
		combat_weapon_types: GameScene.combat_weapon_types,
		armour_types: GameScene.armour_types
	}
	GameScene.unit_setup = new unit_setup(options)

	options = {x: 10, y:4}
	GameScene.unit_setup.placeGeneral(options)		

	options = {
		unit_list: gameFunctions.units,
		scene: GameScene.scene,
		player: 1,
		side: 1,
		angle : 90,
		tile_size: GameScene.tile_size,
		unit_types: GameScene.unit_types,
		projectile_weapon_types: GameScene.projectile_weapon_types,
		combat_weapon_types: GameScene.combat_weapon_types,
		armour_types: GameScene.armour_types
	}
	GameScene.unit_setup = new unit_setup(options)

	// options = {x: 14, y:4}
	// GameScene.unit_setup.placeGeneral(options)
	
	options = {x: 16, y:2}
	GameScene.unit_setup.placeSquad(options)	
	
}
