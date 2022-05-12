const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

//INDEX
router.get("/", middleware.user_access, controllers.admin.getAll);

//SHOW
router.get("/:item", middleware.user_access, controllers.admin.getSingle)

//EDIT
router.get("/:item/:id/edit", middleware.user_access, controllers.admin.getEdit)

//UPDATE
// router.put("/:clientid", middleware.user_access, controllers.admin.updateParent)
// router.put("/:clientid/:item/multiple", middleware.user_access, controllers.admin.updateMultipleChildren)

//CREATE
// router.post("/:clientid/:item", middleware.user_access, controllers.admin.create)

//NEW
// router.get("/:clientid/:item/new", middleware.user_access, controllers.admin.getFormCreate)


/*

//DESTOY
router.delete("/:reportid", middleware.user_access, controllers.reports.deleteReport)
*/

module.exports = router;