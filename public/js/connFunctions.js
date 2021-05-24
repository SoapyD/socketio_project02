
// const address = 'https://soaps-card-game.azurewebsites.net';
// const address = 'http://localhost:3000/admin';
// const address = 'https://soapydevtest.azurewebsites.net';

// const address = 'https://node-v12-ubyor.run-eu-central1.goorm.io';
// const address = 'http://localhost:3000';
// const socket = io(address)

const socket = io(socket_address)



const connFunctions = [];
let availableFunctions = {}


connFunctions.messageServer = (data) => {	
	socket.emit('message_server', data)
}


connFunctions.checkMessages = (socket) => {

    $(document).on('click', '#create', (event) => {         

        event.preventDefault()     

        const data = {
            functionGroup: "socketFunctions",  
            function: "createRoom",
            
            user_id: document.querySelector('#userID').value,     
            user_name: document.querySelector('#userName').value,
            room_name: document.querySelector('#roomName').value,
            password: document.querySelector('#password').value,
			players: document.querySelector('#players').value,

        }
        // socket.emit('message_server', data)
		connFunctions.messageServer(data)
    })

    $(document).on('click', '#join', (event) => {         

        event.preventDefault()     

        const data = {
            functionGroup: "socketFunctions",  
            function: "joinRoom",
            
            user_id: document.querySelector('#userID').value,     
            user_name: document.querySelector('#userName').value,
            room_name: document.querySelector('#roomName').value,
            password: document.querySelector('#password').value,

        }
        // socket.emit('message_server', data)
		connFunctions.messageServer(data)
    })


    socket.on('message_client', (data) => {

		if(data.message){
			console.log(data.message)			
		}		
		
		if(data.functionGroup && data.function){
        	availableFunctions[data.functionGroup][data.function](data);  			
		}

    })

}        

connFunctions.test = (data) => {
  console.log(data)
}


connFunctions.setRoomInfo = (data) => {
	
	gameFunctions.params.room_name = data.room_name
	gameFunctions.params.room_id = data.room_id
	gameFunctions.params.player_number = data.player_number
	gameFunctions.params.max_players = data.max_players
	
	if(data.has_saved_data === true){
		
		gameFunctions.current_player = data.room.config.current_player
		gameFunctions.mode = data.room.config.mode	
		
		
		gameFunctions.units_preload = data.room.units;
		
	}
}

connFunctions.saveGame = () => {
	
	let data = {
		functionGroup: "socketFunctions",  
		function: "updateRoom", //saveGame
		message: "save game",
		room_name: gameFunctions.params.room_name,
		current_player: gameFunctions.current_player,
		mode: gameFunctions.mode,
		units: gameFunctions.units
	}
	
	connFunctions.messageServer(data)	
}




connFunctions.sceneTransition = (data) => {
    // console.log(data.message)

	
	if(gameFunctions.current_uiscene){
		connFunctions.uiSceneTransition();
	}	

	//IF THERE'S A CURRENT FORM LOADED, TWEEN IT AWAY BEFORE TRANSITIONING
	if (gameFunctions.current_form){
	
		gameFunctions.current_scene.tweens.add({
			targets: gameFunctions.current_form,
			alpha: 0,
			duration: 500,
			ease: 'Power3',
			onComplete: function ()
			{
				gameFunctions.current_form.setVisible(false);
				gameFunctions.current_scene.scene.start(data.scene);
				
				gameFunctions.current_form = null;
				gameFunctions.current_scene = null;				
			}
			});    				
		
	}
	else{
		//ELSE JUST TRANSITION THE SCENE
    	gameFunctions.current_scene.scene.start(data.scene)		
	}
  }


connFunctions.uiSceneTransition = (data) => {
	// console.log(data.message)
	gameFunctions.current_uiscene.scene.stop()	
}

connFunctions.runUnitFunction = function(data) {
	if(data.parameters.path){
		gameFunctions.units[data.parameters.id].path = data.parameters.path;
	}
	if(data.parameters.targets){
		gameFunctions.units[data.parameters.id].targets = data.parameters.targets;
	}	
	if(data.parameters.fight_targets){
		gameFunctions.units[data.parameters.id].fight_targets = data.parameters.fight_targets;
	}	
		
	
	if(data.parameters.function_parameter){
		gameFunctions.units[data.parameters.id][data.parameters.function](data.parameters.function_parameter)	
	}
	else{
		gameFunctions.units[data.parameters.id][data.parameters.function]()		
	}

}




availableFunctions = {
    connFunctions: connFunctions,
	GameScene: GameScene
}

connFunctions.checkMessages(socket)

