class Upgrade
{
    constructor(name, level, maxLevel, price)
    {
        this._name = name;
        this._level = level;
        this._maxLevel = maxLevel;
        this._price = price;
    }
}

class ClickUpgrade extends Upgrade
{
    constructor(name, level, maxLevel, price, perClickBonus)
    {
        super(name, level, maxLevel, price);
        this._perClickBonus = perClickBonus;
    }
}

class PerSecondUpgrade extends Upgrade
{
    constructor(name, level, maxLevel, price, perSecondBonus)
    {
        super(name, level, maxLevel, price);
        this._perSecondBonus = perSecondBonus;
    }
}

module.exports = {Upgrade, ClickUpgrade, PerSecondUpgrade}