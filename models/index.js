const models = {};
models.Room = require("./room");
models.User = require("./user");

models.Unit = require("./unit");
models.Armour = require("./armour");
models.Melee = require("./melee");
models.Gun = require("./gun");

models.Faction = require("./faction");
models.Army = require("./army");
models.Squad = require("./squad");
models.Upgrade = require("./upgrade");
models.SpecialRule = require("./special_rule");
models.Barrier = require("./barrier");

models.Error = require("./error");

module.exports = models