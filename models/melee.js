const mongoose = require("mongoose");


const meleeSchema = new mongoose.Schema({
	fight_name: String
	,fight_damage: Number
	,fight_ap: Number
	,fight_max_targets: Number
	,fight_range: Number	
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Melee", meleeSchema);