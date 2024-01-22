class Upgrade
{
    constructor(name, level, maxLevel, price)
    {
        this._name = name;
        this._level = level;
        this._maxLevel = maxLevel;
        this._price = price;
        this._nextUpgrade = null;
    }

    setNextUpgrade(upgrade)
    {
        this._nextUpgrade = upgrade;
    }

    validate()
    {
        if (this._level < this._maxLevel)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    assignUpgrade(upgrade)
    {
        this._name = upgrade._name;
        this._price = upgrade._price;
        this._nextUpgrade = upgrade._nextUpgrade;
        this._perClickBonus = upgrade._perClickBonus;
        if (upgrade._perClickBonus != null)
        {
            this._perClickBonus = upgrade._perClickBonus;
        }
        else
        {
            this._perClickBonus = 0;
        }
        if (upgrade._perSecondBonus != null)
        {
            this._perSecondBonus = upgrade._perSecondBonus;
        }
        else
        {
            this._perSecondBonus = 0;
        }
    }

    onUpgrade()
    {
        if (this._nextUpgrade != null)
        {
            if (this._level == this._nextUpgrade._level)
            {
                this.assignUpgrade(this._nextUpgrade);
            }
        }
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