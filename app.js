if(!process.env.INSTANCE_TYPE){
	require('dotenv').config();
	console.log("dev env variables loaded")	
}




const express = require("express");
const app = express();
const utils = require("./utils");
const socketio = require('socket.io');

const middleware = require('./middleware');
middleware.setup.setupApp(app)



let expressServer;

switch(process.env.INSTANCE_TYPE){
	case "DEV":
	case "DEV-ONLINE":
		// expressServer = app.listen(3000, () => {
			expressServer = app.listen(process.env.PORT||80, process.env.IP, function(){				
			console.log("dev server running")
			setTimeout(utils.timer.checkTimer, process.env.TIMER_MS);
		})	
		break;
	default:
		expressServer = app.listen(process.env.PORT, process.env.IP, function(){
			console.log("prod server running")
			setTimeout(utils.timer.checkTimer, process.env.TIMER_MS);
		})		
		break;
}
	


const io = socketio(expressServer);
utils.socket.checkSockets(io);
