
const models = require("../models");
const utils = require("../utils");

//  #####  ####### #######          #    #       #       
// #     # #          #            # #   #       #       
// #       #          #           #   #  #       #       
// #  #### #####      #    ##### #     # #       #       
// #     # #          #          ####### #       #       
// #     # #          #          #     # #       #       
//  #####  #######    #          #     # ####### ####### 
                                                      

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


//  #####  ####### #######        #####  ### #     #  #####  #       ####### 
// #     # #          #          #     #  #  ##    # #     # #       #       
// #       #          #          #        #  # #   # #       #       #       
// #  #### #####      #    #####  #####   #  #  #  # #  #### #       #####   
// #     # #          #                #  #  #   # # #     # #       #       
// #     # #          #          #     #  #  #    ## #     # #       #       
//  #####  #######    #           #####  ### #     #  #####  ####### #######

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

//  #####  ####### #######       ####### ######  ### ####### 
// #     # #          #          #       #     #  #     #    
// #       #          #          #       #     #  #     #    
// #  #### #####      #    ##### #####   #     #  #     #    
// #     # #          #          #       #     #  #     #    
// #     # #          #          #       #     #  #     #    
//  #####  #######    #          ####### ######  ###    #  

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

//  #####  ####### #######       ####### ####### ######  #     #        #####  ######  #######    #    ####### ####### 
// #     # #          #          #       #     # #     # ##   ##       #     # #     # #         # #      #    #       
// #       #          #          #       #     # #     # # # # #       #       #     # #        #   #     #    #       
// #  #### #####      #    ##### #####   #     # ######  #  #  # ##### #       ######  #####   #     #    #    #####   
// #     # #          #          #       #     # #   #   #     #       #       #   #   #       #######    #    #       
// #     # #          #          #       #     # #    #  #     #       #     # #    #  #       #     #    #    #       
//  #####  #######    #          #       ####### #     # #     #        #####  #     # ####### #     #    #    ####### 

exports.getFormCreate = (req,res) => { 
	res.render("army/new");
};

//  #####  ######  #######    #    ####### ####### 
// #     # #     # #         # #      #    #       
// #       #     # #        #   #     #    #       
// #       ######  #####   #     #    #    #####   
// #       #   #   #       #######    #    #       
// #     # #    #  #       #     #    #    #       
//  #####  #     # ####### #     #    #    ####### 

exports.create = async(req,res) => {
	
	if(req.user){

		let author = {
			id: req.user._id,
			username: req.user.username
		}		

		req.body.params.author = author
	}

	
	let item = await utils.queries.createData({
		model: "Army"
		,params: [
			req.body.params
		]
	})

	res.redirect("/army/"+ item[0]._id)  	

};

// #     # ######  ######     #    ####### ####### 
// #     # #     # #     #   # #      #    #       
// #     # #     # #     #  #   #     #    #       
// #     # ######  #     # #     #    #    #####   
// #     # #       #     # #######    #    #       
// #     # #       #     # #     #    #    #       
//  #####  #       ######  #     #    #    ####### 

exports.update = async(req,res) => {
	
	let id = req.params.id;

	let item = await utils.queries.findData({
		model: "Army"
		,search_type: "findOne"
		,params: [
			{_id: id}
		]
	})

	await utils.queries.updateData(item[0], {
		model: "Army"
		,params: [
			req.body.params
		]
	})

	res.redirect("/army/" +req.params.id)	
};

// ######  ####### #       ####### ####### ####### 
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// #     # #####   #       #####      #    #####   
// #     # #       #       #          #    #       
// #     # #       #       #          #    #       
// ######  ####### ####### #######    #    ####### 


exports.delete = async(req,res) => {

	let id = req.params.id;

	let item = await utils.queries.destroyData({
		model: "Army"
		,params: [
			{_id: id}
		]
	})

	res.redirect("/army/")		
};


