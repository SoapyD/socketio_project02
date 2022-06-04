
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

        await exports.heavy_weapons();



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


    exports.heavy_weapons = async() => {
        let return_data;
        let cost;

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        return_data = await queries.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "rocket launcher"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "rocket launcher",
                    description:"outfit one trooper with a rocket launcher",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_rocket"
                },
            ]
        }
        await queries.createData(list);   
    
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        return_data = await queries.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "laser cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "laser cannon",
                    description:"outfit one trooper with a laser cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_laser_cannon"
                },
            ]
        }
        await queries.createData(list);
        
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////                

        return_data = await queries.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "assault cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "assault cannon",
                    description:"outfit one trooper with a assault cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_assault_cannon"
                },
            ]
        }
        await queries.createData(list);

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////                

        return_data = await queries.findData({
            model: "Gun"
            ,search_type: "findOne"
            ,params: {name: "rad cannon"}
        })    
    
        cost = return_data[0].cost
    
        list = {
            model: "Upgrade"
            ,params: [
               {
                    name: "rad cannon",
                    description:"outfit one trooper with a rad cannon",
                    cost: cost,
                    gun: return_data[0]._id,
                    spritesheet: "trooper_rad_cannon"
                },
            ]
        }
        await queries.createData(list);


        // return Promise.all([queries.createData(list)]);
    }