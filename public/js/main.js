
gameFunctions = []
gameFunctions.btn_sprite = [];


gameFunctions.params = {
	player_number: -1
}


gameFunctions.config = {
    // type: Phaser.AUTO,
    // width: gameFunctions.config.cardSize * gameFunctions.config.tableWidth, //800,
	// height: gameFunctions.config.cardSize * gameFunctions.config.tableHeight, //600,
    // width: 1000,
    // height: 640,
	  width: window.innerWidth * window.devicePixelRatio,
	  height: window.innerHeight * window.devicePixelRatio,	
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
	
	parent: 'gameContainer',
    dom: {
        createContainer: true
    },	
	
    scale: {
          
        mode: Phaser.Scale.FIT,
      },
    // scene: [ GameScene, GameUIScene ]
	// scene: [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, ArmySetupUIScene, GameScene, GameUIScene ]  
    // scene: [ MainMenuScene, ArmySelectMenuScene, GameScene, ArmySetupUIScene ]     
};

if(instance_type === "DEV"){
	gameFunctions.config.scene = [ GameScene, GameUIScene ]
}
else{
	gameFunctions.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, ArmySetupUIScene, GameScene, GameUIScene]
}


gameFunctions.game = new Phaser.Game(gameFunctions.config);

