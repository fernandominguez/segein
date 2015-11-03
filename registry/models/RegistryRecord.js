var mongoose = require("mongoose"),

Schema = mongoose.Schema;

var RegistryRecordSchema = new Schema({
  number:       { type: Number },
  date:         { type: Date },
  type:         { type: String, enum: ["Entrada", "Salida"] },
  source:       { type: String },
  destination:  { type: String },
  text:         { type: String }
});

module.exports = mongoose.model("RegistryRecord", RegistryRecordSchema);