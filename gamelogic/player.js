class Player{
    constructor(username)
    {
        this._username = username;
        this._score = 0;
    }

    incrementScore(amount)
    {
        this._score+=amount;
    }

    sendCurrentState(socket)
    {
        socket.emit('score', this);
    }
}

module.exports = Player