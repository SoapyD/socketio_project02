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
    
    await exports.createSquads()
    await exports.createFactions()


    console.log("Seeding Complete")

}



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
                cost: 10,
                spritesheet: 'general',
                sprite_offset: 0.5,
                size: 0,
                cohesion: 0,
                health: 160,
                movement: 6,
                death_sfx: "death_man", 
                shooting_bonus: -2,
                fighting_bonus: -2,
                symbol_id: 5,
            },
            {
                name: 'squad_leader',
                cost: 10,
                spritesheet: 'squad_leader',
                sprite_offset: 0.5,
                size: 0,
                cohesion: 75,
                health: 120,
                movement: 6,
                death_sfx: "death_man",
                
                shooting_bonus: -1,
                fighting_bonus: -1,
                symbol_id: 4,
            },
            {
                name: 'heavy',
                cost: 10,
                spritesheet: 'heavy',
                sprite_offset: 0.5,
                size: 0,
                cohesion: 75,
                health: 100,
                movement: 6,
                death_sfx: "death_man",
                
                shooting_bonus: -2,
                fighting_bonus: 1,
                symbol_id: 7,
            },
            {
                name: 'special',
                cost: 10,
                spritesheet: 'special',
                sprite_offset: 0.5,
                size: 0,
                cohesion: 75,
                health: 100,
                movement: 6,
                death_sfx: "death_man",
                
                shooting_bonus: -1,
                fighting_bonus: 0,
                symbol_id: 2,                
            },
            {
                name: 'marine',
                cost: 10,
                spritesheet: 'unit',
                sprite_offset: 0.5,
                size: 0,
                cohesion: 75,
                health: 100,
                movement: 6,
                death_sfx: "death_man",
                shooting_bonus: 0,
                fighting_bonus: 0,
                symbol_id: 3,                
            },
            {
                name: 'dread',
                cost: 10,
                spritesheet: 'dread',
                sprite_offset: 0,	
                size: 1,
                cohesion: 0,
                health: 200,
                movement: 10,
                death_sfx: "death_machine",
                shooting_bonus: -1,
                fighting_bonus: -2,
                symbol_id: 1,                
            },
            {
                name: 'tank',
                cost: 10,
                spritesheet: 'tank',
                sprite_offset: 0.5,	
                size: 1,
                cohesion: 0,
                health: 200,
                movement: 14,
                death_sfx: "death_machine",
                shooting_bonus: 0,
                fighting_bonus: -2,
                symbol_id: 12,                
            },         
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


    list = {
        model: "Gun"
        ,params: [
           {
                name: "bolter",
                cost: 10,
                range: 400,
                damage: 20,
                ap: 4,
                max_targets: 2,
                blast_spritesheet: "explosion",
                blast_radius: 1,
            },
            {
                name: "plasma",
                cost: 10,
                range: 300,
                damage: 60,
                ap: 6,               
                max_targets: 1,
                blast_spritesheet: "special_blast",
                blast_radius: 3,
            },
            {
                name: "heavy",
                cost: 10,
                range: 500,
                damage: 40,
                ap: 2,                
                max_targets: 1,
                blast_spritesheet: "heavy_blast",
                blast_radius: 6,
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

    
    let tile_size = 32;
    let range = (tile_size * 2)-(tile_size / 2)
    
    
    list = {
        model: "Melee"
        ,params: [
           {
                name: "sword",
                cost: 10,
                damage: 20,
                ap: 2,
                max_targets: 2,
                range: range
            },
            {
                name: "none",
                cost: 10,
                damage: 0,
                ap: 0,
                max_targets : 0,
                range: 0
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
                cost: 10,
                value: 10,
            },
            {
                name: "heavy",
                cost: 10,
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
			{name: "heavy"}
		]
	})    

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "heavy weapon",
                description:"outfit one trooper with a heavy weapon",
                cost: return_data[0].cost,
                // unit: unit[0]._id,
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

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "special weapon",
                description:"outfit one trooper with a special weapon",
                upgrades_all_in_squad: true,
                cost: return_data[0].cost,
                // unit: unit[0]._id,
                gun: return_data[0]._id,
                // melee: melee[0]._id,
                // armour: armour[0]._id,
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
            type: "tactical squad",
            unit: "marine",
            gun: "bolter",
            armour: "basic",
            melee: "sword",
            upgrades: [{name:"heavy weapon"},{name:"special weapon"}],
            min_size: 5,
            max_size: 10,
        }
    ),
    exports.createSquad(
        {
            type: "heavy squad",
            unit: "marine",
            gun: "heavy",
            armour: "basic",
            melee: "none",
            upgrades: [{name:"heavy weapon"}],
            min_size: 3,
            max_size: 5,
        }
    ),
    exports.createSquad(
        {
            type: "tank",
            unit: "tank",
            gun: "heavy",
            armour: "heavy",
            melee: "none",
            // upgrades: [{name:"heavy weapon"}],
            min_size: 1,
            max_size: 1,
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

	upgrades = await queries.findData({
		model: "Upgrade"
		,search_type: "findOne"
		,params: options.upgrades
	})      

    upgrade_array = []
    upgrades.forEach((upgrade) => {
        upgrade_array.push(upgrade._id)
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
                upgrades: upgrade_array,
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
                    {name:"heavy squad"},
                    {name:"tactical squad"},
                    {name:"tank"},                    
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