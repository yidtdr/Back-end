const { readFileSync } = require('fs')
const Player = require('./gamelogic/player.js')
const UserEvents = require('./console/userEvents.js')
const Shop = require('./gamelogic/shop.js')
const Game = require('./gamelogic/game.js')
const Guild = require('./gamelogic/guild.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./gamelogic/upgrades.js')
var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})

let DEBUG = true;

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

var itemList = {};
// INSERT VALUES HERE //

itemList[0] = new ClickUpgrade("Cursor", 0, 10, 150, 1);
itemList[1] = new PerSecondUpgrade("Auto-clicker", 0, 10, 250, 1);
itemList[0].setNextUpgrade(new ClickUpgrade("Super Cursor", 1, 15, 1500, 5))

// INSERT VALUES HERE //

var games = {};
var guilds = {};

io.on('connection', function(socket){
    var username = socket.handshake.query.username;
    UserEvents.logConnected(username);
    if (!games[username]) 
        games[username] = new Game(
            "default",
            new Player(username),
            new Shop(
                3, itemList
            )
    )
    if (games[username]._player.alreadyConnected())
    {
        return;
    }
    else
    {
        games[username]._player.connected();
        io.emit('allScores', games);    // FIX ASAP - IT IS NOT CORRECT TO GIVE ALL PLAYERS DATA, UNSECURE, INSTEAD MAKE MAP OF TOP PLAYERS
        games[username]._player.sendCurrentState(socket);
        socket.emit('shop', games[username]._shop);
        socket.on('buyUpgrade', function(id){
            if (games[username]._shop.validate(games[username]._player, id) && (games[username]._shop._itemList[id].validate()))
            {
                games[username]._shop.bought(games[username]._player, id);
                games[username]._shop._itemList[id].onUpgrade();
                socket.emit('shop', games[username]._shop);
                games[username]._player.sendCurrentState(socket);
                games[username]._player.sendCurrentState(socket);
                io.emit('allScores', games); // FIX ASAP
            }
        })
        socket.on('increase', function(){
            games[username]._player.incrementScore();
            games[username]._player.sendCurrentState(socket);
            io.emit('allScores', games); // FIX ASAP
        });
        socket.on('joinGuild', function(guildName){
            games[username]._player._guild = guildName;
            guilds[guildName].playerJoined(username);
            games[username]._player.sendCurrentState(socket);
        })
        socket.on('createGuild', function(guildName){
            games[username]._player._guild = guildName;
            guilds[guildName] = new Guild(guildName);
            guilds[guildName].playerJoined(username);
            games[username]._player.sendCurrentState(socket);
            io.emit('allGuilds', guilds);
        })
        socket.on('allGuilds', function()
        {
            socket.emit('allGuilds', guilds)
        });
        setInterval(() => {
            if (games[username]._player.alreadyConnected())
            {
                games[username]._player.timerIncrement(); 
                games[username]._player.sendCurrentState(socket);
                io.emit('allScores', games); // FIX ASAP
            }
            else{
                return;
            }
        }, 1000);
        socket.on('disconnect', () => {
            UserEvents.logDisconnected(username);
            games[username]._player.disconnected();
            socket.disconnect();
        })
    }
});
