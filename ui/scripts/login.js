/*
 * login.js - manage the login form
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var global = new Object() // Global values

var restApiRoot = "/api"
var loginHeading = "Welcome to Connected Mobile Experiences on <a href='http://ciscocloud.github.io/shipped/dist/#/'>Shipped</a>"

// validate - Validate user's login info
function validate()
{
    if(validateServer()) {
        global["username"] = document.getElementById("pass").value;
        var password = document.getElementById("pass").value;
        doLogin(password)
    }
}

// validateServer - Verify server specifies a URL of the form http[s]://xxx:nnn
function validateServer()
{
    var server = document.getElementById("server").value
    if (server.match(/https?:\/\/[^:]+:\d+/)) {
        global["server"] = server + restApiRoot
        return true;
    }
    else
    {
        setError("Invalid server address - must be of form http[s]://xxx:nnn")
        return false;
    }
}


// setError - report an error
function setError(message) {
  if (typeof message == "string" && message.length > 0) {
    $("#errorMessage").html(message)
    $("#errorMessage").show()
  } else {
    $("#errorMessage").empty()
    $("#errorMessage").hide()
  }
}

// doLogin - get API authorization token from server
function doLogin(password) {
  $.post(
      global["server"] + "/local/config",
     {"username": global["username"], "password": password},
     function(data) {
       setError()
       global["apiToken"] = data.authToken
       $("#loginForm").hide()
       $("#logo").hide()
       $("#heading").html('')
       $("#logoutButton").show()
       getUsers()
     }, "json")
   .fail(showRestError)
}

// showRestError - format an error message after a REST call failure
function showRestError(jqXHR, textStatus, errorThrown) {
  if (typeof jqXHR != "object" || typeof jqXHR.status != "number" || jqXHR.status == 0) {
    setError("Error: No response. Is the server at " + global["server"] + " running?")
  } else {
     var msg = "Error " + jqXHR.status + " " + jqXHR.statusText;
     if (typeof errorThrown == "string" && errorThrown.length > 0 && errorThrown != jqXHR.statusText) {
       msg += "; " + errorThrown
     }
     else if (typeof jqXHR.responseJSON == "object" ) {
       msg += "; " + JSON.stringify(jqXHR.responseJSON)
     }
     else if (typeof jqXHR.responseText == "string" &&
              jqXHR.responseText.length > 0) {
       msg += "; " + JSON.responseText
     }
     setError(msg)
  }
}

// doLogout - close map and return to login
function doLogout() {
  setError()
  global["mapDisplayedOnce"] = false
  $("#logo").show()
  $("#heading").html(loginHeading)
  $("#loginForm").show()
  $("#logoutButton").hide()
  $("#content").hide()
  $("#content").empty()
  $("#map").hide()
  $("#map").empty()
  $("#map").css({backgroundImage:"none"})
}

// cmxUrl - build a CMX URL
function cmxUrl(method) {
  return global["server"] + method + "?token=" + global["apiToken"]
}
