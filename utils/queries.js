const models = require("../models");
const Room = require("../models/room");

exports.findRoom = (id) => {
    try{
        return Room.findById(id)
        // .populate("users")
        .populate({path: 'users'})
        .populate({
            path: "forces",
            populate: [{
                path: "army_list",
                model: "Army"
            },
            {
                path: "user"
            }]            
        })        
        .exec()
    }
    catch(err){
        console.log("Error trying to find room by id")
        console.log(err)
    }
}

exports.findRooms = (room_name, include_users=true) => {
    try{
		if(include_users === true){
            return Room.find({room_name: room_name})
            .populate({path: 'users'})          
            .exec();
		}else{
        	return Room.find({room_name: room_name})	
		}

    }
    catch(err){
        console.log("Error trying to find room by room_name")
        console.log(err)
    }
}

exports.findRoomsWithSocket = (socket_id) => {
    return Room.find({sockets: socket_id})
}


	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	//  ██████ ██████  ███████  █████  ████████ ███████       ██████   ██████   ██████  ███    ███ 
	// ██      ██   ██ ██      ██   ██    ██    ██            ██   ██ ██    ██ ██    ██ ████  ████ 
	// ██      ██████  █████   ███████    ██    █████   █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
	// ██      ██   ██ ██      ██   ██    ██    ██            ██   ██ ██    ██ ██    ██ ██  ██  ██ 
	//  ██████ ██   ██ ███████ ██   ██    ██    ███████       ██   ██  ██████   ██████  ██      ██ 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

exports.createRoom = async(data, socket_id) => {

	let armies = await exports.findData({
		model: "Army"
		,search_type: "find"
	})

    let author = {
		id: data.user,
		userName: data.user_name
    }
    
    let users = [];
    users.push(data.user);

    let sockets = [];
    sockets.push(socket_id);

	
	let config = {
		max_players: data.players
		,max_sides: 4 //data.sides
		,turn_number: 0
        ,current_player: 0
		,current_side: 0
		,mode: ""
	}
	
	let forces = [];
	for(let i=0;i<config.max_players;i++){
		let force = {
			player_number: i
        }
        if(i === 0){
            force.user = data.user
            force.army_list = armies[0]
        }
		forces.push(force)
	}

    return Room.create ({
        room_name: data.room_name
        ,password: data.password
        ,author: author
        ,users: users
        ,sockets: sockets
        // ,armies: armies
		
		// ,max_players: max_players
		,config: config
        ,forces: forces
    })
}


	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// 		██  ██████  ██ ███    ██       ██████   ██████   ██████  ███    ███ 
	// 		██ ██    ██ ██ ████   ██       ██   ██ ██    ██ ██    ██ ████  ████ 
	// 		██ ██    ██ ██ ██ ██  ██ █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
	// ██   ██ ██    ██ ██ ██  ██ ██       ██   ██ ██    ██ ██    ██ ██  ██  ██ 
	// 	█████   ██████  ██ ██   ████       ██   ██  ██████   ██████  ██      ██ 														
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

