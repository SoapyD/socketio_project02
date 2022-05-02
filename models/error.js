const mongoose = require("mongoose");


const errorSchema = new mongoose.Schema({
	class: String
	,function: String
	,e: String
    ,created_date: {type: Date, default: Date.now}
});


module.exports = mongoose.model("error", errorSchema);