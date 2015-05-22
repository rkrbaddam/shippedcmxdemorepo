/*
Server for Shipped CMX demo project

Author: David Tootill 2015.05.22
Copyright (C) Cisco, Inc.  All rights reserved.
*/

var express    = require("express");
var app        = express();
var exec       = require("child_process").exec

var nconf = require("nconf");
nconf.argv()
     .file({file: __dirname + "/config.json"});

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

router.get(/^(.*)$/, function(req,res) {
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

app.use(nconf.get("restApiRoot"), router)

// Start the server
var port = nconf.get("port")
app.listen(port)
console.log("CMX demo server listening on port " + port)
