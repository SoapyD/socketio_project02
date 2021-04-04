var ArmySetupUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySetupUIScene' });
    },

    preload: function()
    {

    },

    create: function()
    {
        let startOption = this.add.text((gameFunctions.config.width / 2) - 300, 150, "Setup Army UI", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);
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