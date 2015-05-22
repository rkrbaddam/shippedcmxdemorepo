/*
Server for Shipped CMX demo project

Author: David Tootill 2015.05.22
Copyright (C) Cisco, Inc.  All rights reserved.
*/

var express    = require("express");
var app        = express();
var bodyParser = require("body-parser")
var exec       = require("child_process").exec

var nconf = require("nconf");
nconf.argv()
     .file({file: __dirname + "/config.json"});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var curl2Cmx = "curl -k -H \"Authorization: Basic " + 
               nconf.get("authToken") + "\" " + nconf.get("cmxServer")
console.log("curl2Cmx: " + curl2Cmx)

var router = express.Router();
router.get("/", function(req, res) {
    res.json({ message: "Shipped CMX Demo Server" })
})

// Implement server virtualization if requested

var virtualize = nconf.get("virtualize")
var virtualCMXServer = null
if (virtualize) {
  virtualCMXServer = require("./virtualCMXServer")
  virtualCMXServer.implement()
}

// Implement CMX pass-through methods
// Methods are specfied in Express.js syntax

var methods = [
  "/location/v1/clients/count",                      // Count of clients
  "/location/v1/clients",                            // List all clients
  /^\/location\/v1\/clients\/([0-9a-f:]+)/,          // Single client
  /^\/location\/v1\/history\/clients\/([0-9a-f:]+)/, // Single client history
  /^\/config\/v1\/maps\/imagesource\/(.*)/           // Retrieve image
]

methods.forEach(function(method) {
  cmxPassThru(router, method)
})

app.use(nconf.get("restApiRoot"), router)

// Start the server
var port = nconf.get("port")
app.listen(port)
console.log("CMX demo server listening on port " + port)

// cmxPassThru - pass through a CMX response to our caller
function cmxPassThru(router, method) {
  router.get(method, function(req,res) {
    cmd = curl2Cmx + req.path
    if (virtualize) {
      virtualCMXServer.respond(req, res)
    }
    else {
      console.log("Pass-thru command: " + req.path)
      exec(cmd, function(error, stdout, stderr) {
        if (! error) {
          res.send(JSON.parse(stdout))
        } else {
          res.status(400).json({error: stderr})
        }
      })
    }
  })
}
