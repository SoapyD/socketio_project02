var ArmySelectUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySelectUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
		
        this.load.html('character_form', './html/character_form.html');    		
    },

    create: function()
    {
        let startOption = this.add.text((gameFunctions.config.width / 2) - 300, 150, "Select Army", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);
		
		let callbackParams = {
            functionGroup: "socketFunctions",  
            function: "messageAll",
			message: "end setup",
            returnFunctionGroup: "connFunctions",  
            returnFunction: "uiSceneTransition",		
		};
		

		let width = parseInt($("canvas").css("width"),10);
		let height = parseInt($("canvas").css("height"),10);		
		
		
		
        //ADD THE CHARACTER SELECTION MENU
        // character_form = this.add.dom(this.cameras.main.centerX, this.cameras.main.centerY).createFromCache('character_form');
		character_form = this.add.dom((gameFunctions.config.width / 2), this.cameras.main.centerY - 25).createFromCache('character_form');
        character_form.setScrollFactor(0);
        // character_form.setPerspective(800);
        character_form.setAlpha(0)
        character_form.addListener('click');
		// console.log(character_form)
		
		//CHANGE THE IMAGE TO REFLECT THE CURRENT MAX PLAYER SETUP
		let id = '#map img';
		if(gameFunctions.params.max_players <= 2){
			$(id).attr('src','/img/maps/map2 (1v1).png');
		}
		if(gameFunctions.params.max_players === 4){
			$(id).attr('src','/img/maps/map2 (2v2).png');
		}		

		
		
        
        //ADD CLICK FUNCTIONALITY TO THE CHARACTER SELECTOR
        character_form.on('click', function (event) {

            if (event.target.name === 'sides')
            {
				let num = event.target.id.indexOf('_')
				let player_number = parseInt(event.target.id.substring(0,num))

				let data = {
					functionGroup: "socketFunctions",  
					function: "updateRoom",
					room_name: gameFunctions.params.room_name,
					type: "save config",
					subtype: "side",
					player_number: player_number,
					value: parseInt(event.target.value),
					message: "set side for player "+player_number
				}				
				connFunctions.messageServer(data)
				
			}
            if (event.target.name === 'starts')
            {
				let num = event.target.id.indexOf('_')
				let player_number = parseInt(event.target.id.substring(0,num))

				let data = {
					functionGroup: "socketFunctions",  
					function: "updateRoom",
					room_name: gameFunctions.params.room_name,
					type: "save config",
					subtype: "start",
					player_number: player_number,
					value: parseInt(event.target.value),
					message: "set start for player "+player_number
				}				
				connFunctions.messageServer(data)				
				
			}			
            if (event.target.name === 'armies')
            {

				let data = {
					functionGroup: "socketFunctions",  
					function: "updateRoom",
					room_name: gameFunctions.params.room_name,
					type: "save config",
					subtype: "army",
					player_number: gameFunctions.params.player_number,
					value: event.target.value,
					message: "set army for player "+gameFunctions.params.player_number
				}				
				connFunctions.messageServer(data)
				
			}			
			
			
			
            if (event.target.name === 'start')
            {        
                let data = {
					functionGroup: "socketFunctions",  
					function: "sceneTransition",
					scene: "GameScene",
					room_name: gameFunctions.params.room_name,
					message: "Starting Game Scene"
                }
                    
                connFunctions.messageServer(data)
            }
        })	
        gameFunctions.current_form = character_form
        

		this.tweens.add({
			targets: character_form,
			alpha: 1,
			duration: 500,
			ease: 'Power3',
			onComplete: function ()
			{
				character_form.setVisible(true);
			}
			});
		
		
		
		// let sheet_functions = {}
		// sheet_functions.add_player = (options) => {
			
		// 	let dropdown_markup = "";
		// 	options.armies.forEach((army, i) => {
		// 		dropdown_markup += '<option value="'+i+'">'+army+'</option>'
		// 	})
			
		// 	let markup = `
		// 	<label id="`+options.i+`_player">`+options.name+`</label>

		// 	<select name="characters" id="`+options.i+`_character-select">
		// 		<option value="">--Please choose a force--</option>
		// 		`+dropdown_markup+`
		// 	</select>
		// 	`
			
		// 	$(".players").append(markup)
		// 	}
		
		
		for(let i=0;i<gameFunctions.params.max_players;i++){
			let player_num = i+1
			let player_name = "";
			if(i < gameFunctions.params.users.length){
				player_name = gameFunctions.params.users[i].username
			}

			let forces_list = [];
			if(gameFunctions.params.forces[i].army_list){
				gameFunctions.params.forces[i].army_list.forEach((army) => {
					forces_list.push({
						name: army.name,
						id: army._id
					})
				})
			}

			let options = {
				name: player_name,
				i: i,
				armies: forces_list,
				sides: gameFunctions.params.max_sides,
				starts: 4
			}
			
			ArmySelectUIScene.addPlayer(options)
		}
		
		// character_form.y -= (character_form.height / 2)
		
		//UPDATE SELECTION WITH PRE-LOADED INFO
		if(gameFunctions.params.forces){
			gameFunctions.params.forces.forEach((force, i) => {

				let options = {};
				if(force.side > -1){
					options.subtype = "side"
					options.player_number = force.player_number
					options.value = force.side
					ArmySelectUIScene.updateSelections(options)
				}
				if(force.start > -1){
					options.subtype = "start"
					options.player_number = force.player_number
					options.value = force.start
					ArmySelectUIScene.updateSelections(options)
				}
				if(force.army > -1){
					options.subtype = "army"
					options.player_number = force.player_number
					options.value = force.army
					ArmySelectUIScene.updateSelections(options)
				}		

			})		
		}		
		
		
		
		gameFunctions.current_uiscene = this.scene.get('ArmySelectUIScene');
		
		
    },

    update: function (time, delta)
    {
        // switch( gameFunctions.config.game_state) {
        //     case 0:

        //     break;

        //     default:
        //     // code block
        // }	                 
    }
});


