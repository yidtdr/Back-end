class Game{
    constructor(role, player, shop)
    {
        this._player = player;
        this._shop = shop;
        this._role = role;
    }

    valudateBuy(id)
    {
        return (this._shop.validate(this._player, id) && (this._shop._itemList[id].validate()))
    }
}

module.exports = Game;