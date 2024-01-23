class Guild{
    constructor(name)
    {
        this._name = name;
        this._globalScore = 0;
        this._playerList = {};
        this._playerAmount = 0;
    }

    playerJoined(username)
    {
        this._playerList[this._playerAmount] = username;
        this._playerAmount++;
    }

    playerLeft(username)
    {
        for (user in this._playerList)
        {
            if (this._playerList[user] == username)
            {
                delete this._playerList[user];
            }
        }
    }
}

module.exports = Guild;