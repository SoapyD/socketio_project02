

const utils = require("../utils");
const models = require("../models");


const route_info = [
    {
        "type": "Error",
        "view": "admin/items/",
        "description": "return a list of all recent server and client logged errors",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Class",
                "value": ["class"]
            },
            {
                "column_width": 10,
                "column_name": "Function",
                "value": ["class"]
            },
            {
                "column_width": 10,
                "column_name": "Created_Date",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 20,
                "column_name": "Detail",
                "value": ["detail"]
            },
            {
                "column_width": 10,
                "column_name": "Error",
                "value": ["e","message"]
            },
            {
                "column_width": 40,
                "column_name": "Stack",
                "value": ["e","stack"]
            }                                                 
        ] 
    },
    {
        "type": "Faction",
        "view": "admin/items/",
        "description": "return a list of all current factions",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 20,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 20,
                "column_name": "Description",
                "value": ["description"]
            },
            {
                "column_width": 20,
                "column_name": "Squads",
                "value": ["squads"],
                "foreach": ["name"]
            },
            {
                "column_width": 20,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 20,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }      
        ]     
    },
    {
        "type": "Squad",
        "view": "admin/items/",
        "description": "return a list of all current squads",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 10,
                "column_name": "Cost_Per_Unit",
                "value": ["cost_per_unit"]
            },
            {
                "column_width": 10,
                "column_name": "Min_Size",
                "value": ["min_size"]
            },
            {
                "column_width": 10,
                "column_name": "Max_Size",
                "value": ["max_size"]
            },
            {
                "column_width": 10,
                "column_name": "Unit",
                "value": ["unit","name"]
            },
            {
                "column_width": 10,
                "column_name": "Gun",
                "value": ["gun","name"]
            },
            {
                "column_width": 10,
                "column_name": "Melee",
                "value": ["melee","name"]
            },
            {
                "column_width": 10,
                "column_name": "Armour",
                "value": ['armour','name']
            },
            {
                "column_width": 10,
                "column_name": "Upgrades",
                "value": ["upgrades"],
                "foreach": ["name"]
            },
            {
                "column_width": 10,
                "column_name": "Special_Rules",
                "value": ["special_rules"],
                "foreach": ["name"]
            }                                                      
        ]            
    },        
    {
        "type": "Unit",
        "view": "admin/items/",
        "description": "return a list of all current units",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 15,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 5,
                "column_name": "Cost",
                "value": ["cost"]
            },
            {
                "column_width": 5,
                "column_name": "Shooting_Bonus",
                "value": ["shooting_bonus"]
            },
            {
                "column_width": 5,
                "column_name": "Fighting_Bonus",
                "value": ["fighting_bonus"]
            },
            {
                "column_width": 5,
                "column_name": "Health",
                "value": ["health"]
            },
            {
                "column_width": 5,
                "column_name": "Movement",
                "value": ["movement"]
            },
            {
                "column_width": 5,
                "column_name": "Cohesion",
                "value": ["cohesion"]
            },
            {
                "column_width": 5,
                "column_name": "Size",
                "value": ["size"]
            },
            {
                "column_width": 5,
                "column_name": "Sprite_Offset",
                "value": ['sprite_offset']
            },
            {
                "column_width": 10,
                "column_name": "Spritesheet",
                "value": ["spritesheet"]
            },
            {
                "column_width": 5,
                "column_name": "Death-SFX",
                "value": ["death_sfx"]
            },
            {
                "column_width": 10,
                "column_name": "Symbol_ID",
                "value": ["symbol_id"]
            },

            {
                "column_width": 10,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },            
            {
                "column_width": 10,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }                                                            
        ]         
    },       
    {
        "type": "Gun",
        "view": "admin/items/",
        "description": "return a list of all current guns",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 5,
                "column_name": "Cost",
                "value": ["cost"]
            },
            {
                "column_width": 5,
                "column_name": "Range",
                "value": ["range"]
            },
            {
                "column_width": 10,
                "column_name": "Damage",
                "value": ["damage"]
            },
            {
                "column_width": 10,
                "column_name": "Amour_Piercing",
                "value": ["ap"]
            },
            {
                "column_width": 10,
                "column_name": "Max_Targets",
                "value": ["max_targets"]
            },
            {
                "column_width": 10,
                "column_name": "Blast_Radius",
                "value": ["blast_radius"]
            },
            {
                "column_width": 10,
                "column_name": "Blast_Spritesheet",
                "value": ["blast_spritesheet"]
            },
            {
                "column_width": 10,
                "column_name": "Barrier",
                "value": ['item','barrier','name']
            },
            {
                "column_width": 10,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 10,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }                                                      
        ]         
    },
    {
        "type": "Melee",
        "view": "admin/items/",
        "description": "return a list of all current melee weapons",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 10,
                "column_name": "Cost",
                "value": ["cost"]
            },
            {
                "column_width": 10,
                "column_name": "Range",
                "value": ["range"]
            },
            {
                "column_width": 10,
                "column_name": "Damage",
                "value": ["damage"]
            },
            {
                "column_width": 10,
                "column_name": "Amour_Piercing",
                "value": ["ap"]
            },
            {
                "column_width": 10,
                "column_name": "Max_Targets",
                "value": ["max_targets"]
            },
            {
                "column_width": 20,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 20,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }                                                      
        ]         
    },
    {
        "type": "Armour",
        "view": "admin/items/",
        "description": "return a list of all current armour",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 20,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 20,
                "column_name": "Cost",
                "value": ["cost"]
            },
            {
                "column_width": 20,
                "column_name": "Value",
                "value": ["value"]
            },
            {
                "column_width": 20,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 20,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }                                                      
        ]         
    },
    {
        "type": "Upgrade",
        "view": "admin/items/",
        "description": "return a list of all current upgrades",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 20,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 10,
                "column_name": "Cost",
                "value": ["cost"]
            },
            {
                "column_width": 30,
                "column_name": "Description",
                "value": ["description"]
            },
            {
                "column_width": 10,
                "column_name": "Upgrade_All",
                "value": ["upgrades_all_in_squad"]
            },
            {
                "column_width": 15,
                "column_name": "Unit",
                "value": ["unit","name"]
            },
            {
                "column_width": 15,
                "column_name": "Gun",
                "value": ["gun","name"]
            }                                                        
        ]         
    },    
    {
        "type": "Barrier",
        "view": "admin/items/",
        "description": "return a list of all current barriers",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 20,
                "column_name": "Descripion",
                "value": ["description"]
            },
            {
                "column_width": 10,
                "column_name": "Life",
                "value": ["life"]
            },
            {
                "column_width": 10,
                "column_name": "Blast_Radius",
                "value": ["blast_radius"]
            },
            {
                "column_width": 10,
                "column_name": "Blast_Sprite",
                "value": ["blast_sprite"]
            },
            {
                "column_width": 10,
                "column_name": "Effects",
                "value": ["effects"]
            },
            {
                "column_width": 15,
                "column_name": "Created",
                "value": ["created_date"],
                "type": "date"
            },
            {
                "column_width": 15,
                "column_name": "Updated",
                "value": ["updateddate"],
                "type": "date"
            }                                                      
        ]         
    },
    {
        "type": "SpecialRule",
        "view": "admin/items/",
        "description": "return a list of all current special rules",
        "sort": {created_date: 'desc'},
        "index":[
            {
                "column_width": 10,
                "column_name": "Name",
                "value": ["name"]
            },
            {
                "column_width": 20,
                "column_name": "Descripion",
                "value": ["description"]
            },                                                  
        ]         
    },    
    ]

