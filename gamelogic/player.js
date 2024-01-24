class Player{
    constructor(username)
    {
        this._username = username;
        this._score = 0;
        this._perClickInc = 1;
        this._perSecondInc = 0;
        this._scoreTotal = 0;
        this._connected = false;
        this._guild = "none";
    }

//          CONNECTION MANAGEMENT
    alreadyConnected()
    {
        return this._connected;
    }

    connected()
    {
        this._connected = true;
    }

    disconnected()
    {
        this._connected = false;
    }

    sendCurrentState(socket)
    {
        socket.emit('score', this);
    }

//          SCORE MANAGEMENT
    incrementScore()
    {
        this._score += this._perClickInc;
        this._scoreTotal += this._perClickInc;
    }

    timerIncrement()
    {
        this._score += this._perSecondInc;
        this._scoreTotal += this._perSecondInc; 
    }

//          UPGRADES MANAGEMENT
    boughtUpgrade(price, perClickBonus, perSecBonus)
    {
        this._score -= price;
        this._perClickInc += perClickBonus;
        this._perSecondInc += perSecBonus;
    }

//          GUILDS MANAGEMENT
    isInGuild()
    {
        return (this._guild == null)
    }

    isInThisGuild(guildName)
    {
        return (this._guild == guildName)
    }
}

module.exports = Player