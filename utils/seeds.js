const models = require("../models");
const queries = require("./queries");


exports.resetRooms = async() => {
    let list = [
        {model: "Room"}, 
    ]   
    await queries.removeData(list);   
    console.log("Rooms Reset") 
}

exports.seedDB = async() => {

    //REMOVE ALL DATA FOR MODELS WE WANT TO RESET
    let list = [
    {model: "Room"},
    {model: "Army"},

    {model: "Faction"},
    {model: "Squad"} ,
    {model: "Upgrade"},
    {model: "SpecialRule"},      

    {model: "Unit"},
    {model: "Gun"},
    {model: "Melee"},
    {model: "Armour"},  
    ]

    await queries.removeData(list);


    await exports.createUnits();
    await exports.createGuns();
    await exports.createMelee();
    await exports.createArmour();
    await exports.createUpgrades();  
    await exports.createSpecialRules();    
    
    await exports.createSquads()
    await exports.createFactions()


    console.log("Seeding Complete")

}

let tile_size = 32;


    //  #####  ######  #######    #    ####### #######       #     # #     # ### #######  #####  
    // #     # #     # #         # #      #    #             #     # ##    #  #     #    #     # 
    // #       #     # #        #   #     #    #             #     # # #   #  #     #    #       
    // #       ######  #####   #     #    #    #####   ##### #     # #  #  #  #     #     #####  
    // #       #   #   #       #######    #    #             #     # #   # #  #     #          # 
    // #     # #    #  #       #     #    #    #             #     # #    ##  #     #    #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #     # ###    #     #####  

exports.createUnits = async() => {

    list = {
        model: "Unit"
        ,params: [
           {
                name: 'general',
                cost: 42,
                shooting_bonus: 2,
                fighting_bonus: 2,
                health: 6,
                movement: 6,
                cohesion: 0,

                size: 0,
                sprite_offset: 0.5,
                spritesheet: 'general',
                death_sfx: "death_man", 
                symbol_id: 5,
            },
            {
                name: 'marine',
                cost: 12,
                shooting_bonus: 0,
                fighting_bonus: 0,
                health: 3,
                movement: 6,
                cohesion: 75,

                size: 0,
                sprite_offset: 0.5,
                spritesheet: 'unit',
                death_sfx: "death_man",
                symbol_id: 3,                
            },
            {
                name: 'heavy',
                cost: 12,
                shooting_bonus: 0,
                fighting_bonus: 0,
                health: 3,
                movement: 6,
                cohesion: 75,
                
                size: 0,
                sprite_offset: 0.5,
                spritesheet: 'heavy',
                death_sfx: "death_man",
                symbol_id: 7,
            },
            {
                name: 'special',
                cost: 12,
                shooting_bonus: 0,
                fighting_bonus: 0,
                health: 3,
                movement: 6,
                cohesion: 75,
                
                size: 0,
                sprite_offset: 0.5,
                spritesheet: 'special',
                death_sfx: "death_man",
                symbol_id: 2,                
            },             

            {
                name: 'dread',
                cost: 28,
                shooting_bonus: 2,
                fighting_bonus: 2,
                health: 4,
                movement: 4,
                cohesion: 0,
                
                size: 1,
                sprite_offset: 0,	
                spritesheet: 'dread',
                death_sfx: "death_machine",
                symbol_id: 1,                
            },
            {
                name: 'tank',
                cost: 32,
                shooting_bonus: 2,
                fighting_bonus: 0,
                movement: 4,
                health: 10,
                cohesion: 0,
                
                size: 1,
                sprite_offset: 0.5,	
                spritesheet: 'tank',
                death_sfx: "death_machine",
                symbol_id: 12,                
            },              
            // {
            //     name: 'squad_leader',
            //     cost: 10,
            //     shooting_bonus: 1,
            //     fighting_bonus: 1,
            //     health: 120,
            //     movement: 6,
            //     cohesion: 75,

            //     size: 0,
            //     sprite_offset: 0.5,
            //     spritesheet: 'squad_leader',
            //     death_sfx: "death_man",
            //     symbol_id: 4,
            // },
      
        ]
    }
    return Promise.all([queries.createData(list)]);

}


    //  #####  ######  #######    #    ####### #######        #####  #     # #     #  #####  
    // #     # #     # #         # #      #    #             #     # #     # ##    # #     # 
    // #       #     # #        #   #     #    #             #       #     # # #   # #       
    // #       ######  #####   #     #    #    #####   ##### #  #### #     # #  #  #  #####  
    // #       #   #   #       #######    #    #             #     # #     # #   # #       # 
    // #     # #    #  #       #     #    #    #             #     # #     # #    ## #     # 
    //  #####  #     # ####### #     #    #    #######        #####   #####  #     #  ##### 

