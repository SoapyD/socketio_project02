const mongoose = require("mongoose");


const armySchema = new mongoose.Schema({
	name: String
	,author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user_name: String
    }

	,cost: Number
	
	,units: [{
		
		id: Number
		,side: Number
		,player: Number
		,squad: Number		
		
		,unit_name: String
		,shoot_name: String
		,fight_name: String
		,armour_name: String
		
	}]
	
   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Army", armySchema);