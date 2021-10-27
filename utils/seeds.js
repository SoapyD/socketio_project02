const models = require("../models");
const queries = require("./queries");

exports.seedDB = async() => {

    //REMOVE ALL DATA FOR MODELS WE WANT TO RESET
    let list = [
    {model: "Room"}
    ,{model: "Army"}
    ,{model: "Unit"}
    ,{model: "Gun"}
    ,{model: "Melee"}
    ,{model: "Armour"}   
    ,{model: "Squad"}    
    ]

    await queries.removeData(list);

    //CREATE UNITS
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
    await queries.createData(list);



    //CREATE GUNS
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
    await queries.createData(list);

    let tile_size = 32;
    let range = (tile_size * 2)-(tile_size / 2)

    //CREATE MELEE
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
    await queries.createData(list);


    //CREATE ARMOUR
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
    await queries.createData(list);


    //UPGRADES

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
                cost: return_data[0].cost,
                // unit: unit[0]._id,
                gun: return_data[0]._id,
                // melee: melee[0]._id,
                // armour: armour[0]._id,
            },
        ]
    }
    await queries.createData(list);   






    //Create Squad



	let unit = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: [
			{name: "marine"}
		]
	})     

	let gun = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: [
			{name: "bolter"}
		]
	})    
	let armour = await queries.findData({
		model: "Armour"
		,search_type: "findOne"
		,params: [
			{name: "basic"}
		]
    })
	let melee = await queries.findData({
		model: "Melee"
		,search_type: "findOne"
		,params: [
			{name: "sword"}
		]
	})    

	let upgrades = await queries.findData({
		model: "Upgrade"
		,search_type: "findOne"
		,params: [
            {name: "heavy weapon"},
            {name: "special weapon"}
		]
	})      

    let upgrade_array = []
    upgrades.forEach((upgrade) => {
        upgrade_array.push(upgrade._id)
    })

    list = {
        model: "Squad"
        ,params: [
           {
                name: "tactical squad",
                min_size: 5,
                max_size: 10,
                unit: unit[0]._id,
                gun: gun[0]._id,
                melee: melee[0]._id,
                armour: armour[0]._id,
                available_upgrades: upgrade_array,
            },
        ]
    }
    await queries.createData(list);      

    // let params = {}
    // let info  = await queries.getSquads(params)


    console.log("Seeding Complete")

}

