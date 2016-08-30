const centerOfUlm = [48.37616366164922,10.006818299883644]; // That's Ulm, Germany!

var map;

document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map').setView(centerOfUlm, 13);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function positionFound(position) {
      // alert("lat: "+position.coords.latitude+"; lon: "+position.coords.longitude);
      // alert(position.coords.accuracy);
      map.setView([position.coords.latitude,position.coords.longitude], 13);

      var socket = io.connect('http://localhost');
      socket.on('haltestellen', function(haltestellen) {
        haltestellen.forEach(function(haltestelle) {
          haltestelle.geometry.features.forEach(function(feature, no) {
            var msg = '<b>'+haltestelle.bezeichnung+'</b><br /><a href="/checkin/'+haltestelle._id+'/'+no+'">Check in</a>';
            L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).addTo(map).bindPopup(msg);
          });
        });
      });
      socket.emit('coordinates', position.coords);
    });
  }

}, false);