/* File: registry/controllers/RegistryRole.js */

/* Required Imports */
var atob      = require("atob"),
    i18n      = require("i18next"),
    jwt       = require("jsonwebtoken"),
    mongoose  = require("mongoose");

/* Import Configuration */
var config = require("../config");

/* Internationalization */
i18n.init({
  saveMissing : true,
  debug       : true,
  resGetPath  : "public/locales/__lng__/__ns__.json"
});
i18n.setLng(config.LANGUAGE);

/* Import Model */
var RegistryRole = mongoose.model("RegistryRole");

function urlBase64Decode(str) {
  var output = str.replace("-", "+").replace("_", "/");
  switch (output.length % 4) {
    case 0:   break;
    case 2:   output += "=="; break;
    case 3:   output += "=";  break;
    default:  throw i18n.t("err.urlBase64Decode");
  }
  return atob(output);
};

/* GET - Return a RegistryRole with specified email and password */
exports.findRole = function(req, res) {
  console.log("GET");
  console.log(req.body);

  RegistryRole.findOne({ email: req.body.email, password: req.body.password },
  function(err, registryRole) {
    if(err) { res.json({ type: false, data: i18n.t("err.errorocurred")+": "+err }); }
    else {
      if (registryRole) { res.json({ type: true,  data: registryRole, token: registryRole.token }); }
      else { res.json({ type: false, data: i18n.t("err.findrole") }); }
    }
  });
};

/* POST - Insert a new RegistryRole in the DB */
exports.addRegistryRole = function(req, res) {
  console.log("POST");
  console.log(req.body);

  RegistryRole.findOne({ email: req.body.email },
  function(err, registryRole) {
    if(err) { res.json({ type: false, data: i18n.t("err.errorocurred")+": "+err }); }
    else {
      if (registryRole) { res.json({ type: false, data: i18n.t("err.addregistryrole")}); }
      else {
        var RegistryRoleModel = new RegistryRole();
        RegistryRoleModel.email     = req.body.email;
        RegistryRoleModel.password  = req.body.password;
        RegistryRoleModel.save(function(err, registryRole) {
          registryRole.token = jwt.sign(registryRole, config.JWT_SECRET);
          registryRole.save(function(err, newRegistryRole) {
            if (err) { res.json({ type: false, data: i18n.t("err.errorocurred")+": "+err }); }
            res.json({ type: true, data: newRegistryRole, token: newRegistryRole.token });
          });
        });
      }
    }
  });
};

/* */
exports.getRoleFromToken = function(req) {
  var role = {};
  var ownerHeader = req.headers["authorization"];
  if (typeof ownerHeader !== "undefined") {
    var token = ownerHeader.split(".")[1];
    role = JSON.parse(urlBase64Decode(token));
  }
  return role;
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

/* PUT - Update a RegistryRole that already exists */
exports.updateRegistryRole = function(req, res) {
  console.log("PUT");
  console.log(req.body);

  RegistryRole.findOne(
    { email: req.body.email, password: req.body.password },
    function(err, registryRole) {
      registryRole.email    = req.body.email;
      registryRole.password = req.body.password;
      registryRole.token    = req.body.token;

      registryRole.save(function(err) {
        if(err) { res.json({ type: false, data: i18n.t("err.errorocurred")+": "+err }); }
        res.json({ type: true, data: registryRole });
      });
    }
  );
};

/* DELETE - Delete a RegistryRole with specified email and password */
exports.deleteRegistryRole = function(req, res) {
  console.log("DELETE");
  console.log(req.body);

  RegistryRole.findOne(
    { email: req.body.email, password: req.body.password },
    function(err, registryRole) {
      registryRole.remove(function(err) {
        if(err) { res.json({ type: false, data: i18n.t("err.errorocurred")+": "+err }); }
        res.json({ type: true });
      });
    }
  );
};