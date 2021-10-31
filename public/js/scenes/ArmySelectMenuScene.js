

var ArmySelectMenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ArmySelectMenuScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySelectMenuScene' });
    },

    preload: function()
    {
        // this.load.html('character_form', './html/character_form.html');     
		this.scene.launch("ArmySelectUIScene");
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
            
        gameFunctions.current_scene = this.scene.get('ArmySelectMenuScene');

    },

    update: function (time, delta)
    {

                    
    }
});
