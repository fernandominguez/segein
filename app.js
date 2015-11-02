var express        = require("express"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require('mongoose');

var port   = process.env.PORT;
var msgLog = "Node server running on http://"+process.env.IP+":"+port;
var msgRes = "Welcome to Segein!";

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();
router.get('/', function(req, res) {
  res.send(msgRes);
});

app.use(router);

app.listen(port, function() {
  console.log(msgLog);
});