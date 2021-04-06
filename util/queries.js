const Room = require("../models/room");
// const deckController = require('../controllers/deck');
const boardController = require('../controllers/board');

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
		tableWidth: 7 //7
		,tableHeight: 5 //5
	}	
	
    let boardmatrix = boardController.setupBoardMatrix(config);	
	
    let max_players = 1

    // let armies = []
    // for (let i = 0; i < max_players; i++) {
    //     let curent_army = {
    //         id: i
    //     }
    //     armies.push(curent_army)
    // }

    return Room.create ({
        room_name: data.room_name
        ,password: data.password
        ,author: author
        ,users: users
        ,sockets: sockets
        // ,armies: armies
		
		,max_players: max_players
		,config: config
        // ,decks: decks
        ,matrix: boardmatrix
    })
}



// exports.setSelectedCard = (data) => {
//     return new Promise(function(resolve,reject)
//     {
// 		let saved = false;

//         exports.findRoom(data.roomID)
//         .then((room) => {
    
//             if (room){
// 				room.selected_card = data.cards_array_id
				
	
// 				let card = room.cards[data.cards_array_id] 				
				
// 				card.x = data.card_x
// 				card.y = data.card_y				
				
// 				//SET THE ARD SNAPPING TO A GRID POSITION
// 				card.x_table_pos = Math.floor(card.x / room.config.cardSize);
// 				card.y_table_pos = Math.floor(card.y / room.config.cardSize);				
// 				card.x = card.x_table_pos * room.config.cardSize + (room.config.cardSize / 2)
// 				card.y = card.y_table_pos * room.config.cardSize + (room.config.cardSize / 2)				
				

// 				room.cards[data.cards_array_id] = card
				
// 				room.markModified('selected_card');
// 				room.markModified('cards');
// 				room.save((err, room)=>{
// 					resolve(room)
// 				})	
//             }
// 			else{
// 				resolve(room)
// 			}
//         })
//     })	
// }