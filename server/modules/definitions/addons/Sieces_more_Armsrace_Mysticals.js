// This addon is automatically configured and added into the Mystical menu inside of the Bosses tab, it includes 5 Arms Race-based mysticals, do note that some of these are unbalanced for basegame and are built to be used with the base-game Arras.io Arms Race.
// Siece's more Armsrace Mysticals was created by Siecelesness, if you have any issues or comments please ask Siecelesness on discord.
// Built using APS++.

// The ID's of these bosses if planned to be added to the game are as follows: "occultist", "thaumaturge", "fuko", "ecstasy", "seior". These names are in order from egg - hexagon mysticals.

const { combineStats, skillSet, makeAuto, addAura, makeDeco } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');
g.evenmorereload = { reload: 0.25 }

module.exports = ({ Class }) => {
    // This creates Occultist, the Sorcerer based Mystical.
    Class.flatbread = {
    PARENT: ["drone"],
    SHAPE: 0,
    HITS_OWN_TYPE: "never",
    BODY: {
        FOV: .2,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["egg", { TURRET_FACES_CLIENT: true }],
	},
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [2, 0, 0, 0, 360, 1],
        TYPE: ["autoTurret", {
	    SHOOT_SETTINGS: combineStats([g.basic, g.lowpower, g.lowpower, g.evenmorereload, g.lowpower, g.lowpower]),
            CONTROLLERS: ["nearestDifferentMaster"],
            INDEPENDENT: true
        }],
    }]
};
Class.occultistDeco = makeDeco(4);
Class.occultistDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.005 }]];
Class.occultist = {
    PARENT: ["miniboss"],
    LABEL: "Occultist",
    DANGER: 7,
    SHAPE: 0,
    COLOR: 6,
    SIZE: 26,
    MAX_CHILDREN: 50,
    FACING_TYPE: "autospin",
    VALUE: 2e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
    GUNS: Array(2).fill().map((_, i) => ({
        POSITION: [3.5, 8.65, 1.2, 8, 0, i * 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, g.machgun, { size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "flatbread",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
    })),
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["egg", { TURRET_FACES_CLIENT: true }],
	},
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "occultistDeco",
        },
],
};
// This creates a recreation of Thaumaturge, the Summoner based one.

Class.solarchip = {
    PARENT: ["drone"],
    SHAPE: 4,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: .2,
        HEALTH: .1 * base.HEALTH,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["square", { TURRET_FACES_CLIENT: true }]
    }]
};
Class.thaumaturge  = {
    PARENT: ["miniboss"],
    LABEL: "Thaumaturge ",
    DANGER: 9,
    SHAPE: 4,
    COLOR: 13,
    SIZE: 26,
    MAX_CHILDREN: 25,
    FACING_TYPE: "autospin",
    VALUE: 3e5,
    BODY: {
        FOV: 1,
        SPEED: 0.2 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 2.6 * base.DAMAGE,
    },
    GUNS: [
	{
        POSITION: [3.5, 13.65, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.7 }]),
            TYPE: ["solarchip"],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
	},
	{
        POSITION: [3.5, 13.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.7 }]),
            TYPE: ["solarchip"],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
	},
	{
        POSITION: [3.5, 13.65, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.7 }]),
            TYPE: ["solarchip"],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
	},
	{
        POSITION: [3.5, 13.65, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.7 }]),
            TYPE: ["solarchip"],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
	},
      {
            POSITION: [4.25, 10, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pound]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            },
      {
            POSITION: [4.25, 10, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pound]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            },
      {
            POSITION: [4.25, 10, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pound]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            },
      {
            POSITION: [4.25, 10, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pound]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            },
    ],
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["square", { TURRET_FACES_CLIENT: true }]
    }]
};

// This creates Fuko, the Enchantress based mystical.
Class.fukochip = {
    PARENT: ["drone"],
    SHAPE: 3,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: .2,
        HEALTH: .1 * base.HEALTH,
	SPEED: 0.2 * base.SPEED,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    GUNS: Array(3).fill().map((_, i) => ({
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [10, 7, 1, 0, 0, i * 120, 0],
        },
        {
            POSITION: [3.75, 7, 1.5, 10, 0, i * 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,g.halfreload,g.halfreload]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
    })),
    TURRETS: [{
        POSITION: [14 * Math.SQRT1_2, 0, 0, 60, 0, 1],
        TYPE: ["triangle", { TURRET_FACES_CLIENT: true }],
	}],
};
Class.fuko = {
    PARENT: ["miniboss"],
    LABEL: "Fuko",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: 2,
    SIZE: 26,
    MAX_CHILDREN: 28,
    FACING_TYPE: "autospin",
    VALUE: 4e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: Array(3).fill().map((_, i) => ({
        POSITION: [3.5, 8.65, 1.2, 8, 0, i * 120, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9 }]),
            TYPE: "fukochip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
    })),
TURRETS: [{
        POSITION: [14 * Math.SQRT1_2, 0, 0, 5, 0, 1],
        TYPE: ["triangle", { TURRET_FACES_CLIENT: true }],
	}],
};

