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
		
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 25, "move", GameUIScene.activate_movement, callbackParams, gameFunctions.btn_sprite);					
		
		gameFunctions.createButton(this, gameFunctions.config.width - 50, 75, "shoot", GameUIScene.activate_shooting, callbackParams, gameFunctions.btn_sprite);		

		gameFunctions.createButton(this, gameFunctions.config.width - 50, 125, "fight", GameUIScene.activate_movement, callbackParams, gameFunctions.btn_sprite);				

		
		callbackParams = {mode:"move"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 25, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);					
		
		callbackParams = {mode:"shoot"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 75, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);		

		callbackParams = {mode:"fight"};
		gameFunctions.createButton(this, gameFunctions.config.width - 150, 125, "+", GameUIScene.select_mode, callbackParams, gameFunctions.btn_sprite);				
		
		
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


GameUIScene.select_mode = (options) => {
	if(options.mode){
		GameScene.mode = options.mode
	}
}

GameUIScene.activate_movement = () => {
	GameScene.units.forEach((unit) => {
		if(unit.path){
			unit.move();		
		}
	})	
}

GameUIScene.activate_shooting = () => {
	GameScene.units.forEach((unit) => {
		unit.shoot();
	})	
}







