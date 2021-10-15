var ArmySetupUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySetupUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
	
    },

    create: function()
    {
        let startOption = this.add.text((gameFunctions.config.width / 2) - 300, 150, "Setup Army UI", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);
		
		// let callbackParams = {
        //     functionGroup: "socketFunctions",  
        //     function: "messageAll",
		// 	message: "end setup",
        //     returnFunctionGroup: "connFunctions",  
        //     returnFunction: "uiSceneTransition",		
		// };
		
		// gameFunctions.btn_sprite = [];
		
		// gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "end setup", connFunctions.messageServer, callbackParams, gameFunctions.btn_sprite);					
		
		// gameFunctions.btn_sprite.forEach(btn => {
		// 	gameFunctions.buttonPress(btn, btn.clickAction, btn.callbackParams);                    
		// })		
		
        let options = {
            scene: scene, 
            x: gameFunctions.config.width - 50,
            y: 25,
            height: 50,
            width: 100,
            label:  "end setup",
            clickAction: connFunctions.messageServer,
            callbackParams: {
                    functionGroup: "socketFunctions",  
                    function: "messageAll",
                	message: "end setup",
                    returnFunctionGroup: "connFunctions",  
                    returnFunction: "uiSceneTransition",		
            },
            array: gameFunctions.btn_sprite,
            // sprite: "buttons"
        }
        gameFunctions.btn_sprite.push(new button(options))
		
		
		
		gameFunctions.current_uiscene = this.scene.get('ArmySetupUIScene');
		
		
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