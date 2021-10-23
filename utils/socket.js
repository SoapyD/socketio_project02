// const deckController = require('../controllers/deck');

const functionsUtil = require('./functions');
const queriesUtil = require('./queries');

let availableFunctions = {};



exports.checkMessages = (io,namespace) => {
    io.of(namespace).on('connection', (socket, req)=> {

        //THIS IS A GENERIC MESSAGE HANDLER, ALLOWS CLIENT SIDE TO SEND VARIABLE FUNCTIONGROUP AND FUNCTION NAME TO RUN ON SERVER
        socket.on('message_server', (data) => {

            let network = {
                io: io,
                namespace: namespace,
                socket: socket
            }

            try{
                availableFunctions[data.functionGroup][data.function](network,data);
            }
            catch(err){
                console.log("Error running socket method")
                console.log(err)
            }
        })


        //THIS HANDLES ANY DISCONNECTIONS CLIENTS. IT REMOVES THEIR SOCKET REFERENCES FROM ANY ROOMS IN THE DB
        //ALLOWS ME TO TELL IF A CLIENT IS ALREADY IN THE ROOM OR WAS ONCE IN THE ROOM AND CAN REJOIN
		socket.on('disconnect', async() => {

			let rooms = await queriesUtil.findRoomsWithSocket(socket.id)

            if (rooms.length > 0){
                let room = rooms[0];
                let sockets = rooms[0].sockets; 			
                sockets = functionsUtil.removeFromArray(sockets, socket.id)
                room.sockets = sockets;
                room.save();
				socket.leave(room.room_name)
                console.log("user disconnected: "+socket.id);
            }

		})	

    })
}

exports.test = async(network, data)  => {

	console.log(data)
    let return_data = {
        functionGroup: "connFunctions",
        function: "test",
        message: data.message
    }
    network.io.of(network.socket.id).emit("message_client", return_data)
}


// ##################################################################################
// ##################################################################################
// ##################################################################################
//    #    ######  #     # ### #     # 
//   # #   #     # ##   ##  #  ##    # 
//  #   #  #     # # # # #  #  # #   # 
// #     # #     # #  #  #  #  #  #  # 
// ####### #     # #     #  #  #   # # 
// #     # #     # #     #  #  #    ## 
// #     # ######  #     # ### #     # 
// ##################################################################################
// ##################################################################################
// ##################################################################################

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

