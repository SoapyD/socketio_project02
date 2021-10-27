const mongoose = require("mongoose");


const squadSchema = new mongoose.Schema({
	name: String
	,min_size: Number
	,max_size: Number
	
	,unit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Unit"
	}		
	,gun: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Gun"
	}	
	,melee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Melee"
	}		
	,armour: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Armour"
	}

	,upgrades: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Upgrade"
		}
	]
});


module.exports = mongoose.model("Squad", squadSchema);