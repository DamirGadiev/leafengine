//====================================================================================================================//
// Load Express and Application modules.
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    UUID = require('node-uuid');

// Set up directories for static files.
app.use('/engine/client', express.static(__dirname + '/engine/client'));
app.use('/engine/client/core', express.static(__dirname + '/engine/client/core'));
app.use('/engine/client/classes', express.static(__dirname + '/engine/client/classes'));
app.use('/engine/client/routines', express.static(__dirname + '/engine/client/routines'));
app.use('/assets', express.static(__dirname + '/engine/client/assets'));
app.use('/map', express.static(__dirname + '/engine/client/map'));

// Prepare output to main entry point.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//------------------------------------------------------------------------------------------
var Player = function() {
  this.isHost = true;
  this.id = UUID();

};

var Server = function() {
  var game = {
    id : UUID(),
    player_host: {},
    player_client: {},
    player_count:1
  }
};
//------------------------------------------------------------------------------------------------


// Socket server part
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('move player', function(msg){
    console.log(msg);
  });
});

// Set up listener
http.listen(3000, function(){
  console.log('listening on *:3000');
});
