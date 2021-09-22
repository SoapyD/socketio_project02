const express = require("express");
const router = express.Router();

const controllers = require('../controllers');
const middleware = require("../middleware");


router.get("/", controllers.admin.getLanding)

router.get("/register", controllers.admin.getFormRegisterUser)

router.post("/register", controllers.admin.createSelfUser)

router.get("/login", controllers.admin.getFormLoginUser)

router.post("/login", controllers.admin.loginUser)

router.get("/logout", controllers.admin.logoutUser)

router.get("/room", middleware.user_access, controllers.admin.getRoom)



module.exports = router;