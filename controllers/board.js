exports.setupBoardMatrix = (config) => {
	
    let boardMatrix = [];
    // let tableHeight = 5;
    // let tableWidth = 7;

    for (let y = 0; y < config.tableHeight ; y++) {
        let boardSegment = [];
        for (let x = 0; x < config.tableWidth; x++) {
            boardSegment.push({
                // deck_id: -1,
                // card_id: -1,
                // cards_array_id: -1,
                // orientation: -1
				value: 0
            });
        }
        boardMatrix.push(boardSegment);
    }	
    
    return boardMatrix;
}

exports.updateBoardMatrix = (data) => {

	return new Promise(function(resolve,reject)
	{		
		if (data.room){

			let board_part = data.room.matrix[data.card.y_table_pos][data.card.x_table_pos];
			// board_part.deck_id = data.card.deck_id;
			// board_part.card_id = data.card.card_id;
			// board_part.cards_array_id = data.cards_array_id;		
			// board_part.orientation = data.orientation;		

			data.room.matrix[data.card.y_table_pos][data.card.x_table_pos] = board_part;

			data.room.markModified('matrix');
			data.room.save((err, room)=>{
				resolve(true)
			})
		}
		else{
			resolve(false)
		}
	})
}