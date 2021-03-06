
const mongoose = require("mongoose");


exports.connect = () => {

	try{
		//setup mongoose connection
		password = process.env.DB_PASS
		dbname = process.env.DB_NAME
		mongoose.connect("mongodb+srv://admin:"+password+"@cluster0.cvy6a.azure.mongodb.net/"+dbname+"?retryWrites=true&w=majority", 
		{ 
			useNewUrlParser: true, 
			useUnifiedTopology: true,
			retryWrites: true
		}
		).then(() => {
			console.log('Connected to DB!');
		}).catch(err => {
			console.log("Error:", err.message);
		})  //will create cat app is it doesn't already exist
	}catch(e){
		console.log("CAN'T CONNECT TO DATABASE")
		console.log(e.d)
	}

}
