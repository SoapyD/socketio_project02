const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

// const User = require("../models/user");


//INDEX - display all
router.get("/", middleware.user_access, controllers.army.getAll)

//CREATE - create new
// router.post("/", middleware.isLoggedIn, controller.create)

//NEW - show form to create new
// router.get("/new", middleware.isLoggedIn, controller.getFormCreate)

//SHOW - show details
// router.get("/:id", middleware.isLoggedIn, controller.getSingle)

//EDIT PRODUCT
// router.get("/:id/edit", middleware.isLoggedIn, controller.getEdit)

//UPDATE PRODUCT
// router.put("/:id", middleware.isLoggedIn, controller.update)

//DESTOY
// router.delete("/:id", middleware.isLoggedIn, controller.delete)


module.exports = router;