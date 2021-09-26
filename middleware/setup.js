const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require("passport");

const controllers = require('../controllers');
const routes = require("../routes");
const utils = require("../utils");

const strategies = require('./strategies')

exports.setupApp = async(app) => {
    //setup sessions
    app.use(require("express-session")({
        secret: process.env.SESSION_SECRET, //used to encode and decode sessions
        resave: false,
        saveUninitialized: false
        }));
    app.use(passport.initialize());
    app.use(passport.session());
    

    //setup app
    app.set("view engine", "ejs"); //set ejs as the view engine
    app.use(bodyParser.urlencoded({ extended: true })); //setup body parser so it can read url parameters
    app.use(bodyParser.json()); //allow the app to read json input into the body


    app.use(express.static(__dirname + "/../public")); //setup a public folder for js and css
    app.use(methodOverride("_method")); //setup means of changing POST methods to DELETE and PUT methods
    app.use(flash()); //setup flash messages  

    //setup user authentication and password serialization and deserialization
    strategies.local.setup();

    //setup the local variables
    app.use(function(req, res, next){
        res.locals.user = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");	
        next();
    })



// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self' "
//     +";style-src-elem 'self' "
//     +"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
//     +";script-src-elem 'self' "    
//     +"https://code.jquery.com/jquery-2.2.4.min.js "
//     +"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js " 
//     +"https://cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.min.js "

//     +";img-src * 'self' data:"
//     +";font-src * 'self' "
//   );
//   next();
// });    


    //automatically setup routes along route paths
    for (const [key, value] of Object.entries(routes)) {
        app.use(routes[key].path,routes[key]);
    }   
    app.use(controllers.error.get404);


    //CONNECT TO DATABASE
    utils.database.connect();
    // utils.seeds.seedDB();

}