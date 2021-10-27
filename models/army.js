const mongoose = require("mongoose");


const armySchema = new mongoose.Schema({
	name: String
	,author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
    }

	,cost: Number
	
	,squads: [{
		name: String
		,id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Squad"
		}
		,upgrades: [{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Upgrade"
			}
		}]		
	}]
	
   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Army", armySchema);