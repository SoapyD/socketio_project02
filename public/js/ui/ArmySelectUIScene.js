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
		character_form = this.add.dom((gameFunctions.config.width / 2), this.cameras.main.centerY).createFromCache('character_form');
        character_form.setScrollFactor(0);
        // character_form.setPerspective(800);
        character_form.setAlpha(0)
        character_form.addListener('click');
		// console.log(character_form)
        
        //ADD CLICK FUNCTIONALITY TO THE CHARACTER SELECTOR
        character_form.on('click', function (event) {
			// if (event.target.name === 'select')
			// {
			// var character = this.getChildByName('characters');

			// let data = {
			// functionGroup: "socketFunctions",  
			// function: "selectArmy",			
			// }

			// connFunctions.messageServer(data)

			// }

            if (event.target.name === 'start')
            {        
                let data = {
					functionGroup: "socketFunctions",  
					function: "sceneTransition",
					scene: "GameScene",
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
			let options = {
				name: player_name,
				i: i,
				armies: ['Army 1','Army 2','Army 3'],
				sides: gameFunctions.params.max_sides
			}
			
			ArmySelectUIScene.addPlayer(options)
		}
		
		character_form.y -= (character_form.height / 2)
		
		
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
		dropdown_markup += '<option value="'+i+'">'+army+'</option>'
	})

	let dropdown_sides = "";
	for(let i=0;i<options.sides;i++){
		dropdown_sides += '<option value="'+i+'">'+i+'</option>'
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
		<option value="">--Side--</option>
		`+dropdown_sides+`
	</select>

	<select class="armies" name="armies" id="`+options.i+`_army-select" `+disable_check2+`>
		<option value="">--Army--</option>
		`+dropdown_markup+`
	</select>
	`

	$(".players").append(markup)
}

ArmySelectUIScene.updatePlayers = () => {
	gameFunctions.params.users.forEach((user, i) => {
		let id = '#'+i+'_player';
		let elements = $(id);
		if(elements.length > 0){
			elements.text(user.username);
		}
	})
}

