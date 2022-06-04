const models = require("../../models");
const queries = require("../queries");


exports.resetRooms = async() => {
    let list = [
        {model: "Room"}, 
    ]   
    await queries.removeData(list);   
    console.log("Rooms Reset") 
}

exports.resetTables = async() => {

    
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
}