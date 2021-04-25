var GameUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'GameUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
    },

    create: function()
    {
		
		let callbackParams = {};
		
		gameFunctions.btn_sprite = [];
		
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "move", GameUIScene.active_movement, callbackParams, gameFunctions.btn_sprite);					
		
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.active_movement, callbackParams, gameFunctions.btn_sprite);		

		gameFunctions.createButton(this, gameFunctions.config.width - 50, 125, "fight", GameUIScene.active_movement, callbackParams, gameFunctions.btn_sprite);				
		
		
		gameFunctions.btn_sprite.forEach(btn => {
			gameFunctions.buttonPress(btn, btn.clickAction, btn.callbackParams);                    
		})		
		
		gameFunctions.current_uiscene = this.scene.get('GameUIScene');
		
		
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


GameUIScene.active_movement = () => {
	GameScene.units.forEach((unit) => {
		if(unit.path){
			unit.move();		
		}
	})	
}


