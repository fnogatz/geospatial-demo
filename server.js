var express = require('express');
var io = require('socket.io');
var mongodb = require('mongodb');

var app = express();
var server = require('http').createServer(app);
io = io.listen(server);


app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());


app.post('/checkin-simple.html', function(req, res) {
  io.sockets.emit('checkin', req.body);

  res.redirect('checkin-simple.html');
});


mongodb.MongoClient.connect("mongodb://localhost:27017/geospatial-demo", function(err, db) {
  io.sockets.on('connection', function(socket) {
    socket.on('coordinates', function(coords) {
      db.collection('haltestellen').find({
        "geometry.features.geometry.coordinates": {
          $near: [coords.longitude, coords.latitude]
        }
      }).limit(5).toArray(function(err, haltestellen) {
        socket.emit('haltestellen', haltestellen);
      })
    });
  });


  app.get('/checkin/:haltestelle/:no', function(req, res) {    
    res.redirect('checkin.html');

    // into database:
    db.collection('haltestellen').update({
      _id: req.params.haltestelle
    }, {
      $push: {
        checkins: {
          feature: req.params.no,
          date: new Date()
          // user: req.params.username and so on...
        }
      }
    }, function() {});

    // inform recipients
    db.collection('haltestellen').findOne({
      _id: req.params.haltestelle
    }, function(err, haltestelle) {
      io.sockets.emit('checkin', {
        longitude: haltestelle.geometry.features[req.params.no].geometry.coordinates[0],
        latitude: haltestelle.geometry.features[req.params.no].geometry.coordinates[1],
        username: haltestelle.bezeichnung
      });
    });
  });
});


server.listen(3000, function() {
  console.log('Listening on port 3000');
});