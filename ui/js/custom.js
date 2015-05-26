$(document).ready(function() {
    var $map = jQuery('#mac');
    $.ajax({
        url: 'json_file/my.json',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json",
        success: function(data){
            var $w = data[0].mapInfo.floorDimension.width;    // in feet width of image
            var $h = data[0].mapInfo.floorDimension.length;   // in feet height of image
            var $multi = 1024/$w;
            $w = $multi * $w;
            $h = $multi * $h;
            var $color  = getRandomColor();
            //alert(data[0].mapInfo.image.imageName);
            var url = 'img/'+data[0].mapInfo.image.imageName;
            $map.css({width:$w+'px', height:$h+'px',backgroundImage:'url('+url+')',backgroundSize:$w+'px '+$h+'px' });
            for (var i=0;i<data.length;++i)
            {
                var $wc = data[i].mapCoordinate.x * $multi;
                var $hc = data[i].mapCoordinate.y * $multi;
                var $unm = data[i].userName;
                var newLink = $("<a />", {
                    href : "#",
                    text:$unm,
                    class:"point"
                });
                newLink.click(function(){
                    user($multi,$color);
                });
                newLink.css({top:$hc + 'px', left: $wc+ 'px'});
                $map.append(newLink);
            }
        },
        error: function(data) {
            alert("Error while parsing json data");
        }
    });
});

function user($multi)
{
    var $map = jQuery('#mac');

    var $color = getRandomColor();
    //var $multi = 3.5;

    $.ajax({
        url: 'json_file/user1.json',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json",
        success: function(data){
            for (var i=0;i<50;++i)
            {
                var $wc = data[i].mapCoordinate.x * $multi;
                var $hc = data[i].mapCoordinate.y * $multi;
                var $ts = data[i].sourceTimestamp;
                $ts = epochToJsDate($ts);
                var newLink = $("<a />", {
                    href : "#",
                    title  :$ts,
                    class:"userPoint"
                }).css({top:$hc + 'px', left: $wc+ 'px',backgroundColor:$color});
                if( i % 5 == 0 ) {
                    $map.append(newLink);
                }
            }
        },
        error: function(data) {
            alert("Error while parsing json data");
        }
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function epochToJsDate(ts){
    // ts = epoch timestamp
    // returns date obj
    return new Date(ts*1000);
}