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

    incrementScore()
    {
        this._score += this._perClickInc;
        this._scoreTotal += this._perClickInc;
    }

    sendCurrentState(socket)
    {
        socket.emit('score', this);
    }

    boughtUpgrade(price, perClickBonus, perSecBonus)
    {
        this._score -= price;
        this._perClickInc += perClickBonus;
        this._perSecondInc += perSecBonus;
    }

    timerIncrement()
    {
        this._score += this._perSecondInc;
        this._scoreTotal += this._perSecondInc; 
    }
}

module.exports = Player