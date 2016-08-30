const centerOfUlm = [48.37616366164922,10.006818299883644]; // That's Ulm, Germany!

var map;

function setCurrentPosition(coords) {
  var msg = '<b>Your current position!</b>';

  msg += '<form action="/checkin-simple.html" method="post">\
    <input type="hidden" name="longitude" value="'+coords.longitude+'" />\
    <input type="hidden" name="latitude" value="'+coords.latitude+'" />\
    <input type="text" name="username" placeholder="Username" required="true" />\
    <input type="submit" value="Check in!" />\
    </form>';

  var marker = L.marker([coords.latitude, coords.longitude]).addTo(map).bindPopup(msg).openPopup();

  map.setView([coords.latitude, coords.longitude], 13);
}

document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map').setView(centerOfUlm, 13);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function positionFound(position) {
      //alert("lat: "+position.coords.latitude+"; lon: "+position.coords.longitude);
      setCurrentPosition(position.coords);
    });
  }

}, false);