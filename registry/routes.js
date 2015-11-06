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
  res.render("layout", { theme: config.THEME });
});

router.get("/views/app/home", function(req, res) {
  res.render("app/home");
});

router.get("/views/app/me", function(req, res) {
  res.render("app/me", { user: RegistryUserCtrl.getUserFromToken(req) });
});

router.get("/views/registry/registry", function(req, res) {
  res.render("registry/registry", { records: RegistryRecordCtrl.findAllRegistryRecords(req) });
});

router.get("/views/app/signin", function(req, res) {
  res.render("app/signin");
});

router.get("/views/app/signup", function(req, res) {
  res.render("app/signup");
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