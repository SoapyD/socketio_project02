

var ArmySelectMenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ArmySelectMenuScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySelectMenuScene' });
    },

    preload: function()
    {

    },


    create: function()
    {
        let x_origin = this.cameras.main.centerX	
        let y_origin = this.cameras.main.centerY	

        this.add.grid(
            x_origin, y_origin, 
            config.width,// + (gameFunctions.cardSize * 2), 
            config.height,// + (gameFunctions.cardSize * 2), 
            50, 
            50, 
            0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle(0x000000);
            
            
        let startOption = this.add.text((config.width / 2) - 300, 100, "Please Select Your Army", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);

    },

    update: function (time, delta)
    {

                    
    }
});
