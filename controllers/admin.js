

const utils = require("../utils");
const models = require("../models");

const route_info = [
{
    "type": "Error",
    "view": "admin/error/",
    "description": "return a list of all recent server and client logged errors"
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

        let data = await utils.queries.findData({
            model: route.type
            ,search_type: "find"
        })

        let view = route.view + 'index'
        res.render(view, {title:route.type, stylesheet: view, data: data[0]});
    }
    catch(err){
        console.log(err)
        req.flash("error", "There was an error trying to get item data");
        res.redirect("/")        
    }    

    let test = 1
}

//  #####  ####### #######        #####  ### #     #  #####  #       ####### 
// #     # #          #          #     #  #  ##    # #     # #       #       
// #       #          #          #        #  # #   # #       #       #       
// #  #### #####      #    #####  #####   #  #  #  # #  #### #       #####   
// #     # #          #                #  #  #   # # #     # #       #       
// #     # #          #          #     #  #  #    ## #     # #       #       
//  #####  #######    #           #####  ### #     #  #####  ####### #######


