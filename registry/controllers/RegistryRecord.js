//File: registry/controllers/RegistryRecord.js
var mongoose = require("mongoose");

var RegistryRecord = mongoose.model("RegistryRecord");

//GET - Return all registryRecords in the DB
exports.findAllRegistryRecords = function(req, res) {
  RegistryRecord.find(function(err, registryRecords) {
    if(err) { return res.send(500, err.message); }

    console.log("GET /registro/");
    res.status(200).jsonp(registryRecords);
  });
};

//GET - Return a RegistryRecord with specified ID
exports.findById = function(req, res) {
  RegistryRecord.findById(req.params.id, function(err, registryRecord) {
    if(err) { return res.send(500, err.message); }

    console.log("GET /registro/"+req.params.id);
    res.status(200).jsonp(registryRecord);
  });
};

// POST - Insert a new RegistryRecord in the DB
exports.addRegistryRecord = function(req, res) {
  console.log("POST");
  console.log(req.body);

  var registryRecord = new RegistryRecord({
    number:       req.body.number,
    date:         req.body.date,
    type:         req.body.type,
    source:       req.body.source,
    destination:  req.body.destination,
    text:         req.body.text
  });

  registryRecord.save(function(err, registryRecord) {
    if(err) { return res.send(500, err.message); }
    res.status(200).jsonp(registryRecord);
  });
};

// PUT - Update a RegistryRecord already exists
exports.updateRegistryRecord = function(req, res) {
  RegistryRecord.findById(req.params.id, function(err, registryRecord) {
    registryRecord.number       = req.body.number;
    registryRecord.date         = req.body.date;
    registryRecord.type         = req.body.type;
    registryRecord.source       = req.body.source;
    registryRecord.destination  = req.body.destination;
    registryRecord.text         = req.body.text;

    registryRecord.save(function(err) {
      if(err) { return res.send(500, err.message); }
      res.status(200).jsonp(registryRecord);
    });
  });
};

// DELETE - Delete a RegistryRecord with specified ID
exports.deleteRegistryRecord = function(req, res) {
  RegistryRecord.findById(req.params.id, function(err, registryRecord) {
    registryRecord.remove(function(err) {
    if(err) { return res.send(500, err.message); }
    res.status(200);
    });
  });
};