class Shop{
    constructor(amount, itemList)
    {
        this._amount = amount;
        this._itemList = itemList;
    }

    init(shop)
    {
        this._amount = shop._amount;
        this._itemList = shop._itemList;
    }

    appendItem(item)
    {
        this._itemList[this._amount] = item;
        this._amount++;
    }

    validate(player, itemId)
    {
        if (player._score < this._itemList[itemId]._price)
            return 0;
        return 1;
    }

    bought(player, itemId)
    {
        player.boughtUpgrade(this._itemList[itemId]._price,
         (this._itemList[itemId]._perClickBonus? this._itemList[itemId]._perClickBonus : 0),
         (this._itemList[itemId]._perSecondBonus ? this._itemList[itemId]._perSecondBonus : 0));
        this._itemList[itemId]._level++;
    }
}

module.exports = Shop