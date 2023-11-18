module.exports =  ({Class, Config}) => {
  // return console.log('BY ENABLING THIS ADDON, YOU WILL COMMIT A WAR CRIME!')
  Class.redCross = {
    PARENT: "healerSymbol",
    COLOR: "#FF0000",
    BORDERLESS: true,
    FACING_TYPE: "noFacing"
  }

  Class.warCrime = {
    PARENT: "genericTank",
    SHAPE: 4,
    BORDERLESS: true,
    COLOR: "#FFFFFF",
    TURRETS: [{
      POSITION: { SIZE: 15, LAYER: 1 },
      TYPE: "redCross"
    }],
    UPGRADES_TIER_0: [],
  }

  Class.basic.UPGRADES_TIER_1.push(["warCrime"]);
}