
const models = require("../../models");
const queries = require("../queries");

    //  #####  ######  #######    #    ####### #######       ######     #    ######  ######  ### ####### ######   #####  
    // #     # #     # #         # #      #    #             #     #   # #   #     # #     #  #  #       #     # #     # 
    // #       #     # #        #   #     #    #             #     #  #   #  #     # #     #  #  #       #     # #       
    // #       ######  #####   #     #    #    #####   ##### ######  #     # ######  ######   #  #####   ######   #####  
    // #       #   #   #       #######    #    #             #     # ####### #   #   #   #    #  #       #   #         # 
    // #     # #    #  #       #     #    #    #             #     # #     # #    #  #    #   #  #       #    #  #     # 
    //  #####  #     # ####### #     #    #    #######       ######  #     # #     # #     # ### ####### #     #  #####  

    exports.run = async() => {

        list = {
            model: "Barrier"
            ,params: [
               {
                    name: "poison",
                    description:"poison any unit that passes through the cloud",
                    blast_radius: 3,
                    blast_sprite: "smoke",
                    effects: ["poison"],
                    // modifier: 20 - ((20 /100) * 20), //TOTAL 20% CHANCE OF POISON HITTING
                    life: 3
                },
                {
                    name: "blunt",
                    description:"blunt the effectiveness of any projectile that passes through the barrier",
                    blast_radius: 3,
                    blast_sprite: "barrier",
                    effects: ["blunt"],
                    // modifier: 20 - ((20 /100) * 20), //TOTAL 20% EFFECT on AP      
                    life: 3                    
                },            
            ]
        }
    
        return Promise.all([queries.createData(list)]); 
    }