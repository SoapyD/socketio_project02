
const unit_type = class {
	constructor(options) {
		this.name = options.name;
		this.spritesheet = options.spritesheet;
		this.sprite_offset = options.sprite_offset;
		this.size = options.size; //the grid size of the object used when plotting movement
		this.cohesion = options.cohesion; //the maximum distance a unit can be from another member of it's squad
				
		this.health = options.health;		
		this.movement = options.movement;
	}
	
	// getData() {
	// 	let return_info = {}
	
	// 	for (const element in this){
	// 		return_info[element] = this[element];
	// 	}
		
	// 	return return_info;
	// }
}

const unit_types = []
let options;

options = {
	name: 'marine',
	spritesheet: 'unit',
	size: 0,
	sprite_offset: 0.5,
	cohesion: 75,
	health: 100,
	movement: 10
}

unit_types.push(new unit_type(options))

options = {
	name: 'dread',
	spritesheet: 'dread',
	size: 1,
	sprite_offset: 0,	
	cohesion: 0,
	health: 100,
	movement: 6
}

unit_types.push(new unit_type(options))


options = {
	name: 'tank',
	spritesheet: 'tank',
	size: 1,
	sprite_offset: 0.5,	
	cohesion: 0,
	health: 100,
	movement: 12
}

unit_types.push(new unit_type(options))



GameScene.unit_types = unit_types;

// let unit_info = GameScene.unit_types.find((e) => e.name="marine")
// let item = unit_info.getData();
// item.name = "test"
// console.log(GameScene.unit_types[0])
// console.log(item)


