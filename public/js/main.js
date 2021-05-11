
gameFunctions = []
gameFunctions.btn_sprite = [];


gameFunctions.params = {
	player_number: -1
}


gameFunctions.config = {
    type: Phaser.AUTO,
    // width: gameFunctions.config.cardSize * gameFunctions.config.tableWidth, //800,
	// height: gameFunctions.config.cardSize * gameFunctions.config.tableHeight, //600,
    width: 1000,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
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
	// scene: [ MainMenuScene, ArmySelectMenuScene, GameScene, GameUIScene ]  
    // scene: [ MainMenuScene, ArmySelectMenuScene, GameScene, ArmySetupUIScene ]     
};

gameFunctions.game = new Phaser.Game(gameFunctions.config);