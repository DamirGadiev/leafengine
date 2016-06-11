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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//------------------------------------------------------------------------------------------
// Server player user.
var Player = function () {
    this.host = false;
    this.id = UUID();
};

//Set host property
Player.prototype.setHost = function (host) {
    this.host = host;
};

var Server = function () {
    this.game = {
        uuid: UUID(),
        users: [],
        max_users: 5
    }
};

Server.prototype.connectToGame = function () {
    var that = this;
    var uuid = false;
    var connected_users = that.game.users.length;
    if (connected_users == 0) {
        uuid = that.startGame();
    }
    else {
        uuid = that.joinGame();
    }
    return uuid;
};

Server.prototype.startGame = function () {
    var that = this;
    var player = new Player();
    player.setHost(true);
    that.game.users.push(player);
    return player;
};

Server.prototype.joinGame = function () {
    var that = this;
    var player = new Player();
    that.game.users.push(player);
    return player;
};

Server.prototype.updateState = function (state) {
    var that = this;
    return that.game;
};

Server.prototype.updatePlayer = function (player) {
  var that = this;
};

var server = new Server();
//------------------------------------------------------------------------------------------------

// Socket server part
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('move player', function (msg) {
    //    console.log(msg);
    });
    socket.on("game connect", function (msg) {
        var player = server.connectToGame();
        console.log(player);
        io.emit("game connect", player);
    });
    socket.on("update state", function (state) {
        var game = server.updateState(state);
        io.emit("update state", game);
    });
});

// Set up listener
http.listen(3000, function () {
    console.log('listening on *:3000');
});
