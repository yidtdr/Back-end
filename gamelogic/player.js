class Player{
    constructor(username)
    {
        this._username = username;
        this._score = 0;
        this._perClickInc = 1;
        this._perSecondInc = 0;
    }

    incrementScore()
    {
        this._score+=this._perClickInc;
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
        this._score+=this._perSecondInc;
    }
}

module.exports = Player