// An addon is guaranteed to run only after all groups are loaded.
// This is helpful, if your group relies on all other definitions already being loaded.
// Addons that are dependant on other addons should be named something like
// "[PARENT ADDON NAME]-[EXTENSION NAME].js", to make sure that it would run after that addon ran.

const { dereference } = require('../facilitators.js')

Math.seed = function(s) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + s) & mask;
    var m_z  = (987654321 - s) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}
var seed = Math.random()*1e16; // can be any number
console.log('[corruptedTanks.js] SEED: '+seed)

module.exports = ({ Class }) => {

	const CONFIG = {
        usedTanks: 3, // Number of tanks used per generated tank
        maxChildren: 5, // The overall max children a singluar tank can have
        labelLength: 16, // The random amount of label per tank to use
        gunsPerTank: 4, // The max amount of guns to use from each tank
        turretsPerTank: 2, // The max amount of turrets to use from each tank
        propsPerTank: 2, // The max amount of props to use from each tank
    }
    numTanksToMake = 100;
    var defs = [];
    let startTank = Class.bosses; 
    let handledTanks = new Set(); 
    
    function iterateThroughUpgrades(obj) {
      let newObj = dereference(obj);
      let objName = Object.getOwnPropertyNames(Class).find(item => Class[item] === obj);
      if (handledTanks.has(objName)) return;
      handledTanks.add(objName);
      defs.push([objName, newObj]);
      
      for (const propertyName in newObj) {
        if (propertyName.startsWith("UPGRADES_TIER_")) {
            try { // hack to catch strange proprties that are undefined :/
            for (const upgrade of newObj[propertyName]) {
                iterateThroughUpgrades(Class[upgrade]);
            }
            } catch {}
        }
      }
    }
    
    
    iterateThroughUpgrades(startTank);
    let maxDefLength = defs.length
    for(let arr of defs){
        arr[1].MAX_CHILDREN = CONFIG.maxChildren
        if(arr[1].GUNS != null){
            for(let gun of arr[1].GUNS){
                if(gun.PROPERTIES != null){
                    gun.PROPERTIES.MAX_CHILDREN = CONFIG.maxChildren
                    gun.PROPERTIES.DESTROY_OLDEST_CHILD = true
                }
            }
        }
    }
    
    function generateNewTank(){
        let label = "";
        seed = Math.seed(seed)();
        let finalTank = defs[seed * defs.length | 0][1];
        seed*=1e16;
        finalTank.GUNS = [];
        finalTank.TURRETS = [];
        finalTank.LASERS = [];
        finalTank.PROPS = [];
    
        for(let i = 0; i < CONFIG.usedTanks; i++){
            seed = Math.seed(seed)();  
            let entity = defs[(seed * maxDefLength | 0)][1];
            seed*=1e16;
            if(entity.LABEL){
                seed = Math.seed(seed)();
                let end = seed*entity.LABEL.length|0
                seed*=1e16;
                if(label.length+end < CONFIG.labelLength){
                    label += entity.LABEL.substring(0, end)
                }
            }
    
            if(entity.GUNS){
                for(let a = 0; a < CONFIG.gunsPerTank; a++){
                    seed = Math.seed(seed)();
                    let gun = entity.GUNS[(seed * entity.GUNS.length | 0)]
                    seed*=1e16;
                    if(!gun) continue;
                    if(gun.PROPERTIES){
    
                    }
                    finalTank.GUNS.push(gun)
                }
            }
    
            if (entity.TURRETS) {
                for (let a = 0; a < CONFIG.turretsPerTank; a++) {
                    seed = Math.seed(seed)();
                    let turret = entity.TURRETS[(seed * entity.TURRETS.length | 0)]
                    seed*=1e16;
                    if (!turret) continue;
                    turret.MAX_CHILDREN = CONFIG.maxChildren
                    if (turret.GUNS != null) {
                        for (let gun of turret.GUNS) {
                            if (gun.PROPERTIES != null) {
                                gun.PROPERTIES.MAX_CHILDREN = CONFIG.maxChildren
                                gun.PROPERTIES.DESTROY_OLDEST_CHILD = true
                            }
                        }
                    }
                    finalTank.TURRETS.push(turret)
                }
            }
    
            if (entity.PROPS) {
                for (let a = 0; a < CONFIG.propsPerTank; a++) {
                    seed = Math.seed(seed)();
                    let prop = entity.PROPS[(seed * entity.PROPS.length | 0)]
                    seed*=1e16;
                    if (!prop) continue;
                    finalTank.PROPS.push(prop)
                }
            }
        }
    
        finalTank.LABEL = label
        //if(finalTank?.PARENT?.length)finalTank.PARENT[0].CONTROLLERS = []
        finalTank.CONTROLLERS = []
        finalTank.TYPE = "boss"
        finalTank.UPGRADES_TIER_0 = []
        finalTank.UPGRADES_TIER_1 = []
        finalTank.UPGRADES_TIER_2 = []
        finalTank.UPGRADES_TIER_3 = []
        finalTank.UPGRADES_TIER_4 = []
        finalTank.UPGRADES_TIER_5 = []
        finalTank.DIE_AT_LOW_SPEED = false
        finalTank.DIE_AT_RANGE = false
        finalTank.INDEPENDANT = true
        finalTank.HAS_NO_MASTER = true
        finalTank.ACCEPTS_SCORE = true
        finalTank.CAN_BE_ON_LEADERBOARD = true
        finalTank.GOD_MODE = false
        finalTank.IS_ARENA_CLOSER = false
        finalTank.PASSIVE = false
        finalTank.STAT_NAMES = 6 // generic
        finalTank.SKILL_CAP = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
        finalTank.AI = {}
        //finalTank.MOTION_TYPE = 'motor'
        //finalTank.FACING_TYPE = 'toTarget'
        finalTank.SANCTUARY_TYPE = 'None'
        finalTank.BOSS_TYPE = 'None'
        finalTank.RANDOM_TYPE = 'None'
        finalTank.MISC_IDENTIFIER = "None"
        finalTank.MAX_CHILDREN = (CONFIG.usedTanks*CONFIG.gunsPerTank*CONFIG.maxChildren)*0.5
        return finalTank;
    }
    var pages = [];
    while (numTanksToMake>30) {
        pages.push(30);
        numTanksToMake-=30;
    }
    pages.push(numTanksToMake);

    
    for (let page=0;page<pages.length;page++) {
        let generatedCorruptedTanks = [];
        for (let j=0;j<pages[page];j++) {
            Class[`corruptedTank_${page}_${j}`] = generateNewTank();
            generatedCorruptedTanks.push(`corruptedTank_${page}_${j}`)
        }
        if (page === 0) {
            Class.corruptedTankMenu = {
                PARENT: "menu",
                LABEL: "Corrupted Tanks",
                UPGRADES_TIER_0: (pages.length > 1) ? ([...generatedCorruptedTanks, `corruptedTankMenuPage_2`]) : ([...generatedCorruptedTanks])
            };
        } else {
            Class[`corruptedTankMenuPage_${page+1}`] = {
                PARENT: "menu",
                LABEL: `Page ${page+1}`,
                UPGRADES_TIER_0: (page === pages.length-1) ? ([...generatedCorruptedTanks]) : ([...generatedCorruptedTanks, `corruptedTankMenuPage_${page+2}`])
            };
        }
        
    }




    Class.addons.UPGRADES_TIER_0.push('corruptedTankMenu');
};