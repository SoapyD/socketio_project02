

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

		// let max_sides = 6;
		// GameScene.unit_collisions = []
		// for(let i=0; i<max_sides; i++){
		// 	GameScene.unit_collisions.push(GameScene.scene.add.group());
		// }

    },


    create: function()
    {
		GameScene.game_setup.loadSound();
		GameScene.game_setup.setupTable();

		GameScene.game_setup.setupSquads();		
	
		/*
		let options = {
			scene: GameScene.scene,
			unit_list: gameFunctions.units,
			forces: gameFunctions.params.forces,
			tile_size: gameFunctions.tile_size
		}
		GameScene.squad_setup = new squad_setup(options)

		//SETUP THE SQUADS IF THE GAME ISN'T BEING LOADED FROM A PREVIOUS SAVE
		if(gameFunctions.units_preload.length === 0){
			GameScene.squad_setup.placeSquads();	
		}else{
			GameScene.squad_setup.reloadSquads();
		}		
		*/
    },

    update: function (time, delta)
    {

		GameScene.game_setup.musicHandler(); 
		GameScene.game_setup.updateMarker(); 
		GameScene.controls.update(delta);

		let worldPoint = GameScene.scene.input.activePointer.positionToCamera(GameScene.scene.cameras.main);

		switch(GameScene.game_state){

			case 0:
				//PLACE UNITS LOOP			
				break;			
			case 1:
				// GameScene.fight_circle = new u_circle({
				// 	x: worldPoint.x,
				// 	y: worldPoint.y,
				// 	r: 0.5
				// });
				gameFunctions.current_uiscene.scene.start("GameUIScene")
				GameScene.game_state++;
				break;			

			case 2:

				GameScene.game_setup.checkUnitClicks();
				GameScene.game_setup.updateElements(worldPoint);
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


