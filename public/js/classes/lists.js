
const unit_type = class {
	constructor(options) {
		this.unit_name = options.unit_name;
		this.spritesheet = options.spritesheet;
		this.sprite_offset = options.sprite_offset;
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
				
		this.health = options.health;		
		this.movement = options.movement;
		this.death_sfx = options.death_sfx;
		
		this.shooting_bonus = options.shooting_bonus;
		this.fighting_bonus = options.fighting_bonus;
		
		this.symbol_id = options.symbol_id;
	}
}


const projectile_weapon_type = class {
	constructor(options) {
		this.shoot_name = options.shoot_name;
		this.shoot_range = options.shoot_range;
		this.shoot_damage = options.shoot_damage;
		this.shoot_ap = options.shoot_ap;
		this.max_targets = options.max_targets;
		this.blast_spritesheet = options.blast_spritesheet;
		this.blast_radius = options.blast_radius;
	}
}

const combat_weapon_type = class {
	constructor(options) {
		this.fight_name = options.fight_name;
		this.fight_damage = options.fight_damage;
		this.fight_ap = options.fight_ap;
		this.fight_max_targets = options.fight_max_targets
		this.fight_range = options.fight_range
	}
}

const armour_type = class {
	constructor(options) {
		this.armour_name = options.armour_name;
		this.armour = options.armour;
	}
}


const unit_types = []
const projectile_weapon_types = []
const combat_weapon_types = []
const armour_types = []
let options;

options = {
	unit_name: 'general',
	spritesheet: 'general',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 0,
	health: 160,
	movement: 6,
	death_sfx: "death_man",
	
	shooting_bonus: -2,
	fighting_bonus: -2,
	symbol_id: 5,
}

unit_types.push(new unit_type(options))

options = {
	unit_name: 'squad_leader',
	spritesheet: 'squad_leader',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 120,
	movement: 6,
	death_sfx: "death_man",
	
	shooting_bonus: -1,
	fighting_bonus: -1,
	symbol_id: 4,
}

unit_types.push(new unit_type(options))

options = {
	unit_name: 'heavy',
	spritesheet: 'heavy',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 6,
	death_sfx: "death_man",
	
	shooting_bonus: -2,
	fighting_bonus: 1,
	symbol_id: 7,
}

unit_types.push(new unit_type(options))

options = {
	unit_name: 'special',
	spritesheet: 'special',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 6,
	death_sfx: "death_man",
	
	shooting_bonus: -1,
	fighting_bonus: 0,
	symbol_id: 2,
}

unit_types.push(new unit_type(options))

options = {
	unit_name: 'marine',
	spritesheet: 'unit',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 6,
	death_sfx: "death_man",
	shooting_bonus: 0,
	fighting_bonus: 0,
	symbol_id: 3,
}

unit_types.push(new unit_type(options))



options = {
	unit_name: 'dread',
	spritesheet: 'dread',
	size: 1,
	sprite_offset: 0,	
	cohesion: 0,
	health: 200,
	movement: 10,
	death_sfx: "death_machine",
	shooting_bonus: -1,
	fighting_bonus: -2,
	symbol_id: 1,
}

unit_types.push(new unit_type(options))


options = {
	unit_name: 'tank',
	spritesheet: 'tank',
	size: 1,
	sprite_offset: 0.5,	
	cohesion: 0,
	health: 200,
	movement: 14,
	death_sfx: "death_machine",
	shooting_bonus: 0,
	fighting_bonus: -2,
	symbol_id: 12,
}

unit_types.push(new unit_type(options))



//PROJECTILE WEAPONS
options = {
	shoot_name: "bolter",
	shoot_range: 400,
	shoot_damage: 20,
	max_targets: 2,
	blast_spritesheet: "explosion",
	blast_radius: 1,
	shoot_ap: 4
}

projectile_weapon_types.push(new projectile_weapon_type(options))

options = {
	shoot_name: "plasma",
	shoot_range: 300,
	shoot_damage: 60,
	max_targets: 1,
	blast_spritesheet: "special_blast",
	blast_radius: 3,
	shoot_ap: 6
}

projectile_weapon_types.push(new projectile_weapon_type(options))

options = {
	shoot_name: "heavy",
	shoot_range: 500,
	shoot_damage: 40,
	max_targets: 1,
	blast_spritesheet: "heavy_blast",
	blast_radius: 6,
	shoot_ap: 2
}

projectile_weapon_types.push(new projectile_weapon_type(options))



//COMBAT WEAPONS
options = {
	fight_name: "none",
	fight_damage: 0,
	fight_ap: 0,
	fight_max_targets : 0,
	fight_range: 0
}

combat_weapon_types.push(new combat_weapon_type(options))

let fight_range = (gameFunctions.tile_size * 2)-(gameFunctions.tile_size / 2)

options = {
	fight_name: "sword",
	fight_damage: 20,
	fight_ap: 2,
	fight_max_targets: 2,
	fight_range: fight_range
}

combat_weapon_types.push(new combat_weapon_type(options))

options = {
	armour_name: "basic",
	armour: 10,
}

armour_types.push(new armour_type(options))

options = {
	armour_name: "heavy",
	armour: 15,
}

armour_types.push(new armour_type(options))


GameScene.unit_types = unit_types;
GameScene.projectile_weapon_types = projectile_weapon_types;
GameScene.combat_weapon_types = combat_weapon_types;
GameScene.armour_types = armour_types;


