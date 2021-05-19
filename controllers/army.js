
const Army = require("../models/army");


exports.getAll = (req,res) => {
	//get all products from DB
	res.render("army/index")
	// Product.find({}, function(err, products){
	// 	if(err){
	// 		console.log("Couldn't run 'find' function in product route");
	// 		console.log(err);
	// 	} else{
	// 		res.render("products/index", {products:products});
	// 	}
	// });	
};

// exports.getProduct = (req, res) => { //middleware.isLoggedIn, 
// 	//find product with provided ID

// 	Product.findById(req.params.id).exec(function(err, product){
// 		if(err){
// 			console.log("Couldn't run 'find' function");
// 		} else{
// 			res.render("products/show", {product:product});
// 		}
// 	});		
// };

// exports.getEditProduct = (req,res) => { //, middleware.isCampGroundOwnership

// 	Product.findById(req.params.id).exec(function(err, product){
// 		if(err){
// 			console.log("Couldn't run 'find' function");
// 		} else{
// 			res.render("products/edit", {product:product});
// 		}
// 	});		
// };

// exports.getFormCreateProduct = (req,res) => { //middleware.isLoggedIn, 
// 	res.render("products/new");
// };

// exports.createProduct = (req,res) => { //, middleware.isLoggedIn
	
// 	// let author = {
// 	// 	id: req.user._id,
// 	// 	username: req.user.username
// 	// }
// 	let author = {
// 		id: "5ef4d0322ad3f50b9b181ecA", //5ef4d0322ad3f50b9b181ec3
// 		username: "tom_bombchild@hotmail.com"
// 	}	
	
// 	Product.create ({
// 		name: req.body.name,
// 		image: req.body.image,
// 		description: req.body.description,
// 		cost: req.body.cost,
// 		author: author
// 	}, function(err, product){
// 		if(err){
// 			console.log("Couldn't add product");
// 			console.log(err);
// 		} else{
// 			res.redirect("/products");
// 		}
// 	});	
// };

// exports.updateProduct = (req,res) => { //, middleware.isCampGroundOwnership
	
// 	Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, product){
// 		if(err){
// 			console.log("there was an error trying to find blog")
// 		}
// 		else{
// 			res.redirect("/products/" +req.params.id)
// 		}
// 	})		
// };

// exports.updateStatusProduct = (req,res) => { //, middleware.isCampGroundOwnership
	
// 	// console.log(req.params)
// 	Product.findById(req.params.id).exec(function(err, product){
// 		if(err){
// 			console.log("Couldn't run 'find' function");
// 		} else{

// 			let toggle_state = ''
// 			if (product.active === true)
// 			{
// 				product.active = false;
// 				toggle_state = 'deactivate';
// 			}
// 			else
// 			{
// 				product.active = true;
// 				toggle_state = 'activate';				
// 			}

// 			Pack.find({products: product._id.toString(), active:true}, function(err, packs){
// 				if(err){
// 					console.log("there's been an error returning product list");
// 					console.log(err);
// 				}
// 				else{
// 					// console.log(packs)
// 					if (packs.length > 0 && toggle_state === 'deactivate')
// 					{
// 						let pack_list = "";
// 						let pack_text = "pack"
// 						packs.forEach( function(pack, index){
// 							if (pack_list != "")
// 							{
// 								pack_list += ', '
// 								pack_text = "packs"
// 							}
// 							pack_list += '"' + pack.name + '"'
// 						})
// 						if (pack_list.length > 100){
// 							pack_list = pack_list.substring(1,100)+'...'
// 						}
// 						req.flash("error", "Can't Deactive product as it's included in "+packs.length.toString()+" active "+pack_text+": "+pack_list);
// 						res.redirect("/products/"+req.params.id)	
// 					}
// 					else
// 					{
// 						// console.log("find to deactive product")	
// 						product.save(function(err,product){
// 							if(err){
// 								console.log("there's been an error saving the pack with products");
// 								console.log(err);
// 							}
// 							else{
// 								req.flash("success", 'Sucessfully made "' + product.name + '" '+toggle_state);
// 								res.redirect("/products/")						
// 							}
// 						})										
// 					}
// 				}					
// 			})
// 		}
// 	});	
// };

// exports.deleteProduct = (req,res) => { //, middleware.isCampGroundOwnership
	
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


