
const error_handler = class {
	constructor(options) {	

        this.errors = [];
    }

    log(options) {

        try{

            this.errors.push(options)

            let error_message = "-----------\nERROR\n-----------\n"

            if(options.class){
                // console.log("class:",options.class)
                error_message += 'class: '+options.class+'\n'
            }

            if(options.function){
                // console.log("function:",options.function)
                error_message += 'function: '+options.function+'\n'
            }

            if(options.e){
                // console.log("error:")
                error_message += 'error message:'+'\n'+options.e.message+'\n'+'\n'
                error_message += 'error stack:'+'\n'+options.e.stack+'\n'
                // console.log(options.e)
            }

            console.log(error_message)
            //set the e value

            //repackage the error as it doesn't transfer over sockets
            let message = options.e.message;
            let stack = options.e.stack;
            options.e = {
                "message": message,
                "stack": stack
            };
            options.detail = ''

            options.detail += 'Room Name: ' + gameFunctions.params.room_name + '<br>'
            options.detail += 'Player Number: ' + gameFunctions.params.player_number + '<br>'
              

            if(GameScene.online === true){
                let data = {
                    functionGroup: "socketFunctions",  
                    function: "logClientError",
                    message: "log error",
                    options: options 
                }				
                connFunctions.messageServer(data)
            }

        }catch(e){
            console.log("error handler has errored")
            console.log(e)
        }

    }
}