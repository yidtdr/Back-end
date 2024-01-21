const Player = require('./gamelogic/player.js')
const Shop = require('./gamelogic/shop.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./gamelogic/upgrades.js')
var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})

let DEBUG = false;

var players = {};
var shop = new Shop();
var cu = new ClickUpgrade("ClickUpgrade", 0, 5, 10, 3);
shop.appendItem(cu)
cu = new ClickUpgrade("ClickUpgrade", 0, 5, 100, 30);
shop.appendItem(cu)
cu = new PerSecondUpgrade("PerSecUpdate", 0, 5, 10, 3);
shop.appendItem(cu)

console.log(shop);

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
    console.log('Connected ----')
    var username = socket.handshake.query.username;
    if (!players[username]) 
        players[username] = new Player(username);
    io.emit('allScores', players);
    players[username].sendCurrentState(socket);
    socket.emit('shop', shop);
    socket.on('buyUpgrade', function(id){
        if (shop.validate(players[username], id))
        {
            shop.bought(players[username], id);
            players[username].sendCurrentState(socket);
        }
    })
    socket.on('increase', function(){
        players[username].incrementScore();
        players[username].sendCurrentState(socket);
        io.emit('allScores', players);
    });
});
