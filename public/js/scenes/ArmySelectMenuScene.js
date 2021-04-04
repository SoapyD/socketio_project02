

var ArmySelectMenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ArmySelectMenuScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySelectMenuScene' });
    },

    preload: function()
    {
        this.load.html('character_form', './html/character_form.html');     
    },


    create: function()
    {
        let x_origin = this.cameras.main.centerX	
        let y_origin = this.cameras.main.centerY	

        this.add.grid(
            x_origin, y_origin, 
            gameFunctions.config.width,// + (gameFunctions.cardSize * 2), 
            gameFunctions.config.height,// + (gameFunctions.cardSize * 2), 
            50, 
            50, 
            0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle(0x000000);
            
            
        //ADD THE CHARACTER SELECTION MENU
        character_form = this.add.dom(this.cameras.main.centerX, y_origin).createFromCache('character_form');
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
        

		// console.log(this)
		this.tweens.add({
			targets: character_form,
			// y: this.cameras.main.centerY,
			alpha: 1,
			duration: 500,
			ease: 'Power3',
			onComplete: function ()
			{
				character_form.setVisible(true);
			}
			});    		
		
		
        gameFunctions.current_scene = this.scene.get('ArmySelectMenuScene');

    },

    update: function (time, delta)
    {

                    
    }
});
