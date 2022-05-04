
const queriesUtil = require('./queries');

exports.checkTimer = async() => {
    try{
        exports.checkItems("Room", 2)
        exports.checkItems("Error", 48)        
    }    
    catch(err){
        console.log("ERROR TRYING TO RUN TIMER")
        console.log(err)     
    }

    setTimeout(exports.checkTimer, process.env.TIMER_MS);
}


exports.checkItems = async(model, hours) => {

    var cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

	let rooms = await queriesUtil.findData({
		model: model
		,search_type: "find"
		,params: [
            {
                updateddate: {
                    $lt: cutoff
                }
            }
		]
	})

    if(rooms[0]){

        let ids = [];
        rooms[0].forEach((room) => {
            ids.push({_id: room._id})
        })

        if(ids.length > 0){
            let item = await queriesUtil.destroyData({
                model: model
                ,params: ids
            })
        }
    }




}