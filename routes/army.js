const express = require("express");
const router = express.Router();
const controller = require('../controllers/army');
const middleware = require("../middleware");

// const User = require("../models/user");


//INDEX - display all
router.get("/", middleware.isLoggedIn, controller.getAll)

//CREATE - create new
// router.post("/", middleware.isLoggedIn, controller.create)

//NEW - show form to create new
// router.get("/new", middleware.isLoggedIn, controller.getFormCreate)

//SHOW - show details
// router.get("/:id", middleware.isLoggedIn, controller.get)

//EDIT PRODUCT
// router.get("/:id/edit", middleware.isLoggedIn, controller.getEdit)

//UPDATE PRODUCT
// router.put("/:id", middleware.isLoggedIn, controller.update)

//DESTOY
// router.delete("/:id", middleware.isLoggedIn, controller.delete)


module.exports = router;