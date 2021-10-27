const mongoose = require("mongoose");


const upgradeSchema = new mongoose.Schema({
	name: String
	,cost: Number

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

});


module.exports = mongoose.model("Upgrade", upgradeSchema);