exports.joinRoom = async(network, data, room) => {

	let armies = await exports.findData({
		model: "Army"
		,search_type: "find"
	})

    //ADD USER TO ROOM THEN RETURN DATA
    room.users.push(data.user);

    let player_id = room.users.indexOf(data.user);

    //ADD USER ID TO THE FORCES LIST
    room.forces[player_id].user = data.user;
    room.forces[player_id].army_list = armies[0];
    room.sockets.push(network.socket.id);
    saved_room = await room.save()	

    return await exports.findRooms(data.room_name)

    // return Promise.all([queries.createData(list)]); 
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ######  ####### ####### #     # 
// #     # #     # #     # ##   ## 
// #     # #     # #     # # # # # 
// ######  #     # #     # #  #  # 
// #   #   #     # #     # #     # 
// #    #  #     # #     # #     # 
// #     # ####### ####### #     # 
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports.saveRoom = (room) => {
    // let promises = [];
    // promises.push(room.save())

    // return Promise.all(promises)
    // .catch((err) => {
    //     console.log(err)
    // })      
    return room.save()
}

exports.updateRoom = (room, data) => {
	
    room.config.turn_number = data.turn_number
	room.config.current_side = data.current_side
	room.config.current_player = data.current_player
    room.config.mode = data.mode
    room.config.mode_state = data.mode_state
	room.units = [];
	
	data.units.forEach((unit) => {
		
		let info = {
			id: unit.id
			,side: unit.side
			,player: unit.player
			,squad: unit.squad		

            ,upgrade_id: unit.upgrade_id
			,unit_name: unit.unit_name
			,shoot_name: unit.shoot_name
			,fight_name: unit.fight_name
			,armour_name: unit.armour_name

			,health: unit.health
            ,alive: unit.alive
            ,killed_by: unit.killed_by
			,in_combat: unit.in_combat

			,x: unit.x
			,y: unit.y
			,rotation: unit.rotation
		}
		
		room.units.push(info)
	})
	
	room.markModified('config');
	room.markModified('units');	

	return room.save()
}

exports.updateRoomConfig = (room, data) => {
	
	// console.log(data)
	// console.log(room)
	
	if(data.subtype){
		switch(data.subtype){
			case 'side':
				room.forces[data.player_number].side = data.value;
				break;
			case 'start':
				room.forces[data.player_number].start = data.value;
				break;
			case 'army':
                // if(data.value !== ""){
                    room.forces[data.player_number].army = data.value;
                // }
				break;
		}		
	}

	
	room.markModified('forces');

	return room.save()
}

//SQUAD

exports.getFaction = (params) => {
    
    return models.Faction.find(params)

    .populate({
        path: "squads",
        model: "Squad",
        populate: [
            {path: 'upgrades',model: "Upgrade"},
            {path: 'unit'},
            {path: 'gun'},
            {path: 'melee'},
            {path: 'armour'},
        ]
        // populate: {
        //     path: 'unit'
        // }          
    })  

    // .populate({path: 'unit'})
    // .populate({path: 'gun'})
    // .populate({path: 'melee'})
    // .populate({path: 'armour'})
}

exports.getArmies = (options) => {

    let promises = [];

    let params = [];
    options.forces.forEach((force) => {
        params = {
            _id: force.army
        }
        promises.push(exports.getArmy(params))
    })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })  

}

exports.getArmy = (params) => {

    return models.Army.find(params)
    .populate({path: 'faction'})
    .populate(
        // [
        {
            path: "squads",
            populate: [
            {
                path: "squad",
                // model: "Squad",
                populate: [
                        {path: 'unit'},  
                        {path: 'gun'},
                        {path: 'melee'},
                        {path: 'armour'},
                        {
                            path: 'upgrades',
                            populate: [
                                {path: "upgrade"},
                                {path: 'unit'},  
                                {path: 'gun'},
                                {path: 'melee'},
                                {path: 'armour'},
                                ]                 
                        }
                    ]
            },
            {
                path: 'upgrades',
                populate: {
                    path: "upgrade",
                    populate: [
                        {path: 'unit'},  
                        {path: 'gun'},
                        {path: 'melee'},
                        {path: 'armour'},
                    ]                    
                }          
            }
            ]
        },
        
        // ]
    )  

}

// exports.getSquads = (params) => {
//     return models.Squad.find(params)
//     .populate({path: 'unit'})
//     .populate({path: 'gun'})
//     .populate({path: 'melee'})
//     .populate({path: 'armour'})
//     .populate({
//         path: "upgrades",
//         populate: {
//             path: 'upgrade'     
//         }
//     }) 
// }



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    #    #       #       
//   # #   #       #       
//  #   #  #       #       
// #     # #       #       
// ####### #       #       
// #     # #       #       
// #     # ####### ####### 
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ####### ### #     # ######        ######     #    #######    #    
// #        #  ##    # #     #       #     #   # #      #      # #   
// #        #  # #   # #     #       #     #  #   #     #     #   #  
// #####    #  #  #  # #     # ##### #     # #     #    #    #     # 
// #        #  #   # # #     #       #     # #######    #    ####### 
// #        #  #    ## #     #       #     # #     #    #    #     # 
// #       ### #     # ######        ######  #     #    #    #     # 

