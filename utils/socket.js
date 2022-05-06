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
				// if(i==0){	
				// }
                availableFunctions[data.functionGroup][data.function](network,data);
            }
			catch(e){
				let options = {
					"class": "socket",
					"function": "message_server",
					"e": e
				}
				errorHandler.log(options)
			}			
        })


        //THIS HANDLES ANY DISCONNECTIONS CLIENTS. IT REMOVES THEIR SOCKET REFERENCES FROM ANY ROOMS IN THE DB
        //ALLOWS ME TO TELL IF A CLIENT IS ALREADY IN THE ROOM OR WAS ONCE IN THE ROOM AND CAN REJOIN
		socket.on('disconnect', async() => {

			try{
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
			}
			catch(e){
				let options = {
					"class": "socket",
					"function": "disconnect",
					"e": e
				}
				errorHandler.log(options)
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

exports.logClientError = async(network, data)  => {
	// console.log(data)
	errorHandler.log(data.options)
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
    // catch(err){
    //     console.log("Error trying to find rooms")
    //     console.log(err)
    // }
	catch(e){
		let options = {
			"class": "socket",
			"function": "createRoom findRoom",
			"e": e
		}
		errorHandler.log(options)
	}			

    try{
        //IF ROOM DOES EXIST
        if (rooms && rooms.length > 0){


            let return_data = {
				functionGroup: "connFunctions",
				function: "printError",
				parameters: {
					user_name: "SERVER",
					message: ""
				}  
            }

            //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
            let room = rooms[0];
            if(room.users.indexOf(data.user) > -1){
                if(room.sockets.indexOf(network.socket.id) > -1){
                    return_data.parameters.message = "You're already in this room";							
                }else{
                    return_data.parameters.message = "Room already exists, please use join button to rejoin it";								
                }
            }
            else{
                return_data.parameters.message = 'Creation failed, please choose another room name and try again';							
            }
        
			network.io.to(network.socket.id).emit("message_client", return_data)

        }
        else{
            let room = await queriesUtil.createRoom(data, network.socket.id)
			
			let player_number = room.users.indexOf(data.user)
			
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
    // catch(err){
    //     console.log("Error trying to create room")
    //     console.log(err)
	// }
	catch(e){
		let options = {
			"class": "socket",
			"function": "createRoom",
			"e": e
		}
		errorHandler.log(options)
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
    // catch(err){
    //     console.log("Error trying to find rooms")
    //     console.log(err)
	// }
	catch(e){
		let options = {
			"class": "socket",
			"function": "joinRoom findRoom",
			"e": e
		}
		errorHandler.log(options)
	}				

    try{

        let return_data = {
			functionGroup: "connFunctions",
			function: "printError",
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
                if(room.users.indexOf(data.user) > -1){
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

					let returned_rooms = await queriesUtil.joinRoom(network, data, room)
					saved_room = returned_rooms[0];

                    return_data.parameters.message = "Room Joined. You're player number is : "+saved_room.users.indexOf(data.user)   
                    
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
			let armies;
			if(saved_room.units.length > 0){
				has_saved_data = true
				armies = await queriesUtil.getArmies({forces: saved_room.forces})
				next_scene = "GameScene"
			}

			let player_number;
			saved_room.users.forEach((user, i) => {
				if(user._id.toString() === data.user){
					player_number = i;
				}
			})			
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
				,room_name: data.room_name
				,room_id: saved_room._id
				,max_players: saved_room.config.max_players
				,player_number: player_number
				,max_sides: saved_room.config.max_sides
				// ,player_side: side
				,has_saved_data: has_saved_data
				// ,room: saved_room
				,scene: next_scene
				,armies: armies
			}
			network.socket.join(data.room_name)
			//send room info back to socket
			network.io.to(network.socket.id).emit('message_client', return_data);
			

			//SEND A USER AND FORCE DATA UPDATE TO ALL OTHER PLAYERS EXCEPT SENDER
			return_data = {
                functionGroup: "connFunctions"
                ,function: "updateRoomInfo"
                ,message: "Update Room Info"
				,users: saved_room.users
				,forces: saved_room.forces								
			}

			if(has_saved_data === false){
				network.socket.to(data.room_name).emit('message_client', return_data);
			}
			// network.io.to(network.socket.id).emit("message_client", return_data) 
		}
		
		
    }
    // catch(err){
    //     console.log("Error trying to join room")
    //     console.log(err)
	// }
	catch(e){
		let options = {
			"class": "socket",
			"function": "joinRoom",
			"e": e
		}
		errorHandler.log(options)
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

	try{
		let return_data = {
			functionGroup: data.returnFunctionGroup,
			function: data.returnFunction,
			parameters: data.returnParameters,
			message: data.message,
		}	
	
		network.io.in(data.room_name).emit("message_client", return_data)     	
	}
	catch(e){
		let options = {
			"class": "socket",
			"function": "messageAll",
			"e": e
		}
		errorHandler.log(options)
	}				
}

exports.startGame = async(network, data) => {

	try{
		//GET ROOM & ARMIES
		let room = await queriesUtil.findRoom(data.room_id)			
		let armies = await queriesUtil.getArmies({forces: room.forces})
	
		let return_data = {
			functionGroup: "connFunctions",
			function: "sceneTransition",
			scene: data.scene,
			armies: armies,
			message: data.message
		}	
		
		network.io.in(room.room_name).emit("message_client", return_data)	
	}
	catch(e){
		let options = {
			"class": "socket",
			"function": "startGame",
			"e": e
		}
		errorHandler.log(options)
	}					
}

exports.sceneTransition = (network, data) => {

	try{
		let return_data = {
			functionGroup: "connFunctions",
			function: "sceneTransition",
			scene: data.scene,
			message: data.message
		}	
		
		network.io.in(data.room_name).emit("message_client", return_data)     	
	}
	catch(e){
		let options = {
			"class": "socket",
			"function": "sceneTransition",
			"e": e
		}
		errorHandler.log(options)
	}						
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
    // catch(err){
    //     console.log("Error trying to find rooms")
    //     console.log(err)
	// }
	catch(e){
		let options = {
			"class": "socket",
			"function": "updateRoom findRoom",
			"e": e
		}
		errorHandler.log(options)
	}						
	
	if(rooms){
		let room = rooms[0];
		
		if(room){
			try{
				let return_data;

				return_data = {
					functionGroup: "connFunctions", //data.ui_scene
					function: "readyUp",
					message: "ready up",
					parameters: {
						player_number: data.player_number
						//runAdvanceMode
					}
				}					

				switch(data.type){

					case "ready force":
						room.forces[data.player_number].ready = true;
						if(data.options.actions){
							room.forces[data.player_number].actions = data.options.actions;
						}
						room.markModified('forces');	
						let updated_room = await queriesUtil.saveRoom(room)

						let readied = 0;
						let total_side = 0;
						let total_actions = 0;
						updated_room.forces.forEach((force) => {
							total_actions += force.actions;
							total_side++;
							if(force.ready === true){
								readied++;
							}
						})
						// console.log(data)
						if(readied === total_side){
							//END THE TURN
							return_data.parameters.options = data.options;						
							return_data.parameters.total_actions = total_actions;

							//RESET ALL ROOMS BACK TO "UNREADY"
							updated_room.forces.forEach((force) => {
								force.ready = false;
								force.actions = 0;
							})
							updated_room.markModified('forces');	
							updated_room = await queriesUtil.saveRoom(updated_room)

							// console.log("ready up sent | force0: ",updated_room.forces[0].ready,' | force1: ',updated_room.forces[1].ready)
							network.io.in(data.room_name).emit("message_client", return_data)
						}

					break;
					
					case "end turn":
						//RESET ALL ROOMS BACK TO "UNREADY"
						room.forces.forEach((force) => {
							force.ready = false;
						})
						room.markModified('forces');	
						room = await queriesUtil.saveRoom(room)							

						return_data = {
							functionGroup: "GameUIScene",
							function: "advanceSide",
							message: "next side"
						}								
						network.io.in(data.room_name).emit("message_client", return_data)

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
						if(data.value !== -1 && data.value !== '-1'){
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
						}
						break;	
				}
				
			}			
			catch(e){
				// let options = {
				// 	"class": "socket",
				// 	"function": "updateRoom "+data.type,
				// 	"e": e
				// }
				// errorHandler.log(options)

				exports.updateRoom(network, data)
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