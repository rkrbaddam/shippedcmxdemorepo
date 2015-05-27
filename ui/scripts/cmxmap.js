/*
 * cmxmap.js - manage a user map
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var user
var scale

function showAllUserMap(mapName, imageName, userToShow) {
  $("#heading").html("Map of " + mapName)
  $("#content").html("<button onClick='returnToUserList()'>Return to User List</button>")
  $("#content").show()
  var userlist = global["userlist"]
  var $map = jQuery('#map');
  var imgUrl = cmxUrl("/config/v1/maps/imagesource/" + imageName)
  var $w = userlist[0].mapInfo.floorDimension.width    // in feet width of image
  var $h = userlist[0].mapInfo.floorDimension.length   // in feet height of image
  var imgWidth = $(window).width()
  var scale = imgWidth / $w;
  $w = imgWidth
  $h = $h * scale
  //alert(userlist[0].mapInfo.image.imageName);
  $map.css({width: imgWidth + 'px', height:$h+'px',backgroundImage:'url('+imgUrl+')',backgroundSize:$w+'px '+$h+'px' });
  for (var i = 0; i < userlist.length; i++) {
      var user = userlist[i]
      var $wc = user.mapCoordinate.x * scale
      var $hc = user.mapCoordinate.y * scale
      var $unm = user.userName
      var newLink = $("<a />", {
          href : "#",
          text: $unm,
          class:"point",
          onClick: "showUser(" + i + "," + scale + ")"
      });
      newLink.css({top:$hc + 'px', left: $wc+ 'px'});
      $map.append(newLink);
  }
  $map.show()
  if (userToShow >= 0) {
    showUser(userToShow, scale)
  }
}

function showUser(i, myScale)
{
  $(".userPoint").remove()
  $(".userPoint2").remove()
  scale = myScale
  var user = global["userlist"][i]
  $.get(
      cmxUrl("/location/v1/history/clients/" + user.macAddress),
      showUserHistory,
      "json")
   .fail(showRestError)
}

function showUserHistory(history) {
  var $map = jQuery('#map');
  var $color = "#ff0000"
  for (var i = 0; i < 50; i++) {
    var $wc = history[i].mapCoordinate.x * scale
    var $hc = history[i].mapCoordinate.y * scale
    var $ts = history[i].sourceTimestamp
    $ts = new Date($ts*1000)
    var newLink 
    if (i%5 == 0) {
      newLink = $("<a />", {
          href: "#",
          title: $ts,
          text: 1 + (i / 5),
          class:"userPoint"
      }).css({top:$hc + 'px', left: $wc+ 'px',backgroundColor:$color})
    } else {
      newLink = $("<a />", {
          href: "#",
          class:"userPoint2"
      }).css({top:$hc + 'px', left: $wc+ 'px',backgroundColor:$color})
    }
    $map.append(newLink);
  }
}

function returnToUserList() {
  $("#map").hide()
  getUsers()
}

