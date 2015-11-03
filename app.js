/* Required Modules */
var bodyParser      = require("body-parser"),
    express         = require("express"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    morgan          = require("morgan"),
    nib             = require("nib"),
    stylus          = require("stylus");

/* Application Paths */
var pathApp     = __dirname+"/registry/",
    pathPublic  = __dirname+"/public";

/* Import Configuration */
var config = require(pathApp+"config");

/* Connect to DB */
mongoose.connect(config.DATABASE, function(err, res) {
  if(err) { throw err; }
  console.log('Connected to Database.');
});

/* Import Controllers and Models */
var RegistryRecord      = require(pathApp+"models/RegistryRecord");
var RegistryUser        = require(pathApp+"models/RegistryUser");
var RegistryUserCtrl    = require(pathApp+"controllers/RegistryUser");
var RegistryRecordCtrl  = require(pathApp+"controllers/RegistryRecord");

/* Middlewares */
var app = express();
app.set("views", pathApp+"views");
app.set("view engine", "jade");
app.use(express.static(pathPublic));
app.use(stylus.middleware({
  src: pathPublic,
  compile: function (str, path) {
    return stylus(str)
    .set("filename", path)
    .use(nib());
  }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan("dev"));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin" , "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
  next();
});

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

router.route('/registry')
  .get(RegistryRecordCtrl.findAllRegistryRecords)
  .post(RegistryRecordCtrl.addRegistryRecord);

router.route('/registry/:id')
  .get(RegistryRecordCtrl.findById)
  .put(RegistryRecordCtrl.updateRegistryRecord)
  .delete(RegistryRecordCtrl.deleteRegistryRecord);

app.use(router);

/* Caught Exceptions */
process.on("uncaughtException", function(err) {
  console.log(err);
});

/* Start server */
app.listen(config.PORT, function() {
  console.log("Registry Node Server running on http://"+config.HOST+":"+config.PORT);
});