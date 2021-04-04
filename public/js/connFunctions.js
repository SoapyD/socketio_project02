
// const address = 'https://soaps-card-game.azurewebsites.net';
// const address = 'http://localhost:3000/admin';


// const address = 'https://node-v12-ubyor.run-eu-central1.goorm.io';
const address = 'http://localhost:3000';
const socket = io(address)



const connFunctions = [];
let availableFunctions = {}



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
        socket.emit('message_server', data)
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
        socket.emit('message_server', data)
    })



    socket.on('message_client', (data) => {
        availableFunctions[data.functionGroup][data.function](data);  
    })

}        

connFunctions.Test = (data) => {
  console.log(data.message)
}

connFunctions.sceneTransition = (data) => {
    console.log(data.message)
    gameFunctions.game.scene.start(data.scene)
  }




availableFunctions = {
    connFunctions: connFunctions
}

connFunctions.checkMessages(socket)

