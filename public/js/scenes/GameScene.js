

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function()
    {

    },


    create: function()
    {
        // this.input.mouse.disableContextMenu();

        // this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        //     gameFunctions.game.cameras.main.zoom -= (deltaY / 100) * 0.1;

        //     if(gameFunctions.game.cameras.main.zoom <= 0.8){
        //         gameFunctions.game.cameras.main.zoom = 0.8
        //     }	
        //     if(gameFunctions.game.cameras.main.zoom >= 2){
        //         gameFunctions.game.cameras.main.zoom = 2
        //     }	

        // });


        // let x_origin = this.cameras.main.centerX	
        // let y_origin = this.cameras.main.centerY	

        // this.add.grid(
        //     x_origin, y_origin, 
        //     config.width,// + (gameFunctions.cardSize * 2), 
        //     config.height,// + (gameFunctions.cardSize * 2), 
        //     gameFunctions.config.cardSize, 
        //     gameFunctions.config.cardSize, 
        //     0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle(0x000000);


        //Create a camera controller using the arraow keys
        // var cursors = this.input.keyboard.createCursorKeys();

        // var controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     acceleration: 0.04,
        //     drag: 0.0005,
        //     maxSpeed: 0.7
        // };

        // controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        //SET BOUNDS TO THE CAMERA MOVEMENT
        // this.cameras.main.setBounds(
        //     -gameFunctions.config.cardSize, 
        //     -gameFunctions.config.cardSize, 
        //     config.width + (gameFunctions.config.cardSize * 2), 
        //     config.height + (gameFunctions.config.cardSize * 2));
        
    },

    update: function (time, delta)
    {
        // controls.update(delta);

        // // console.log("loop")
        // switch( gameFunctions.config.game_state) {
        //     case 0:
        //     break;
		
        //     default:
        //     // code block
        // }	
                    
    }
});