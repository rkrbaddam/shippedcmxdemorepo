/*
virtualCMXServer - implement virtual CMX server for use when CMX is down
We assume the existence of a testData directory with two files
  allClients.json - contains an array of all clients by MAC address
  history.json - contains an array of a single client's history

Author: David Tootill 2015.05.22
Copyright (C) Cisco, Inc.  All rights reserved.
*/

var allClients = null
var history = null


// implement() - set up server virtualization
function implement() {
  console.log("Server virtualization active - CMX server will not be accessed")
  allClients = require("./testData/allClients.json")
  history = require("./testData/history.json")
}

// respond() - respond to a REST API call
function respond(req, res) {
  var matches
  if (null != req.path.match(/clients\/count$/)) {
    res.json({count: allClients.length})

  } else if (null != req.path.match(/clients$/)) {
    res.send(allClients)

  } else if (null != (matches = req.path.match(/history\/clients\/([0-9a-f:]+)/))) {
    if (history[0].apMacAddress == matches[1]) {
      res.send(history)
    } else {
      res.status(404).send({error: "Client " + matches[1] + " history not available"})
    }

  } else if (null != (matches = req.path.match(/\/clients\/([0-9a-f:]+)/))) {
    for (var i = 0; i < allClients.length; i++) {
      var client = allClients[i]
      if (client.apMacAddress == matches[1]) {
        res.send(client)
        return
      }
    }
    res.status(404).send({error: "Client " + matches[1] + " not found"})

  } else if (null != (matches = req.path.match(/^\/config\/v1\/maps\/imagesource\/(.*)/))) {
      res.status(404).send({error: "Image " + matches[1] + " not found"})

  } else {
      res.status(500).send({error: "URL " + req.path + " cannot be virtualized"})
  }
}

exports.implement = implement
exports.respond = respond
