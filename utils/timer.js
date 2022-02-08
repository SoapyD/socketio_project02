
const queriesUtil = require('./queries');

exports.checkTimer = async() => {
    try{
        exports.checkRooms()
    }    
    catch(err){
        console.log("ERROR TRYING TO RUN TIMER")
        console.log(err)     
    }

    setTimeout(exports.checkTimer, process.env.TIMER_MS);
}


exports.checkRooms = async() => {

    var cutoff = new Date();
    // cutoff.setDate(cutoff.getDate()-5);
    // cutoff.setMinutes(cutoff.getMinutes() - 5);
    cutoff.setHours(cutoff.getHours() - 1);

	let rooms = await queriesUtil.findData({
		model: "Room"
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
                model: "Room"
                ,params: ids
            })
        }
    }




}