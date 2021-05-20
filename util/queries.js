const models = require("../models");
const Room = require("../models/room");


exports.findRoom = (id) => {
    try{
        return Room.findById(id).populate("users").exec()
    }
    catch(err){
        console.log("Error trying to find room by id")
        console.log(err)
    }
}

exports.findRooms = (room_name) => {
    try{
        return Room.find({room_name: room_name})
    }
    catch(err){
        console.log("Error trying to find room by room_name")
        console.log(err)
    }
}

exports.findRoomsWithSocket = (socket_id) => {
    return Room.find({sockets: socket_id})
}

exports.createRoom = (data, socket_id) => {

    let author = {
		id: data.user_id,
		userName: data.user_name
    }
    
    let users = [];
    users.push(data.user_id);

    let sockets = [];
    sockets.push(socket_id);

	
	let config = {
		max_players: data.players
		,current_player: 0
		,mode: ""
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
        // ,decks: decks
        // ,matrix: boardmatrix
    })
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


exports.updateRoom = (room, data) => {
	
	room.config.current_player = data.current_player
	room.config.mode = data.mode
	room.units = [];
	
	data.units.forEach((unit) => {
		
		let info = {
			id: unit.id
			,side: unit.side
			,player: unit.player
			,squad: unit.squad		

			,unit_name: unit.unit_name
			,shoot_name: unit.shoot_name
			,fight_name: unit.fight_name
			,armour_name: unit.armour_name

			,health: unit.health
			,alive: unit.alive
			,in_combat: unit.in_combat

			,x: unit.sprite.x
			,y: unit.sprite.y
			,rotation: unit.sprite.rotation
		}
		
		room.units.push(info)
		
	})
	
	room.markModified('config');
	room.markModified('units');	
	
	return room.save()
}


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

exports.findData = async(find_list) => {

    let promises = [];

    find_list.forEach((list) => {

        if (list.params)
        {
            list.params.forEach((item) => {
                promises.push(models[list.model][list.search_type](item))
            })
        }
        else{
            promises.push(models[list.model][list.search_type]())
        }
    })

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

exports.createData = async(creation_list, search_type="findOrCreate") => {

    let promises = [];

    creation_list.forEach((list) => {
        list.params.forEach((item) => {
            promises.push(models[list.model][search_type](item))
        })
    })

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

exports.updateData = async(item, update_list) => {

    let promises = [];

    update_list.forEach((list) => {

        list.params.forEach((param_item) => {
            for(const key in param_item){
                item[key] = param_item[key]
            }
        })
        promises.push(item.save())
    })  
    
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

exports.destroyData = async(destroy_list) => {

    let promises = [];

    destroy_list.forEach((list) => {

        list.params.forEach((item) => {
            promises.push(models[list.model].destroy(item))
        })
    })  

    return Promise.all(promises)
    .catch((err) => {
        console.log(err)
    })      
}






