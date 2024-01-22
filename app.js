const { readFileSync } = require('fs')
const Player = require('./gamelogic/player.js')
const UserEvents = require('./console/userEvents.js')
const Shop = require('./gamelogic/shop.js')
const Init = require('./shopCreator.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./gamelogic/upgrades.js')
var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})

let DEBUG = false;

var players = {};
var shop = new Shop;

var object = new Shop();
var itemList = {};
// INSERT VALUES HERE //

itemList[0] = new ClickUpgrade("Cursor", 0, 10, 150, 1);
itemList[1] = new PerSecondUpgrade("Auto-clicker", 0, 10, 250, 1);
itemList[0].setNextUpgrade(new ClickUpgrade("Super Cursor", 1, 10, 1500, 5))

// INSERT VALUES HERE //
for (let i in itemList)
{
    object.appendItem(itemList[i]);
}

shop.init(object);

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
    var username = socket.handshake.query.username;
    UserEvents.logConnected(username);
    if (!players[username]) 
        players[username] = new Player(username);
    io.emit('allScores', players);
    players[username].sendCurrentState(socket);
    socket.emit('shop', shop);
    socket.on('buyUpgrade', function(id){
        if (shop.validate(players[username], id) && (shop._itemList[id].validate()))
        {
            shop.bought(players[username], id);
            shop._itemList[id].onUpgrade();
            socket.emit('shop', shop);
            players[username].sendCurrentState(socket);
            io.emit('allScores', players);
        }
    })
    socket.on('increase', function(){
        players[username].incrementScore();
        players[username].sendCurrentState(socket);
        io.emit('allScores', players);
    });

    setInterval(() => {
        players[username].timerIncrement();
        players[username].sendCurrentState(socket);
    }, 1000);
    socket.on('disconnect', () => UserEvents.logDisconnected(username))
});
