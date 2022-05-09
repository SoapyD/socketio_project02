

const utils = require("../utils");
const models = require("../models");

const route_info = [
{
    "type": "Error",
    "view": "admin/error/",
    "description": "return a list of all recent server and client logged errors",
    "sort": {created_date: 'desc'}
},
{
    "type": "Faction",
    "view": "admin/faction/",
    "description": "return a list of all current factions",
    "sort": {created_date: 'desc'}
},
{
    "type": "Squad",
    "view": "admin/squad/",
    "description": "return a list of all current squads",
    "sort": {created_date: 'desc'}
},
{
    "type": "Unit",
    "view": "admin/unit/",
    "description": "return a list of all current units",
    "sort": {created_date: 'desc'}
},
{
    "type": "Armour",
    "view": "admin/armour/",
    "description": "return a list of all current armours",
    "sort": {created_date: 'desc'}
},
{
    "type": "Gun",
    "view": "admin/gun/",
    "description": "return a list of all current guns",
    "sort": {created_date: 'desc'}
},
{
    "type": "Melee",
    "view": "admin/melee/",
    "description": "return a list of all current melee weapons",
    "sort": {created_date: 'desc'}
},
{
    "type": "Upgrade",
    "view": "admin/upgrade/",
    "description": "return a list of all current upgrades",
    "sort": {created_date: 'desc'}
},
{
    "type": "SpecialRule",
    "view": "admin/special_rule/",
    "description": "return a list of all current special rules",
    "sort": {created_date: 'desc'}
}
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
        res.render(view, {title:route.type, stylesheet: view, data: data[0]});
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