exports.createRoom = async(network, data)  => {

    //SEE IF ROOM EXISTS ALREADY
    let rooms;
    try{
        rooms = await queriesUtil.findRooms(data.room_name)
    }
    catch(err){
        console.log("Error trying to find rooms")
        console.log(err)
    }

    try{
        //IF ROOM DOES EXIST
        if (rooms && rooms.length > 0){


            let return_data = {
				functionGroup: "connFunctions",
				function: "printMessage",
				parameters: {
					user_name: "SERVER",
					message: ""
				}  
            }

            //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
            let room = rooms[0];
            if(room.users.indexOf(data.user_id) > -1){
                if(room.sockets.indexOf(network.socket.id) > -1){
                    return_data.parameters.message = "You're already in this room";							
                }else{
                    return_data.parameters.message = "Room already exists, please use join button to rejoin it";								
                }
            }
            else{
                return_data.parameters.message = 'Creation failed, please choose another room name and try again';							
            }

            // network.io.to(network.socket.id).emit("message_client", return_data)        
			network.io.to(network.socket.id).emit("message_client", return_data)

        }
        else{
            let room = await queriesUtil.createRoom(data, network.socket.id)
			
			let player_number = room.users.indexOf(data.user_id)
			
			//SEARCH FOR ROOM TO GET LINKED USER DATA
			room = await queriesUtil.findRoom(room._id)	
			
			let return_data; 			
			
			
			//SEND THE CORE GAME DATA OT THE PLAYER
			return_data = {
                functionGroup: "connFunctions"
                ,function: "setRoomInfo"
                ,message: "Room Info"
				,users: room.users
				,forces: room.forces
				// ,user_name: data.user_name
				,room_name: data.room_name
				,room_id: room._id
				,max_players: room.config.max_players
				,player_number: player_number
				,max_sides: room.config.max_sides
				// ,player_side: side
				,scene: "ArmySelectMenuScene"
			}
			network.socket.join(data.room_name)
			//send room info back to socket
			network.io.to(network.socket.id).emit('message_client', return_data);
         
        }
    }
    catch(err){
        console.log("Error trying to create room")
        console.log(err)
    }
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

exports.joinRoom = async(network, data)  => {

    //SEE IF ROOM EXISTS ALREADY
    let rooms;
    try{
        rooms = await queriesUtil.findRooms(data.room_name, false)
    }
    catch(err){
        console.log("Error trying to find rooms")
        console.log(err)
    }

    try{

        let return_data = {
			functionGroup: "connFunctions",
			function: "printMessage",
			parameters: {
				user_name: "SERVER",
				message: ""
			}    			
        }

		// let transition = false;
		let saved_room;
		
        //IF ROOM DOES EXIST
        if (rooms && rooms.length > 0){

            //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
            let room = rooms[0];

            if(room.password !== data.password)
            {
                return_data.parameters.message = "Wrong password! Please try again";
            }
            else{
                //IF USER IS A MEMBER OF THE ROOM
                if(room.users.indexOf(data.user_id) > -1){
                    //IF THE USER IS STILL IN THE ROOM
                    if(room.sockets.indexOf(network.socket.id) > -1){
                        return_data.parameters.message = "You're already in this room";
                    }else{
                        return_data.parameters.message = "Rejoined room.";	
                                        
                        network.socket.join(data.room_name) 
                        room.sockets.push(network.socket.id);
                        saved_room = await room.save()
						
						// transition = true;
                    }
                }
                else{
                    //ADD USER TO ROOM THEN RETURN DATA
					room.users.push(data.user_id);

					let player_id = room.users.indexOf(data.user_id);

					//ADD USER ID TO THE FORCES LIST
					room.forces[player_id].user_id = data.user_id;
                    room.sockets.push(network.socket.id);
                    saved_room = await room.save()	
					
                    return_data.parameters.message = "Room Joined. You're player number is : "+saved_room.users.indexOf(data.user_id)   
                    
					network.io.to(network.socket.id).emit("message_client", return_data) 

                    return_data.parameters.message = "Player: "+data.user_name+" joined room."
					
					// transition = true;
                }
            }   
    
        }
        else{
			return_data.parameters.message = "Join failed. Room Doesn't exist"
			
        }

		//MESSAGE PLAYER WITH JOIN RESULTS
		network.io.to(network.socket.id).emit("message_client", return_data) 

		if(saved_room){
			
			let has_saved_data = false;
			let next_scene = "ArmySelectMenuScene"
			if(saved_room.units.length > 0){
				has_saved_data = true
				next_scene = "GameScene"
			}

			let player_number = saved_room.users.indexOf(data.user_id)			
			//SEARCH FOR ROOM TO GET LINKED USER DATA
			saved_room = await queriesUtil.findRoom(saved_room._id)					
			
			
			//SEND THE CORE GAME DATA OT THE PLAYER
			return_data = {
                functionGroup: "connFunctions"
                ,function: "setRoomInfo"
                ,message: "Room Info"
				,users: saved_room.users
				,forces: saved_room.forces
				,config: saved_room.config
				,units: saved_room.units
				// ,user_name: data.user_name
				,room_name: data.room_name
				,room_id: saved_room._id
				,max_players: saved_room.config.max_players
				,player_number: player_number
				,max_sides: saved_room.config.max_sides
				// ,player_side: side
				,has_saved_data: has_saved_data
				// ,room: saved_room
				,scene: next_scene
			}
			network.socket.join(data.room_name)
			//send room info back to socket
			network.io.to(network.socket.id).emit('message_client', return_data);
			
			saved_room.sockets.forEach((socket)=> {
				if(socket !== network.socket.id){
					return_data.function = "updateRoomInfo";
					return_data.message = "Update Room Info";
					network.io.to(socket).emit('message_client', return_data);
				}	
			})
		}
		
		
    }
    catch(err){
        console.log("Error trying to join room")
        console.log(err)
    }
}



// ##################################################################################
// ##################################################################################
// ##################################################################################
//  #####  ####### ####### #     # ######  
// #     # #          #    #     # #     # 
// #       #          #    #     # #     # 
//  #####  #####      #    #     # ######  
//       # #          #    #     # #       
// #     # #          #    #     # #       
//  #####  #######    #     #####  #   
// ##################################################################################
// ##################################################################################
// ##################################################################################

//USED WHEN WE JUST NEED TO PASS CERTAIN VALUES DIRECTLY BACK TO ALL USERS TO TRIGGER A FUNCTION WITH OPTIONAL PARAEMTERS
exports.messageAll = (network, data) => {

	let return_data = {
		functionGroup: data.returnFunctionGroup,
		function: data.returnFunction,
		parameters: data.returnParameters,
		message: data.message,
	}	
	// if(data.returnFunction === 'woundUnit'){
	// 	console.log(data.room_name)	
	// 	console.log(return_data)
	// }
	network.io.in(data.room_name).emit("message_client", return_data)     	
}


exports.selectArmy = (network, data) => {

	let return_data = {
		functionGroup: "connFunctions",
		function: "test",
		message: "Army Selected"
	}	
	
	network.io.in(data.room_name).emit("message_client", return_data)     	
}

exports.sceneTransition = (network, data) => {

	let return_data = {
		functionGroup: "connFunctions",
		function: "sceneTransition",
		scene: data.scene,
		message: data.message
	}	
	
	network.io.in(data.room_name).emit("message_client", return_data)     	
}



// ##################################################################################
// ##################################################################################
// ##################################################################################
// #     # ######  ######     #    ####### ####### 
// #     # #     # #     #   # #      #    #       
// #     # #     # #     #  #   #     #    #       
// #     # ######  #     # #     #    #    #####   
// #     # #       #     # #######    #    #       
// #     # #       #     # #     #    #    #       
//  #####  #       ######  #     #    #    ####### 
// ##################################################################################
// ##################################################################################
// ##################################################################################

exports.updateRoom = async(network, data) => {
	

    let rooms;
    try{
        rooms = await queriesUtil.findRooms(data.room_name)
    }
    catch(err){
        console.log("Error trying to find rooms")
        console.log(err)
    }
	
	if(rooms){
		let room = rooms[0];
		
		if(room){
			try{
				let return_data;
				
				switch(data.type){
					case "ready force":
						room.forces[data.player_number].ready = true;
						room.markModified('forces');	
						let updated_room = await queriesUtil.saveRoom(room)

						// let updated_room = await queriesUtil.findRoom(room.id)
						let readied = 0;
						let total_side = 0;
						updated_room.forces.forEach((force) => {
							if(force.side === data.player_side){
								total_side++;
								if(force.ready === true){
									readied++;
								}
							}
						})
						if(readied === total_side){
							//END THE TURN

							//RESET ALL ROOMS BACK TO "UNREADY"
							updated_room.forces.forEach((force) => {
								force.ready = false;
							})
							updated_room.markModified('forces');	
							updated_room = await queriesUtil.saveRoom(updated_room)							

							return_data = {
								functionGroup: "GameUIScene",
								function: "advanceSide",
								message: "next side"
							}								
							network.io.in(data.room_name).emit("message_client", return_data)							
						}

					break;
					case 'save room':
						room = await queriesUtil.updateRoom(room, data)
												
						return_data = {
							functionGroup: "connFunctions",
							function: "test",
							message: "room updated"
						}	

						network.io.in(data.room_name).emit("message_client", return_data)
						
						break;
					case 'save config':
						room = await queriesUtil.updateRoomConfig(room, data)
						
						return_data = {
							functionGroup: "connFunctions",
							function: "updateRoomInfo",
							message: "selection updated",
							parameters: {
								player_number: data.player_number,
								subtype: data.subtype,
								value: data.value
							}
						}	

						network.io.in(data.room_name).emit("message_client", return_data)						
						break;	
				}
				
			}
			catch(err){
				console.log("Error trying to update room")
				console.log(err)			
			}			
		}
	}
	else{
		console.log("room not found")
	}
	
}




availableFunctions = {
    socketFunctions: exports
}



exports.checkSockets= (io) => {

    exports.checkMessages(io,'/');
}