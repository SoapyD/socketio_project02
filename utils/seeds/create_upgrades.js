
const models = require("../../models");
const queries = require("../queries");

    //  #####  ######  #######    #    ####### #######       #     # ######   #####  ######     #    ######  #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #     # #     #   # #   #     # #       #     # 
    // #       #     # #        #   #     #    #             #     # #     # #       #     #  #   #  #     # #       #       
    // #       ######  #####   #     #    #    #####   ##### #     # ######  #  #### ######  #     # #     # #####    #####  
    // #       #   #   #       #######    #    #             #     # #       #     # #   #   ####### #     # #             # 
    // #     # #    #  #       #     #    #    #             #     # #       #     # #    #  #     # #     # #       #     # 
    //  #####  #     # ####### #     #    #    #######        #####  #        #####  #     # #     # ######  #######  #####  

    exports.run = async() => {
        let return_data = await queries.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "rocket launcher"}
        })    
    
        let cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "rocket launcher",
                    description:"outfit one trooper with a rocket launcher",
                    cost: cost,
                    gun: return_data[0]._id,
                },
            ]
        }
        await queries.createData(list);   
    
    


        /*
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
        
        */

        
        return Promise.all([queries.createData(list)]); 
    }