exports.createGuns = async() => {

    let range = tile_size

    list = {
        model: "Gun"
        ,params: [
           {
                name: "bolter",
                cost: 56,
                range: 10 * range,
                damage: 1,
                ap: 2,
                max_targets: 1,
                blast_radius: 1,
                blast_spritesheet: "explosion",
            },   
            {
                name: "plasma",
                cost: 100,
                range: 8 * range,
                damage: 2,
                ap: 2,               
                max_targets: 1,
                blast_radius: 3,
                blast_spritesheet: "special_blast",
            },
            {
                name: "rocket launcher",
                cost: 106,
                range: 16 * range,
                damage: 1,
                ap: 0,                
                max_targets: 1,
                blast_radius: 6,
                blast_spritesheet: "heavy_blast",
            }, 
            {
                name: "heavy stubber",
                cost: 98,
                range: 30 * range,
                damage: 1,
                ap: 3,
                max_targets: 3,
                blast_radius: 1,
                blast_spritesheet: "explosion",
            },                     
        ]
    }

    return Promise.all([queries.createData(list)]);
}


//  #####  ######  #######    #    ####### #######       #     # ####### #       ####### ####### 
// #     # #     # #         # #      #    #             ##   ## #       #       #       #       
// #       #     # #        #   #     #    #             # # # # #       #       #       #       
// #       ######  #####   #     #    #    #####   ##### #  #  # #####   #       #####   #####   
// #       #   #   #       #######    #    #             #     # #       #       #       #       
// #     # #    #  #       #     #    #    #             #     # #       #       #       #       
//  #####  #     # ####### #     #    #    #######       #     # ####### ####### ####### ####### 

exports.createMelee = async() => {

    let range = (tile_size * 2)-(tile_size / 2)
    
    list = {
        model: "Melee"
        ,params: [
           {
                name: "sword",
                cost: 11,
                damage: 1,
                ap: 1,
                max_targets: 1,
                range: range * 1
            },
            {
                name: "none",
                cost: 0,
                damage: 0,
                ap: 0,
                max_targets : 0,
                range: range * 1
            },
            {
                name: "power fist",
                cost: 19,
                damage: 2,
                ap: 2,
                max_targets : 3,
                range: range * 1
            },            
        ]
    }
    return Promise.all([queries.createData(list)]);
}

    //  #####  ######  #######    #    ####### #######          #    ######  #     # ####### #     # ######  
    // #     # #     # #         # #      #    #               # #   #     # ##   ## #     # #     # #     # 
    // #       #     # #        #   #     #    #              #   #  #     # # # # # #     # #     # #     # 
    // #       ######  #####   #     #    #    #####   ##### #     # ######  #  #  # #     # #     # ######  
    // #       #   #   #       #######    #    #             ####### #   #   #     # #     # #     # #   #   
    // #     # #    #  #       #     #    #    #             #     # #    #  #     # #     # #     # #    #  
    //  #####  #     # ####### #     #    #    #######       #     # #     # #     # #######  #####  #     # 
exports.createArmour = async() => {
    list = {
        model: "Armour"
        ,params: [
           {
                name: "basic",
                cost: 20,
                value: 10,
            },
            {
                name: "heavy",
                cost: 30,
                value: 15,
            },
        ]
    }
    return Promise.all([queries.createData(list)]);
}




    //  #####  ######  #######    #    ####### #######       #     # ######   #####  ######     #    ######  #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #     # #     #   # #   #     # #       #     # 
    // #       #     # #        #   #     #    #             #     # #     # #       #     #  #   #  #     # #       #       
    // #       ######  #####   #     #    #    #####   ##### #     # ######  #  #### ######  #     # #     # #####    #####  
    // #       #   #   #       #######    #    #             #     # #       #     # #   #   ####### #     # #             # 
    // #     # #    #  #       #     #    #    #             #     # #       #     # #    #  #     # #     # #       #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #        #####  #     # #     # ######  #######  #####  

