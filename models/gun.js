const mongoose = require("mongoose");


const gunSchema = new mongoose.Schema({
	shoot_name: String
	,shoot_range: Number
	,shoot_damage: Number
	,shoot_ap: Number
	,max_targets: Number
	,blast_spritesheet: String
	,blast_radius: Number
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Gun", gunSchema);