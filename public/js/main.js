
errorHandler = new error_handler();
gameFunctions = []
gameFunctions.btn_sprite = [];
gameFunctions.units = [];
gameFunctions.units_preload = [];
gameFunctions.mode = '';
// gameFunctions.current_player = -1;
gameFunctions.current_side = -1;
gameFunctions.mode_state = 0;
// gameFunctions.mode_state_max = 9;
gameFunctions.tile_size = 32;

gameFunctions.params = {
	room_name: "",
	room_id: "",
	// user_name: "",
	users: [],
	forces: [],
	player_number: -1,
	player_side: -1,
	max_players: 2,
	max_sides: 2,
	readied_players: 0,
	turn_number: 0,
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
	
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //   },
    // scene: [ GameScene, GameUIScene ]
	// scene: [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, ArmySetupUIScene, GameScene, GameUIScene ]  
    // scene: [ MainMenuScene, ArmySelectMenuScene, GameScene, ArmySetupUIScene ]     
};


switch(instance_type){
	case "DEV":
		gameFunctions.config.scene = [ GameScene, ArmySetupUIScene, GameUIScene ]
		// gameFunctions.config.scene = [ GameScene, ArmySetupUIScene ]
		break;
	case "DEV-ONLINE":
		gameFunctions.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
		break;		
	default:
		gameFunctions.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
		break;
}



gameFunctions.game = new Phaser.Game(gameFunctions.config);

