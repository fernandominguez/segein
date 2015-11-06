/* Required Modules */
var bodyParser      = require("body-parser"),
    express         = require("express"),
    i18n            = require("i18next"),
    methodOverride  = require("method-override"),
    morgan          = require("morgan"),
    nib             = require("nib"),
    stylus          = require("stylus");

/* Application Paths */
var pathApp     = __dirname+"/registry/",
    pathPublic  = __dirname+"/public";

/* Import Configuration */
var config = require(pathApp+"config");

/* Internationalization */
i18n.init({
  saveMissing : true,
  debug       : true,
  resGetPath  : "public/locales/__lng__/__ns__.json"
});
i18n.setLng(config.LANGUAGE);

/* Middlewares */
var app = express();
app.use(i18n.handle);
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

i18n.registerAppHelper(app);

/* API routes */
var router = require(pathApp+"routes");
app.use(router);

/* Caught Exceptions */
process.on("uncaughtException", function(err) {
  console.log(err);
});

/* Start server */
app.listen(config.PORT, function() {
  console.log("Registry Node Server running on http://"+config.HOST+":"+config.PORT);
});