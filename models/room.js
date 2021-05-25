const mongoose = require("mongoose");
// const User = require("../models/user");


const roomSchema = new mongoose.Schema({
	room_name: String
	,password: String
	,sockets: [String]
    ,users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
    // ,characters: [{
    //     id: Number
    //     ,character_id: {type: Number, default: -1}
    //     ,life: {type: Number, default: 0}
    //     ,armour: {type: Number, default: 0}
    // }]

	,author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user_name: String
    }



	,config: {
		max_players: Number
		,max_sides: Number
		,current_player: {type: Number, default: 0}
		,current_side: {type: Number, default: 0}
		,mode: String
	}
	
	// ,selected_unit: {type: Number, default: -1}	
	
	,units: [{
		
		id: Number
		,side: Number
		,player: Number
		,squad: Number		
		
		,unit_name: String
		,shoot_name: String
		,fight_name: String
		,armour_name: String
		
		,health: Number
		,alive: Boolean
		,in_combat: Boolean
		
		,x: {type: Number, default: 0}
		,y: {type: Number, default: 0}
		,rotation: {type: Number, default: 0}
	}]
	


   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Room", roomSchema);