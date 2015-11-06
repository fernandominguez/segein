var express   = require("express"),
    mongoose  = require("mongoose");

/* Application */
var pathApp = __dirname+"/";

/* Import Configuration */
var config = require(pathApp+"config");

/* Connect to DB */
mongoose.connect(config.DATABASE, function(err, res) {
  if(err) { throw err; }
  console.log('Connected to Database.');
});

/* Import Controllers and Models */
var RegistryRecord      = require(pathApp+"models/RegistryRecord"),
    RegistryUser        = require(pathApp+"models/RegistryUser"),
    RegistryUserCtrl    = require(pathApp+"controllers/RegistryUser"),
    RegistryRecordCtrl  = require(pathApp+"controllers/RegistryRecord");

/* API routes */
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { theme: config.THEME });
});

router.get("/views/body-home", function(req, res) {
  res.render("body-home");
});

router.get("/views/body-me", function(req, res) {
  res.render("body-me", { user: RegistryUserCtrl.getUserFromToken(req) });
});

router.get("/views/body-registry", function(req, res) {
  res.render("body-registry", { records: RegistryRecordCtrl.findAllRegistryRecords(req) });
});

router.get("/views/body-signin", function(req, res) {
  res.render("body-signin");
});

router.get("/views/body-signup", function(req, res) {
  res.render("body-signup");
});

router.route("/signin")
  .post(RegistryUserCtrl.findUser);

router.route("/signup")
  .post(RegistryUserCtrl.addRegistryUser);

router.route("/me")
  .get(RegistryUserCtrl.isAuthorized, RegistryUserCtrl.findUser);

router.route("/registry")
  .get(RegistryRecordCtrl.findAllRegistryRecords)
  .post(RegistryRecordCtrl.addRegistryRecord);

router.route('/registry/:id')
  .get(RegistryRecordCtrl.findById)
  .put(RegistryRecordCtrl.updateRegistryRecord)
  .delete(RegistryRecordCtrl.deleteRegistryRecord);

module.exports = router;