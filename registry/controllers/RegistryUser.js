/* File: registry/backend/controllers/RegistryUser.js */

/* Required Imports */
var atob      = require("atob"),
    jwt       = require("jsonwebtoken"),
    mongoose  = require("mongoose");

/* Import Configuration */
var config = require("../config");

/* Import Model */
var RegistryUser = mongoose.model("RegistryUser");

function urlBase64Decode(str) {
  var output = str.replace("-", "+").replace("_", "/");
  switch (output.length % 4) {
    case 0:   break;
    case 2:   output += "=="; break;
    case 3:   output += "=";  break;
    default:  throw "Illegal base64url string!";
  }
  return atob(output);
};

/* GET - Return a RegistryUser with specified email and password */
exports.findUser = function(req, res) {
  console.log("GET");
  console.log(req.body);

  RegistryUser.findOne({ email: req.body.email, password: req.body.password },
  function(err, registryUser) {
    if(err) { res.json({ type: false, data: "Error ocurred: "+err }); }
    else {
      if (registryUser) { res.json({ type: true,  data: registryUser, token: registryUser.token }); }
      else { res.json({ type: false, data: "Incorrect email or password" }); }
    }
  });
};

/* POST - Insert a new RegistryUser in the DB */
exports.addRegistryUser = function(req, res) {
  console.log("POST");
  console.log(req.body);

  RegistryUser.findOne({ email: req.body.email },
  function(err, registryUser) {
    if(err) { res.json({ type: false, data: "Error ocurred: "+err }); }
    else {
      if (registryUser) { res.json({ type: false, data: "User already exists!" }); }
      else {
        var RegistryUserModel = new RegistryUser();
        RegistryUserModel.email     = req.body.email;
        RegistryUserModel.password  = req.body.password;
        RegistryUserModel.save(function(err, registryUser) {
          registryUser.token = jwt.sign(registryUser, config.JWT_SECRET);
          registryUser.save(function(err, newRegistryUser) {
            if (err) { res.json({ type: false, data: "Error ocurred: "+err }); }
            res.json({ type: true, data: newRegistryUser, token: newRegistryUser.token });
          });
        });
      }
    }
  });
};

/* */
exports.getUserFromToken = function(req) {
  var user = {};
  var ownerHeader = req.headers["authorization"];
  if (typeof ownerHeader !== "undefined") {
    var token = ownerHeader.split(".")[1];
    user = JSON.parse(urlBase64Decode(token));
  }
  return user;
};

/* */
exports.isAuthorized = function(req, res, next) {
  var ownerHeader = req.headers["authorization"];
  if (typeof ownerHeader !== "undefined") {
    req.token = ownerHeader.split(" ")[1];
    next();
  }
  else { res.sendStatus(403); }
}

/* PUT - Update a RegistryUser that already exists */
exports.updateRegistryUser = function(req, res) {
  console.log("PUT");
  console.log(req.body);

  RegistryUser.findOne(
    { email: req.body.email, password: req.body.password },
    function(err, registryUser) {
      registryUser.email    = req.body.email;
      registryUser.password = req.body.password;
      registryUser.token    = req.body.token;

      registryUser.save(function(err) {
        if(err) { res.json({ type: false, data: "Error ocurred: "+err }); }
        res.json({ type: true, data: registryUser });
      });
    }
  );
};

/* DELETE - Delete a RegistryRecord with specified email and password */
exports.deleteRegistryUser = function(req, res) {
  console.log("DELETE");
  console.log(req.body);

  RegistryUser.findOne(
    { email: req.body.email, password: req.body.password },
    function(err, registryUser) {
      registryUser.remove(function(err) {
        if(err) { res.json({ type: false, data: "Error ocurred: "+err }); }
        res.json({ type: true });
      });
    }
  );
};