exports.createUpgrades = async() => {
	let return_data = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: [
			{name: "rocket launcher"}
		]
	})    

	let unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: [
			{name: "heavy"}
		]
	})  

    let cost = return_data[0].cost + unit_data[0].cost

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "rocket launcher",
                description:"outfit one trooper with a rocket launcher",
                cost: cost,
                unit: unit_data[0]._id,
                gun: return_data[0]._id,
                // melee: melee[0]._id,
                // armour: armour[0]._id,
            },
        ]
    }
    await queries.createData(list);   


    return_data = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: [
			{name: "plasma"}
		]
    })    
	unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: [
			{name: "special"}
		]
	})      

    cost = return_data[0].cost + unit_data[0].cost

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "special weapon",
                description:"outfit one trooper with a plasma weapon",
                cost: return_data[0].cost,
                unit: unit_data[0]._id,
                gun: return_data[0]._id,
                // melee: melee[0]._id,
                // armour: armour[0]._id,
            },
        ]
    }
    
    // return_data = await queries.findData({
	// 	model: "Gun"
	// 	,search_type: "findOne"
	// 	,params: [
	// 		{name: "plasma"}
	// 	]
	// })    

    // list = {
    //     model: "Upgrade"
    //     ,params: [
    //        {
    //             name: "special weapon",
    //             description:"outfit one trooper with a special weapon",
    //             upgrades_all_in_squad: true,
    //             cost: return_data[0].cost,
    //             // unit: unit[0]._id,
    //             gun: return_data[0]._id,
    //             // melee: melee[0]._id,
    //             // armour: armour[0]._id,
    //         },
    //     ]
    // }
    return Promise.all([queries.createData(list)]); 
}


    //  #####  ######  #######    #    ####### #######        #####  ######  #######  #####  ###    #    #             ######  #     # #       #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #       #     #  #    # #   #             #     # #     # #       #       #     # 
    // #       #     # #        #   #     #    #             #       #     # #       #        #   #   #  #             #     # #     # #       #       #       
    // #       ######  #####   #     #    #    #####   #####  #####  ######  #####   #        #  #     # #       ##### ######  #     # #       #####    #####  
    // #       #   #   #       #######    #    #                   # #       #       #        #  ####### #             #   #   #     # #       #             # 
    // #     # #    #  #       #     #    #    #             #     # #       #       #     #  #  #     # #             #    #  #     # #       #       #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #       #######  #####  ### #     # #######       #     #  #####  ####### #######  #####  


exports.createSpecialRules = async() => {

    list = {
        model: "SpecialRule"
        ,params: [
           {
                name: "swift",
                description:"unit can charge even if they've shot their weapon",
            },
            {
                name: "sword dance",
                description:"unit can leave combat without suffering opportunity attacks from enemies",
            },            
        ]
    }

    return Promise.all([queries.createData(list)]); 
}



    //  #####  ######  #######    #    ####### #######        #####   #####  #     #    #    ######   #####  
    // #     # #     # #         # #      #    #             #     # #     # #     #   # #   #     # #     # 
    // #       #     # #        #   #     #    #             #       #     # #     #  #   #  #     # #       
    // #       ######  #####   #     #    #    #####   #####  #####  #     # #     # #     # #     #  #####  
    // #       #   #   #       #######    #    #                   # #   # # #     # ####### #     #       # 
    // #     # #    #  #       #     #    #    #             #     # #    #  #     # #     # #     # #     # 
    //  #####  #     # ####### #     #    #    #######        #####   #### #  #####  #     # ######   #####  

