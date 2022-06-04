
const models = require("../../models");
const queries = require("../queries");

    //  #####  ######  #######    #    ####### #######        #####  #     # #     #  #####  
    // #     # #     # #         # #      #    #             #     # #     # ##    # #     # 
    // #       #     # #        #   #     #    #             #       #     # # #   # #       
    // #       ######  #####   #     #    #    #####   ##### #  #### #     # #  #  #  #####  
    // #       #   #   #       #######    #    #             #     # #     # #   # #       # 
    // #     # #    #  #       #     #    #    #             #     # #     # #    ## #     # 
    //  #####  #     # ####### #     #    #    #######        #####   #####  #     #  ##### 

    exports.run = async() => {

        let tile_size = 32;
        let range = tile_size
    
        list = {
            model: "Gun"
            ,params: [
                //REGULAR WEAPONS
                {
                    name: "pistol",
                    cost: 4,
                    range: 5 * range,
                    damage: 1,
                    ap: 0,
                    max_targets: 1,
                    blast_radius: 1,
                    blast_spritesheet: "explosion",
                },                
                {
                    name: "blaster",
                    cost: 4,
                    range: 10 * range,
                    damage: 1,
                    ap: 0,
                    max_targets: 1,
                    blast_radius: 1,
                    blast_spritesheet: "explosion",
                },
                
                //SPECIAL WEAPONS
                {
                    name: "plasma gun",
                    cost: 20,
                    range: 8 * range,
                    damage: 2,
                    ap: 2,               
                    max_targets: 1,
                    blast_radius: 3,
                    blast_spritesheet: "special_blast",
                },



                //HEAVY WEAPONS
                {
                    name: "rocket launcher",
                    cost: 21,
                    range: 15 * range,
                    damage: 1,
                    ap: 1,                
                    max_targets: 1,
                    blast_radius: 6,
                    blast_spritesheet: "heavy_blast",
                }, 
                {
                    name: "assault cannon",
                    cost: 8,
                    range: 10 * range,
                    damage: 1,
                    ap: 0,
                    max_targets: 3,
                    blast_radius: 1,
                    blast_spritesheet: "explosion",
                },                 
                {
                    name: "laser cannon",
                    cost: 18,
                    range: 20 * range,
                    damage: 4,
                    ap: 4,
                    max_targets: 1,
                    blast_radius: 1,
                    blast_spritesheet: "explosion",
                },                  

            ]
        }
    
        let return_data = await queries.findData({
            model: "Barrier"
            ,search_type: "findOne"
            ,params: {name: "blunt"}
        })    
    
        list.params.push(
            {
                name: "shield generator",
                cost: 5,
                range: 8 * range,
                damage: 0,
                ap: 0,               
                max_targets: 2,
                blast_radius: 3,
                blast_spritesheet: "special_blast",
                barrier: return_data[0]._id
            }    
        )
    
        return_data = await queries.findData({
            model: "Barrier"
            ,search_type: "findOne"
            ,params: {name: "poison"}
        })    
    
        list.params.push(
            {
                name: "rad cannon",
                cost: 16,
                range: 15 * range,
                damage: 1,
                ap: 2,               
                max_targets: 1,
                blast_radius: 3,
                blast_spritesheet: "explosion",
                barrier: return_data[0]._id
            }   
        )    
    
        return Promise.all([queries.createData(list)]);
    }