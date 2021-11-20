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

        ArmySetupUIScene.state = -1;
        ArmySetupUIScene.state_max = 1;
        ArmySetupUIScene.unit_id = -1;
    },

    create: function()
    {
        let startOption = this.add.text((gameFunctions.config.width / 2) - 300, 150, "Setup Army UI", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);
			
		ArmySetupUIScene.scene = this.scene.get('ArmySetupUIScene')
		gameFunctions.current_uiscene = this.scene.get('ArmySetupUIScene');

        ArmySetupUIScene.loadSingleButton(this)
        gameFunctions.btn_sprite[0].updateText("Finish Placement")	

        ArmySetupUIScene.setupHUD();
        ArmySetupUIScene.runAdvanceMode();
    },

    update: function (time, delta)
    {
        // switch( gameFunctions.config.game_state) {
        //     case 0:

        //     break;

        //     default:
        //     // code block
        // }	                 

        let current_unit;
        // var worldPoint = GameScene.scene.input.activePointer.positionToCamera(GameScene.scene.cameras.main);
        if(ArmySetupUIScene.unit_id !== -1){
            current_unit = gameFunctions.units[ArmySetupUIScene.unit_id];
            current_unit.alive = true;
            // if(current_unit.alive === false){
            current_unit.sprite.x = GameScene.marker.x + (gameFunctions.tile_size /  2);
            current_unit.sprite.y = GameScene.marker.y + (gameFunctions.tile_size / 2);
            current_unit.updateElements(current_unit.sprite)     
            
            current_unit.sprite_ghost.x = GameScene.marker.x + (gameFunctions.tile_size /  2);
            current_unit.sprite_ghost.y = GameScene.marker.y + (gameFunctions.tile_size / 2);
            current_unit.updateElements(current_unit.sprite_ghost)
            
            if(current_unit.cohesion > 0){
                current_unit.cohesionCheck();
            }                
            // }
        }

        if(GameScene.left_click === true){
            if(current_unit){
                // current_unit.alive = true;
                // if(current_unit.cohesion > 0){
                //     current_unit.cohesionCheck();
                // }
                if(current_unit.cohesion_check === true){
                    ArmySetupUIScene.runAdvanceMode();
                }
            }
        }

        GameScene.left_click = false;

    }
});



// ██       ██████   █████  ██████        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██      
// ██      ██    ██ ███████ ██   ██ █████ ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██ 
// ███████  ██████  ██   ██ ██████        ██████   ██████     ██       ██     ██████  ██   ████ ███████ 

ArmySetupUIScene.loadSingleButton = (scene) => {
	let callbackParams;
	let options;
	
	options = {
		scene: scene, 
		x: gameFunctions.config.width,
		y: 25,
		height: 50,
		width: 250,
		label:  "+",
		clickAction: ArmySetupUIScene.advanceMode,
		callbackParams: callbackParams,
		array: gameFunctions.btn_sprite
	}
	
	gameFunctions.btn_sprite.push(new button(options))

}


//  #####  ####### ####### #     # ######        #     # #     # ######  
// #     # #          #    #     # #     #       #     # #     # #     # 
// #       #          #    #     # #     #       #     # #     # #     # 
//  #####  #####      #    #     # ######  ##### ####### #     # #     # 
// 	     # #          #    #     # #             #     # #     # #     # 
// #     # #          #    #     # #             #     # #     # #     # 
//  #####  #######    #     #####  #             #     #  #####  ######  

