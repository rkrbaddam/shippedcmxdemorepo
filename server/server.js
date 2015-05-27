/*
Server for Shipped CMX demo project

Author: David Tootill 2015.05.22
Copyright (C) Cisco, Inc.  All rights reserved.
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser")
var exec       = require("child_process").exec
var request    = require("request")

var nconf = require("nconf");
nconf.argv()
     .file({file: __dirname + "/config.json"});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  next()
})

// Set configuration defaults

var virtualize = false
var virtualCMXServer = null
configure()

// Implement local methods

var router = express.Router();
router.get("/", function(req, res) {
    res.json({ message: "Shipped CMX Demo Server" })
})

// Implement config method to set configuration

router.post("/local/config", function(req,res) {
  for (var key in req.body) {
    switch(key) {
      case "authToken":
      case "cmxServer":
      case "password":
      case "username":
      case "virtualize":
        console.log("Setting " + key + " = " + req.body[key])
        nconf.set(key, req.body[key])
        break

      default:
        res.status(400).json({error: "Unknown local config keyword '" + key + "'"})
        return
    }
  }
  configure()
  res.json({username: nconf.get("username"),
            password: nconf.get("password"),
            authToken: nconf.get("authToken"),
            cmxServer: nconf.get("cmxServer"),
            virtualize: nconf.get("virtualize")})
})

// Implement CMX pass-through methods

router.get(/^(.*)$/, function(req,res) {
  if (typeof req.query.token != "string" || req.query.token.length == 0 ) {
    res.status(400).json({"error": "Missing token on request"})
    return
  }
  if (virtualize) {
    virtualCMXServer.respond(req, res)
  }
  else {
    console.log("Pass-through command: " + req.path)
    request({
      url: nconf.get("cmxServer") + req.path,
      headers: {
        "Authorization": "Basic " + req.query.token
      }
    })
    .pipe(res)
  }
})

app.use(nconf.get("restApiRoot"), router)

// Start the server
var port = nconf.get("port")
app.listen(port)
console.log("CMX demo server listening on port " + port)

// configure() - set local configuration values
function configure() {
  // Set authorization token

  username = nconf.get("username")
  password = nconf.get("password")
  if (typeof username == "string" && typeof password == "string" && username != "-") {
    var authToken = new Buffer(username + ":" + password).toString("base64");
    console.log("Auth token for user " + username + " is " + authToken)
    nconf.set("authToken", authToken)
  }

  // Implement server virtualization if requested

  if (nconf.get("virtualize")) {
    if (! virtualize) {
      console.log("Server virtualization active - CMX server will not be accessed")
    }
  } else if (virtualize) {
      var virtualCMXServer = require("./virtualCMXServer")
      virtualCMXServer.implement()
      console.log("Server virtualization now inactive - requests will pass through to CMX")
  }
  virtualize = nconf.get("virtualize")
}