//  #####  ####### #######          #    #       #       
// #     # #          #            # #   #       #       
// #       #          #           #   #  #       #       
// #  #### #####      #    ##### #     # #       #       
// #     # #          #          ####### #       #       
// #     # #          #          #     # #       #       
//  #####  #######    #          #     # ####### ####### 
                                                      

exports.getAll = async(req,res) => {

    try{
        let view = "admin/index"
        res.render(view, {title:"Admin", stylesheet: view, route_info: route_info});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get admin data");
        res.redirect("/")        
    }
};

exports.getItem = async(req,res) => {

    try{
        let item = req.params.item;
        let route = route_info[item];

        let params = {
            model: route.type
            ,search_type: "find"
        }
        if(route.sort){
            params.sort = route.sort
        }

        let data = await utils.queries.findData(params)


        let view = route.view + 'index'
        res.render(view, {route_id: item, route:route, stylesheet: view, data: data[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get item data");
        res.redirect("/")        
    }    
}

//  #####  ####### #######        #####  ### #     #  #####  #       ####### 
// #     # #          #          #     #  #  ##    # #     # #       #       
// #       #          #          #        #  # #   # #       #       #       
// #  #### #####      #    #####  #####   #  #  #  # #  #### #       #####   
// #     # #          #                #  #  #   # # #     # #       #       
// #     # #          #          #     #  #  #    ## #     # #       #       
//  #####  #######    #           #####  ### #     #  #####  ####### #######


