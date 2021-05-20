
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

// exports.getSingle = (req, res) => { //middleware.isLoggedIn, 
// 	//find product with provided ID

// 	Product.findById(req.params.id).exec(function(err, product){
// 		if(err){
// 			console.log("Couldn't run 'find' function");
// 		} else{
// 			res.render("products/show", {product:product});
// 		}
// 	});		
// };

// exports.getEdit = (req,res) => { //, middleware.isCampGroundOwnership

// 	Product.findById(req.params.id).exec(function(err, product){
// 		if(err){
// 			console.log("Couldn't run 'find' function");
// 		} else{
// 			res.render("products/edit", {product:product});
// 		}
// 	});		
// };

// exports.getFormCreate = (req,res) => { //middleware.isLoggedIn, 
// 	res.render("products/new");
// };

// exports.create = (req,res) => { //, middleware.isLoggedIn
	
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


