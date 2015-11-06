var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RegistryRoleSchema = new Schema({
  id:   { type: String },
  name: { type: String }
});

module.exports = mongoose.model("RegistryRole", RegistryRoleSchema);