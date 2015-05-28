/*
 * cmxmap.js - manage a user map
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var user
var scale
var mapName
var imageName
var userListButton = "<button onClick='returnToUserList()'>Show List of All Users</button>"
var allUserMapButton = "<button onClick='showUserMap()'>Show Map of All Users</button>"
var historyLengthToShow = 10
var historyMinimumGapSeconds = 60

// showUserMap - show the map of users
// Arguments:
//   mapNameArg   - human-readable name of map for header
//   imageNameArg - filename of image to show
//   userToShow   - index of user for which history is desired; -1 to show all users
function showUserMap(mapNameArg, imageNameArg, userToShow) {
  if (typeof mapNameArg == "string") {
    mapName = mapNameArg
  }
  if (typeof imageNameArg == "string") {
    imageName = imageNameArg
  }
  $("#content").show()
  var userlist = global.userlist
  var $map = jQuery('#map');
  var imgUrl = cmxUrl("/config/v1/maps/imagesource/" + imageName)
  var $w = userlist[0].mapInfo.floorDimension.width    // in feet width of image
  var $h = userlist[0].mapInfo.floorDimension.length   // in feet height of image
  var imgWidth = $(window).width()
  scale = imgWidth / $w;
  $w = imgWidth
  $h = $h * scale
  $map.css({width: imgWidth + 'px', height:$h+'px', backgroundImage:'url('+imgUrl+')', backgroundSize:$w+'px '+$h+'px' });
  $map.show()
  if (typeof userToShow == "number" && userToShow >= 0) {
    getUserHistory(userToShow)
  } else {
    // Add links for individual users
    $("#heading").html("Map of All Users in Room " + mapName)
    $("#content").html(userListButton)
    $("#content").append("<br><br><span class='mapCaption'>Click on a user in the map below to display their location history</span>")
    for (var i = 0; i < userlist.length; i++) {
        var user = userlist[i]
        var x = user.mapCoordinate.x * scale
        var y = user.mapCoordinate.y * scale
        var newLink = $("<a />", {
            href : "#",
            text: user.userName,
            class:"point",
            onClick: "getUserHistory(" + i + ")"
        });
        newLink.css({top:y + 'px', left: x+ 'px'});
        $map.append(newLink);
    }
    $(".userPoint").remove()
    $(".userPointCaption").remove()
  }
}

function getUserHistory(i)
{
  $(".point").remove()
  $(".userPoint").remove()
  $(".userPointCaption").remove()
  $("#content").html(userListButton + "&nbsp;&nbsp" + allUserMapButton)
  $("#content").append("<br><br><span class='mapCaption'>Points are numbered from the most recent; hover over a point to see its exact time</span>")
  var user = global.userlist[i]
  $("#heading").html("Location History of User " + user.userName + " at MAC Address " + user.macAddress)
  $.get(
      cmxUrl("/location/v1/history/clients/" + user.macAddress),
      showUserHistory,
      "json")
   .fail(showRestError)
}

function showUserHistory(history) {
  var $map = jQuery('#map');
  var timeOfLastPoint = 0
  var minGapMS = historyMinimumGapSeconds*1000
  var pointsShown = 0
  for (var i = 0; pointsShown < historyLengthToShow && i < history.length; i++) {
    var timestamp = history[i].sourceTimestamp
    if (timestamp - timeOfLastPoint >= minGapMS) {
      var x = history[i].mapCoordinate.x * scale
      var y = history[i].mapCoordinate.y * scale
      timestamp = new Date(timestamp*1000)
      $map.append( $("<a />", {
            href: "#",
            title: timestamp,
            text: ++pointsShown, 
            class:"userPoint"
        }).css({top:y + 'px', left: x+ 'px'}))
      $map.append($("<span />", {
            text: timestamp.toLocaleTimeString(),
            class:"userPointCaption"
        }).css({top:y + 'px', left: (x+18) + 'px'}))
    }
  }
}

function returnToUserList() {
  $("#map").hide()
  $("#content").hide()
  setError()
  getUsers()
}

