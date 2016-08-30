const centerOfUlm = [48.37616366164922,10.006818299883644]; // That's Ulm, Germany!

var map;

document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map').setView(centerOfUlm, 13);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(map);


  var socket = io.connect('http://localhost');
  socket.on('checkin', function (coords) {    
    L.marker([coords.latitude, coords.longitude]).addTo(map).bindPopup(coords.username);
  });
}, false);