exports.findData = async(list) => {

    let promises = [];

    // find_list.forEach((list) => {

        if (list.params)
        {
            if(!list.populate){
                list.params.forEach((item) => {
                    promises.push(models[list.model][list.search_type](item))
                })
            }
        }
        else{
            promises.push(models[list.model][list.search_type]())
        }
    // })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })    
}

//  #####  ######  #######    #    ####### #######       ######  #######  #####  ####### ######  ######  
// #     # #     # #         # #      #    #             #     # #       #     # #     # #     # #     # 
// #       #     # #        #   #     #    #             #     # #       #       #     # #     # #     # 
// #       ######  #####   #     #    #    #####   ##### ######  #####   #       #     # ######  #     # 
// #       #   #   #       #######    #    #             #   #   #       #       #     # #   #   #     # 
// #     # #    #  #       #     #    #    #             #    #  #       #     # #     # #    #  #     # 
//  #####  #     # ####### #     #    #    #######       #     # #######  #####  ####### #     # ######  

exports.createData = async(list, search_type="create") => {

    let promises = [];

    // creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model][search_type](item))
        })
    // })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })  
}


// #     # ######  ######     #    ####### #######       ######     #    #######    #    
// #     # #     # #     #   # #      #    #             #     #   # #      #      # #   
// #     # #     # #     #  #   #     #    #             #     #  #   #     #     #   #  
// #     # ######  #     # #     #    #    #####   ##### #     # #     #    #    #     # 
// #     # #       #     # #######    #    #             #     # #######    #    ####### 
// #     # #       #     # #     #    #    #             #     # #     #    #    #     # 
//  #####  #       ######  #     #    #    #######       ######  #     #    #    #     # 

exports.updateData = async(item, list) => {

    let promises = [];

    // update_list.forEach((list) => {
        list.params.forEach((param_item) => {
            for(const key in param_item){
                item[key] = param_item[key]
            }
        })
        promises.push(item.save())
    // })  
    
    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })      
}


// ######  #######  #####  ####### ######  ####### #     #       ######     #    #######    #    
// #     # #       #     #    #    #     # #     #  #   #        #     #   # #      #      # #   
// #     # #       #          #    #     # #     #   # #         #     #  #   #     #     #   #  
// #     # #####    #####     #    ######  #     #    #    ##### #     # #     #    #    #     # 
// #     # #             #    #    #   #   #     #    #          #     # #######    #    ####### 
// #     # #       #     #    #    #    #  #     #    #          #     # #     #    #    #     # 
// ######  #######  #####     #    #     # #######    #          ######  #     #    #    #     # 

exports.destroyData = async(list) => {

    let promises = [];

    // destroy_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model].deleteOne(item))
        })
    // })  

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })      
}




// ######  ####### #     # ####### #     # #######       ######     #    #######    #    
// #     # #       ##   ## #     # #     # #             #     #   # #      #      # #   
// #     # #       # # # # #     # #     # #             #     #  #   #     #     #   #  
// ######  #####   #  #  # #     # #     # #####   ##### #     # #     #    #    #     # 
// #   #   #       #     # #     #  #   #  #             #     # #######    #    ####### 
// #    #  #       #     # #     #   # #   #             #     # #     #    #    #     # 
// #     # ####### #     # #######    #    #######       ######  #     #    #    #     # 
                                                                                      

exports.removeData = async(list) => {

    let promises = [];

        list.forEach((item) => {
            promises.push(models[item.model].remove({}))
        })

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })      
}



