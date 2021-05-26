// const deckController = require('../controllers/deck');

const functionsUtil = require('../util/functions');
const queriesUtil = require('../util/queries');

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
    network.io.of(network.namespace).emit("message_client", return_data)
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
                // functionGroup: "connFunctions",
                // function: "test",
                // message: ""
            }

            //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
            let room = rooms[0];
            if(room.users.indexOf(data.user_id) > -1){
                if(room.sockets.indexOf(network.socket.id) > -1){
                    return_data.message = "You're already in this room";							
                }else{
                    return_data.message = "Room already exists, please use join button to rejoin it";								
                }
            }
            else{
                return_data.message = 'Creation failed, please choose another room name and try again';							
            }

            network.io.to(network.socket.id).emit("message_client", return_data)        
    
        }
        else{
            let room = await queriesUtil.createRoom(data, network.socket.id)
			
			let player_number = room.users.indexOf(data.user_id)
			
			//SEARCH FOR ROOM TO GET LINKED USER DATA
			room = await queriesUtil.findRoom(room._id)
			
			let side = -1;
			if(player_number === 0 || player_number === 1){
				side = 0;
			}
			if(player_number === 2 || player_number === 3){
				side = 1;
			}			
			
			let return_data;
			
			//TRANSITION TO THE NEXT GAME SCREEN
            // return_data = {
            //     functionGroup: "connFunctions",
            //     function: "sceneTransition",
            //     message: "Room Created",
            //     scene: "ArmySelectMenuScene"
            // }
            //send room info back to socket
            // network.io.to(network.socket.id).emit("message_client", return_data)  			
			
			
			//SEND THE CORE GAME DATA OT THE PLAYER
			return_data = {
                functionGroup: "connFunctions"
                ,function: "setRoomInfo"
                ,message: "Room Info"
				,users: room.users				
				// ,user_name: data.user_name
				,room_name: data.room_name
				,room_id: room._id
				,max_players: room.config.max_players
				,player_number: player_number
				,max_sides: room.config.max_sides
				,player_side: side
				,scene: "ArmySelectMenuScene"
			}
			network.socket.join(data.roomName)
			//send room info back to socket
			network.io.to(network.socket.id).emit('message_client', return_data);
         
        }
    }
    catch(err){
        console.log("Error trying to create room")
        console.log(err)
    }
}


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
            // functionGroup: "connFunctions",
            // function: "test",
            // message: ""
        }

		// let transition = false;
		let saved_room;
		
        //IF ROOM DOES EXIST
        if (rooms && rooms.length > 0){

            //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
            let room = rooms[0];

            if(room.password !== data.password)
            {
                return_data.message = "Wrong password! Please try again";
            }
            else{
                //IF USER IS A MEMBER OF THE ROOM
                if(room.users.indexOf(data.user_id) > -1){
                    //IF THE USER IS STILL IN THE ROOM
                    if(room.sockets.indexOf(network.socket.id) > -1){
                        return_data.message = "You're already in this room";
                    }else{
                        return_data.message = "Rejoined room.";	
                                        
                        network.socket.join(data.room_name) 
                        room.sockets.push(network.socket.id);
                        saved_room = await room.save()
						
						// transition = true;
                    }
                }
                else{
                    //ADD USER TO ROOM THEN RETURN DATA
                    room.users.push(data.user_id);
                    room.sockets.push(network.socket.id);
                    saved_room = await room.save()	
					
                    return_data.message = "Room Joined. You're player number is : "+saved_room.users.indexOf(data.user_id)   
                    
                    network.io.to(network.socket.id).emit("message_client", return_data) 

                    return_data.message = "Player: "+data.user_name+" joined room."
					
					// transition = true;
                }
            }   
    
        }
        else{
            return_data.message = "Join failed. Room Doesn't exist"
        }

		//MESSAGE PLAYER WITH JOIN RESULTS
        network.io.of(network.namespace).emit("message_client", return_data)     

		if(saved_room){
			
			let has_saved_data = false;
			let next_scene = "ArmySelectMenuScene"
			if(saved_room.units.length > 0){
				has_saved_data = true
				next_scene = "GameScene"
			}

			console.log(saved_room)
			console.log(data)
			let player_number = saved_room.users.indexOf(data.user_id)			
			//SEARCH FOR ROOM TO GET LINKED USER DATA
			saved_room = await queriesUtil.findRoom(saved_room._id)			

			let side = -1;
			if(player_number === 0 || player_number === 1){
				side = 0;
			}
			if(player_number === 2 || player_number === 3){
				side = 1;
			}				
			
			
			//TRANSITION TO THE NEXT GAME SCREEN
			// return_data = {
			// functionGroup: "connFunctions",
			// function: "sceneTransition",
			// message: "Room Joined",
			// scene: next_scene
			// }
			// //send room info back to socket
			// network.io.to(network.socket.id).emit("message_client", return_data)			
			
			
			//SEND THE CORE GAME DATA OT THE PLAYER
			return_data = {
                functionGroup: "connFunctions"
                ,function: "setRoomInfo"
                ,message: "Room Info"
				,users: saved_room.users
				// ,user_name: data.user_name
				,room_name: data.room_name
				,room_id: saved_room._id
				,max_players: saved_room.config.max_players
				,player_number: player_number
				,max_sides: saved_room.config.max_sides
				,player_side: side
				,has_saved_data: has_saved_data
				,room: saved_room
				,scene: next_scene
			}
			network.socket.join(data.roomName)
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
		
		//TRANSITION TO THE NEXT GAME SCREEN
		// if(transition === true){
		// let return_data = {
		// functionGroup: "connFunctions",
		// function: "sceneTransition",
		// message: "Room Joined",
		// scene: "ArmySelectMenuScene"
		// }

		// //send room info back to socket
		// network.io.to(network.socket.id).emit("message_client", return_data)  			
		// }
		
		
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
	
	network.io.of(network.namespace).emit("message_client", return_data)     	
}


