const Shop = require('./gamelogic/shop.js')
const {Upgrade, ClickUpgrade, PerSecondUpgrade} = require('./gamelogic/upgrades.js')

var object = new Shop();
var itemList = {};
// INSERT VALUES HERE //

itemList[0] = new ClickUpgrade("Cursor", 0, 10, 150, 1);
itemList[1] = new PerSecondUpgrade("Auto-clicker", 0, 10, 250, 1);
itemList[0].setNextUpgrade(new ClickUpgrade("Super Cursor", 1, 15, 1500, 5))

// INSERT VALUES HERE //
for (let i in itemList)
{
    object.appendItem(itemList[i]);
}

