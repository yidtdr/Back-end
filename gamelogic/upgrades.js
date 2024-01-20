class Upgrade
{
    constructor(name, level, maxLevel)
    {
        this._name = name;
        this._level = level;
        this._maxLevel = maxLevel;
    }
}

class ClickUpgrade extends Upgrade
{
    constructor(name, level, maxLevel, clickBonus)
    {
        super(name, level, maxLevel);
        this._clickBonus = clickBonus;
    }
}

class PerSecondUpgrade extends Upgrade
{
    constructor(name, level, maxLevel, perSecondInc)
    {
        super(name, level, maxLevel);
        this._perSecondInc = perSecondInc;
    }
}

module.exports = Upgrade, ClickUpgrade, PerSecondUpgrade