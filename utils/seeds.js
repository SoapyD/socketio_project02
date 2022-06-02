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

    {model: "DynamicRoute"},    
    {model: "Faction"},
    {model: "Squad"} ,
    {model: "Upgrade"},
    {model: "SpecialRule"}, 
    {model: "Barrier"},      

    {model: "Unit"},
    {model: "Gun"},
    {model: "Melee"},
    {model: "Armour"},  
    ]

    await queries.removeData(list);
    await exports.createDynamicRoutes();

    await exports.createUnits();
    await exports.createBarriers();    
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

    //  #####  ######  #######    #    ####### #######       ######  ####### #     # ####### #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #     #    #    #       #     # 
    // #       #     # #        #   #     #    #             #     # #     # #     #    #    #       #       
    // #       ######  #####   #     #    #    #####   ##### ######  #     # #     #    #    #####    #####  
    // #       #   #   #       #######    #    #             #   #   #     # #     #    #    #             # 
    // #     # #    #  #       #     #    #    #             #    #  #     # #     #    #    #       #     # 
    //  #####  #     # ####### #     #    #    #######       #     # #######  #####     #    #######  #####  

    exports.createDynamicRoutes = async() => {

        list = {
            model: 'DynamicRoute'
            ,params:
        [
            {
                model: 'Error',
                description: 'return a list of all recent server and client logged errors',
                sort: '{"created_date": "desc"}',
                index:[
                    {
                        column_width: 10,
                        column_name: 'Class',
                        value: ['class'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Function',
                        value: ['class'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Created_Date',
                        value: ['created_date'],
                        element_type: 'date',
                        readonly: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Detail',
                        value: ['detail'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Error',
                        value: ['e','message'],
                        readonly: 1
                    },
                    {
                        column_width: 40,
                        column_name: 'Stack',
                        value: ['e','stack'],
                        readonly: 1
                    }                                                 
                ] 
            },
            {
                model: 'Faction',
                description: 'return a list of all current factions',
                sub_data: ['Squad'],
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Naming',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Description',
                        value: ['description'],
                        element_type: 'textarea',
                        startrow: 1,
                        endrow: 1                
                    },
                    {
                        column_width: 20,
                        column_name: 'Squads',
                        value: ['squads'],
                        foreach: ['name'],
                        sub_data: 'Squad',
                        header: 'Composition',
                        startrow: 1,
                        endrow: 1 
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        readonly: 1,
                        startrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        readonly: 1,
                        endrow: 1 
                    }      
                ]     
            },
            {
                model: 'Squad',
                description: 'return a list of all current squads',
                sub_data: ['Unit','Gun','Melee','Armour','Upgrade','SpecialRule'],
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name and Size',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Min_Size',
                        edit_field_width: 2,
                        value: ['min_size']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Size',
                        value: ['max_size'],
                        edit_field_width: 2,
                        endrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Cost_Per_Unit',
                        value: ['cost_per_unit'],
                        header: 'Definition',
                        edit_field_width: 2,
                        startrow: 1,
                        endrow: 1,
                        readonly: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Unit',
                        sub_data: 'Unit',                
                        value: ['unit','name'],
                        startrow: 1,
                        element_type: 'select',
                    },
                    {
                        column_width: 10,
                        column_name: 'Gun',
                        sub_data: 'Gun',                
                        value: ['gun','name'],
                        element_type: 'select',                
                    },
                    {
                        column_width: 10,
                        column_name: 'Melee',
                        sub_data: 'Melee',                
                        value: ['melee','name'],
                        element_type: 'select',                
                    },
                    {
                        column_width: 10,
                        column_name: 'Armour',
                        sub_data: 'Armour',
                        value: ['armour','name'],
                        element_type: 'select',                
                        endrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Upgrades',
                        value: ['upgrades'],
                        foreach: ['name'],
                        sub_data: 'Upgrade',             
                        header: 'Upgrades and Special Rules',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Special_Rules',
                        value: ['special_rules'],
                        foreach: ['name'],          
                        sub_data: 'SpecialRule',
                        endrow: 1
                    }                                                      
                ]            
            },        
            {
                model: 'Unit',
                description: 'return a list of all current units',
                editable: 1,        
                index:[
                    {
                        column_width: 15,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Cost',
                        value: ['cost'],
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Shooting_Bonus',
                        value: ['shooting_bonus'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Fighting_Bonus',
                        value: ['fighting_bonus']
                    },
                    {
                        column_width: 5,
                        column_name: 'Health',
                        value: ['health']
                    },
                    {
                        column_width: 5,
                        column_name: 'Movement',
                        value: ['movement']
                    },
                    {
                        column_width: 5,
                        column_name: 'Cohesion',
                        value: ['cohesion']
                    },
                    {
                        column_width: 5,
                        column_name: 'Size',
                        value: ['size'],
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Sprite_Offset',
                        value: ['sprite_offset'],
                        header: 'Assets',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Spritesheet',
                        value: ['spritesheet']
                    },
                    {
                        column_width: 5,
                        column_name: 'Death-SFX',
                        value: ['death_sfx']
                    },
                    {
                        column_width: 10,
                        column_name: 'Symbol_ID',
                        value: ['symbol_id'],
                        endrow: 1
                    },
        
                    {
                        column_width: 10,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1
                    },            
                    {
                        column_width: 10,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1
                    }                                                            
                ]         
            },       
            {
                model: 'Gun',
                description: 'return a list of all current guns',
                sub_data: ['Barrier'],
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Range',
                        value: ['range']
                    },
                    {
                        column_width: 10,
                        column_name: 'Damage',
                        value: ['damage']
                    },
                    {
                        column_width: 10,
                        column_name: 'Amour_Piercing',
                        value: ['ap']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Targets',
                        value: ['max_targets']
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Radius',
                        value: ['blast_radius'],
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Spritesheet',
                        value: ['blast_spritesheet'],
                        header: 'Assets',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Barrier',
                        value: ['barrier','name'],
                        header: 'Barriers',
                        sub_data: 'Barrier',
                        element_type: 'select',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1,                
                    },
                    {
                        column_width: 10,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1,
                    }                                                      
                ]         
            },
            {
                model: 'Melee',
                description: 'return a list of all current melee weapons',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Range',
                        value: ['range']
                    },
                    {
                        column_width: 10,
                        column_name: 'Damage',
                        value: ['damage']
                    },
                    {
                        column_width: 10,
                        column_name: 'Amour_Piercing',
                        value: ['ap']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Targets',
                        value: ['max_targets'],
                        endrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1
                    }                                                      
                ]         
            },
            {
                model: 'Armour',
                description: 'return a list of all current armour',
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Value',
                        value: ['value'],
                        endrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        readonly: 1,
                        startrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        readonly: 1,
                        endrow: 1
                    }                                                      
                ]         
            },
            {
                model: 'Upgrade',
                description: 'return a list of all current upgrades',
                sub_data: ['Unit','Gun'],
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 30,
                        column_name: 'Description',
                        value: ['description'],
                        startrow: 1,
                        endrow: 1,                
                    },            
                    {
                        column_width: 10,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1,            
                    },
                    {
                        column_width: 10,
                        column_name: 'Upgrade_All',
                        value: ['upgrades_all_in_squad'],
                        endrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Unit',
                        value: ['unit','name'],
                        sub_data: 'Unit',
                        element_type: 'select',
                        header: 'Joins',
                        startrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Gun',
                        value: ['gun','name'],
                        sub_data: 'Gun',     
                        element_type: 'select',           
                        endrow: 1
                    }                                                        
                ]         
            },    
            {
                model: 'Barrier',
                description: 'return a list of all current barriers',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Descripion',
                        value: ['description'],
                        element_type: 'textarea',
                        startrow: 1,
                        endrow: 1,                
                    },
                    {
                        column_width: 10,
                        column_name: 'Life',
                        value: ['life'],
                        header: 'Stats',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Effects',
                        value: ['effects'],
                        startrow: 1,
                        endrow: 1,                
                    },            
                    {
                        column_width: 10,
                        column_name: 'Blast_Radius',
                        value: ['blast_radius'],
                        header: 'Assets',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Sprite',
                        value: ['blast_sprite'],
                        endrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1,
                    },
                    {
                        column_width: 15,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1,                
                    }                                                      
                ]         
            },
            {
                model: 'SpecialRule',
                description: 'return a list of all current special rules',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Descripion',
                        value: ['description'],
                        startrow: 1,
                        endrow: 1,
                        element_type: 'textarea'                
                    },                                                  
                ]         
            },    
            ]
        }
        return Promise.all([queries.createData(list)]);
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

    //  #####  ######  #######    #    ####### #######       ######     #    ######  ######  ### ####### ######   #####  
    // #     # #     # #         # #      #    #             #     #   # #   #     # #     #  #  #       #     # #     # 
    // #       #     # #        #   #     #    #             #     #  #   #  #     # #     #  #  #       #     # #       
    // #       ######  #####   #     #    #    #####   ##### ######  #     # ######  ######   #  #####   ######   #####  
    // #       #   #   #       #######    #    #             #     # ####### #   #   #   #    #  #       #   #         # 
    // #     # #    #  #       #     #    #    #             #     # #     # #    #  #    #   #  #       #    #  #     # 
    //  #####  #     # ####### #     #    #    #######       ######  #     # #     # #     # ### ####### #     #  #####  

    exports.createBarriers = async() => {

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

	let return_data = await queries.findData({
		model: "Barrier"
		,search_type: "findOne"
		,params: {name: "blunt"}
	})    

    list.params.push(
        {
            name: "shield generator",
            cost: 100,
            range: 8 * range,
            damage: 0,
            ap: 0,               
            max_targets: 1,
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
            cost: 100,
            range: 16 * range,
            damage: 1,
            ap: 0,               
            max_targets: 1,
            blast_radius: 3,
            blast_spritesheet: "explosion",
            barrier: return_data[0]._id
        }   
    )    

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
		,params: {name: "rocket launcher"}
	})    

	let unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: {name: "heavy"}
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
		,params: {name: "shield generator"}
    })    
	unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: {name: "special"}
	})      

    cost = return_data[0].cost + unit_data[0].cost

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "shield generator",
                description:"outfit one trooper with a shield generator",
                cost: return_data[0].cost,
                unit: unit_data[0]._id,
                gun: return_data[0]._id,
            },
        ]
    }
    await queries.createData(list);     


    return_data = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: {name: "rad cannon"}
    })    
	unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: {name: "heavy"}
	})      

    cost = return_data[0].cost + unit_data[0].cost

    list = {
        model: "Upgrade"
        ,params: [
           {
                name: "rad cannon",
                description:"outfit one trooper with a rad cannon",
                cost: return_data[0].cost,
                unit: unit_data[0]._id,
                gun: return_data[0]._id,
            },
        ]
    }
    await queries.createData(list);  



    return_data = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: {name: "plasma"}
    })    
	unit_data = await queries.findData({
		model: "Unit"
		,search_type: "findOne"
		,params: {name: "special"}
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
           { //done
                name: "swift",
                description:"unit can charge even if they've shot their weapon",
            },
            { //done
                name: "sword dance",
                description:"unit can leave combat without suffering opportunity attacks from enemies",
            }, 
            { //done
                name: "firing drills",
                description:"unit that doesn't move can double the number of shots from their ranged weapon",
            }, 
            { //done
                name: "whirling dervish",
                description:"unit adds 4 to their melee armour piercing value the turn they move into combat",
            },
            { //done
                name: "sniper",
                description:"unit adds 4 to their armour piercing value if they don't move before taking the shot",
            },       
            { //done
                name: "berserker",
                description:"unit can double the number of targets from their melee weapon the turn they move into combat",
            },    
            { //done
                name: "regen",
                description:"20% chance of the unit regenerating any lost wounds suffered",
            },  
            { //done
                name: "barrage",
                description:"you may fire a shot with a weapon indirectly",
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
            upgrades: [{params:{name:"rocket launcher"}},{params:{name:"special weapon"}}],
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
                upgrades: [{params:{name:"shield generator"}},{params:{name:"rad cannon"}}],
                special_rules: [{params:{name:"swift"}},{params:{name:"sword dance"}}],
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
		,params: {name: options.unit}
	})     

	gun = await queries.findData({
		model: "Gun"
		,search_type: "findOne"
		,params: {name: options.gun}
	})    
	armour = await queries.findData({
		model: "Armour" 
		,search_type: "findOne"
		,params: {name: options.armour}
    })
	melee = await queries.findData({
		model: "Melee"
		,search_type: "findOne"
		,params: {name: options.melee}
    })
    
    cost = unit[0].cost + gun[0].cost + melee[0].cost + armour[0].cost

	upgrades = await queries.findData({
		model: "Upgrade"
		,search_type: "findOne"
		,multiple_search: options.upgrades
	})      

    upgrade_array = []
    upgrades.forEach((upgrade) => {
        upgrade_array.push(upgrade._id)
    })


	special_rules = await queries.findData({
		model: "SpecialRule"
		,search_type: "findOne"
		,multiple_search: options.special_rules
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
                    {params:{name:"general"}},
                    {params:{name:"heavy squad"}},
                    {params:{name:"tactical squad"}},
                    {params:{name:"scouts"}},
                    {params:{name:"tank"}},   
                    {params:{name:"dread"}},                                        
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
		,multiple_search: options.squads
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