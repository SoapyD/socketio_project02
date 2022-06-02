const mode_handler = class {
	constructor(options) {

    }

    // ███████ ███████ ██      ███████  ██████ ████████       ███    ███  ██████  ██████  ███████ 
    // ██      ██      ██      ██      ██         ██          ████  ████ ██    ██ ██   ██ ██      
    // ███████ █████   ██      █████   ██         ██    █████ ██ ████ ██ ██    ██ ██   ██ █████   
    //      ██ ██      ██      ██      ██         ██          ██  ██  ██ ██    ██ ██   ██ ██      
    // ███████ ███████ ███████ ███████  ██████    ██          ██      ██  ██████  ██████  ███████                                                                                                                            

    selectMode = (options) => {

        try{	
            // GameScene.sfx['button'].play();
            if(GameScene.online === false){
                this.runSelectMode(options);
            }else{

                let data = {
                    functionGroup: "socketFunctions",  
                    function: "messageAll",
                    room_name: gameFunctions.params.room_name,
                    returnFunctionGroup: "modeHandler",
                    returnFunction: "runSelectMode", //selectMode
                    message: "select mode",
                    returnParameters: {
                        options: options
                    }
                }
                connFunctions.messageServer(data)
            }	
        }catch(e){

            let options = {
                "class": "modeHandler",
                "function": "selectMode",
                "e": e
            }
            errorHandler.log(options)
        }
    }

    runSelectMode = (options) => {
        try{		
            if(options.parameters){
                options = options.parameters.options
            }

            
            if(options.mode){
                gameFunctions.mode = options.mode	

                GameScene.resetTempSprites();
                GameUIScene.setAllWaitingHUD();

                GameScene.selected_unit = [];
                
                //RESET ALL PLAYER ACTIONS
                if(gameFunctions.units){
                    gameFunctions.units.forEach((unit) => {
                        if(unit.core.alive === true && unit.core.side === gameFunctions.current_side){
                            unit.resetActions();
                            
                            unit.drawFlash(false)
                            unit.drawFlash(true)

                            switch(options.mode){
                                case "shoot":
                                    if (unit.core.in_combat === true){
                                        unit.drawFlash(false, true)
                                    }
                                    break;
                                    case "charge":

                                        if (unit.core.shot === true && unit.checkSpecialRule("swift") === false){
                                            unit.drawFlash(false, true)
                                        }
                                    break;	
                                    case "fight":
                                        if (unit.melee_class[unit.selected_melee].damage === 0){
                                            unit.drawFlash(false, true)
                                        }
                                    break;														
                            }

                        }else{
                            unit.drawFlash(false)//, true)
                        }

                    })
                }
            }
        }catch(e){

            let options = {
                "class": "modeHandler",
                "function": "runSelectMode",
                "e": e
            }
            errorHandler.log(options)
        }			
    }


    //      #    ######  #     #    #    #     #  #####  #######       #     # ####### ######  ####### 
    //     # #   #     # #     #   # #   ##    # #     # #             ##   ## #     # #     # #       
    //    #   #  #     # #     #  #   #  # #   # #       #             # # # # #     # #     # #       
    //   #     # #     # #     # #     # #  #  # #       #####   ##### #  #  # #     # #     # #####   
    //   ####### #     #  #   #  ####### #   # # #       #             #     # #     # #     # #       
    //   #     # #     #   # #   #     # #    ## #     # #             #     # #     # #     # #       
    //   #     # ######     #    #     # #     #  #####  #######       #     # ####### ######  ####### 

    readyAdvanceMode = (actions=-1) => {

        try{	
            let cohesion_check = true;
    
    
            if(cohesion_check === true){
                gameFunctions.btn_sprite[0].hideButton();
            
    
                if(GameScene.online === false){
                    if(actions>-1){
                        GameScene.active_actions = actions;
                    }
                    // else{	
                    // }
                    this.runAdvanceMode();
                }else{		
                    let options = {
                        completion_function_group: "modeHandler",
                        completion_function: 'runAdvanceMode',
                        current_mode: gameFunctions.mode_state		
                    }
                    if(actions > -1){
                        options.actions = actions
                    }
            
                    connFunctions.sendReadyUp(options);
                }
            }else{
                let options = {
                    scene: GameScene.scene,
                    pos: {
                        x: GameScene.rectangle.x,
                        y: GameScene.rectangle.y
                    },
                    text: "Cannot move unless all unit coherency is met."
                }
                new popup(options)		
            }
        }catch(e){
    
            let options = {
                "class": "modeHandler",
                "function": "readyAdvanceMode",
                "e": e
            }
            errorHandler.log(options)
        }		
    }
    
    runAdvanceMode = () => {
        try{	
            gameFunctions.mode_state++;
            if(gameFunctions.mode_state > 27){
                gameFunctions.mode_state = 0;
            }
        }catch(e){
    
            let options = {
                "class": "modeHandler",
                "function": "runAdvanceMode",
                "e": e
            }
            errorHandler.log(options)
        }		
    } 

    //  #####  ####### #       #######  #####  #######          #     #####  ####### ### ####### #     #  #####  
    // #     # #       #       #       #     #    #            # #   #     #    #     #  #     # ##    # #     # 
    // #       #       #       #       #          #           #   #  #          #     #  #     # # #   # #       
    //  #####  #####   #       #####   #          #    ##### #     # #          #     #  #     # #  #  #  #####  
    //       # #       #       #       #          #          ####### #          #     #  #     # #   # #       # 
    // #     # #       #       #       #     #    #          #     # #     #    #     #  #     # #    ## #     # 
    //  #####  ####### ####### #######  #####     #          #     #  #####     #    ### ####### #     #  #####      

    setupMode = (mode) => {

        this.selectMode({mode: mode});
        gameFunctions.btn_sprite[0].updateText("trigger "+mode)
        if(gameFunctions.params.player_side === gameFunctions.current_side){
            gameFunctions.btn_sprite[0].showButton();				
        }else{
            this.readyAdvanceMode();
        }		
        
        //THIS IS CAUSING BODY RESETS
        GameScene.game_setup.checkAllCombat();
        
        connFunctions.saveGame(mode);

        gameFunctions.mode_state++;
        GameScene.game_setup.checkCollisionsBarriers();
    }

    setupActions = (mode) => {
        //PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
        gameFunctions.mode = ""; //RESET MODE SO ACTIONS CAN'T BE SET WHILE THEY PLAY
        actions = 0;
        gameFunctions.units.forEach((unit) => {

            switch(mode){
                case "move":
                case "charge":                    
					if(unit.path.length > 0){
						if(unit.core.player === gameFunctions.params.player_number){
							actions++;
						}
					}                    
                break;
                case "shoot":
                    if(unit.targets.length > 0){
                        if(unit.core.player === gameFunctions.params.player_number){
                            actions += unit.targets.length;
                        }
                    }
                break;     
                case "fight":
                    if(unit.fight_targets.length > 0){
                        if(unit.core.player === gameFunctions.params.player_number){
                            actions += unit.fight_targets.length;
                        }
                    }
                break;                          
            }
        })	
        this.readyAdvanceMode(actions);
        gameFunctions.mode_state++;        
    }

    countActionsForAdvanceMode = (mode) => {

        let actions = 0

        gameFunctions.units.forEach((unit) => {
            switch(mode){
                case "move":     
                case "charge":                                 
                    if(unit.path.length > 0){
                        if(unit.core.player === gameFunctions.params.player_number){
                            actions++;
                        }
                    }
                break;
                case "shoot":                
                    if(unit.targets.length > 0){
                        if(unit.core.player === gameFunctions.params.player_number){
                            actions += unit.targets.length;
                        }
                    }
                break;                     
                case "fight":                
                    if(unit.fight_targets.length > 0){
                        if(unit.core.player === gameFunctions.params.player_number){
                            actions += unit.fight_targets.length;
                        }
                    }
                break;                    
            }
        })
        
        this.readyAdvanceMode(actions);
        gameFunctions.mode_state++;        

    }

    //      #     #####  ####### ### #     #    #    ####### #######          #     #####  ####### ### ####### #     #  #####  
    //     # #   #     #    #     #  #     #   # #      #    #               # #   #     #    #     #  #     # ##    # #     # 
    //    #   #  #          #     #  #     #  #   #     #    #              #   #  #          #     #  #     # # #   # #       
    //   #     # #          #     #  #     # #     #    #    #####   ##### #     # #          #     #  #     # #  #  #  #####  
    //   ####### #          #     #   #   #  #######    #    #             ####### #          #     #  #     # #   # #       # 
    //   #     # #     #    #     #    # #   #     #    #    #             #     # #     #    #     #  #     # #    ## #     # 
    //   #     #  #####     #    ###    #    #     #    #    #######       #     #  #####     #    ### ####### #     #  #####  

    activateActions = (mode) => {
        try{	
            GameScene.game_setup.sfxHandler("button");
            let activated = -1;

            gameFunctions.units.forEach((unit) => {

                switch(mode){
                    case "move":     
                    case "charge":                                 
                        if(unit.path.length > 0){
                            this.runAction(unit, 'move', mode)
                            activated = 1
                        }
                    break;
                    case "shoot":                
                        if(unit.targets.length > 0){
                            this.runAction(unit, mode)
                            activated = 1
                        }
                    break;                     
                    case "fight":                
                        if(unit.fight_targets.length > 0){
                            this.runAction(unit, mode)
                            activated = 1
                        }
                    break;                    
                }
            })	
    
            // return activated;
            if(activated !== 0){
                GameScene.resetTempSprites();
                gameFunctions.btn_sprite[0].hideButton()

                if(activated === -1){
                    this.readyAdvanceMode();
                }

                gameFunctions.mode_state++;
            }


        }catch(e){
    
            let options = {
                "class": "modeHandler",
                "function": "activateAction",
                "e": e
            }
            errorHandler.log(options)
        }        
    }

    runAction = (unit, mode, params="") => {
        if(unit.core.player === gameFunctions.params.player_number){
    
            if(GameScene.online === false){
                if(params !== ""){
                    unit[mode](params);
                }else{
                    unit[mode]()
                }
            }else{
                let data = {
                    functionGroup: "socketFunctions",  
                    function: "messageAll",
                    room_name: gameFunctions.params.room_name,
                    returnFunctionGroup: "connFunctions",
                    returnFunction: "runUnitFunction",
                    returnParameters: {
                        id: unit.core.id, 
                        path: unit.path,
                        function: mode
                    },
                    message: "run "+mode
                }        

                if(params !== ""){
                    data.returnParameters.function_parameter = params
                }

                connFunctions.messageServer(data)
            }   
        }
    }


    // #     # ####### #     # #######        #####  ### ######  ####### 
    // ##    # #        #   #     #          #     #  #  #     # #       
    // # #   # #         # #      #          #        #  #     # #       
    // #  #  # #####      #       #    #####  #####   #  #     # #####   
    // #   # # #         # #      #                #  #  #     # #       
    // #    ## #        #   #     #          #     #  #  #     # #       
    // #     # ####### #     #    #           #####  ### ######  ####### 

    nextSide = () => {
        try{	

            //APPLY ANY STATUS EFFECTS CAUSED BY A BARRIER
            GameScene.game_setup.updateBarriers();


            gameFunctions.mode = ""
            gameFunctions.units.forEach((unit) => {
                if(unit.core.alive === true){
                    unit.checkStatus();
                    if(unit.core.player === gameFunctions.params.player_number){
                        unit.resetActions();
                        unit.resetLocks();
                    }
                }
            })

            GameScene.game_setup.sfxHandler("end_turn")
            
            this.advanceSide()

            //RUN REGEN CHECK WHEN THE SIDE ADVANCES
            gameFunctions.units.forEach((unit) => {
                if(gameFunctions.current_side === unit.core.side){
                    if(unit.checkSpecialRule("regen") === true){

                        let roll = gameFunctions.getRandomInt(20);
                        options = {
                            random_roll: roll
                        }			
                        
                        
                        if(GameScene.online === false){			
                            unit.regen(options);
                        }else{
                            //ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
                            if(gameFunctions.params.player_number === unit.core.player){
                                let data = {
                                        functionGroup: "socketFunctions",  
                                        function: "messageAll",
                                        room_name: gameFunctions.params.room_name,
                                        returnFunctionGroup: "connFunctions",
                                        returnFunction: "regen",
                                        returnParameters: options,
                                        message: "Check Regen"
                                    }				
                                connFunctions.messageServer(data)
                            }
                        }		


                    }				
                }
            })


        }catch(e){

            let options = {
                "class": "modeHandler",
                "function": "nextSide",
                "e": e
            }
            errorHandler.log(options)
        }		
    }

    advanceSide = () => {

        try{	
            let sides_array = []
            gameFunctions.params.forces.forEach((force) => {
                if(!sides_array.includes(force.side)){
                    sides_array.push(force.side)
                }
            })
            //gameFunctions.params.max_sides
            let sides = sides_array.length;


            // CHANGE THE PARAMS SIDE IF THIS IS A LOCAL GAME
            if(GameScene.online === false && gameFunctions.current_side !== -1){
        
                GameScene.offline_force++;
                if(GameScene.offline_force >= gameFunctions.params.forces.length){
                    GameScene.offline_force = 0;
                }	
                gameFunctions.params.player_number = GameScene.offline_force;
                gameFunctions.params.player_side = gameFunctions.params.forces[GameScene.offline_force].side;
            }	

            gameFunctions.current_side += 1
            if(gameFunctions.current_side >= sides){
                gameFunctions.current_side = 0

                gameFunctions.params.turn_number++;
                GameUIScene.hud_item.setText("c_Turn",gameFunctions.params.turn_number)	
            }
            

            gameFunctions.units.forEach((unit) => {
                unit.moves = 0;
                unit.fights = 0;
                unit.shots = 0;
            })

            GameUIScene.checkButtonVisability();
        }catch(e){

            let options = {
                "class": "modeHandler",
                "function": "selectUnit",
                "e": e
            }
            errorHandler.log(options)
        }		
    }


    //  #####  #     # #######  #####  #    #       #     # ####### ######  ####### 
    // #     # #     # #       #     # #   #        ##   ## #     # #     # #       
    // #       #     # #       #       #  #         # # # # #     # #     # #       
    // #       ####### #####   #       ###    ##### #  #  # #     # #     # #####   
    // #       #     # #       #       #  #         #     # #     # #     # #       
    // #     # #     # #       #     # #   #        #     # #     # #     # #       
    //  #####  #     # #######  #####  #    #       #     # ####### ######  ####### 

    advanceMode = () => {
        try{	

            let activated = false;
            let actions = 0;
            switch(gameFunctions.mode_state){
    
                // #     # ####### #     # ####### 
                // ##   ## #     # #     # #       
                // # # # # #     # #     # #       
                // #  #  # #     # #     # #####   
                // #     # #     #  #   #  #       
                // #     # #     #   # #   #       
                // #     # #######    #    ####### 
    
                case 0:
                    this.setupMode("move")
                    break;
    
                case 1:
                    //WAIT FOR PLAYERS TO READY UP
                    break;
    
                case 2:
                    //PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
                    this.countActionsForAdvanceMode("move")			
                    break;
    
                case 3:
                    //WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
                    break;
    
                
                case 4:
                    //activate movement
                    this.activateActions("move")
                    break;
    
                
                case 5:
                    //WAIT FOR PLAYERS TO READY UP
                    break;
    
                //  #####  #     # ####### ####### ####### 
                // #     # #     # #     # #     #    #    
                // #       #     # #     # #     #    #    
                //  #####  ####### #     # #     #    #    
                // 	     # #     # #     # #     #    #    
                // #     # #     # #     # #     #    #    
                //  #####  #     # ####### #######    #   
    
                case 6:
                    //setup shoot
                    this.setupMode("shoot")
                    break;
    
                case 7:
                    //WAIT FOR PLAYERS TO READY UP
                    break;			
    
                case 8:
                    //PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
                    this.countActionsForAdvanceMode("shoot")	
                    break;
    
                case 9:
                    //WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
                    break;
    
                case 10:
                    //activate shoot
                    this.activateActions("shoot")
                    break;
    
                case 11:
                    //WAIT FOR PLAYERS TO READY UP
                    break;	
    
                //  #####  #     #    #    ######   #####  ####### 
                // #     # #     #   # #   #     # #     # #       
                // #       #     #  #   #  #     # #       #       
                // #       ####### #     # ######  #  #### #####   
                // #       #     # ####### #   #   #     # #       
                // #     # #     # #     # #    #  #     # #       
                //  #####  #     # #     # #     #  #####  ####### 
    
                case 12:
                    //setup charge
                    this.setupMode("charge")
                    break;
    
                case 13:
                    //WAIT FOR PLAYERS TO READY UP
                    break;	
    
                case 14:
                    //PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
                    this.countActionsForAdvanceMode("charge")			
                    break;
    
                case 15:
                    //WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
                    break;
    
                case 16:
                    //activate charge
                    this.activateActions("charge")
                    break;			
    
                case 17:
                    //WAIT FOR PLAYERS TO READY UP
                    break;	
    
                // ####### ###  #####  #     # ####### 
                // #        #  #     # #     #    #    
                // #        #  #       #     #    #    
                // #####    #  #  #### #######    #    
                // #        #  #     # #     #    #    
                // #        #  #     # #     #    #    
                // #       ###  #####  #     #    #    
    
                
                case 18:
                    //setup fight
                    this.setupMode("fight")
    
                case 19:
                    //WAIT FOR PLAYERS TO READY UP
                    break;				
    
                case 20:
                    //PASS THE TOTAL ACTIONS TO PLAY TO THE SERVER
                    this.countActionsForAdvanceMode("fight")			
                    break;
    
                case 21:
                    //WAIT FOR PLAYERS TO READY UP SO TOTAL ACTIONS CAN BE PASSED BACK
                    break;
    
                case 22:
                    //activate fight
                    this.activateActions("fight")
                    break
    
                case 23:
                    //WAIT FOR PLAYERS TO READY UP
                    break;
    
                // ####### #     # ######        ####### #     # ######  #     # 
                // #       ##    # #     #          #    #     # #     # ##    # 
                // #       # #   # #     #          #    #     # #     # # #   # 
                // #####   #  #  # #     # #####    #    #     # ######  #  #  # 
                // #       #   # # #     #          #    #     # #   #   #   # # 
                // #       #    ## #     #          #    #     # #    #  #    ## 
                // ####### #     # ######           #     #####  #     # #     # 
    
                
                case 24:
                    //setup end turn
                    this.setupMode("end turn")
                    break;
    
                case 25:
                    //WAIT FOR PLAYERS TO READY UP
                    break;
    
                case 26:
                    //activate end turn
                    GameScene.game_setup.sfxHandler("end_turn")
                    gameFunctions.mode_state++;			
                    this.readyAdvanceMode();
                    this.nextSide();
                    break;
    
                case 27:
                    //WAIT FOR PLAYERS TO READY UP
                    break;			
    
                /**/
            }
        }catch(e){
    
            let options = {
                "class": "modeHandler",
                "function": "advanceMode",
                "e": e
            }
            errorHandler.log(options)
        }		
    }

    //  #####  #     # #######  #####  #    #        #####     #    #     # #######       ####### #     # ######  
    // #     # #     # #       #     # #   #        #     #   # #   ##   ## #             #       ##    # #     # 
    // #       #     # #       #       #  #         #        #   #  # # # # #             #       # #   # #     # 
    // #       ####### #####   #       ###    ##### #  #### #     # #  #  # #####   ##### #####   #  #  # #     # 
    // #       #     # #       #       #  #         #     # ####### #     # #             #       #   # # #     # 
    // #     # #     # #       #     # #   #        #     # #     # #     # #             #       #    ## #     # 
    //  #####  #     # #######  #####  #    #        #####  #     # #     # #######       ####### #     # ######  


    checkGameEnd = () => {

        try{	
            // let force_check = [];
            let max_sides = 0;
            gameFunctions.params.forces.forEach((force) => {
                if(force.side > max_sides){
                    max_sides = force.side
                }
            })

            let sides = [];
            for(i=0;i<=max_sides;i++){
                sides.push(0)
            }

            //loop through units and count live units per force / side
            gameFunctions.units.forEach((unit) => {
                // let force = force_check[unit.player]
                if(unit.core.alive === true){
                    // force.live_units++;
                    sides[unit.core.side] += 1;  
                }
            })

            //
            sides.forEach((side) => {
                if(side === 0){
                    let options = {
                        scene: gameFunctions.current_scene,
                        pos: {
                            x: gameFunctions.config.width / 2,
                            y: gameFunctions.config.height / 2
                        },
                        text: "side "+side+" is defeated!"
                    }
                    new popup(options)	
                }
            })
        }catch(e){

            let options = {
                "class": "modeHandler",
                "function": "checkGameEnd",
                "e": e
            }
            errorHandler.log(options)
        }
    }

}



