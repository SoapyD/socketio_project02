const passport = require("passport");
const User = require("../models/user");
const utils = require("../utils");


exports.getLanding = (req, res) => {
	res.render("landing");
}


exports.getFormRegisterUser = (req,res)=> {
	res.render("register");
}

exports.getFormLoginUser = (req,res) => {
	res.render("login");		
}


exports.createSelfUser = (req,res) => {

	// CHECK TO SEE IF THE USERNAME ALREADY EXISTS
	User.findOne({username: req.body.username}, function(err, user){
	
		if (err){
			req.flash("error", err.message);
			return res.redirect("/register")
		}		
		if(user) {
			req.flash("error", "Username already exists, please select a new one");
			return res.redirect("/register")			
		}

		User.register(
			new User({username: req.body.username, role:req.body.role}), req.body.password, function(err, user){
				if (err){
					// console.log(err)
					req.flash("error", err.message);
					return res.redirect("/register")
				}
				else{
					passport.authenticate("local")(req,res,function(){
						req.flash("success", "Welcome to Site " + user.username);
						res.redirect("/")
					})
				}
			});
	});
}

exports.loginUser = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
})


exports.logoutUser = (req,res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
}


exports.getRoom = async(req,res) => {

	let data = {
		address: process.env.SOCKET_ADDRESS,
		instance_type: process.env.INSTANCE_TYPE,
	}

	//CREATE ROOM IF THIS IS A DEV INSTANCE
	switch(process.env.INSTANCE_TYPE){
		case "DEV":
			let options = {
				user: "6069bd7bc7b18a43c84292b4", //a user id we can user as an author
				user_name: "test",
				players: 1, //max players
				room_name: "test room",
				password: ""

			}
			let room = await utils.queries.createRoom(options, "network.socket.id")

			let army = await utils.queries.getArmy({name: "Test"})

			room.forces[0].side = 0;
			room.forces[0].start = 0;
			room.forces[0].army = army[0]._id; //test army reference

			// room.forces[1].side = 1;			
			// room.forces[1].start = 1;
			// room.forces[1].army = 'Test';

			let armies = await utils.queries.getArmies({forces: room.forces})

			room.save();

			data.room = room;
			data.armies = armies;
			break;
	}


	res.render("room", data);
}



