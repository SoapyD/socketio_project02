const models = require("../models");

exports.seedDB = () => {
   //Remove all rooms
   models.Room.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("removed rooms!");
        }	   
    }); 

    models.Army.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("removed armies!");
        }	   
    }); 

}