const Player = require('./gamelogic/player.js')
var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})

let DEBUG = true;

var players = {};

if (DEBUG)
{
    app.get('/', function(req,res) {
        res.sendFile(__dirname + '/client/debug.html')
    })
}
else
{
    app.get('/', function(req,res) {
    res.sendFile(__dirname + '/client/index.html')
})}
app.use('/client', express.static(__dirname + '/client'))
serv.listen(2000)


io.on('connection', function(socket){
    console.log('---- Connected ----')
    var username = socket.handshake.query.username;
    if (!players[username]) 
        players[username] = new Player(username);
    io.emit('allScores', players);
    players[username].sendCurrentState(socket);
    socket.on('increase', function(){
        players[username].incrementScore(1);
        players[username].sendCurrentState(socket);
        io.emit('allScores', players);
    });
});
