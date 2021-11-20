

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function()
    {		

		GameScene.scene = this.scene.get('GameScene')
		gameFunctions.current_scene = this.scene.get('GameScene');

		GameScene.loading_screen = new loading_screen({scene: GameScene.scene, launch_uiscene: "ArmySetupUIScene"}) //GameUIScene
		GameScene.game_setup = new game_setup({scene: GameScene.scene, scene_container: GameScene})

    },


    create: function()
    {
		GameScene.game_setup.loadSound();
		GameScene.game_setup.setupTable();

		GameScene.game_setup.setupSquads();		
    },

    update: function (time, delta)
    {

		GameScene.game_setup.musicHandler(); 
		GameScene.game_setup.updateMarker(); 
		GameScene.controls.update(delta);
		
		switch(GameScene.game_state){

			case 0:
				//PLACE UNITS LOOP
				break;			

			case 1:

				
				GameScene.game_state++;
				break;
			case 2:
				GameScene.game_setup.checkUnitClicks();
				GameScene.game_setup.updateElements();
				GameScene.pathfinder.update();

				break;
		}


	}
});



// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 



GameScene.resetTempSprites = () => {
	// console.log(live_tiles)
	if (!GameScene.scene.temp_sprites){
		GameScene.scene.temp_sprites = [];
	}
	else{
		GameScene.scene.temp_sprites.forEach((sprite) => {
			sprite.destroy();
		})
	}		
}

GameScene.showMessage = (text) => {
	let options = {
		scene: GameScene.scene,
		pos: {
			x: GameScene.rectangle.x,
			y: GameScene.rectangle.y
		},
		text: text
	}
	new popup(options)	
}


