
// const address = 'https://soaps-card-game.azurewebsites.net';
// const address = 'http://localhost:3000/admin';


const address = 'https://node-v12-ubyor.run-eu-central1.goorm.io';
// const address = 'http://localhost:3000';
const socket = io(address)



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
        availableFunctions[data.functionGroup][data.function](data);  
    })

}        

connFunctions.test = (data) => {
  console.log(data.message)
}


connFunctions.sceneTransition = (data) => {
    console.log(data.message)

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
	console.log(data.message)
	gameFunctions.current_uiscene.scene.stop()	
}


availableFunctions = {
    connFunctions: connFunctions
}

connFunctions.checkMessages(socket)

