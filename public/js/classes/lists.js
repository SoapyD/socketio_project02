
const unit_type = class {
	constructor(options) {
		this.name = options.name;
		this.spritesheet = options.spritesheet;
		this.sprite_offset = options.sprite_offset;
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
				
		this.health = options.health;		
		this.movement = options.movement;
		this.death_sfx = options.death_sfx;
	}
}

const projectile_weapon_type = class {
	constructor(options) {
		this.name = options.name;
		this.shoot_range = options.shoot_range;
		this.shoot_damage = options.shoot_damage;
		this.max_targets = options.max_targets;
	}
}

const combat_weapon_type = class {
	constructor(options) {
		this.name = options.name;
		this.fight_damage = options.fight_damage;
	}
}

const armour_type = class {
	constructor(options) {
		this.name = options.name;
		this.armour = options.armour;
	}
}


const unit_types = []
const projectile_weapon_types = []
const combat_weapon_types = []
const armour_types = []
let options;

options = {
	name: 'marine',
	spritesheet: 'unit',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 10,
	death_sfx: "death_man"
}

unit_types.push(new unit_type(options))

options = {
	name: 'squad_leader',
	spritesheet: 'squad_leader',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 10,
	death_sfx: "death_man"
}

unit_types.push(new unit_type(options))

options = {
	name: 'heavy',
	spritesheet: 'heavy',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 10,
	death_sfx: "death_man"
}

unit_types.push(new unit_type(options))

options = {
	name: 'special',
	spritesheet: 'special',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 10,
	death_sfx: "death_man"
}

unit_types.push(new unit_type(options))



options = {
	name: 'dread',
	spritesheet: 'dread',
	size: 1,
	sprite_offset: 0,	
	cohesion: 0,
	health: 100,
	movement: 6,
	death_sfx: "death_machine"
}

unit_types.push(new unit_type(options))

options = {
	name: 'tank',
	spritesheet: 'tank',
	size: 1,
	sprite_offset: 0.5,	
	cohesion: 0,
	health: 100,
	movement: 12,
	death_sfx: "death_machine"
}

unit_types.push(new unit_type(options))

//PROJECTILE WEAPONS
options = {
	name: "bolter",
	shoot_range: 200,
	shoot_damage: 20,
	max_targets: 2
}

projectile_weapon_types.push(new projectile_weapon_type(options))

//COMBAT WEAPONS
options = {
	name: "none",
	fight_damage: 0,
}

combat_weapon_types.push(new combat_weapon_type(options))

options = {
	name: "sword",
	fight_damage: 20,
}

combat_weapon_types.push(new combat_weapon_type(options))

options = {
	name: "basic",
	armour: 20,
}

armour_types.push(new armour_type(options))


GameScene.unit_types = unit_types;
GameScene.projectile_weapon_types = projectile_weapon_types;
GameScene.combat_weapon_types = combat_weapon_types;
GameScene.armour_types = armour_types;