exports.selectArmy = (network, data) => {

	let return_data = {
		functionGroup: "connFunctions",
		function: "test",
		message: "Army Selected"
	}	
	
	network.io.of(network.namespace).emit("message_client", return_data)     	
}

exports.sceneTransition = (network, data) => {

	let return_data = {
		functionGroup: "connFunctions",
		function: "sceneTransition",
		scene: data.scene,
		message: data.message
	}	
	
	network.io.of(network.namespace).emit("message_client", return_data)     	
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
				room = await queriesUtil.updateRoom(room, data)

				let return_data = {
					functionGroup: "connFunctions",
					function: "test",
					message: "room updated"
				}	

				network.io.of(network.namespace).emit("message_client", return_data)
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

/*


//    #    ######  #     # ### #     # 
//   # #   #     # ##   ##  #  ##    # 
//  #   #  #     # # # # #  #  # #   # 
// #     # #     # #  #  #  #  #  #  # 
// ####### #     # #     #  #  #   # # 
// #     # #     # #     #  #  #    ## 
// #     # ######  #     # ### #     # 

exports.checkMessages = (io,namespace) => {
    io.of(namespace).on('connection', (socket, req)=> {

		//JOIN THE PLAYER TO A ROOM
		socket.on('createRoom', (data) => {

			// CHECK TO SEE IF ROOM ALREADY EXISTS
			queriesUtil.findRooms(data.roomName)
			.then((rooms) => {
				// console.log(rooms.length);

				if (rooms.length > 0){
					// IF ROOM NAME EXISTS, FAIL THE CREATION PROCESS
					let room = rooms[0];
					if(room.users.indexOf(data.userID) > -1){
						if(room.sockets.indexOf(socket.id) > -1){
							io.to(socket.id).emit('MessageFromServer', "You're already in this room");							
						}else{
							io.to(socket.id).emit('MessageFromServer', "Room already exists, please use join button to rejoin it");								
						}
					}
					else{
						io.to(socket.id).emit('MessageFromServer', 'Creation failed, please choose another name');							
					}
				}else{
					// ELSE, ALLOW THE ROOM TO BE CREATED
					io.to(socket.id).emit('MessageFromServer', 'Creating room.');

					queriesUtil.createRoom(data, socket.id)
					.then((room) => {
						
						let return_data = {
							userName: data.userName
							,roomName: data.roomName
							,roomID: room._id
                            ,maxPlayers: room.max_players
							,playerNumber: room.users.indexOf(data.userID)
						}
						socket.join(data.roomName)
						//send room info back to socket
						io.to(socket.id).emit('roomInfo', return_data);

						if (room.users.length >= room.max_players){
							io.of(namespace).emit("advanceGameState", data)
						}						
						
					})

				}				
			})
		})

		//JOIN THE PLAYER TO A ROOM
		socket.on('joinRoom', (data) => {

			// CHECK TO SEE IF ROOM ALREADY EXISTS
			queriesUtil.findRooms(data.roomName)
			.then((rooms) => {
				// console.log(rooms.length);

				if (rooms.length > 0){
					let room = rooms[0];

                    if(room.password !== data.password)
                    {
                        io.to(socket.id).emit('MessageFromServer', "Wrong password! Please try again");
                    }
                    else{

                        if(room.users.indexOf(data.userID) > -1){
                            if(room.sockets.indexOf(socket.id) > -1){
                                io.to(socket.id).emit('MessageFromServer', "You're already in this room");							
                            }else{
                                io.to(socket.id).emit('MessageFromServer', "Rejoining room");														
                                room.sockets.push(socket.id);
    
                                room.save(function(err, room) {
                                    let return_data = {
                                        userName: data.userName
                                        ,roomName: data.roomName
                                        ,roomID: room._id
                                        ,playerNumber: room.users.indexOf(data.userID)
                                        ,characterID: room.characters.indexOf(data.userID)
                                        ,room: room
                                        ,type: 'rejoining'
                                    }
                                    //send room info back to socket
                                    io.to(socket.id).emit('roomInfo', return_data);				
                                })
                                socket.join(data.roomName)							
                            }
                        }
                        else{					
                            //ADD USER TO ROOM THEN RETURN DATA
                            room.users.push(data.userID);
                            room.sockets.push(socket.id);
    
                            room.save(function(err, room) {
                                let return_data = {
                                    userName: data.userName
                                    ,roomName: data.roomName
                                    ,roomID: room._id
                                    ,playerNumber: room.users.indexOf(data.userID)
                                    ,maxPlayers: room.max_players
                                }
                                //send room info back to socket
                                io.to(socket.id).emit('roomInfo', return_data);				
                            })
                            socket.join(data.roomName)
    
                            if (room.users.length >= room.max_players){
                                io.of(namespace).emit("advanceGameState", data)
                            }                        
                        }

                    }
				
				}else{
					// ELSE, ALLOW THE ROOM TO BE CREATED
					io.to(socket.id).emit('MessageFromServer', "Join failed. Room Doesn't exist");

				}
			})
		})    

		socket.on('MessageToServer', (data) => {
			io.in(data.roomName).emit("MessageFromServer",data.text)
		})	

		socket.on('disconnect', () => {

			queriesUtil.findRoomsWithSocket(socket.id)
			.then((rooms) => {
				if (rooms.length > 0){
					let room = rooms[0];
					let sockets = rooms[0].sockets; 			
					sockets = functionsUtil.removeFromArray(sockets, socket.id)
					room.sockets = sockets;
					room.save();
					console.log("user disconnected: "+socket.id);
				}
			});
		})		

// ######  ######  #######        #####     #    #     # #######       #     # ####### #     # #     #  #####  
// #     # #     # #             #     #   # #   ##   ## #             ##   ## #       ##    # #     # #     # 
// #     # #     # #             #        #   #  # # # # #             # # # # #       # #   # #     # #       
// ######  ######  #####   ##### #  #### #     # #  #  # #####   ##### #  #  # #####   #  #  # #     #  #####  
// #       #   #   #             #     # ####### #     # #             #     # #       #   # # #     #       # 
// #       #    #  #             #     # #     # #     # #             #     # #       #    ## #     # #     # 
// #       #     # #######        #####  #     # #     # #######       #     # ####### #     #  #####   #####  

socket.on('requestAdvanceGameState', (data) => {
    io.of(namespace).emit("advanceGameState", data)
})		

socket.on('requestChangeCharacter', (data) => {

    if (data.character !== ""){
        //SAVE CHARACTER
        queriesUtil.findRoom(data.roomID)
        .then((room) => {

            room.characters[data.playerId].character_id = data.character

            room.save(function(err, room) {
                io.of(namespace).emit("ChangeCharacter", data)
            })
        })
    }
})	

socket.on('requestHideCharacterMenu', () => {
    io.of(namespace).emit("HideCharacterMenu")
})		


//  #####   #####  ######  ####### #       #       ######     #    ######  
// #     # #     # #     # #     # #       #       #     #   # #   #     # 
// #       #       #     # #     # #       #       #     #  #   #  #     # 
//  #####  #       ######  #     # #       #       ######  #     # ######  
//       # #       #   #   #     # #       #       #     # ####### #   #   
// #     # #     # #    #  #     # #       #       #     # #     # #    #  
//  #####   #####  #     # ####### ####### ####### ######  #     # #     # 		


		socket.on('requestMoveScrollbar', (data) => {
			io.of(namespace).emit("MoveScrollbar", data)
		})										


//  #####     #    ######  ######   #####  
// #     #   # #   #     # #     # #     # 
// #        #   #  #     # #     # #       
// #       #     # ######  #     #  #####  
// #       ####### #   #   #     #       # 
// #     # #     # #    #  #     # #     # 
//  #####  #     # #     # ######   ##### 		


		socket.on('requestCreateCard', (data) => {

			if (data.roomID !== '')
			{
                // let card_number = deckController.drawCard(data.roomID, data.deck_id);
                deckController.drawCard(data) //data.roomID, data.deck_id
                .then((card_id) =>{
                    // let card_number = 0
					if (card_id >= 0){
						data.card_id = card_id;
						io.of(namespace).emit("CreateCard", data)							
					}
                });
			
			}

		})	

		socket.on('requestMoveCard', (data) => {
			io.of(namespace).emit("MoveCard", data)
		})	

		socket.on('requestRotateCard', (data) => {

			queriesUtil.findRoom(data.roomID)
			.then((room) => {
				
				let card = room.cards[data.cards_array_id];
				
				if (card.angle === data.angle){

					card.angle += 90
					if (card.angle >= 180){
						card.angle = -180
					}

					switch(card.angle) {
						case 0:
							card.orientation = 0; //0
							break;
						case 90:
							card.orientation = 1; //90
							break;	
						case -180:
							card.orientation = 2; //180
							break;
						case -90:
							card.orientation = 3; //270
							break;				
						default:
					}

					data.angle = card.angle;
					data.orientation = card.orientation;

					room.cards[data.cards_array_id] = card;
					room.markModified('cards');
					room.save((err, room)=>{
						io.of(namespace).emit("RotateCard",data)
					})						
					
				}

			})
		})			

		socket.on('requestSizeCard', (data) => {
			io.of(namespace).emit("SizeCard",data)
		})					
		
		socket.on('requestGridSnapCard', (data) => {
			//ADD IN SET SELECTED CARD FUNCTION HERE
			queriesUtil.setSelectedCard(data)
			.then((room)=> {
				let old_data = data
				let card = room.cards[old_data.cards_array_id];
				
				data = {
					cards_array_id: old_data.cards_array_id
					,card_x: card.x
					,card_y: card.y	
					,card_x_table_pos: card.x_table_pos
					,card_y_table_pos: card.y_table_pos						
				}
				io.of(namespace).emit("GridSnapCard",data)				
			})

		})							
		
		socket.on('requestPalmCard', (data) => {
			io.of(namespace).emit("PalmCard",data)
		})		
		
		socket.on('requestLockCard', (data) => {
			
// 			CHECK IF CARD IS TOUCHING LAST PLACED CARD
			deckController.checkTouching(data)
			.then((check_touching_data) => {
				// console.log(check_touching_data)
				
				
				if (check_touching_data.room){
					// IF LAST CARD DOESN'T EXIST (-1) OR CARD IS TOUCHING LAST CARD (1), CHECK BOARD MATRIX 					
					if (check_touching_data.touching !== 0)
					{
						let pass_check = deckController.checkBoardMatrix(check_touching_data)
                        
                        console.log("locking card check: "+pass_check)
						//IF NOT CLASHING BOARD MATRIX, UPDATE MATRIX AND LOCK CARD
						if (pass_check === true){
							
							deckController.updateBoardMatrix(check_touching_data)
							.then((complete) => {
								// console.log("locking card check: "+complete)
								if (complete === true){
									io.of(namespace).emit("LockCard",data)
								}
								
							})
							
						}
					}
				}	
				
			})
			

		})									
		
			
		socket.on('requestChangePlayer', () => {
			io.of(namespace).emit("ChangePlayer")
		})				

	})
}

*/
		
		



exports.checkSockets= (io) => {

    exports.checkMessages(io,'/');
}