exports.createSquads = async() => {

    return Promise.all([
        exports.createSquad(
            {
                type: "general",
                unit: "general",
                gun: "bolter",
                armour: "basic",
                melee: "sword",
                upgrades: [],
                special_rules: [],                
                min_size: 1,
                max_size: 1,
            }
        ),
        exports.createSquad(
        {
            type: "tactical squad",
            unit: "marine",
            gun: "bolter",
            armour: "basic",
            melee: "sword",
            upgrades: [{name:"rocket launcher"},{name:"special weapon"}],
            special_rules: [],            
            min_size: 5,
            max_size: 10,
        }
        ),
        exports.createSquad(
            {
                type: "heavy squad",
                unit: "marine",
                gun: "rocket launcher",
                armour: "basic",
                melee: "none",
                upgrades: [],
                special_rules: [],                
                min_size: 3,
                max_size: 5,
            }
        ),
        exports.createSquad(
            {
                type: "tank",
                unit: "tank",
                gun: "rocket launcher",
                armour: "heavy",
                melee: "none",
                upgrades: [],
                special_rules: [],                
                min_size: 1,
                max_size: 1,
            }
        ), 
        exports.createSquad(
            {
                type: "dread",
                unit: "dread",
                gun: "heavy stubber",
                armour: "heavy",
                melee: "power fist",
                upgrades: [],
                special_rules: [],
                min_size: 1,
                max_size: 1,
            }
        ),
        exports.createSquad(
            {
                type: "scouts",
                unit: "marine",
                gun: "bolter",
                armour: "basic",
                melee: "sword",
                upgrades: [],
                special_rules: [{name:"swift"},{name:"sword dance"}],
                min_size: 5,
                max_size: 10,
            }
        ),        
        
    ]);    
}

exports.createSquad = async(options) => {

    //Create Squad
    let unit;
    let gun;
    let armour;
    let melee;
    let cost = 0;
    let upgrades;
    let upgrade_array = [];

	unit = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: [
			{name: options.unit}
		]
	})     

	gun = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: [
			{name: options.gun}
		]
	})    
	armour = await queries.findData({
		model: "Armour"
		,search_type: "findOne"
		,params: [
			{name: options.armour}
		]
    })
	melee = await queries.findData({
		model: "Melee"
		,search_type: "findOne"
		,params: [
			{name: options.melee}
		]
    })
    
    cost = unit[0].cost + gun[0].cost + melee[0].cost + armour[0].cost

	upgrades = await queries.findData({
		model: "Upgrade"
		,search_type: "findOne"
		,params: options.upgrades
	})      

    upgrade_array = []
    upgrades.forEach((upgrade) => {
        upgrade_array.push(upgrade._id)
    })


	special_rules = await queries.findData({
		model: "SpecialRule"
		,search_type: "findOne"
		,params: options.special_rules
	})      

    special_rules_array = []
    special_rules.forEach((rule) => {
        special_rules_array.push(rule._id)
    })

    list = {
        model: "Squad"
        ,params: [
           {
                name: options.type,
                min_size: options.min_size,
                max_size: options.max_size,
                unit: unit[0]._id,
                gun: gun[0]._id,
                melee: melee[0]._id,
                armour: armour[0]._id,
                cost_per_unit: cost,
                upgrades: upgrade_array,
                special_rules: special_rules_array,                
            },
        ]
    }
    return Promise.all([queries.createData(list)])    

}


//  #####  ######  #######    #    ####### #######       #######    #     #####  ####### ### ####### #     #  #####  
// #     # #     # #         # #      #    #             #         # #   #     #    #     #  #     # ##    # #     # 
// #       #     # #        #   #     #    #             #        #   #  #          #     #  #     # # #   # #       
// #       ######  #####   #     #    #    #####   ##### #####   #     # #          #     #  #     # #  #  #  #####  
// #       #   #   #       #######    #    #             #       ####### #          #     #  #     # #   # #       # 
// #     # #    #  #       #     #    #    #             #       #     # #     #    #     #  #     # #    ## #     # 
//  #####  #     # ####### #     #    #    #######       #       #     #  #####     #    ### ####### #     #  #####  


exports.createFactions = async() => {


    return Promise.all([
        exports.createFaction(
            {
                name: "space marines",
                description: "big, burley, bruising murder men",
                squads: [
                    {name:"general"},
                    {name:"heavy squad"},
                    {name:"tactical squad"},
                    {name:"scouts"},
                    {name:"tank"},   
                    {name:"dread"},                                        
                ],
            }
        ),
        // exports.createFaction(
        //     {
        //         name: "Test",
        //         description: "test force",
        //         squads: [{name:"heavy squad"}],
        //     }
        // ),        
        ]);

}

exports.createFaction = async(options) => {

	let squads = await queries.findData({
		model: "Squad"
		,search_type: "find"
		,params: options.squads
	})   

    let squad_array = []
    squads.forEach((squad) => {
        squad_array.push(squad[0]._id)
    })

    let list = {
        model: "Faction"
        ,params: [
           {
                name: options.name,
                description: options.description,
                squads: squad_array,
            },
        ]
    }
    return Promise.all([queries.createData(list)])   

}