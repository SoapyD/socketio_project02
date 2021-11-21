
const socket = io(socket_address)



const connFunctions = [];
let availableFunctions = {}


connFunctions.messageServer = (data) => {	
	socket.emit('message_server', data)
}


connFunctions.checkMessages = (socket) => {

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

    $(document).on('click', '#create', (event) => {         

        event.preventDefault()     

        const data = {
            functionGroup: "socketFunctions",  
            function: "createRoom",
            
            user: document.querySelector('#userID').value,     
            user_name: document.querySelector('#userName').value,
            room_name: document.querySelector('#roomName').value,
            password: document.querySelector('#password').value,
			players: document.querySelector('#players').value,

        }
        // STOP PLAYERS FROM CREATING A ROOM WITH LESS THAN MINIMUM PLAYER NUMBER IS IT
		if(data.players > 0){
			connFunctions.messageServer(data)
		}

    })

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

    $(document).on('click', '#join', (event) => {         

        event.preventDefault()     

        const data = {
            functionGroup: "socketFunctions",  
            function: "joinRoom",
            
            user: document.querySelector('#userID').value,     
            user_name: document.querySelector('#userName').value,
            room_name: document.querySelector('#roomName').value,
            password: document.querySelector('#password').value,

        }
        // socket.emit('message_server', data)
		connFunctions.messageServer(data)
    })

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################	
	// ███    ███ ███████ ███████ ███████  █████   ██████  ███████       ██████   ██████   ██████  ███    ███ 
	// ████  ████ ██      ██      ██      ██   ██ ██       ██            ██   ██ ██    ██ ██    ██ ████  ████ 
	// ██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████   █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
	// ██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██            ██   ██ ██    ██ ██    ██ ██  ██  ██ 
	// ██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████       ██   ██  ██████   ██████  ██      ██ 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

	// CLICK ON THE "MESSAGE" BUTTON TO SEND A MESSAGE
    $(document).on('click', '#submit-message', (event) => {
		connFunctions.sendPrintMessage();
    })   

	//PRESS ENTER TO SEND A MESSAGE
    $(document).on('keypress', (event) => {
        if(event.which == 13) {
			connFunctions.sendPrintMessage();  
        }
    });


	connFunctions.sendPrintMessage = () => {
        const data = {
            functionGroup: "socketFunctions",  
            function: "messageAll",
			room_name: gameFunctions.params.room_name,
			
			returnFunctionGroup: "connFunctions",
			returnFunction: "printMessage",
			returnParameters: {
				message: document.querySelector('#fname').value,
				user_name: document.querySelector('#userName').value,
			},
		}

        //CLEAR TEXT
        document.querySelector('#fname').value = "";		

        connFunctions.messageServer(data)  
	}

	connFunctions.printMessage = (data) => {
		const messages = document.querySelector('#messages'); 
		messages.insertAdjacentHTML("beforeend", "<li>"+data.parameters.user_name+" - '"+data.parameters.message+"'</li>");	
	}

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	//  ██████  ███████ ███    ██ ███████ ██████  ██  ██████       ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  
	// ██       ██      ████   ██ ██      ██   ██ ██ ██            ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ 
	// ██   ███ █████   ██ ██  ██ █████   ██████  ██ ██      █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  
	// ██    ██ ██      ██  ██ ██ ██      ██   ██ ██ ██            ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██ 
	//  ██████  ███████ ██   ████ ███████ ██   ██ ██  ██████       ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ 
	// // ##################################################################################
	// ##################################################################################
	// ##################################################################################

	//THIS IS A GENERIC RESPONSE HANDER THAT RUNS WHATEVER FUNCTION, IN WHATEVER GROUP, IS PASSED TO IT
    socket.on('message_client', (data) => {

		if(data.message){
			switch(instance_type){
				case "DEV":
				case "DEV-ONLINE":			
					console.log(data.message)
					console.log(data)
					break;
			}
			// console.log(data)
		}
		// if(data.function === 'woundUnit'){
		// 	console.log("WOUNDING")
		// 	console.log(data)
		// }
		
		if(data.functionGroup && data.function){
        	availableFunctions[data.functionGroup][data.function](data);  			
		}

    })

}        



	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// ████████ ██████   █████  ███    ██ ███████ ██ ████████ ██  ██████  ███    ██ ███████ 
	//    ██    ██   ██ ██   ██ ████   ██ ██      ██    ██    ██ ██    ██ ████   ██ ██      
	//    ██    ██████  ███████ ██ ██  ██ ███████ ██    ██    ██ ██    ██ ██ ██  ██ ███████ 
	//    ██    ██   ██ ██   ██ ██  ██ ██      ██ ██    ██    ██ ██    ██ ██  ██ ██      ██ 
	//    ██    ██   ██ ██   ██ ██   ████ ███████ ██    ██    ██  ██████  ██   ████ ███████ 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

