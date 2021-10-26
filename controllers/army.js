
const models = require("../models");
const utils = require("../utils");

exports.getAll = async(req,res) => {
	//get all products from DB
	let items = await utils.queries.findData({
		model: "Army"
		,search_type: "find"
		// ,params: [
		// 	{name: "test"}
		// ]
	})

	res.render("army/index",{armies: items[0]})
};

exports.getSingle = async(req, res) => {

	let id = req.params.id;

	let item = await utils.queries.findData({
		model: "Army"
		,search_type: "findOne"
		,params: [
			{_id: id}
		]
	})

	res.render("army/show",{army: item[0]})	
};

exports.getEdit = async(req,res) => {

	let id = req.params.id;

	let item = await utils.queries.findData({
		model: "Army"
		,search_type: "findOne"
		,params: [
			{_id: id}
		]
	})

	res.render("army/edit", {army:item[0]});	
};

exports.getFormCreate = (req,res) => { 
	res.render("army/new");
};

exports.create = async(req,res) => {
	
	// let author = {
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	
	let item = await utils.queries.createData({
		model: "Army"
		,params: [
			req.body.params
		]
	})

	res.redirect("/army/"+ item[0]._id)  	

};

// exports.update = (req,res) => { //, middleware.isCampGroundOwnership
	
// 	Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, product){
// 		if(err){
// 			console.log("there was an error trying to find blog")
// 		}
// 		else{
// 			res.redirect("/products/" +req.params.id)
// 		}
// 	})		
// };


// exports.delete = (req,res) => { //, middleware.isCampGroundOwnership
	
// 	Product.findByIdAndDelete(req.params.id, req.body.product, function(err, product){
// 		if(err){
// 			console.log("there was an error trying to find product")
// 		}
// 		else{
// 			req.flash("success", 'Sucessfully deleted "' + product.name + '"');
// 			res.redirect("/products/")
// 		}
// 	})			
// };