for (let i = 0; i < 3; i++) {
	Class.fuko.GUNS.push(
        {
            POSITION: [15/1.5, 7/1.5, 1/1.5, 0, 8.5, i * 120, 0],
        },
        {
            POSITION: [3/1.5, 7/1.5, 1.7/1.5, 15/1.5, 8.5, i * 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [15/1.5, 7/1.5, 1/1.5, 0, -8.5, i * 120, 0],
        },
        {
            POSITION: [3/1.5, 7/1.5, 1.7/1.5, 15/1.5, -8.5, i * 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
        },
	     )
	}
//This creates Ecstasy, the Exorcistor based mystical.
Class.ecstasyatmosphere = addAura(.05,1.3,.3,"#c679fc");
Class.doomchip = {
    PARENT: ["drone"],
    SHAPE: 5,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: .2,
        HEALTH: .025 * base.HEALTH,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [21 * Math.SQRT1_2, 0, 0, 32, 0, 1],
        TYPE: ["pentagon", { TURRET_FACES_CLIENT: true }],
	},
{
        POSITION: [10 * Math.SQRT1_2, 0, 0, 32, 0, 2],
        TYPE: ["ecstasyatmosphere"],
	},
],
};
Class.ecstasydeco = makeDeco(6);
Class.ecstasydeco.CONTROLLERS = [["spin", { independent: true, speed: -0.005 }]];
Class.ecstasydeco2 = makeDeco(3);
Class.ecstasydeco2.CONTROLLERS = [["spin", { independent: true, speed: -0.005 }]];
Class.ecstasy = {
    PARENT: ["miniboss"],
    LABEL: "Ecstasy",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: 14,
    SIZE: 26,
    MAX_CHILDREN: 20,
    FACING_TYPE: "autospin",
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 15 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    GUNS: Array(5).fill().map((_, i) => ({
        POSITION: [3.5, 8.65, 1.2, 8, 0, i * 72, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy]),
            TYPE: "doomchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
    })),
    TURRETS: [{
        POSITION: [22.5 * Math.SQRT1_2, 0, 0, 6.75, 0, 1],
        TYPE: ["pentagon", { TURRET_FACES_CLIENT: true }],
	},
        {
            POSITION: [10, 0, 0, 0, 360, 1.2],
            TYPE: "ecstasydeco",
        },
        {
            POSITION: [8, 0, 0, 0, 360, 1.1],
            TYPE: "ecstasydeco2",
        }
],
};
for (let i = 0; i < 5; i++) {
	Class.ecstasy.GUNS.push(
	{
        POSITION: [3, 8.15, 1.1, 8, 0, i * 72, 0],
        },
	     )
	}
//This creates Seior, the Apostal (Hexagon mystical)'s alternate.
Class.magicchip = {
    PARENT: ["drone"],
    SHAPE: 6,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: .2,
        HEALTH: .05 * base.HEALTH,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [24 * Math.SQRT1_2, 0, 0, 30, 0, 1],
        TYPE: ["hexagon", { TURRET_FACES_CLIENT: true }],
	}],
};
Class.seior = {
    PARENT: ["miniboss"],
    LABEL: "Seiðr",
    DANGER: 8,
    SHAPE: 6,
    COLOR: 0,
    SIZE: 26,
    MAX_CHILDREN: 15,
    FACING_TYPE: "autospin",
    VALUE: 5e5,
    BODY: {
        FOV: 0.6,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 14 * base.HEALTH,
        DAMAGE: 5.5 * base.DAMAGE,
    },
    GUNS: Array(6).fill().map((_, i) => ({
        POSITION: [3.5, 8.65, 1.2, 8, 0, i * 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy]),
            TYPE: "magicchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.necro,
            WAIT_TO_CYCLE: true,
        },
    })),
    TURRETS: [{
        POSITION: [24 * Math.SQRT1_2, 0, 0, 30, 0, 1],
        TYPE: ["hexagon", { TURRET_FACES_CLIENT: true }],
	}],
};
for (let i = 0; i < 6; i++) {
	Class.seior.TURRETS.push(
	{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 8, 0, i * 60 + 30, 160, 0],
        TYPE: ["bansheegun", { INDEPENDENT: true }],
        },
	     )
	}
//Creates the menu of Arms Race Mysticals.
Class.armsracemysticals = {
    PARENT: ["menu"],
    LABEL: "Arms Race Mysticals",
    COLOR: 13,
    SHAPE: 4,
    UPGRADES_TIER_0: ["occultist", "thaumaturge", "fuko", "ecstasy", "seior"],
    TURRETS: [{
POSITION: [15 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["square", { TURRET_FACES_CLIENT: true }],
	},
],
};
	Class.mysticals.UPGRADES_TIER_0.push("armsracemysticals");
//Reports if the addon was successfully loaded.
	console.log('[Sieces more Armsrace Mysticals] was loaded successfully!');
};