const { readFileSync } = require('fs')
const Player = require('./gamelogic/player.js')
const UserEvents = require('./console/userEvents.js')
const Shop = require('./gamelogic/shop.js')
const Game = require('./gamelogic/game.js')
const Guild = require('./gamelogic/guild.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./gamelogic/upgrades.js')
const GameLogic = require('./gamelogic/gamelogic.js')
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

gl = new GameLogic();

io.on('connection', function(socket){

//          CONNECTION MANAGEMENT

    var username = socket.handshake.query.username;
    UserEvents.logConnected(username);
    if (gl.onUserConnect(username))
    {
        gl._games[username]._player.connected();
        gl._games[username]._player.sendCurrentState(socket);
        gl.sendShop(username, socket);

//          SERVER EVENTS MANAGEMENT


//              SHOP MANAGEMENT
        socket.on('buyUpgrade', function(id){
            gl.buyUpgrade(username, socket, id);
        })

        socket.on('getShop', function() {
            gl.sendShop(username, socket);
        })

//              GUILDS MANAGEMENT

        socket.on('joinGuild', function(guildName){
            gl.onGuildJoin(username, guildName, socket);
        });

        socket.on('createGuild', function(guildName){
            gl.onGuildCreate(username, guildName, socket);
        });

        socket.on('allGuilds', function(){
            gl.sendAllGuilds(socket);
        });

//              PLAYER SCORE MANAGEMENT

        socket.on('increase', function(){
            gl.onIncrease(username, socket);
        });

        setInterval(() => {
            gl.onTimer(username, socket);
        }, 1000);

//          DISCONNECTION MANAGEMENT

        socket.on('disconnect', () => {
            gl.onUserDisconnect(username, socket);
        })
    }
    else
    {
//          IF USER GETS THERE -> HE IS TRYING TO ACCESS GAME WITH 1 ACCOUNT
//                      BUT MULTIPLE DEVICES, WHICH IS ILLEGAL
//          TODO: WARNING SYSTEM TO PREVENT USERS TRYING TO CHEAT
        socket.disconnect();
    }
});
