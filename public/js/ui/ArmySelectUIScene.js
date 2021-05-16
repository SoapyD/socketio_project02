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
        character_form = this.add.dom(this.cameras.main.centerX, this.cameras.main.centerY).createFromCache('character_form');
        character_form.setScrollFactor(0);
        character_form.setPerspective(800);
        character_form.setAlpha(0)
        character_form.addListener('click');
        
        //ADD CLICK FUNCTIONALITY TO THE CHARACTER SELECTOR
        character_form.on('click', function (event) {
            if (event.target.name === 'select')
            {
                var character = this.getChildByName('characters');

                let data = {
					functionGroup: "socketFunctions",  
					function: "selectArmy",			
                }
                    
                connFunctions.messageServer(data)
            
            }

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