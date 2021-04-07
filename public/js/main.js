
gameFunctions = []
gameFunctions.btn_sprite = [];


gameFunctions.config = {
    type: Phaser.AUTO,
    // width: gameFunctions.config.cardSize * gameFunctions.config.tableWidth, //800,
	// height: gameFunctions.config.cardSize * gameFunctions.config.tableHeight, //600,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
	
	parent: 'gameContainer',
    dom: {
        createContainer: true
    },	
	
    scale: {
          
        mode: Phaser.Scale.FIT,
      },
      scene: [ GameScene ]  
    // scene: [ MainMenuScene, ArmySelectMenuScene, GameScene, ArmySetupUIScene ]     
};

gameFunctions.game = new Phaser.Game(gameFunctions.config);