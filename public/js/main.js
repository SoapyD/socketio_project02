
gameFunctions = []
gameFunctions.btn_sprite = [];
gameFunctions.units = [];
gameFunctions.units_preload = [];
gameFunctions.mode = '';
gameFunctions.current_player = -1;


gameFunctions.params = {
	room_name: "",
	room_id: "",
	player_number: -1,
	max_player: 2
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


switch(instance_type){
	case "DEV":
		gameFunctions.config.scene = [ GameScene, GameUIScene ]
		break;
	case "DEV-ONLINE":
		gameFunctions.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, ArmySetupUIScene, GameScene, GameUIScene]
		break;		
	default:
		gameFunctions.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, ArmySetupUIScene, GameScene, GameUIScene]
		break;
}



gameFunctions.game = new Phaser.Game(gameFunctions.config);