ArmySelectUIScene.addPlayer = (options) => {
			
	let dropdown_markup = "";
	options.armies.forEach((army, i) => {
		dropdown_markup += '<option value="'+army.id+'">'+army.name+'</option>'
	})

	let dropdown_sides = "";
	for(let i=0;i<options.sides;i++){
		dropdown_sides += '<option value="'+i+'">'+i+'</option>'
	}	

	let dropdown_starts = "";
	for(let i=0;i<options.starts;i++){
		let print_value = i+1
		dropdown_starts += '<option value="'+i+'">'+print_value+'</option>'
	}		
	
	//ONLY ALLOW SIDE SELECTION FOR PLAYER WHO CREATED THE GAME
	let disable_check = ""
	if(gameFunctions.params.player_number !== 0){
		disable_check = 'disabled="true"'
	}		
	
	//GREY OUT ARMY SELECTION FOR OTHER PLAYERS
	let disable_check2 = ""
	if(options.i !== gameFunctions.params.player_number){
		disable_check2 = 'disabled="true"'
	}

	
	let markup = `
	<label id="`+options.i+`_player">`+options.name+`</label>

	<select class="sides" name="sides" id="`+options.i+`_side-select" `+disable_check+`>
		<option value="-1">--Side--</option>
		`+dropdown_sides+`
	</select>

	<select class="starts" name="starts" id="`+options.i+`_start-select" `+disable_check+`>
		<option value="-1">--Start--</option>
		`+dropdown_starts+`
	</select>

	<select class="armies" name="armies" id="`+options.i+`_army-select" `+disable_check2+`>
		<option value="-1">--Army--</option>
		`+dropdown_markup+`
	</select>
	`

	$(".players").append(markup)
}

ArmySelectUIScene.updatePlayers = () => {

	//UPDATE PLAYER INFO
	gameFunctions.params.users.forEach((user, i) => {
		//UPDATE PLAYER ELEMENTS
		let id = '#'+i+'_player';
		let elements = $(id);
		if(elements.length > 0){
			elements.text(user.username);
		}
	})

	//NEED TO ADD IN A BIT HERE THAT'LL UPDATE THE FORCES DROPDOWN
}

ArmySelectUIScene.updateSelections = (options) => {
	let id = '#'+options.player_number+'_'+options.subtype+'-select';
	// $(id).val(parseInt(options.value));
	$(id).val(options.value);	
}


ArmySelectUIScene.checkComplete = () => {
	let value_count = 0;
	for(let i=0;i<gameFunctions.params.max_players;i++){
		let id = '#'+i+'_side-select';
		let val = $(id).val();
		if(parseInt(val) > -1){
			value_count++;
		}

		id = '#'+i+'_start-select';
		val = $(id).val();
		if(parseInt(val) > -1){
			value_count++;
		}		
		
		id = '#'+i+'_army-select';
		val = $(id).val();
		if(parseInt(val) > -1){
			value_count++;
		}
	}
	
	let check = false;
	if(value_count === gameFunctions.params.max_players * 3){
		check = true;
	}
	return check;
}