connFunctions.sceneTransition = (data) => {
    // console.log(data.message)

	//save any data that's been passed back from the server
	if(data.armies){
		data.armies.forEach((army, i) => {
			gameFunctions.params.forces[i].army = army
		})
	}

	
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

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// ███████ ███████ ████████     ██ ██    ██ ██████  ██████   █████  ████████ ███████     ██ ███████  █████  ██    ██ ███████       ██████   ██████   ██████  ███    ███ 
	// ██      ██         ██       ██  ██    ██ ██   ██ ██   ██ ██   ██    ██    ██         ██  ██      ██   ██ ██    ██ ██            ██   ██ ██    ██ ██    ██ ████  ████ 
	// ███████ █████      ██      ██   ██    ██ ██████  ██   ██ ███████    ██    █████     ██   ███████ ███████ ██    ██ █████   █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
	//      ██ ██         ██     ██    ██    ██ ██      ██   ██ ██   ██    ██    ██       ██         ██ ██   ██  ██  ██  ██            ██   ██ ██    ██ ██    ██ ██  ██  ██ 
	// ███████ ███████    ██    ██      ██████  ██      ██████  ██   ██    ██    ███████ ██     ███████ ██   ██   ████   ███████       ██   ██  ██████   ██████  ██      ██
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

connFunctions.setRoomInfo = (data) => {

	gameFunctions.params.room_name = data.room_name
	gameFunctions.params.room_id = data.room_id
	gameFunctions.params.users = data.users	
	gameFunctions.params.forces = data.forces
	// gameFunctions.params.user_name = data.user_name
	gameFunctions.params.player_number = data.player_number
	gameFunctions.params.max_players = data.max_players
	// gameFunctions.params.player_side = data.player_side
	gameFunctions.params.max_sides = data.max_sides	
	
	if(data.has_saved_data === true){
		
		gameFunctions.current_side = data.config.current_side
		// gameFunctions.current_player = data.room.config.current_player
		gameFunctions.mode = data.config.mode
		gameFunctions.mode_state = data.config.mode_state
		// 

		
		gameFunctions.units_preload = data.units;
	}

	if(data.forces){
		if(data.forces[data.player_number]){
			gameFunctions.params.player_side = data.forces[data.player_number].side
		}
	}

	// SLIDE THE MESSAGE BOARD UP
	$('#message-form').slideToggle(1000);
	$('#message-input').slideDown(1000);

	if(data.scene){
		connFunctions.sceneTransition(data);
	}
}

connFunctions.updateRoomInfo = (data) => {
	
	//UPDATE PLAYER DATA IF IT'S AVAILABLE
	if(data.users){
		gameFunctions.params.users = data.users	
		//ALSO UPDATE FORCES SO THE RIGHT USERNAME WILL BE ASSOCIATED WITH THE USER
		gameFunctions.params.forces = data.forces	
		ArmySelectUIScene.updatePlayers();		
	}
	if(data.parameters){
		// if(data.parameters.value){
		try{
			gameFunctions.params.forces[data.parameters.player_number][data.parameters.subtype] = data.parameters.value
			
			if(data.parameters.player_number === gameFunctions.params.player_number){
				switch(data.parameters.subtype){
					case 'side':
						gameFunctions.params.player_side = gameFunctions.params.forces[data.parameters.player_number][data.parameters.subtype]
						break;
				}				
			}

			
			ArmySelectUIScene.updateSelections(data.parameters)
		}catch(err){
			console.log("couldn't update selection")
		}
			
		// }		
	}

	//UNHIDE THE START BUTTON IF THIS IS THE CREATING PLAYER
	if(gameFunctions.params.users.length === gameFunctions.params.max_players && gameFunctions.params.player_number === 0){
		let check = ArmySelectUIScene.checkComplete();
		var x = document.getElementById("start");
		if(x){
			if(check === true){
				x.style.display = "block";			
			}else{
				x.style.display = "none";
			}
		}

	}
	
}

// ##################################################################################
// ##################################################################################
// ##################################################################################
// ######  #######    #    ######  #     #       #     # ######  
// #     # #         # #   #     #  #   #        #     # #     # 
// #     # #        #   #  #     #   # #         #     # #     # 
// ######  #####   #     # #     #    #    ##### #     # ######  
// #   #   #       ####### #     #    #          #     # #       
// #    #  #       #     # #     #    #          #     # #       
// #     # ####### #     # ######     #           #####  #  
// ##################################################################################
// ##################################################################################
// ##################################################################################

connFunctions.sendReadyUp = (ui_scene) => {
	if(GameScene.online === false){
		connFunctions.readyUp({parameters: {player_id:gameFunctions.params.player_number}})
	}else{
		let data = {
			functionGroup: "socketFunctions",  
			function: "messageAll",
			room_name: gameFunctions.params.room_name,
			returnFunctionGroup: "connFunctions",
			returnFunction: "readyUp",
			returnParameters: {
				player_id:gameFunctions.params.player_number,
				ui_scene: ui_scene
			},
			message: "ready player "+gameFunctions.params.player_number
		}

		connFunctions.messageServer(data)		
	}
}

connFunctions.readyUp = (data) => {
	gameFunctions.params.forces[data.parameters.player_id].ready = true;

	let scene;
	switch(data.parameters.ui_scene){
		case "GameUIScene":
			scene = GameUIScene
			break;
		case "ArmySetupUIScene":
			scene = ArmySetupUIScene
			break;			
	}

	if(scene){
		scene.setForcesHUD(data.parameters.player_id, "ready", true, false)	
	}
}

connFunctions.checkReadyUp = (check_side_only=true) => {
	let all_ready = false;
	let ready_count = 0;
	let player_count = 0;
	gameFunctions.params.forces.forEach((force) => {
		if (force.ready === true){
			ready_count++;
		}
		if(check_side_only === true){
			if(force.side === gameFunctions.current_side){
				player_count++;
			}
		}else{
			player_count++;
		}
	})
	if(ready_count === player_count){
		all_ready = true;
	}	

	return all_ready;
}



// ##################################################################################
// ##################################################################################
// ##################################################################################
//  #####     #    #     # #######        #####     #    #     # #######
// #     #   # #   #     # #             #     #   # #   ##   ## #       
// #        #   #  #     # #             #        #   #  # # # # #       
//  #####  #     # #     # #####   ##### #  #### #     # #  #  # #####   
//       # #######  #   #  #             #     # ####### #     # #       
// #     # #     #   # #   #             #     # #     # #     # #       
//  #####  #     #    #    #######        #####  #     # #     # ####### 
// ##################################################################################
// ##################################################################################
// ##################################################################################

connFunctions.saveGame = (mode) => {
	
	let data = {
		functionGroup: "socketFunctions",  
		function: "updateRoom", //saveGame
		message: "save game",
		type: "save room",
		room_name: gameFunctions.params.room_name,
		turn_number: gameFunctions.params.turn_number,
		current_side: gameFunctions.current_side,
		// current_player: gameFunctions.current_player,
		mode: mode,
		mode_state: gameFunctions.mode_state
		// units: gameFunctions.units
	}

	data.units = [];
	gameFunctions.units.forEach((unit) => {
		let unit_data = {
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
			,in_combat: unit.in_combat
			
			,x: unit.sprite.x
			,y: unit.sprite.y
			,rotation: unit.sprite.angle		
		}
		data.units.push(unit_data)
	})

	if(gameFunctions.params.player_side === gameFunctions.current_side){
		connFunctions.messageServer(data)	
	}
}




	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// ██    ██ ███    ██ ██ ████████ 
	// ██    ██ ████   ██ ██    ██    
	// ██    ██ ██ ██  ██ ██    ██    
	// ██    ██ ██  ██ ██ ██    ██    
	//  ██████  ██   ████ ██    ██    
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################


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

	// ██     ██  ██████  ██    ██ ███    ██ ██████  ██ ███    ██  ██████  
	// ██     ██ ██    ██ ██    ██ ████   ██ ██   ██ ██ ████   ██ ██       
	// ██  █  ██ ██    ██ ██    ██ ██ ██  ██ ██   ██ ██ ██ ██  ██ ██   ███ 
	// ██ ███ ██ ██    ██ ██    ██ ██  ██ ██ ██   ██ ██ ██  ██ ██ ██    ██ 
	//  ███ ███   ██████   ██████  ██   ████ ██████  ██ ██   ████  ██████ 

connFunctions.woundUnit = (data) => {
	// console.log(data)
	let unit = gameFunctions.units[data.parameters.defender_id]
	unit.wound(data.parameters)
}

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// ███    ███ ██ ███████  ██████ 
	// ████  ████ ██ ██      ██      
	// ██ ████ ██ ██ ███████ ██      
	// ██  ██  ██ ██      ██ ██      
	// ██      ██ ██ ███████  ██████ 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

connFunctions.test = (data) => {
	console.log(data)
}




availableFunctions = {
    connFunctions: connFunctions,
	GameScene: GameScene,
	ArmySetupUIScene: ArmySetupUIScene,
	GameUIScene: GameUIScene,
}

connFunctions.checkMessages(socket)

