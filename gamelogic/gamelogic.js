const Player = require('./player.js')
const UserEvents = require('./../console/userEvents.js')
const Shop = require('./shop.js')
const Game = require('./game.js')
const Guild = require('./guild.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./upgrades.js')

class GameLogic{
    constructor()
    {
        this._guilds = {};
        this._games = {};
        var itemList = {};

        // INSERT VALUES HERE //
        itemList[0] = new ClickUpgrade("Cursor", 0, 10, 150, 1);
        itemList[1] = new PerSecondUpgrade("Auto-clicker", 0, 10, 250, 1);
        itemList[0].setNextUpgrade(new ClickUpgrade("Super Cursor", 1, 15, 1500, 5))

        this._shop = new Shop(2, itemList);
    }

//          [PLAYER MANAGEMENT]
    onUserConnect(username)
    {
        if (!this._games[username])
        {
            this._games[username] = new Game(
                "default",
                new Player(username),
                this._shop
            )
            UserEvents.logConnected(username);
            return true;
        }

        if (this._games[username]._player.alreadyConnected())
        {
            return false;
        }

        UserEvents.logConnected(username);
        return true;
    }

    onUserDisconnect(username, socket)
    {
        UserEvents.logDisconnected(username);
        this._games[username]._player.disconnected();
        socket.disconnect();
    }

//          [SCORE MANAGEMENT]
    onTimer(username, socket)
    {
        if (this._games[username]._player.alreadyConnected())
            {
                this._games[username]._player.timerIncrement(); 
                this._games[username]._player.sendCurrentState(socket);
            }
            else{
                return;
            }
    }

    onIncrease(username, socket)
    {
        this._games[username]._player.incrementScore();
        this._games[username]._player.sendCurrentState(socket);
    }

//          [GUILD MANAGEMENT]
    sendAllGuilds(socket)
    {
        socket.emit('allGuilds', this._guilds);
    }

    onGuildJoin(username, guildName, socket)
    {
        if (!this._games[username]._player.isInGuild()){
            this._games[username]._player._guild = guildName;
            this._guilds[guildName].playerJoined(username);
            this._games[username]._player.sendCurrentState(socket);
        }
    }
    
    onGuildLeave(username, guildName, socket)
    {
        if (this._games[username]._player.isInThisGuild(guildName))
        {
            this._games[username]._player._guild = null;
            this._guilds[guildName].playerLeft(username);
            this._games[username]._player.sendCurrentState(socket);
        }
    }

    onGuildCreate(username, guildName, socket)
    {
        if (!this._games[username]._player.isInGuild())
        {
            this._games[username]._player._guild = guildName;
            this._guilds[guildName] = new Guild(guildName);
            this._guilds[guildName].playerJoined(username);
            this._games[username]._player.sendCurrentState(socket);
        }
    }

//          [SHOP MANAGEMENT]
    sendShop(username, socket)
    {
        socket.emit('shop', this._games[username]._shop);
    }

    buyUpgrade(username, socket, id)
    {
        if (this._games[username].valudateBuy(id))
        {
            this._games[username]._shop.bought(this._games[username]._player, id);
            this._games[username]._shop._itemList[id].onUpgrade();
            this.sendShop(username, socket);
            this._games[username]._player.sendCurrentState(socket);
            this._games[username]._player.sendCurrentState(socket);
        }
    }
}

module.exports = GameLogic;