ArmySetupUIScene.setupHUD = () => {

    let hud_width = 200;

    
    ArmySetupUIScene.hud_item = new hud({
        scene: ArmySetupUIScene.scene,
        // grid: true,

        x: 2, y: 2,
        x_itts: 6, y_itts: 4,
        x_indent: 10, y_indent: 6,			
        width: hud_width, height: 50,

        fill_colour: 0xe6ffff,
        fill_alpha: 0.9,
        radius: { tl: 0, tr: 12, bl: 12, br: 12 },
        border: {
            width: 4,
            colour: 000000,
            alpha: 1
        },
        text: [
            {id: 'Title',label: 'Army Setup', x: 0, y: 0, height: 3},
            // {id: 'c_Turn',label: gameFunctions.params.turn_number, x: 3, y: 0, box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 2, height: 3}},				
        ]
    });

    if(gameFunctions.params.forces){
        ArmySetupUIScene.forces_hud = {};
        gameFunctions.params.forces.forEach((force, i) => {
        // for (let i=0;i<4;i++){
        // let i = 0

            let colour = GameScene.game_setup.getSideColour(force.side)
            let width = 100;

            ArmySetupUIScene.forces_hud[i] = {}
            ArmySetupUIScene.forces_hud[i]["header"] =
                new hud({
                    scene: ArmySetupUIScene.scene,
                    // grid: true,
        
                    x: (i*width)+(hud_width * 1) + 2, y: 2,
                    x_itts: 4, y_itts: 4,
                    x_indent: 0, y_indent: 0,			
                    width: width, height: 50,
        
                    fill_colour: colour.colour,
                    fill_alpha: 0.9,
                    radius: 0,
                    border: {
                        width: 4,
                        colour: 000000,
                        alpha: 1
                    },
                    text: [
                        {id: i,label: force.user.username, x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 18}},
                    ]
                })

                ArmySetupUIScene.forces_hud[i]["footer"] =
                new hud({
                    scene: ArmySetupUIScene.scene,
                    // grid: true,
        
                    x: (i*width)+(hud_width * 1) + 2, y: 50+2,
                    x_itts: 4, y_itts: 4,
                    x_indent: 0, y_indent: 0,			
                    width: width, height: 25,
        
                    colour: colour,
                    fill_colour: colour.colour,
                    fill_alpha: 0.9,
                    radius: 0,
                    border: {
                        width: 4,
                        colour: 000000,
                        alpha: 1
                    },
                    text: [
                        {id: i,label: '', x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 12}},
                    ]
                })					
        
                ArmySetupUIScene.forces_hud[i]["footer"].setVisible(false);
        // }
        })

        ArmySetupUIScene.setAllWaitingHUD();
    }
}

ArmySetupUIScene.setForcesHUD = (i, text, is_visible, is_gray) => {
    if(ArmySetupUIScene.forces_hud){
        let element = ArmySetupUIScene.forces_hud[i]["footer"]
        element.setText(i,text)
        element.setVisible(is_visible);
        element.setGray(is_gray)
    }
}

ArmySetupUIScene.setAllWaitingHUD = () => {
    gameFunctions.params.forces.forEach((force, i) => {
        if(force.side === gameFunctions.current_side){
            ArmySetupUIScene.setForcesHUD(i, "unready", true, true)
        }else{
            ArmySetupUIScene.setForcesHUD(i, "unready", false, true)
        }
    })
}


// ███    ███  ██████  ██████  ███████       ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  
// ████  ████ ██    ██ ██   ██ ██            ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ 
// ██ ████ ██ ██    ██ ██   ██ █████   █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  
// ██  ██  ██ ██    ██ ██   ██ ██            ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██ 
// ██      ██  ██████  ██████  ███████       ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ 

ArmySetupUIScene.runAdvanceMode = () => {
	ArmySetupUIScene.state++;
	if(ArmySetupUIScene.state > ArmySetupUIScene.state_max){
		ArmySetupUIScene.state = 0;
	}
	
	ArmySetupUIScene.advanceMode()	
}

ArmySetupUIScene.advanceMode = () => {
	let options = {}
	// let btn;
	let activated = false;
	switch(ArmySetupUIScene.state){
		case 0:
			//GET THE ID OF THE NEXT UNIT TO SETUP
            ArmySetupUIScene.unit_id = -1
			gameFunctions.units.forEach((unit) => {

                if(unit.player === gameFunctions.params.player_number && unit.alive === false && ArmySetupUIScene.unit_id === -1){
                    ArmySetupUIScene.unit_id = unit.id;
                }
            })
            
			ArmySetupUIScene.state++;
			break;
        case 1:
            //WAITING FOR UNIT TO BE PLACED
            break;
    }
}

