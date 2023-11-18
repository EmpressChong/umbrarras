const {
  combineStats
} = require('../facilitators.js');
const {
  base,
  gunCalcNames
} = require('../constants.js');
const g = require('../gunvals.js');
const {
  statnames, smshskl
} = require("../constants");
const {
  boomerang,
  bee
} = require("../groups/tanks");
const {
  makeAuto, makeHybrid, makeOver, makeCeption, skillSet, dereference, addAura
} = require("../facilitators");
const {
  trap, genericTank
} = require("../groups/generics");
const {
  minion
} = require("../groups/tanks");
const {
  unsetTrap
} = require("../groups/tanks");


g.strong = {reload: 0.5, health: 1.2, damage: 1.2, pen: 1.4, speed: 2, maxSpeed: 1.4, range: 1.25, density: 2};
g.triplereload = {reload: 0.333};
g.noreload = {reload: 1.001};
g.mega = {size: 3};
g.one_fifth_reload = {reload: 1.2};
g.arnest_keeper = {
  reload: 5,
  size: 1.25,
  health: 1.05,
  damage: 1.05,
  pen: 1.1,
  speed: 0.33,
  maxSpeed: 0.4,
  range: 0.6,
  density: 1.2
};
g.big = {size: 2};
let makeAura = (type, name = -1, options = {}) => {
  let turret = {
    type: "titanAura",
    size: 6,
    independent: true,
    layer: 1,
  };
  if (options.type != null) {
    turret.type = options.type;
  }
  if (options.size != null) {
    turret.size = options.size;
  }
  if (options.angle != null) {
    turret.angle = options.angle;
  }
  let output = dereference(type);
  let aura = {
    /*********    SIZE                             X             Y         ANGLE        ARC */
    POSITION: {SIZE: turret.size, ANGLE: turret.angle, LAYER: turret.layer},
    TYPE: [
      turret.type,
    ],
  };
  if (type.GUNS != null) {
    output.GUNS = type.GUNS;
  }
  if (type.TURRETS == null) {
    output.TURRETS = [aura];
  } else {
    output.TURRETS = [...type.TURRETS, aura];
  }
  if (name === -1) {
    output.LABEL = "Aura-" + type.LABEL;
  } else {
    output.LABEL = name;
  }
  output.DANGER = type.DANGER + 1;
  return output;
}
let makeLabyShape = (type, level) => {
  let usableSHAPE = Math.max(type.SHAPE, 3),
  downscale = Math.cos(Math.PI / usableSHAPE),
      strenghtMultiplier = 5 ** (level - 1);
  return {
    LABEL: ["", "Beta ", "Alpha ", "Omega ", "Gamma ", "Delta ", "Zeta "][level] + type.LABEL,
    VALUE: type.VALUE * strenghtMultiplier,
    SHAPE: type.SHAPE,
    SIZE: type.SIZE / downscale ** (level - 1),
    COLOR: type.COLOR,
    ALPHA: type.ALPHA,
    BODY: {
      DAMAGE: type.BODY.DAMAGE,
      DENSITY: type.BODY.DENSITY,
      HEALTH: type.BODY.HEALTH * strenghtMultiplier,
      PENETRATION: type.BODY.PENETRATION,
      ACCELERATION: type.BODY.ACCELERATION
    },
    DRAW_HEALTH: type.DRAW_HEALTH,
    GIVE_KILL_MESSAGE: type.GIVE_KILL_MESSAGE || level > 2,
    GUNS: type.GUNS,
    TURRETS: [...(type.TURRETS ? type.TURRETS : []), ...Array(level).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [20 * downscale ** (i + 1), 0, 0, !(i & 1) ? 180 / usableSHAPE : 0, 0, 1],
      TYPE: [type, { MIRROR_MASTER_ANGLE: true }]
    }))]
  };
};
let makeBird = (type, name = -1, color) => {
  let output = dereference(type),
      shootyBois = [{
        POSITION: [16, 8, 1, 0, 0, 150, 0.1],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]), TYPE: "bullet", LABEL: gunCalcNames.thruster }
      },{
        POSITION: [16, 8, 1, 0, 0, 210, 0.1],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]), TYPE: "bullet", LABEL: gunCalcNames.thruster }
      },{
        POSITION: [18, 8, 1, 0, 0, 180, 0.6],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.halfrecoil]), TYPE: "bullet", LABEL: gunCalcNames.thruster }
      }];
  if (color) for (let i = 0; i < 3; i++) shootyBois[i].PROPERTIES.TYPE = [shootyBois[i].PROPERTIES.TYPE, { COLOR: color, KEEP_OWN_COLOR: true }];
  for (let i in output.GUNS) if (output.GUNS[i].PROPERTIES) output.GUNS[i].PROPERTIES.ALT_FIRE = true;
  if (output.FACING_TYPE === "locksFacing") output.FACING_TYPE = "toTarget";
  output.GUNS = type.GUNS == null ? [...shootyBois] : [...output.GUNS, ...shootyBois];
  output.LABEL = name === -1 ? "Bird " + type.LABEL : name;
  return output;
};

let makeMiniElite = type => {
  let out = dereference(type);
  out.PARENT = 'minielite';
  out.COLOR = genericTank.COLOR;
  out.HEALTH = base.HEALTH;
  return out;
};
let makeMiniBoss = type => {
  let out = dereference(type);
  out.SIZE = 11;
  out.COLOR = genericTank.COLOR;
  out.HEALTH = base.HEALTH;
  return out;
};

module.exports = ({
                    Class
                  }) => {

  // This addon is enabled by default. Uncomment line below to disable.
  // return console.log('[empressaddons.js] Addon disabled by default');

  // Empress' Creations
  Class.reload
  Class.eliteFortress = {
    PARENT: ["elite"],
    AI: {
      STRAFE: true
    },
    GUNS: [{
      POSITION: [4, 6, 0.6, 7, -8, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
        TYPE: "autoswarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
      {
        POSITION: [4, 6, 0.6, 7, 8, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 6, 0.6, 7, -8, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 6, 0.6, 7, 8, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 6, 0.6, 7, -8, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 6, 0.6, 7, 8, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ],
    TURRETS: [{
      POSITION: [10, 0, 0, 0, 360, 1],
      TYPE: "auraBasicGen",
    }],
  };
  for (let i = 0; i < 3; i++) {
    Class.eliteFortress.GUNS.push(
        {
      POSITION: [10.5, 6, 1, 0, 0, 120 * i + 60, 0],
    }, {
      POSITION: [3, 6, 1.7, 10.5, 0, 120 * i + 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    }, )
  }

  // DELTA CRASHERS
  Class.delta = {
    PARENT: ["miniboss"],
    LABEL: "Delta Crasher",
    COLOR: 5,
    SHAPE: 3,
    SIZE: 27,
    VARIES_IN_SIZE: true,
    VALUE: 5e5,
    BODY: {
      FOV: 1.3,
      SPEED: 0.08 * base.SPEED,
      HEALTH: 8 * base.HEALTH,
      DAMAGE: 3.5 * base.DAMAGE,
    },
  };

  Class.deltaFortressTop = {
    PARENT: ["elite"],
    AI: {
      STRAFE: false,
      NO_LEAD: false
    },
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: -0.005
      }],
      //"nearestDifferentMaster",
    ],
    INDEPENDENT: true,
    GUNS: [{
      POSITION: [4, 6, 0.7, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,
      },
    },
      {
        POSITION: [4, 6, 0.7, 7, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
            range: 1.5
          }]),
          TYPE: ["swarm", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [4, 6, 0.7, 7, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
            range: 1.5
          }]),
          TYPE: ["swarm", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
        },
      },
    ],
    TURRETS: [],
  }
  for (let i = 0; i < 3; i++) {
    Class.deltaFortressTop.GUNS.push({
      POSITION: [4, 6, 0.7, 7, 7, 120 * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,

      },
    }, {
      POSITION: [4, 6, 0.7, 7, -7, 120 * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,
      },
    }, )
  }
  Class.deltaFortress = {
    PARENT: ["delta"],
    AI: {
      STRAFE: true
    },
    GUNS: [{
      POSITION: [10.5, 6, 1, 0, 6, 60, 0],
    },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, 60, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, 180, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 180, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 180, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, -60, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, -60, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
    TURRETS: [{
      POSITION: [13, 0, 0, 0, 360, 1],
      TYPE: "deltaFortressTop",
    },
      {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: "auraBasicGen",
      },
    ],
  };
  // SHINY DELTA CRASHERS LOL
  Class.shinydeltas = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Delta Crasher",
    COLOR: 1,
    SHAPE: 3.5,
    SIZE: 54,
    VARIES_IN_SIZE: true,
    VALUE: 1e6,
    BODY: {
      FOV: 1.4,
      SPEED: 0.02 * base.SPEED,
      HEALTH: 12 * base.HEALTH,
      DAMAGE: 4.5 * base.DAMAGE,
    },
    UPGRADES_TIER_0: [],
  };
  Class.shinydeltaFortressTop = {
    PARENT: ["shinydeltas"],
    AI: {
      STRAFE: false,
      NO_LEAD: false
    },
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: -0.005
      }],
      //"nearestDifferentMaster",
    ],
    INDEPENDENT: true,
    GUNS: [{
      POSITION: [4, 6, 0.7, 7, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,
      },
    },
      {
        POSITION: [4, 6, 0.7, 7, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
            range: 1.5
          }]),
          TYPE: ["swarm", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [4, 6, 0.7, 7, 0, 270, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
            range: 1.5
          }]),
          TYPE: ["swarm", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [4, 6, 0.7, 7, 0, 330, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
            range: 1.5
          }]),
          TYPE: ["swarm", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
        },
      },
    ],
    TURRETS: [],
  }
  for (let i = 0; i < 4; i++) {
    Class.shinydeltaFortressTop.GUNS.push({
      POSITION: [4, 6, 0.7, 7, 7, 90 * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,

      },
    }, {
      POSITION: [4, 6, 0.7, 7, -7, 90 * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.pound, g.morespeed, g.morespeed, g.mini, g.doublereload, {
          range: 1.5
        }]),
        TYPE: ["swarm", {
          INDEPENDENT: true
        }],
        STAT_CALCULATOR: gunCalcNames.swarm,
        AUTOFIRE: true,
      },
    }, )
  }
  Class.shinydeltaFortress = {
    PARENT: ["shinydeltas"],
    AI: {
      STRAFE: true
    },
    GUNS: [{
      POSITION: [10.5, 6, 1, 0, 6, 40, 0],
    },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 40, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, 80, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, 80, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, 120, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 160, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 160, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 200, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 200, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 240, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, -6, 280, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, -6, 280, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 320, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 320, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [10.5, 6, 1, 0, 6, 360, 0],
      },
      {
        POSITION: [3, 6, 1.7, 10.5, 6, 360, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
    TURRETS: [{
      POSITION: [13, 0, 0, 0, 360, 1],
      TYPE: "shinydeltaFortressTop",
    },
      {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: "auraBasicGen",
      },
    ],
  };
  Class.holywaferbread = {
    PARENT: ["sunchip"],
    SHAPE: 0,
    COLOR: 3,
  };
  Class.holysorcerer = {
    PARENT: ["miniboss"],
    LABEL: "Holy Sorcerer",
    DANGER: 50,
    SHAPE: 0,
    COLOR: 3,
    SIZE: 26,
    MAX_CHILDREN: 150,
    FACING_TYPE: "autospin",
    VALUE: 15e6,
    BODY: {
      FOV: 0.8,
      SPEED: 0.15 * base.SPEED,
      HEALTH: 25 * base.HEALTH,
      DAMAGE: 34 * base.DAMAGE,
    },
    GUNS: Array(2).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [4.5, 11, 1.2, 8, 0, i * 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, g.machgun, g.strong, g.triplereload, g.strong, {
          size: 0.8,
          spray: 150,
          speed: 2,
          shudder: 1.75
        }]),
        TYPE: "holywaferbread",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };

  // MYSTICALS EXTENSION
  Class.wormchip = {
    PARENT: ["sunchip"],
    SHAPE: 7
  };
  Class.perseus = {
    PARENT: ["miniboss"],
    LABEL: "Perseus",
    DANGER: 9,
    SHAPE: 7,
    COLOR: 30,
    SIZE: 26,
    MAX_CHILDREN: 14,
    FACING_TYPE: "autospin",
    VALUE: 6e5,
    BODY: {
      FOV: 0.6,
      SPEED: 0.06 * base.SPEED,
      HEALTH: 18 * base.HEALTH,
      DAMAGE: 6.5 * base.DAMAGE,
    },
    GUNS: Array(7).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 7.7, 1.2, 8, 0, i * 51, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, { size: 1.2, }]),
        TYPE: "wormchip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };
  Class.electrochip = {
    PARENT: ["sunchip"],
    SHAPE: 8
  };
  Class.dardanos = {
    PARENT: ["miniboss"],
    LABEL: "Dardanos",
    DANGER: 9,
    SHAPE: 8,
    COLOR: 15,
    SIZE: 26,
    MAX_CHILDREN: 14,
    FACING_TYPE: "autospin",
    VALUE: 7e5,
    BODY: {
      FOV: 0.6,
      SPEED: 0.05 * base.SPEED,
      HEALTH: 19 * base.HEALTH,
      DAMAGE: 7.5 * base.DAMAGE,
    },
    GUNS: Array(8).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 7, 1.2, 8, 0, i * 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, { size: 1.3, }]),
        TYPE: "electrochip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };
  Class.divinechip = {
    PARENT: ["sunchip"],
    SHAPE: 9,
  };
  Class.cora = {
    PARENT: ["miniboss"],
    LABEL: "Cora",
    DANGER: 9,
    SHAPE: 8,
    COLOR: "#65F0EC",
    SIZE: 26,
    MAX_CHILDREN: 13,
    FACING_TYPE: "autospin",
    VALUE: 9e5,
    BODY: {
      FOV: 0.9,
      SPEED: 0.09 * base.SPEED,
      HEALTH: 20 * base.HEALTH,
      DAMAGE: 9 * base.DAMAGE,
    },
    GUNS: Array(9).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 7, 1.2, 8, 0, i * 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, { size: 1.4, }]),
        TYPE: "divinechip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };
  Class.nightchip = {
    PARENT: ["sunchip"],
    SHAPE: 12,
  };
  Class.concordia = {
    PARENT: ["miniboss"],
    LABEL: "Concordia",
    DANGER: 12,
    SHAPE: 12,
    COLOR: 8,
    SIZE: 26,
    MAX_CHILDREN: 12,
    FACING_TYPE: "autospin",
    VALUE: 10e5,
    BODY: {
      FOV: 0.6,
      SPEED: 0.02 * base.SPEED,
      HEALTH: 21 * base.HEALTH,
      DAMAGE: 10 * base.DAMAGE,
    },
    GUNS: Array(12).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 4, 1.2, 8, 0, i * 30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, { size: 1.5,}]),
        TYPE: "nightchip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };
  //** Made by Umbra :3 (yes I really put this here just cause you said you will steal it)
  // MYSTICALS EXTENSION PT. 2: SHINY OMEGA
  Class.shinyomegaSorcerer = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Omega Sorcerer",
    DANGER: 8,
    SHAPE: 0,
    COLOR: 1,
    SIZE: 52,
    DENSITY: 2,
    MAX_CHILDREN: 100,
    FACING_TYPE: "autospin",
    VALUE: 3e5,
    BODY: {
      FOV: 0.5,
      SPEED: 0.09 * base.SPEED,
      HEALTH: 9 * base.HEALTH,
      DAMAGE: 4.5 * base.DAMAGE,
    },
    GUNS: Array(2).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, g.machgun, g.doublereload, g.strong, {
          size: 0.4,
          spray: 150,
          speed: 2,
          shudder: 1.75
        }]),
        TYPE: "shinybetawaferbread",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    })),
    TURRETS: [{
      POSITION: [15, 0, 0, 45, 0, 1],
      TYPE: "shinyEggDummy"
    },
      {
        POSITION: [10, 0, 0, 45, 0, 1],
        TYPE: "shinyEggDummy"
      },
      {
        POSITION: [3, 0, 0, 45, 0, 1],
        TYPE: "shinyEggDummy"
      },
    ]
  };
  Class.shinySquareDummy = {
    SHAPE: 4,
    COLOR: 1,
  }
  Class.shinyomegasummoner = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Omega Summoner",
    DANGER: 9,
    SHAPE: 4,
    COLOR: 1,
    SIZE: 52,
    MAX_CHILDREN: 12,
    FACING_TYPE: "autospin",
    VALUE: 5e5,
    BODY: {
      FOV: 0.5,
      SPEED: 0.08 * base.SPEED,
      HEALTH: 13 * base.HEALTH,
      DAMAGE: 5.5 * base.DAMAGE,
    },
    GUNS: Array(4).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, g.destroy, g.veryfast, g.strong, {
          maxSpeed: 3
        }, {
          size: 0.8
        }]),
        TYPE: ["shinyomegasunchip"],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    })),
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
      TYPE: ["shinySquare", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 0, 0, 1],
      TYPE: ["shinySquare", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 3, 0, 0, 45, 0, 1],
      TYPE: ["shinySquare", {
        MIRROR_MASTER_ANGLE: true
      }]
    }]
  };
  Class.shinydoritoDummy = {
    SHAPE: 3,
    COLOR: 1,
  }
  Class.shinyomegadorito = {
    PARENT: ["sunchip"],
    SHAPE: 3,
    HITS_OWN_TYPE: "hard",
    BODY: {
      FOV: 0.5,
    },
    AI: {
      BLIND: true,
      FARMER: true,
    },
    NECRO: [3],
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 1.5, 0, 0, 0, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 360, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }]
  };
  Class.shinyomegaenchantress = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Omega Enchantress",
    DANGER: 11,
    SHAPE: 3.5,
    COLOR: 1,
    SIZE: 52,
    MAX_CHILDREN: 9,
    FACING_TYPE: "autospin",
    VALUE: 750000,
    BODY: {
      FOV: 0.5,
      SPEED: 0.07 * base.SPEED,
      HEALTH: 18 * base.HEALTH,
      DAMAGE: 7.5 * base.DAMAGE,
    },
    GUNS: Array(3).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, g.destroy, g.veryfast, g.strong, g.lessreload, {
          maxSpeed: 3
        }, {
          size: 0.9
        }]),
        TYPE: "shinyomegadorito",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    })),
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 1.5, 0, 0, 0, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 360, 0, 1],
      TYPE: ["shinydoritoDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }]
  };
  Class.shinypentaDummy = {
    COLOR: 1,
    SHAPE: 5,
  }
  Class.shinyomegademonchip = {
    PARENT: ["sunchip"],
    SHAPE: 5,
    HITS_OWN_TYPE: "hard",
    BODY: {
      FOV: 0.4,
    },
    AI: {
      BLIND: true,
      FARMER: true,
    },
    NECRO: [5],
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 1.5, 0, 0, 0, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 360, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }]
  };
  Class.shinyomegaexorcistor = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Omega Exorcistor",
    DANGER: 15,
    SHAPE: 5.5,
    COLOR: 1,
    SIZE: 52,
    MAX_CHILDREN: 5,
    FACING_TYPE: "autospin",
    VALUE: 1000000,
    BODY: {
      FOV: 0.4,
      SPEED: 0.05 * base.SPEED,
      HEALTH: 22 * base.HEALTH,
      DAMAGE: 9 * base.DAMAGE,
    },
    GUNS: Array(5).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 72, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, g.destroy, g.veryfast, g.strong, g.one_third_reload, {
          maxSpeed: 3
        }, {
          size: 1.5
        }]),
        TYPE: "shinyomegademonchip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    })),
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 1.5, 0, 0, 0, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }, {
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 360, 0, 1],
      TYPE: ["shinypentaDummy", {
        MIRROR_MASTER_ANGLE: true
      }]
    }]
  };

  // CELESTIALLY CELESTIAL
  Class.celestiallycelestial = {
    PARENT: ["celestial"],
    LABEL: "Celestiallest Celestial",
    NAME: "Celeste",
    AI: {
      STRAFE: true,
    },
    SHAPE: 0,
    COLOR: 38,
    SIZE: 50,
    BODY: {
      SPEED: 2 * base.SPEED,
    },
    TURRETS: [{
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: ["freyja", {
        INDEPENDENT: true,
      }],
    },
      {
        POSITION: [12, 0, 0, 0, 360, 1],
        TYPE: ["nyx", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["theia", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [6, 0, 0, 0, 360, 1],
        TYPE: ["zaphkiel", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [3, 0, 0, 0, 360, 1],
        TYPE: ["paladin", {
          INDEPENDENT: true,
        }],
      },
    ],
  }
  // MYSTICALLEST MYSTICAL
  Class.mysticallestmystical = {
    PARENT: ["miniboss"],
    LABEL: "Mysticallest Mystical",
    NAME: "Mysta",
    AI: {
      STRAFE: true,
    },
    SHAPE: 8,
    COLOR: 36,
    SIZE: 50,
    BODY: {
      SPEED: 2 * base.SPEED,
    },
    TURRETS: [{
      POSITION: [15, 7, 0, 45, 0, 0, 0],
      TYPE: ["sorcerer", {
        INDEPENDENT: true,
      }],
    },
      {
        POSITION: [15, 7, 0, 90, 0, 0, 0],
        TYPE: ["summoner", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 135, 0, 0, 0],
        TYPE: ["enchantress", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 180, 0, 0, 0],
        TYPE: ["exorcistor", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 225, 0, 0, 0],
        TYPE: ["shaman", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 270, 0, 0, 0],
        TYPE: ["perseus", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 315, 0, 0, 0],
        TYPE: ["dardanos", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [15, 7, 0, 360, 0, 0, 0],
        TYPE: ["concordia", {
          INDEPENDENT: true,
        }],
      },
    ],
  }
  Class.rogueRammer = {
    PARENT: ["miniboss"],
    LABEL: "Rogue Rammer",
    COLOR: 17,
    SHAPE: 6,
    SIZE: 35,
    BODY: {
      SPEED: 2 * base.SPEED,
      BULLET_HEALTH: 0.8 * base.BULLET_HEALTH,
      BULLET_DAMAGE: 0.8 * base.BULLET_DAMAGE,
      BULLET_PEN: 0.8 * base.BULLET_PEN,
      RELOAD: 0.8 * base.RELOAD,
      HEALTH: 18 * base.HEALTH,
      BODY_DAMAGE: 5 * base.BODY_DAMAGE,
    },
    TURRETS: [{
      POSITION: [14.5, 0, 0, 0, 360, 1],
      TYPE: ["gersemiLowerBody", {
        COLOR: 17,
      }],
    },
      {
        POSITION: [8.5, 0, 0, 0, 360, 1],
        TYPE: ["gersemiUpperBody", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [6, 0, 0, 0, 360, 1],
        TYPE: ["auraBasicGen"],
      },
    ],
  };
  for (let i = 0; i < 6; i++) {
    Class.rogueRammer.TURRETS.push({
      POSITION: [7, 9, 0, 360 / 6 * (i + 0.5), 180, 0],
      TYPE: ["terrestrialTrapTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  // ROGUE EMPRESS
  Class.autoSmasherDrone = {
    PARENT: ["drone"],
    LABEL: "Auto-Smasher Drone",
    COLOR: 18,
    DANGER: 6,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    BODY: {
      PUSHABILITY: 0.3,
      HEALTH: 0.25 * 5,
      DAMAGE: 3.265 / 5,
      SPEED: 2,
      DENSITY: 0.1,
      RESIST: 3,
      FOV: 100,
    },
    SHAPE: 0,
    GUNS: [],
    TURRETS: [{
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "smasherBody",
    },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: ["auto4gun", {
          INDEPENDENT: true
        }],
      },
    ],
  }
  Class.rogueEmpressLowerBody = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Empress Lower Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: -0.005
      }]
    ],
    FACING_TYPE: ["spin", {
      speed: -0.005
    }],
    COLOR: 17,
    SIZE: 100,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 12,
    FOV: 10,
    MAX_CHILDREN: 12,
    GUNS: [],
  }
  for (let i = 0; i < 12; i++) {
    Class.rogueEmpressLowerBody.GUNS.push(
        {
          POSITION: [2.5, 3, 1.6, 9, 0, 360 / 12 * i, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.factory, g.celeslower, g.pound, g.summoner, g.one_third_reload, g.halfreload, g.lessreload, g.one_third_reload, g.slow, g.one_third_reload, g.slow, g.halfreload, g.lessreload, g.lessreload, {
              size: 2.1
            }]),
            TYPE: ["autoSmasherDrone", {
              INDEPENDENT: true,
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
          },
        }, {
          POSITION: [1.5, 1, 1, 9, 0, 360 / 12 * i, 0],
        },
    )
  }
  Class.askshybridMissile = {
    PARENT: ["missile"],
    LABEL: "Auto-Smasher-Trap-Skimmer Hybrid Missile",
    HITS_OWN_TYPE: "never",
    DANGER: 6,
    COLOR: 18,
    SHAPE: 0,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    BODY: {
      FOV: 1.05 * base.FOV,
      DENSITY: 2 * base.DENSITY,
    },
    GUNS: [
      {
        POSITION: [4, 6, 1.6, 13, -2, 90, 0.5],
      },
      {
        POSITION: [4, 6, 1.6, 13, 2, -90, 0.5],
      },
      {
        POSITION: [14, 6, 1, 0, -2, 150, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [14, 6, 1, 0, 2, 210, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [5, 7, 1, 9, -2, 90, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.trap,
            g.halfrange,
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ]),
          TYPE: [
            "trap",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [5, 7, 1, 9, 2, -90, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.trap,
            g.halfrange,
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          ]),
          TYPE: [
            "trap",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
    ],
    TURRETS: [{
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "smasherBody",
    },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: ["auto4gun", {
          INDEPENDENT: true
        }],
      },
    ],
  }
  Class.askshybridTurret = {
    PARENT: ["genericTank"],
    LABEL: "Triple-Auto-Smasher-Trap-Skimmer Hybrid Turret",
    BODY: {
      FOV: 10,
    },
    COLOR: 16,
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [{
      POSITION: [3, 10, 1.2, 15, 0, 0, 0],
    },
      {
        POSITION: [16, 18, -0.7, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            g.basic,
            g.pound,
            g.arty,
            g.skim,
            g.morespeed,
            g.one_third_reload,
            g.lessreload,
            g.halfreload,
            g.one_third_reload,
            g.halfreload,
            g.lessreload,
            {
              range: 3
            },
          ]),
          TYPE: "askshybridMissile",
        },
      },
    ],
  };
  Class.rogueEmpressBottomBody = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Empress Bottom Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: 0.005
      }]
    ],
    FACING_TYPE: ["spin", {
      speed: 0.005
    }],
    COLOR: 17,
    SIZE: 100,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 9,
    FOV: 1,
    TURRETS: [],
  };
  for (let i = 0; i < 9; i++) {
    Class.rogueEmpressBottomBody.TURRETS.push({
      POSITION: [6.5, 9, 0, 360 / 9 * (i + 0.5), 160, 0],
      TYPE: ["askshybridTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  Class.rogueEmpressMiddleBody = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Empress Middle Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: -0.005
      }]
    ],
    FACING_TYPE: ["spin", {
      speed: -0.005
    }],
    COLOR: 17,
    SIZE: 100,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 6,
    FOV: 1,
    TURRETS: [],
  };
  for (let i = 0; i < 6; i++) {
    Class.rogueEmpressMiddleBody.TURRETS.push({
      POSITION: [8.5, 9, 0, 360 / 6 * (i + 0.5), 160, 0],
      TYPE: ["guardGunnerScratch", {
        INDEPENDENT: true,
        COLOR: 16,
      }],
    }, )
  }
  Class.rogueAnni = {
    PARENT: ["miniboss"],
    LABEL: "Rogue Devastator",
    COLOR: 17,
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    FACING_TYPE: ["autospin"],
    AUTOSPIN: true,
    AUTOFIRE: true,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
      FOV: 1.4,
      SPEED: 0.05 * base.SPEED,
      HEALTH: 16 * base.HEALTH,
      SHIELD: 3 * base.SHIELD,
    },
    GUNS: [{
      POSITION: [4, 6, -1.6, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
        TYPE: ["bullet"],
        AUTOFIRE: true
      }
    },
      {
        POSITION: [4, 6, -1.6, 8, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
          TYPE: ["bullet"],
          AUTOFIRE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
          TYPE: ["bullet"],
          AUTOFIRE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
          TYPE: ["bullet"],
          AUTOFIRE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
          TYPE: ["bullet"],
          AUTOFIRE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 300, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.pound, g.destroy, g.destroy, g.anni, g.halfrecoil, g.lessreload, g.basic]),
          TYPE: ["bullet"],
          AUTOFIRE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 30, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 90, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 150, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 210, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 270, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [11, 7, 0.6, 0, 0, 330, 0],
        PROPERTIES: {
          TYPE: "swarm",
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
          STAT_CALCULATOR: gunCalcNames.swarm,
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
    ],
  }
  Class.rogueEmpressPillbox = {
    PARENT: ["unsetTrap"],
    LABEL: "Rogue Empress Pillbox",
    BODY: {
      SPEED: 1,
      DENSITY: 5,
    },
    DIE_AT_RANGE: false,
    TURRETS: [{
      POSITION: [11, 0, 0, 0, 360, 1],
      TYPE: "legionaryTwin",
    }, ],
  }
  Class.assemblerDotRE = {
    LABEL: '',
    SHAPE: -4,
    COLOR: 16
  };
  Class.assemblerTrapRE = {
    PARENT: ['setTrap'],
    LABEL: "Assembler Trap",
    BODY: {
      SPEED: 0.7,
      ACCEL: 0.75
    },
    TURRETS: [
      {
        /**        SIZE X  Y  ANGLE ARC */
        POSITION: [4, 0, 0, 0,    360, 1],
        TYPE: 'assemblerDotRE'
      }
    ],
    HITS_OWN_TYPE: 'assembler'
  };
  Class.assemblerturret = {
    PARENT: ['genericTank'],
    DANGER: 7,
    LABEL: 'Assembler',
    STAT_NAMES: statnames.trap,
    BODY: {
      FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    AUTOFIRE: true,
    GUNS: [
      {
        POSITION: [18, 12, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [2, 12, 1.1, 18, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block]),
          TYPE: 'assemblerTrapRE',
          MAX_CHILDREN: 8
        }
      }
    ],
    TURRETS: [
      {
        /**        SIZE X   Y  ANGLE ARC */
        POSITION: [2.5, 14, 0, 0,    360, 1],
        TYPE: 'assemblerDot'
      }
    ]
  };
  Class.rogueEmpressTopBody = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Empress Top Body",
    SIZE: 100,
    COLOR: 17,
    MAX_CHILDREN: 5,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 3,
    TURRETS: [],
    CONTROLLERS: [
      ["spin", {
        speed: 0.1,
      }]
    ],
    GUNS: [{
      POSITION: [5, 14, 1.6, 6, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.veryfast, g.mini, {
          maxSpeed: 3
        }]),
        TYPE: ["legionaryPillbox", {
          AUTOFIRE: true,
        }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
      {
        POSITION: [5, 14, 1.6, 6, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.veryfast, g.mini, {
            maxSpeed: 3
          }]),
          TYPE: ["legionaryPillbox", {
            AUTOFIRE: true,
          }],
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [5, 14, 1.6, 6, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.veryfast, g.mini, {
            maxSpeed: 3
          }]),
          TYPE: ["legionaryPillbox", {
            AUTOFIRE: true,
          }],
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [5, 8, 1.6, 9, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.summoner, g.minion, g.mega, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, {
            SIZE: 45
          }]),
          TYPE: ["alviss", {
            INDEPENDENT: true,
          }],
        },
      },
      {
        POSITION: [5, 8, 1.6, 9, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.summoner, g.minion, g.mega, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, {
            SIZE: 45
          }]),
          TYPE: ["tyr", {
            INDEPENDENT: true,
          }],
        },
      },
      {
        POSITION: [5, 8, 1.6, 9, 0, 360, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.summoner, g.minion, g.mega, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, {
            SIZE: 45
          }]),
          TYPE: ["fiolnir", {
            INDEPENDENT: true,
          }],
        },
      },
      {
        POSITION: [5, 8, 1.6, 9, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.summoner, g.minion, g.mega, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, {
            SIZE: 28
          }]),
          TYPE: ["rogueArmada", {
            INDEPENDENT: true,
          }],
        },
      },
      {
        POSITION: [5, 8, 1.6, 9, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.summoner, g.minion, g.mega, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, g.noreload, g.one_third_reload, g.lessreload, g.lessreload, g.halfreload, g.lessreload, {
            SIZE: 28
          }]),
          TYPE: ["roguePalisade", {
            INDEPENDENT: true,
          }],
        },
      },
    ],
  }
  for (let i = 0; i < 3; i++) {
    Class.rogueEmpressTopBody.TURRETS.push({
      POSITION: [16, 12, 0, 360 / 3 * (i + 0.5), 180, 0],
      TYPE: ["assemblerturret", {
      }],
    }, )
  }
  Class.rogueWarrior = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Warrior",
    COLOR: 18,
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    GUNS: [],
    TURRETS: [],
  };
  for (let i = 0; i < 3; i++) {
    Class.rogueWarrior.GUNS.push({
      POSITION: [17, 8, 1, 0, 0, 120 * i, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.sniper, g.doublereload]),
        TYPE: "bullet",
      },
    }, {
      POSITION: [13, 8, 1, 0, 0, 120 * i + 60, 0],
    }, {
      POSITION: [4, 8, 1.7, 13, 0, 120 * i + 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.doublereload, ]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    }, )
    Class.rogueWarrior.TURRETS.push({
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: ["bigauto4gun"]
    }, )
  }
  Class.rogueEmpressBase = {
    PARENT: ["genericTank"],
    LABEL: "Rogue Empress Base",
    FACING_TYPE: "autospin",
    DANGER: 4,
    SHAPE: 12,
    COLOR: 17,
    SIZE: 150,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    BROADCAST_MESSAGE: "The Rogue Empress Has Fallen!",
    BODY: {
      SPEED: base.SPEED * 0.005,
    },
    TURRETS: [],
  }
  for (let i = 0; i < 12; i++) {
    Class.rogueEmpressBase.TURRETS.push({
      POSITION: [5, 8.5, 0, 360 / 12 * (i + 1), 30, 0],
      TYPE: ["baseTrapTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  Class.rogueEmpress = {
    PARENT: ["eternal"],
    LABEL: "Rogue Empress",
    AI: {
      STRAFE: true,
    },
    NAME: "Supernova",
    FACING_TYPE: "autospin",
    DANGER: 50, //How dangerous it is according to AI
    SHAPE: 12,
    COLOR: 17,
    SIZE: 150,
    VALUE: 1e9,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    BROADCAST_MESSAGE: "The Rogue Empress Has Fallen!",
    BODY: {
      SPEED: base.SPEED * 0.005,
      HEALTH: base.HEALTH * 1.5,
    },
    TURRETS: [{
      POSITION: [15.5, 0, 0, 0, 360, 1],
      TYPE: ["rogueEmpressLowerBody"],
    },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: ["rogueEmpressBottomBody"],
      },
      {
        POSITION: [6.5, 0, 0, 0, 360, 1],
        TYPE: ["rogueEmpressMiddleBody"],
      },
      {
        POSITION: [2, 0, 0, 0, 360, 1],
        TYPE: ["rogueEmpressTopBody"],
      },
      {
        POSITION: [0.6, 0, 0, 0, 360, 1],
        TYPE: ["rogueWarrior"],
      },
    ],
  };
  for (let i = 0; i < 12; i++) {
    Class.rogueEmpress.TURRETS.push({
      POSITION: [5, 8.5, 0, 360 / 12 * (i + 1), 30, 0],
      TYPE: ["baseTrapTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  Class.rogueEmpressTier = {
    PARENT: ["menu"],
    LABEL: "Rogue Empress Tier",
    SHAPE: 12,
    COLOR: 17,
    UPGRADES_TIER_0: []
  }
  // WARK
  Class.warkGun = {
    PARENT: ["genericTank"],
    LABEL: "Auto-Wark",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 16,
    GUNS: [{
      POSITION: [16, 4, 1, 0, -3.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.auto, g.gunner, g.trap, g.power, g.slow]),
        TYPE: "trap",
      },
    },
      {
        POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.auto, g.gunner, g.trap, g.power, g.slow]),
          TYPE: "trap",
        },
      },
    ],
  }
  Class.warkMissile = {
    PARENT: ["missile"],
    LABEL: "Auto-Wark Wark Missile",
    HITS_OWN_TYPE: "never",
    DANGER: 6,
    COLOR: 36,
    SHAPE: 0,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    BODY: {
      FOV: 1.05 * base.FOV,
      DENSITY: 2 * base.DENSITY,
    },
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [13, 8, 1, 0, 5.5, 185, 0],
    },
      {
        POSITION: [3, 9, 1.5, 13, 5.5, 185, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
          AUTOFIRE: true,
        },
      },
      {
        /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [13, 8, 1, 0, -5.5, 175, 0],
      },
      {
        POSITION: [3, 9, 1.5, 13, -5.5, 175, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
          AUTOFIRE: true,
        },
      },
    ],
    TURRETS: [{
      POSITION: [11, 0, 0, 0, 360, 1],
      TYPE: ["warkGun", {
        INDEPENDENT: true
      }],
    }, ],
  }
  Class.warkMissileTurret = {
    PARENT: ["genericTank"],
    LABEL: "Auto-Wark Wark Missile Turret",
    BODY: {
      FOV: 10,
    },
    COLOR: 16,
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [{
      POSITION: [3, 10, 1.2, 15, 0, 0, 0],
    },
      {
        POSITION: [16, 18, -0.7, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            g.basic,
            g.pound,
            g.arty,
            g.skim,
            g.morespeed,
            g.one_third_reload,
            g.lessreload,
            g.halfreload,
            {
              range: 3
            },
          ]),
          TYPE: "warkMissile",
        },
      },
    ],
  };
  Class.warkBottomBody = {
    PARENT: ["genericTank"],
    LABEL: "Wark Bottom Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: 0.005
      }]
    ],
    FACING_TYPE: ["spin", {
      speed: 0.005
    }],
    COLOR: 36,
    SIZE: 100,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 9,
    FOV: 1,
    TURRETS: [],
  };
  for (let i = 0; i < 9; i++) {
    Class.warkBottomBody.TURRETS.push({
      POSITION: [6.5, 9, 0, 360 / 9 * (i + 0.5), 160, 0],
      TYPE: ["warkMissileTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  Class.machineGunnerWarkTurret = {
    PARENT: ["genericTank"],
    LABEL: "Machine Gunner Wark Turret",
    STAT_NAMES: statnames.mixed,
    DANGER: 7,
    BODY: {
      FOV: 10,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [13, 8, 1, 0, 5.5, 0, 0],
    },
      {
        POSITION: [3, 9, 1.5, 13, 5.5, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [13, 8, 1, 0, -5.5, 0, 0],
      },
      {
        POSITION: [3, 9, 1.5, 13, -5.5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [9, 5.5, 1, 0, 5.5, 0, 0],
      },
      {
        POSITION: [1.5, 6, 1.5, 13, 5.5, 0, 1],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [9, 5.5, 1, 0, -5.5, 0, 0],
      },
      {
        POSITION: [1.5, 6, 1.5, 13, -5.5, 0, 1.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [7, 3, 1, 0, 5.5, 0, 0],
      },
      {
        POSITION: [0.5, 4, 1.5, 13, 5.5, 0, 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [7, 3, 1, 0, -5.5, 0, 0],
      },
      {
        POSITION: [0.5, 4, 1.5, 13, -5.5, 0, 2.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, ]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
  Class.warkMiddleBody = {
    LABEL: "Wark Middle Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: 0.005
      }]
    ],
    COLOR: 36,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    SHAPE: 7,
    FOV: 1,
    TURRETS: [],
  };
  for (let i = 0; i < 7; i++) {
    Class.warkMiddleBody.TURRETS.push({
      POSITION: [7, 8.5, 0, 360 / 7 * (i + 0.5), 160, 0],
      TYPE: ["machineGunnerWarkTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  Class.warkTopBody = {
    PARENT: ["genericTank"],
    LABEL: "Wark Top Body",
    CONTROLLERS: [
      ["spin", {
        independent: true,
        speed: 0.005
      }]
    ],
    FACING_TYPE: ["spin", {
      speed: 0.005
    }],
    COLOR: 36,
    SIZE: 100,
    SKILL_CAP: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    SHAPE: 5,
    FOV: 2,
    TURRETS: [],
  };
  for (let i = 0; i < 5; i++) {
    Class.warkTopBody.TURRETS.push({
      POSITION: [8, 11, 0, 360 / 5 * (i + 0.5), 160, 0],
      TYPE: ["barricadeTurret", {
        INDEPENDENT: true,
        AUTOFIRE: true,
      }],
    }, )
  }
  Class.wawawarkrkrkwarkwark = {
    PARENT: ["eternal"],
    LABEL: "wkakwrwrwkarkrkwarkrwakrkkrawkrwakarkwarkrkwawakrwrkawrakwarkwarkwrkwararwkarkwrarkkwrkwarrkwa",
    NAME: "wkakwrwrwkarkrkwarkrwakrkkrawkrwakarkwarkrkwawakrwrkawrakwarkwarkwrkwararwkarkwrarkkwrkwarrkwa",
    FACING_TYPE: "autospin",
    DANGER: 1000,
    SHAPE: 24,
    AI: {
      STRAFE: true,
    },
    COLOR: 36,
    SIZE: 100,
    SKILL_CAP: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    SKILL: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    BROADCAST_MESSAGE: "A Strange Trembling...",
    TURRETS: [{
      POSITION: [15.5, 0, 0, 0, 360, 1],
      TYPE: ["warkBottomBody"],
    },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: ["warkMiddleBody"],
      },
      {
        POSITION: [6.5, 0, 0, 0, 360, 1],
        TYPE: ["warkTopBody"],
      },
    ],
  }
  for (let i = 0; i < 12; i++) {
    Class.wawawarkrkrkwarkwark.TURRETS.push({
      POSITION: [5, 8.5, 0, 360 / 6 * (i + 0.5), 180, 0, 0],
      TYPE: ["baseTrapTurret", {
        INDEPENDENT: true,
      }],
    }, {
      POSITION: [5, 8.5, 0, 360 / 6 * (i + 1), 180, 0, 1],
      TYPE: ["baseTrapTurret", {
        INDEPENDENT: true,
      }],
    }, )
  }
  //DEV
  Class.helenasTank = {
    PARENT: ["auraBasic"],
    LABEL: "Helena's Tank",
    COLOR: 42,
    SHAPE: 12,
    BODY: {
      FOV: 2,
      DAMAGE: 100 * base.DAMAGE,
      HEALTH: 1000 * base.HEALTH,
      SPEED: 3 * base.SPEED,
      RELOAD: 3 * base.RELOAD,
      BULLET_DAMAGE: 100 * base.BULLET_DAMAGE,
    },
    SKILL_CAP: Array(10).fill(255),
    SKILL: Array(10).fill(255),
  };
  Class.helenasWark = {
    PARENT: ["genericTank"],
    LABEL: "Helena's Wark",
    STAT_NAMES: statnames.mixed,
    COLOR: 37,
    SHAPE: 12,
    SKILL_CAP: Array(10).fill(255),
    SKILL: Array(10).fill(255),
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [13, 8, 1, 0, 5.5, 185, 0],
    },
      {
        POSITION: [3, 9, 1.5, 13, 5.5, 185, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        /* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [13, 8, 1, 0, -5.5, 175, 0],
      },
      {
        POSITION: [3, 9, 1.5, 13, -5.5, 175, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
  Class.moshrav = {
    PARENT: ["overlord"],
    LABEL: "Moshrav",
    NAME: "Moshrav",
    COLOR: 32,
    SIZE: 15,
    SKILL_CAP: Array(10).fill(255),
    SKILL: Array(10).fill(255),
  };
  Class.machineShot = {
    PARENT: ["genericTank"],
    LABEL: "Machine Shot",
    DANGER: 7,
    HAS_NO_RECOIL: true,
    BODY: {},
    GUNS: [{
      POSITION: [16, 8, 1, 0, -3, -30, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.triplereload, g.triplereload, g.triplereload, g.triplereload, g.triplereload]),
        TYPE: "bullet",
      },
    },
      {
        POSITION: [16, 8, 1, 0, 3, 30, 0.667],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.triplereload, g.triplereload, g.triplereload, g.triplereload, g.triplereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 8, 1, 0, -2, -15, 0.333],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.triplereload, g.triplereload, g.triplereload, g.triplereload, g.triplereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 8, 1, 0, 2, 15, 0.333],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.triplereload, g.triplereload, g.triplereload, g.triplereload, g.triplereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.triplereload, g.triplereload, g.triplereload, g.triplereload, g.triplereload]),
          TYPE: "bullet",
        },
      },
    ],
  };
  Class.armageddonMenu = {
    PARENT: ["menu"],
    LABEL: "SPECIAL ARMAGEDDON TANKS",
    SHAPE: 0,
    UPGRADES_TIER_0: []
  };
  Class.armageddonBasic = {
    PARENT: ["genericTank"],
    LABEL: "Armageddon Basics",
    SHAPE: 0,
    GUNS: [{
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        COLOR: 16,
        LABEL: "",
        STAT_CALCULATOR: 0,
        WAIT_TO_CYCLE: false,
        AUTOFIRE: false,
        SYNCS_SKILLS: false,
        MAX_CHILDREN: 0,
        ALT_FIRE: false,
        NEGATIVE_RECOIL: false,
      },
    }, ],
    UPGRADES_TIER_0: []
  };
  Class.armageddonTrapper = {
    PARENT: ["genericTank"],
    LABEL: "Armageddon Trappers",
    SHAPE: 0,
    STAT_NAMES: statnames.trap,
    GUNS: [{
      POSITION: [15, 7, 1, 0, 0, 0, 0],
    },
      {
        POSITION: [3, 7, 1.7, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
    UPGRADES_TIER_0: []
  };
  Class.armageddonDroners = {
    PARENT: ["genericTank"],
    LABEL: "Armageddon Droners",
    SHAPE: 0,
    STAT_NAMES: statnames.drone,
    BODY: {
      FOV: base.FOV * 1.1,
    },
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 11, 1.3, 7, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 6,
      },
    }, ],
    UPGRADES_TIER_0: []
  };
  Class.shinyomegaMysticals = {
    PARENT: ["menu"],
    LABEL: "Shiny Omega Mysticals",
    COLOR: 1,
    SHAPE: 4,
    UPGRADES_TIER_0: []
  };
  Class.deltas = {
    PARENT: ["menu"],
    LABEL: "Deltas",
    COLOR: 5,
    SHAPE: 3.5,
    UPGRADES_TIER_0: []
  };
  // ARMAGEDDON TANKS

  Class.rangerTurret = {
    PARENT: ["genericTank"],
    LABEL: "Auto Ranger Turret",
    BODY: {
      FOV: 1.5 * base.FOV,
    },
    COLOR: 16,
    GUNS: [{
      POSITION: [24, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.assass]),
        TYPE: "bullet",
      },
    }, ],
  };
  Class.empress = {
    PARENT: ["genericTank"],
    LABEL: "Empress",
    DANGER: 7,
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [19, 6.5, 1, 0, -1, -17.5, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
        TYPE: "bullet",
      },
    },
      {
        POSITION: [19, 6.5, 1, 0, 1, 17.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 6.5, 1, 0, -1, -137.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 6.5, 1, 0, 1, 137.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 6.5, 1, 0, -1, -257.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 6.5, 1, 0, 1, 257.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.power, g.gunner, g.doublereload, g.mini, g.morereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [25, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [25, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [25, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 240, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 120, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double, g.spam, g.doublereload]),
          TYPE: "bullet",
        },
      },
    ],
    TURRETS: [{
      POSITION: [11, 8, 0, 60, 180, 0],
      TYPE: ["rangerTurret", {
        INDEPENDENT: true
      }],
    },
      {
        POSITION: [11, 8, 0, 180, 180, 0],
        TYPE: ["rangerTurret", {
          INDEPENDENT: true
        }],
      },
      {
        POSITION: [11, 8, 0, -60, 180, 0],
        TYPE: ["rangerTurret", {
          INDEPENDENT: true
        }],
      },
    ],
  };
  Class.sanc = {
    PARENT: ["dominator"],
    FACING_TYPE: "autospin",
    LABEL: "Sanctuary",
    CONTROLLERS: ["alwaysFire"],
    HAS_NO_RECOIL: true,
    MOVE_SPEED: 0,
    SIZE: 54,
    GUNS: [{
      POSITION: [4, 3.75, 1, 8, 0, 0, 0],
    },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 30, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 30, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 60, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 90, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 120, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 150, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 150, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 180, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 210, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 210, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 240, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 270, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 270, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 300, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 300, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 330, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 330, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
      {
        POSITION: [4, 3.75, 1, 8, 0, 360, 0],
      },
      {
        POSITION: [1.25, 3.75, 1.7, 12, 0, 360, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
          TYPE: "trap",
        },
      },
    ],
    TURRETS: [{
      POSITION: [22, 0, 0, 0, 360, 0],
      TYPE: ["dominationBody"],
    },
      {
        POSITION: [13.5, 0, 0, 0, 360, 1],
        TYPE: ["destroyerDominator", {
          INDEPENDENT: true,
        }],
      },
      {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: ["hexaHealer", {
        }],
      },
    ]
  };
  Class.warrior = {
    PARENT: ["genericTank"],
    LABEL: "Warrior",
    BODY: {
      DENSITY: base.DENSITY * 2,
      FOV: 1.3,
    },
    DANGER: 7,
    GUNS: [{
      /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
      POSITION: [20, 6, -2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.mini, g.doublereload]),
        TYPE: "bullet",
        ALT_FIRE: true,
        LABEL: "Minigun",
      },
    },
      {
        POSITION: [18, 6.5, -2, 0, 0, 0, 0.333],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.mini, g.doublereload]),
          TYPE: "bullet",
          ALT_FIRE: true,
          LABEL: "Minigun",
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
          ALT_FIRE: true,
        },
      },
      {
        POSITION: [16, 10, 1, 0, -1, 90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.pound]),
          TYPE: "bullet",
          LABEL: "Side",
        },
      },
      {
        POSITION: [16, 10, 1, 0, 1, -90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront, g.pound]),
          TYPE: "bullet",
          LABEL: "Side",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -1, 80, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 1, -80, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -1, 100, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 1, -100, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "autoswarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [13, 8, 1, 0, -1, 140, 0.6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
          TYPE: "bullet",
          LABEL: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [13, 8, 1, 0, 1, 220, 0.6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
          TYPE: "bullet",
          LABEL: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [16, 8, 1, 0, 0, 150, 0.1],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
          TYPE: "bullet",
          LABEL: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [16, 8, 1, 0, 0, 210, 0.1],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
          TYPE: "bullet",
          LABEL: gunCalcNames.thruster,
        },
      },
    ],
  };
  Class.mech = makeAuto(trap, "mech", { HAS_NO_RECOIL: true, BODY: { BULLET_DAMAGE: 0.25, },})
  Class.empire = {
    PARENT: ["genericTank"],
    LABEL: "Empire",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
      SPEED: 0.8 * base.SPEED,
      FOV: 1.2 * base.FOV,
    },
    GUNS: [{
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
        TYPE: "bullet",
      },
    },
      {
        POSITION: [22, 8, 1, 0, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 60, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 180, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 300, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 60, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 180, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 300, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 300, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 120, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [14, 9, 1, 0, 0, 240, 0],
      },
      {
        POSITION: [9, 12, 1, 0, 0, 240, 0],
      },
      {
        POSITION: [4, 9, 1.5, 14, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow, g.lessreload]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 60, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 120, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 240, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 180, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 300, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.minion, g.factory]),
          TYPE: ["tinyMinion", ],
          STAT_CALCULATOR: gunCalcNames.minion,
        },
      },
    ],
    TURRETS: [{
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: ["autoTankGun"],
    }, ]
  };
  Class.ac130 = {
    PARENT: ["genericTank"],
    LABEL: "AC-130",
    DANGER: 6,
    GUNS: [
      {
        POSITION: [7, 7.5, 0.6, 7, 4, 90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -4, 90, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 4, 270, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -4, 270, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 4, 90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -4, 90, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 140, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 45, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, -45, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: ["autoswarm"],
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Autonomous",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 0, -140, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
          LABEL: "Guided",
        },
      },
    ]
  };
  Class.autoboomerang = makeAuto(boomerang, "Auto-Boomerang")
  Class.grenada = {
    PARENT: ["genericTank"],
    DANGER: 7,
    LABEL: "Grenada",
    STAT_NAMES: statnames.trap,
    FACING_TYPE: "locksFacing",
    AUTOFIRE: true,
    BODY: {
      SPEED: base.SPEED * 0.8,
      FOV: base.FOV * 1.15,
    },
    GUNS: [{
      POSITION: [22, 8, 1.3, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
        TYPE: "bullet",
      },
    },
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [5, 10, 1, 14, 0, 0, 0],
      },
      {
        POSITION: [6, 10, -1.5, 7, 0, 0, 0],
      },
      {
        POSITION: [2, 10, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.boomerang]),
          TYPE: "autoboomerang",
        },
      },
    ],
  };
  Class.bombardationer = {
    PARENT: ["genericTank"],
    LABEL: "Bombardationer",
    DANGER: 6,
    FACING_TYPE: "autospin",
    TURRETS: [{
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: "grenada",
    },
      {
        POSITION: [11, 8, 0, 120, 190, 0],
        TYPE: "grenada",
      },
      {
        POSITION: [11, 8, 0, 240, 190, 0],
        TYPE: "grenada",
      },
      {
        POSITION: [11, 8, 0, 60, 190, 0],
        TYPE: "grenada",
      },
      {
        POSITION: [11, 8, 0, 180, 190, 0],
        TYPE: "grenada",
      },
      {
        POSITION: [11, 8, 0, 300, 190, 0],
        TYPE: "grenada",
      },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: "auto4gun",
      },
    ],
  };
  Class.tractor = {
    PARENT: ["genericTank"],
    LABEL: "Tractor",
    FACING_TYPE: "autospin",
    TURRETS: [{
      POSITION: [13, 6, 0, 0, 160, 0],
      TYPE: "bigauto4gun",
    },
      {
        POSITION: [13, 6, 0, 60, 160, 0],
        TYPE: "bigauto4gun",
      },
      {
        POSITION: [13, 6, 0, 120, 160, 0],
        TYPE: "bigauto4gun",
      },
      {
        POSITION: [13, 6, 0, 180, 160, 0],
        TYPE: "bigauto4gun",
      },
      {
        POSITION: [13, 6, 0, 240, 160, 0],
        TYPE: "bigauto4gun",
      },
      {
        POSITION: [13, 6, 0, 300, 160, 0],
        TYPE: "bigauto4gun",
      },
    ],
    GUNS: [{
      POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
        TYPE: "bullet",
      },
    },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, 7.25, 60, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 60, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, 7.25, 120, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 120, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, 7.25, 180, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 180, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, 7.25, 240, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 240, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, 7.25, 300, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [12, 3.5, 1, 0, -7.25, 300, 0.75],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.doublereload]),
          TYPE: "bullet",
        },
      },
    ]
  };
  Class.cubicchip = {
    PARENT: ["sunchip"],
    COLOR: 18,
    SHAPE: "M 0.0575 0.0437 V 0.9921 L 0.8869 0.5167 V -0.4306 L 0.0575 0.0437 Z M -0.0583 0.0437 V 0.9921 L -0.8869 0.5159 V -0.4306 L -0.0583 0.0437 Z M 0 -0.0556 L 0.829 -0.5266 L 0 -1 L -0.8254 -0.527 L 0 -0.0556",
  };
  Class.lilith = {
    PARENT: ["miniboss"],
    LABEL: "Lilith",
    DANGER: 12,
    SHAPE: "M 0.0575 0.0437 V 0.9921 L 0.8869 0.5167 V -0.4306 L 0.0575 0.0437 Z M -0.0583 0.0437 V 0.9921 L -0.8869 0.5159 V -0.4306 L -0.0583 0.0437 Z M 0 -0.0556 L 0.829 -0.5266 L 0 -1 L -0.8254 -0.527 L 0 -0.0556",
    COLOR: 18,
    SIZE: 26,
    MAX_CHILDREN: 6,
    FACING_TYPE: "autospin",
    VALUE: 5e6,
    BODY: {
      FOV: 0.4,
      SPEED: 0.01 * base.SPEED,
      HEALTH: 23 * base.HEALTH,
      DAMAGE: 15 * base.DAMAGE,
    },
    GUNS: Array(6).fill(undefined, undefined, undefined).map((_, i) => ({
      POSITION: [3.5, 9, 1.2, 8, 0, i * 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy, g.mega, g.pound, g.lessreload, g.strong]),
        TYPE: "cubicchip",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    }))
  };
  Class.meplaytanksmith = {
    PARENT: ["genericTank"],
    LABEL: "umbra playing tanksmith.io",
    HAS_NO_RECOIL: true,
    COLOR: 17,
    BODY: {
      RELOAD: 3 * base.RELOAD,
    },
    TURRETS: [{
      POSITION: [13, 6, 4, 0, 160, 0],
      TYPE: ["annihilator", {
        COLOR: 17,
      }],
    },
      {
        POSITION: [13, 6, 4, 60, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 4, 120, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 4, 180, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 4, 240, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 4, 300, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 0, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 60, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 120, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 180, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 240, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
      {
        POSITION: [13, 6, 10, 300, 160, 0],
        TYPE: ["annihilator", {
          COLOR: 17,
        }],
      },
    ],
  };
  Class.basemechTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    INDEPENDENT: true,
    COLOR: 16,
    GUNS: [{
      POSITION: [16, 14, 1, 0, 0, 0, 0],
    },
      {
        POSITION: [4, 14, 1.8, 16, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.lowpower, g.pound, g.destroy, g.doublereload, g.hexatrap]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
          AUTOFIRE: true,
        },
      },
    ],
  };
  Class.autominion = makeAuto(minion, "AutoMinion")
  Class.arroguepalisade = {
    PARENT: ["miniboss"],
    LABEL: "Rogue Alcazar",
    COLOR: 17,
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
      FOV: 1.4,
      SPEED: 0.05 * base.SPEED,
      HEALTH: 20 * base.HEALTH,
      SHIELD: 3.5 * base.SHIELD,
      DAMAGE: 5 * base.DAMAGE,
      RELOAD: 1.25 * base.RELOAD
    },
    GUNS: [
      {
        POSITION: [4, 6, -1.6, 8, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 300, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound, g.halfreload, g.halfreload]),
          TYPE: ["autominion", {
            INDEPENDENT: true
          }],
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 4,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true
        }
      },
      {
        POSITION: [3, 3, 1, 8, 0, 0, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 60, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 120, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 180, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 240, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 300, 0],
      },
    ],
    TURRETS: [{
      POSITION: [7, 8, 0, 30, 110, 0],
      TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
    },
      {
        POSITION: [7, 8, 0, 90, 110, 0],
        TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
      },
      {
        POSITION: [7, 8, 0, 150, 110, 0],
        TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
      },
      {
        POSITION: [7, 8, 0, 210, 110, 0],
        TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
      },
      {
        POSITION: [7, 8, 0, 270, 110, 0],
        TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
      },
      {
        POSITION: [7, 8, 0, 330, 110, 0],
        TYPE: ["baseTrapTurret", { health: 1.1, damage: 1.3 }]
      },
    ],
  };
  Class.autobee = makeAuto(bee, "Auto-Bee")
  Class.titanhive = {
    PARENT: ["bullet"],
    LABEL: "Titan Hive",
    BODY: {
      RANGE: 100,
      FOV: 0.6,
    },
    FACING_TYPE: "turnWithSpeed",
    INDEPENDENT: true,
    CONTROLLERS: ["alwaysFire", "nearestDifferentMaster", "targetSelf"],
    AI: {
      NO_LEAD: true,
    },
    GUNS: [{
      POSITION: [7, 9.5, 0.6, 7, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees,]),
        TYPE: "bee",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 90, 1 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 135, 2 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 180, 3 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 225, 4 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 270, 5 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 315, 6 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 9.5, 0.6, 7, 0, 360, 7 / 8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
          TYPE: "bee",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ],
    TURRETS: [{
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: [
        "auraBasicGen",
        {
          INDEPENDENT: true,
        },
      ],
    }, ],
  };
  Class.titanomachyTurret = {
    PARENT: ["genericTank"],
    LABEL: "Titanomachy",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    COLOR: 16,
    GUNS: [{
      POSITION: [14, 14, -1.2, 5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.hive, g.strong, g.one_fifth_reload]),
        TYPE: "titanhive",
      },
    },
      {
        POSITION: [15, 12, 1, 5, 0, 0, 0],
      },
      {
        POSITION: [16, 10, 1, 5, 0, 0, 0],
      },
    ],
  };
  Class.arnestGuardian = {
    PARENT: ["miniboss"],
    LABEL: "Nest Guardian",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    GUNS: [],
    TURRETS: [{
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: [
        "hyperTwisterTurret",
        {
          INDEPENDENT: true,
          COLOR: 14,
        },
      ],
    }, ],
  };
  for (let i = 0; i < 5; i++) {
    Class.arnestGuardian.GUNS.push(
        {
          POSITION: [7, 3.5, 1, 6, 0, 72 * i + 36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound,]),
            TYPE: "bullet",
            LABEL: "Devastator",
          },
        },
        {
          POSITION: [5.5, 7, 1, 6, 0, 72 * i + 36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.anni]),
            TYPE: "bullet",
            LABEL: "Devastator",
          },
        },
    );
    Class.arnestGuardian.TURRETS.push({
      POSITION: [8, 9, 0, 72 * i, 120, 0],
      TYPE: [
        "titanomachyTurret",
        {
          INDEPENDENT: true,
          COLOR: 14,
        },
      ],
    });
  }
  Class.fortifierTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
      FOV: 0.6,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 16,
    AI: {
      SKYNET: true,
      FULL_VIEW: true,
    },
    GUNS: [
      {
        POSITION: [28, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
          TYPE: "bullet",
          STAT_CALCULATOR: gunCalcNames.bullet,
        },
      },
      {
        POSITION: [24, 8, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [4, 8, 1.3, 22, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 18, 0, 0, 1 / 4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 14, 0, 0, 2 / 4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 10, 0, 0, 3 / 4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
          TYPE: "mech",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
  Class.pellbox = makeAuto(unsetTrap, "Pillbox")
  Class.nwcarrierTurret = {
    PARENT: ["genericTank"],
    LABEL: "Carrier",
    BODY: {
      FOV: 2,
      RELOAD: 5 * base.RELOAD,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    COLOR: 16,
    GUNS: [
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [7, 8, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound, g.morespeed]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound, g.morespeed]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound, g.morespeed]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ],
  };
  Class.arnestWarden = {
    PARENT: ["miniboss"],
    LABEL: "Nest Warden",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    GUNS: [],
    TURRETS: [
      {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [
          "fortifierTurret",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
    ],
  };
  for(let i = 0; i < 5; i++) {
    Class.arnestWarden.TURRETS.push(
        {
          POSITION: [8, 9, 0, 72*i, 120, 0],
          TYPE: [
            "nwcarrierTurret",
            {
              INDEPENDENT: true,
              COLOR: 14,
            },
          ],
        }
    );
    Class.arnestWarden.GUNS.push(
        {
          POSITION: [10.7, 8, 1, 0, 0, 72*i+36, 0],
        },
        {
          POSITION: [1.5, 8, 1.2, 10.7, 0, 72*i+36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct, g.one_third_reload]),
            TYPE: "pellbox",
            MAX_CHILDREN: 20,
            DESTROY_OLDEST_CHILD: true,
          },
        },
    );
  }
  Class.pentadrone = {
    LABEL: "Pentagon Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 3,
    CONTROL_RANGE: 0,
    SHAPE: 5,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: [
      "nearestDifferentMaster",
      "canRepel",
      "mapTargetToGoal",
      "hangOutNearMaster",
    ],
    AI: {
      BLIND: true,
    },
    BODY: {
      PENETRATION: 1.2,
      PUSHABILITY: 0.6,
      ACCELERATION: 0.05,
      HEALTH: 1.5,
      DAMAGE: 3,
      SPEED: 3,
      RANGE: 200,
      DENSITY: 0.03,
      RESIST: 1.5,
      FOV: 0.6,
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
  };
  Class.autopentadrone = makeAuto(Class.pentadrone, "Auto Pentagon Drone", { BODY: { RELOAD: 0.01 * base.RELOAD }});
  Class.omegapentadrone = {
    LABEL: "Pentagon Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 3,
    CONTROL_RANGE: 0,
    SHAPE: makeLabyShape(Class.pentagon, 3),
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: [
      "nearestDifferentMaster",
      "canRepel",
      "mapTargetToGoal",
      "hangOutNearMaster",
    ],
    AI: {
      BLIND: true,
    },
    BODY: {
      PENETRATION: 1.4,
      PUSHABILITY: 0.6,
      ACCELERATION: 0.02,
      HEALTH: 4.5,
      DAMAGE: 4.5,
      SPEED: 2.5,
      RANGE: 200,
      DENSITY: 0.03,
      RESIST: 1.5,
      FOV: 0.6,
    },
    HITS_OWN_TYPE: "hard",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
    TURRETS: [{
      POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
      TYPE: ["pentagon", { MIRROR_MASTER_ANGLE: true }]
    },{
      POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 0, 0, 1],
      TYPE: ["pentagon", { MIRROR_MASTER_ANGLE: true }]
    },{
      POSITION: [20 * Math.SQRT1_2 ** 3, 0, 0, 45, 0, 1],
      TYPE: ["pentagon", { MIRROR_MASTER_ANGLE: true }]
    }],
  };
  Class.hyperboomerTurret = {
    PARENT: ["genericTank"],
    LABEL: "Hyper Boomer",
    BODY: {
      FOV: 10,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    COLOR: 14,
    GUNS: [
      {
        POSITION: [5, 5.5, 1, 18, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [7.75, 10, 1, 12, 0, 0, 0],
      },
      {
        POSITION: [6, 10, -1.5, 7, 0, 0, 0],
      },
      {
        POSITION: [2, 10, 1.3, 18, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.boomerang, g.strong, g.mega, g.one_fifth_reload, g.one_fifth_reload, g.one_fifth_reload, g.one_fifth_reload, g.one_fifth_reload, g.one_fifth_reload, g.one_fifth_reload, g.one_third_reload]),
          TYPE: "autoboomerang",
        },
      },
    ],
  };
  Class.arnestKeeper = {
    PARENT: ["miniboss"],
    LABEL: "Nest Keeper",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    MAX_CHILDREN: 25,
    GUNS: [
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 35, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -35, 1 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 180, 2 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 108, 3 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -108, 4 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 35, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.one_fifth_reload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -35, 1 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.one_fifth_reload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 180, 2 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.one_fifth_reload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 108, 3 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.one_fifth_reload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -108, 4 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.one_fifth_reload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3, 3, 1, 8, 0, 35, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, -35, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 180, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 108, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, -108, 0],
      },
    ],
    TURRETS: [
      {
        POSITION: [8, 9, 0, 72, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 0, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 144, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 216, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, -72, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: [
          "hyperboomerTurret",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
    ],
  };
  Class.nestkinglayer2 = {
    PARENT: ["miniboss"],
    LABEL: "",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    AUTOSPIN: true,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    GUNS: [],
    TURRETS: [],
  };
  for (let i = 0; i < 5; i++) {
    Class.nestkinglayer2.GUNS.push(
        {
          POSITION: [7, 4.5, 1, 6, 0, 72 * i + 36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound]),
            TYPE: "bullet",
            LABEL: "Devastator",
          },
        },
        {
          POSITION: [5.5, 7, 1, 6, 0, 72 * i + 36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.anni]),
            TYPE: "bullet",
            LABEL: "Devastator",
          },
        },
    );
    Class.nestkinglayer2.TURRETS.push({
      POSITION: [8, 9, 0, 72 * i, 120, 0],
      TYPE: [
        "titanomachyTurret",
        {
          INDEPENDENT: true,
          COLOR: 14,
        },
      ],
    });
  }
  Class.nestkinglayer1 = {
    PARENT: ["miniboss"],
    LABEL: "",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    AUTOSPIN: true,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    GUNS: [],
    TURRETS: [],
  };
  for(let i = 0; i < 5; i++) {
    Class.nestkinglayer1.TURRETS.push(
        {
          POSITION: [8, 9, 0, 72*i, 120, 0],
          TYPE: [
            "nwcarrierTurret",
            {
              INDEPENDENT: true,
              COLOR: 14,
            },
          ],
        }
    );
    Class.nestkinglayer1.GUNS.push(
        {
          POSITION: [10.7, 8, 1, 0, 0, 72*i+36, 0],
        },
        {
          POSITION: [1.5, 8, 1.2, 10.7, 0, 72*i+36, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct, g.one_third_reload]),
            TYPE: "pellbox",
            MAX_CHILDREN: 20,
            DESTROY_OLDEST_CHILD: true,
          },
        },
    );
  }
  Class.nestkinglayer3 = {
    PARENT: ["miniboss"],
    LABEL: "",
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    AUTOSPIN: true,
    BODY: {
      FOV: 1.3,
      SPEED: base.SPEED * 0.20,
      HEALTH: base.HEALTH * 12,
      SHIELD: base.SHIELD * 2,
      REGEN: base.REGEN,
      DAMAGE: base.DAMAGE * 3,
    },
    MAX_CHILDREN: 25,
    GUNS: [
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 35, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -35, 1 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 180, 2 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 108, 3 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -108, 4 / 5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper]),
          TYPE: "autopentadrone",
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 35, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.halfreload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -35, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.halfreload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.halfreload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, 108, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.halfreload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3.5, 6.65, 1.2, 8, 0, -108, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.arnest_keeper, g.halfreload, g.big]),
          TYPE: "omegapentadrone",
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
        },
      },
      {
        POSITION: [3, 3, 1.2, 8, 0, 35, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, -35, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 180, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, 108, 0],
      },
      {
        POSITION: [3, 3, 1, 8, 0, -108, 0],
      },
    ],
    TURRETS: [
      {
        POSITION: [8, 9, 0, 72, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 0, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 144, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, 216, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
      {
        POSITION: [8, 9, 0, -72, 120, 0],
        TYPE: [
          "bigauto4gun",
          {
            INDEPENDENT: true,
            COLOR: 14,
          },
        ],
      },
    ],
  };
  Class.nestKingTurret = {
    PARENT: "genericTank",
    BODY: {
      FOV: 3,
    },
    SHAPE: 3,
    TURRETS: [
      {
        POSITION: {SIZE: 15, ANGLE: 60, X: 8, LAYER: 0},
        TYPE: ["hyperTwisterTurret", { COLOR: 14, }],
      },
      {
        POSITION: {SIZE: 15, ANGLE: -60, X: 8, LAYER: 0},
        TYPE: ["fortifierTurret", { COLOR: 14, }],
      },
      {
        POSITION: {SIZE: 15, ANGLE: 180, X: 8, LAYER: 0},
        TYPE: ["hyperboomerTurret", { COLOR: 14, }],
      },
    ]
  }
  Class.nestking = {
    PARENT: ["miniboss"],
    LABEL: "Legionary Nester",
    SIZE: 80,
    COLOR: 14,
    SHAPE: 5,
    VALUE: 5e6,
    AUTOSPIN: true,
    BODY: {
      FOV: 1.5,
      SPEED: base.SPEED * 0.05,
      HEALTH: base.HEALTH * 20,
    },
    TURRETS: [
      /** SIZE     X       Y     ANGLE    ARC */
      {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: ["nestkinglayer1"],
      },
      {
        POSITION: [16, 0, 0, 0, 360, 1],
        TYPE: ["nestkinglayer2"],
      },
      {
        POSITION: [12, 0, 0, 0, 360, 1],
        TYPE: ["nestkinglayer3"],
      },
      {
        POSITION: {SIZE: 6, LAYER: 1, ANGLE: 360},
        TYPE: ["nestKingTurret", { COLOR: 14, }],
      },
    ],
  };
  Class.auraTrap = makeAura(Class.trap);
  Class.kamikazeBigAura = addAura(1.5, 2);
  Class.kamikazeAura = addAura(0.6, 2);
  Class.rogueKamikaze = {
    PARENT: ["miniboss"],
    LABEL: "Rogue Kamikaze",
    COLOR: 17,
    SHAPE: 6,
    SIZE: 35,
    BODY: {
      SPEED: 5 * base.SPEED,
      BULLET_HEALTH: 0.6 * base.BULLET_HEALTH,
      BULLET_DAMAGE: 0.6 * base.BULLET_DAMAGE,
      BULLET_PEN: 0.6 * base.BULLET_PEN,
      RELOAD: 0.6 * base.RELOAD,
      HEALTH: 2000,
      BODY_DAMAGE: 15 * base.BODY_DAMAGE,
    },
    TURRETS: [
      {
        POSITION: {SIZE: 6, LAYER: 1, ANGLE: 360},
        TYPE: ["kamikazeBigAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 60, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 120, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 180, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 240, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 300, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 360, X: 6},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 30, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 90, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 150, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 210, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 270, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 330, X: 9},
        TYPE: ["kamikazeAura"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 30, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 90, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 150, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 210, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 270, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
      {
        POSITION: { SIZE: 6, ANGLE: 330, LAYER: 0, X: 10},
        TYPE: ["basicTurret"],
      },
    ],
    GUNS: [],
  };
  for (let i = 0; i < 6; i++) {
    Class.rogueKamikaze.GUNS.push(
        {
          POSITION: [4, 3.75, 1, 8, 0, (360/6 * i + 1), 0],
        },
        {
          POSITION: [4, 3.75, 0, 8, 0, (360/6 * i + 1), 0],
        },
        {
          POSITION: [1.25, 3.75, 1.7, 12, 0, (360/6 * i + 1), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.halfrange, g.halfspeed, g.one_third_reload]),
            TYPE: ["auraTrap"],
          }
        },
    );
  }
  Class.arsummoner = {
    PARENT: "miniboss",
    LABEL: "Thaumaturge",
    DANGER: 10,
    SHAPE: 4,
    COLOR: 13,
    SIZE: 26,
    FACING_TYPE: "autospin",
    VALUE: 5e5,
    BODY: {
      FOV: 0.8,
      SPEED: 0.08 * base.SPEED,
      HEALTH: 10 * base.HEALTH,
      DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: Array(4).fill(undefined, undefined, undefined).map((_, i) => ([{
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner,]),
        TYPE: "sunchip",
        MAX_CHILDREN: 6,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true
      }
    },{
      POSITION: [2.5, 3, 1.2, 8, 5, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, { spray: 50, speed: 1.25, shudder: 1.25 }]),
        TYPE: "waferbread",
        MAX_CHILDREN: 8,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      }
    },{
      POSITION: [2.5, 3, 1.2, 8, -5, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, { spray: 150, speed: 1.25, shudder: 1.25 }]),
        TYPE: "waferbread",
        MAX_CHILDREN: 8,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      }
    }])).flat(),
  };
  Class.deltamissile = {
    PARENT: ["missile"],
    GUNS: [
      {
        POSITION: [16, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [14, 6, 1, 0, -2, 150, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [14, 6, 1, 0, 2, 210, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [14, 6, 1, 0, -2, 90, 0.5],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [14, 6, 1, 0, 2, 270, 0.5],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
    ],
  };
  Class.hyperskimmerTurret = {
    PARENT: ["genericTank"],
    LABEL: "Hyper Skimmer",
    BODY: {
      FOV: 2 * base.FOV,
    },
    COLOR: 2,
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [
      {
        POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            g.basic,
            g.pound,
            g.arty,
            g.arty,
            g.skim,
          ]),
          TYPE: "deltamissile",
        },
      },
      {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
      },
    ],
  };
  Class.deltaSkimmer = {
    PARENT: ["delta"],
    LABEL: "Delta Skimmer",
    COLOR: 2,
    TURRETS: [
      {
        POSITION: [20, 5, 0, 60, 170, 0],
        TYPE: "hyperskimmerTurret",
      },
      {
        POSITION: [20, 5, 0, 180, 170, 0],
        TYPE: "hyperskimmerTurret",
      },
      {
        POSITION: [20, 5, 0, 300, 170, 0],
        TYPE: "hyperskimmerTurret",
      },
    ],
  };
  Class.legionarymissile = {
    PARENT: ["missile"],
    GUNS: [
      {
        POSITION: [16, 6, 1, 0, 0, 0, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [14, 6, 1, 0, -2, 90, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [14, 6, 1, 0, 2, -90, 0],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
          STAT_CALCULATOR: gunCalcNames.thruster,
        },
      },
      {
        POSITION: [14, 6, 1, 0, 0, 130, 0.5],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [14, 6, 1, 0, 0, 230, 0.5],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
      {
        POSITION: [14, 6, 1, 0, 0, 180, 0.5],
        PROPERTIES: {
          AUTOFIRE: true,
          SHOOT_SETTINGS: combineStats([
            g.basic,
            {reload: 1},
          ]),
          TYPE: [
            "bullet",
            {
              PERSISTS_AFTER_DEATH: true,
            },
          ],
        },
      },
    ],
  };
  Class.legionarySkimTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
      FOV: 3 * base.FOV,
    },
    COLOR: 2,
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [
      {
        POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            g.basic,
            g.pound,
            g.arty,
            g.arty,
            g.skim,
            { health: 1.3, reload: 3, damage: 1.25 },
          ]),
          TYPE: "legionarymissile",
        },
      },
      {
        POSITION: [17, 15, 1, 0, 0, 0, 0],
      },
    ],
  };
  Class.monsoonPillbox = {
    PARENT: ["unsetTrap"],
    LABEL: "Pillbox",
    BODY: {
      SPEED: 1,
      DENSITY: 5,
    },
    MAX_CHILDREN: 6,
    DIE_AT_RANGE: true,
    TURRETS: [
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: "monsoonTurretARDreadV2",
      },
    ],
  };
  Class.legionarySkimmer = {
    PARENT: ["delta"],
    LABEL: "Legionary Skimmer",
    AI: { STRAFE: true, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e6,
    COLOR: 2,
    SIZE: 80,
    BODY: {
      FOV: 1.5,
      SPEED: 0.1 * base.SPEED,
      HEALTH: 2000,
      DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: [],
    TURRETS: [
      {
        POSITION: [14, 8, 0, 180, 170, 0],
        TYPE: "legionarySkimTurret",
      },
      {
        POSITION: [14, 8, 0, 60, 170, 0],
        TYPE: "legionarySkimTurret",
      },
      {
        POSITION: [14, 8, 0, -60, 170, 0],
        TYPE: "legionarySkimTurret",
      },
    ],
  };
  for (let i = 0; i < 3; i++) {
    Class.legionarySkimmer.GUNS.push(
        {
          POSITION: [14.5, 12, 1, 0, 0, 120*i, 0],
        },
        {
          POSITION: [3, 12, 1.7, 14.5, 0, 120*i, 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.veryfast, {size: 0.6, maxSpeed: 3}]),
            TYPE: "monsoonPillbox",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
    )
  }
  for (let i = 0; i < 3; i++) {
    Class.legionarySkimmer.GUNS.push(
        {
          POSITION: [5, 12, 1.6, -11, 0, 120*i, 0],
        }
    )
  }
  Class.deltaDestroyer = {
    PARENT: ["delta"],
    GUNS: [
      {
        POSITION: [7, 12, 1, 6, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
      {
        POSITION: [7, 12, 1, 6, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
      {
        POSITION: [7, 12, 1, 6, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
      {
        POSITION: [5, 16, 1, 6, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.anni]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
      {
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.anni]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
      {
        POSITION: [5, 16, 1, 6, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.anni]),
          TYPE: "bullet",
          LABEL: "Devastator",
        },
      },
    ],
    TURRETS: [
      {
        POSITION: [11, 0, 0, 180, 360, 0],
        TYPE: ["crasherSpawner"],
      },
      {
        POSITION: [11, 0, 0, 60, 360, 0],
        TYPE: ["crasherSpawner"],
      },
      {
        POSITION: [11, 0, 0, -60, 360, 0],
        TYPE: ["crasherSpawner"],
      },
      {
        POSITION: [11, 0, 0, 30, 360, 0],
        TYPE: ["crasherSpawner"],
      },
      {
        POSITION: [11, 0, 0, -30, 360, 0],
        TYPE: ["crasherSpawner"],
      },
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: [
          "tripletTurret",
          {
            INDEPENDENT: true,
            COLOR: 5,
          },
        ],
      },
    ],
  };
  Class.triplegadgetgun = {
    PARENT: ["genericTank"],
    LABEL: "Tri-Gadget Gun",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    COLOR: 5,
    GUNS: [
      {
        POSITION: [19, 8, 1.4, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.single]),
          TYPE: ["bullet"],
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [19, 8, 1.4, 0, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.single]),
          TYPE: ["bullet"],
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [19, 8, 1.4, 0, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.single]),
          TYPE: ["bullet"],
          AUTOFIRE: true,
        },
      },
      {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
      },
      {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 120, 0]
      },
      {
        POSITION: [5.5, 8, -1.8, 6.5, 0, 240, 0]
      }
    ],
  };
  Class.deltaSprayer = {
    PARENT: ["delta"],
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
      {
        /*    SIZE         X             Y         ANGLE        ARC */
        POSITION: [6, 0, 0, 0, 360, 1],
        TYPE: ["triplegadgetgun", { INDEPENDENT: true, }],
      },
      {
        POSITION: [9, 4, -8, 180, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 0, 180, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 8, 180, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 8, 60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 0, 60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, -8, 60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 8, -60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, 0, -60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
      {
        POSITION: [9, 4, -8, -60, 130, 0],
        TYPE: ["sprayer", { COLOR: 16 }],
      },
    ],
  };
  Class.unchimaverry = {
    PARENT: ["genericTank"],
    LABEL: "Unchi-maverry",
    MAX_CHILDREN: 8,
    GUNS: [
      /* {
      POSITION: [ 17.6, 16, 0.9, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.carrier, g.battle]),
      TYPE: "drone",
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      MAX_CHILDREN: 4,
      //
      }, },0*/
      {
        POSITION: [14.600000000000001, 16, 0.9, 0, 2, 15, 1 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.mehdrone, g.mini, g.weak, g.micro, g.bigdrone, g.blank, g.blank, g.blank, g.twin, g.bent, g.flank]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
          // dam: 1.913625, str: 1.0843875, pen: 0.8640000000000001, rld: 343750000.0000001
        },
      }, {
        POSITION: [14.600000000000001, 16, 0.9, 0, -2, -15, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.mehdrone, g.mini, g.weak, g.micro, g.bigdrone, g.blank, g.blank, g.blank, g.flank, g.twin, g.bent]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
          // dam: 1.913625, str: 1.0843875, pen: 0.8640000000000001, rld: 343750000.0000001
        },
      }, {
        POSITION: [17.6, 16, 0.9, 0, 0, 0, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.mehdrone, g.mini, g.weak, g.micro, g.bigdrone, g.blank, g.blank, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
          // dam: 1.913625, str: 1.0843875, pen: 0.8640000000000001, rld: 343750000.0000001
        },
      },
      /* {
      POSITION: [ 20.48, 15, 1.9, 0, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.battle, g.carrier, g.flank]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [17.48, 15, 1.9, 0, 2, 195, 1 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.pound, g.lessreload, g.blank, g.blaster, g.chain, g.destroy, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 2.26046953125, str: 0.22902264, pen: 0.5702400000000001, rld: 5715943.2
        },
      }, {
        POSITION: [17.48, 15, 1.9, 0, -2, -195, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.mach, g.lessreload, g.blank, g.blaster, g.chain, g.destroy, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 2.26046953125, str: 0.22902264, pen: 0.5702400000000001, rld: 5715943.2
        },
      }, {
        POSITION: [20.48, 15, 1.9, 0, 0, 180, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.pound, g.lessreload, g.blank, g.chain, g.blaster, g.destroy, g.blank, g.flank, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 2.26046953125, str: 0.22902264, pen: 0.5702400000000001, rld: 5715943.2
        },
      },
    ],
    BODY: {
      SPEED: 0.9 * base.SPEED,
      FOV:  base.FOV,
    },
  };
  Class.gtopowic = {
    PARENT: ["genericTank"],
    LABEL: "Gtopowic",
    GUNS: [
      /* {
      POSITION: [ 16.4, 6.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },{
      POSITION: [ 6.9, 6.5, 1.6000000000000023, 16.4, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [16.4, 6.5, 1, 0, 0, 0, 0],
      }, {
        POSITION: [6.9, 6.5, 1.6000000000000023, 16.4, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [5.5648, 6.5, -1.54, 0, 0, 0, 0],
      },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: base.FOV,
    },
    UPGRADES_TIER_5: [],
    UPGRADES_TIER_6: [],
  };
  Class.baverc = {
    PARENT: ["genericTank"],
    LABEL: "Gyattank",
    GUNS: [
      /* {
      POSITION: [ 22.4, 10.5, 0.6, 14, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.battle, g.flank]),
      TYPE: "drone",
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      MAX_CHILDREN: 2,
      //
      }, },7*/
      {
        POSITION: [19.4, 10.5, 0.6, 7, 2, 15, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.battle, g.mini, g.flank, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [17.4, 10.5, 0.6, 7, 2, 15, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.carrier, g.battle, g.mini]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [15.399999999999999, 10.5, 0.6, 7, 2, 15, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.carrier, g.battle, g.mini]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 3.375, str: 0.3, pen: 1.2, rld: 6250000
        },
      }, {
        POSITION: [19.4, 10.5, 0.6, 7, -2, -15, 0 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.flank, g.battle]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [17.4, 10.5, 0.6, 7, -2, -15, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.flank, g.battle, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [15.399999999999999, 10.5, 0.6, 7, -2, -15, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.flank, g.battle, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 3.375, str: 0.3, pen: 1.2, rld: 6250000
        },
      }, {
        POSITION: [22.4, 10.5, 0.6, 14, 0, 0, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.battle, g.flank, g.mini, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [20.4, 10.5, 0.6, 14, 0, 0, 6 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.flank, g.battle, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 0.9054180000000001, str: 0.210375, pen: 1.485, rld: 791015625
        },
      }, {
        POSITION: [18.4, 10.5, 0.6, 14, 0, 0, 8 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.flank, g.battle, g.carrier]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 2,
          // dam: 3.375, str: 0.3, pen: 1.2, rld: 6250000
        },
      },
      /* {
      POSITION: [ 7.68, 17, 1.4, 13, 0, 180, 0],
      },{
      POSITION: [ 5.9, 23.799999999999997, 1.02, 7.68, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.mach, g.pound, g.blank, g.blank, g.blaster, g.destroy, g.blank, g.blank, g.bent, g.flank, g.twin]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },6.5*/
      {
        POSITION: [4.68, 17, 1.4, 6.5, 2, 195, 1 / 2],
      }, {
        POSITION: [5.9, 23.799999999999997, 1.02, 11.18, 2, 195, 1 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.mach, g.blank, g.blank, g.blaster, g.destroy, g.blank, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [4.68, 17, 1.4, 6.5, -2, -195, 0 / 2],
      }, {
        POSITION: [5.9, 23.799999999999997, 1.02, 11.18, -2, -195, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.mach, g.blank, g.blank, g.blaster, g.destroy, g.blank, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [7.68, 17, 1.4, 13, 0, 180, 0 / 2],
      }, {
        POSITION: [5.9, 23.799999999999997, 1.02, 20.68, 0, 180, 0 / 2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.mach, g.blank, g.blank, g.blaster, g.destroy, g.blank, g.blank, g.twin, g.flank, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [7.36, 33.31999999999999, -1.0900000000000003, 13, 0, 180, 0],
      },
    ],
    BODY: {
      SPEED: 0.9 * base.SPEED,
      FOV: 1.1 * base.FOV,
    },
  };
  Class.gutotorheirlsic = {
    PARENT: ["genericTank"],
    LABEL: "Gutotor Heirlsic",
    GUNS: [
      /* {
      POSITION: [ 4.48, 8, 0.9, 14, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.battle, g.mini, g.carrier]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },7*/
      {
        POSITION: [1.4800000000000004, 8, 0.9, 7, 2, 15, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156.0000000005
        },
      }, {
        POSITION: [-0.5199999999999996, 8, 0.9, 7, 2, 15, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156.0000000005
        },
      }, {
        POSITION: [-2.5199999999999996, 8, 0.9, 7, 2, 15, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      }, {
        POSITION: [1.4800000000000004, 8, 0.9, 7, -2, -15, 0 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.twin, g.bent, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156
        },
      }, {
        POSITION: [-0.5199999999999996, 8, 0.9, 7, -2, -15, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156.0000000005
        },
      }, {
        POSITION: [-2.5199999999999996, 8, 0.9, 7, -2, -15, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      }, {
        POSITION: [4.48, 8, 0.9, 14, 0, 0, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.mini, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156
        },
      }, {
        POSITION: [2.4800000000000004, 8, 0.9, 14, 0, 0, 6 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.bent, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.4485058593749999, str: 0.07350750000000002, pen: 1, rld: 2598156.0000000005
        },
      }, {
        POSITION: [0.4800000000000004, 8, 0.9, 14, 0, 0, 8 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.bent, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      },
    ],
    BODY: {
      SPEED: 0.9 * base.SPEED,
      FOV: 1.2 * base.FOV,
    },
  };
  Class.pox = {
    PARENT: ["genericTank"],
    LABEL: "Pox",
    SIZE: 26,
    COLOR: 1,
    GUNS: [
      /* {
      POSITION: [ 20.8, 18.5, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "drone",
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      MAX_CHILDREN: 6,
      //
      }, },0*/
      {
        POSITION: [20.8, 18.5, 1.2, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.mehdrone, g.sniper, g.blank, g.blank, g.bigdrone, g.blank, g.blank, g.blank, g.flank]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 6,
          // dam: 2.1870000000000003, str: 1.33875, pen: 1.1880000000000002, rld: 421875000
        },
      },
      /* {
      POSITION: [ 6, 20, 1.5, 13, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "drone",
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      MAX_CHILDREN: 6,
      //
      }, },6.5*/
      {
        POSITION: [6, 20, 1.5, 13, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.mehdrone, g.blank, g.blank, g.blank, g.bigdrone, g.blank, g.blank, g.blank, g.flank]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 6,
          // dam: 2.73375, str: 1.33875, pen: 1.08, rld: 312500000
        },
      },
    ],
    BODY: {
      SPEED: 0.20 * base.SPEED,
      FOV: 1.1 * base.FOV,
    },
  };
  Class.marbler = {
    PARENT: ["genericTank"],
    LABEL: "Marbler",
    GUNS: [
      /* {
      POSITION: [ 13.76, 7.5, 0.9, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [13.76, 7.5, 0.9, 0, 0, 0, 0 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.5189853515625, str: 0.09256500000000001, pen: 1.125, rld: 2361960
        },
      }, {
        POSITION: [11.76, 7.5, 0.9, 0, 0, 0, 1 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.5189853515625, str: 0.09256500000000001, pen: 1.125, rld: 2361960
        },
      }, {
        POSITION: [9.76, 7.5, 0.9, 0, 0, 0, 2 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      },
      /* {
      POSITION: [ 6.08, 8.5, 1.7, 15, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.battle, g.carrier, g.mini, g.flank]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },7.5*/
      {
        POSITION: [3.08, 8.5, 1.7, 7.5, 2, 195, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.bent, g.flank, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.052484355, pen: 0.9, rld: 1299078.0000000002
        },
      }, {
        POSITION: [1.08, 8.5, 1.7, 7.5, 2, 195, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.bent, g.flank, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.052484355, pen: 0.9, rld: 1299078.0000000002
        },
      }, {
        POSITION: [-0.9199999999999999, 8.5, 1.7, 7.5, 2, 195, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.bent, g.flank, g.twin]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      }, {
        POSITION: [3.08, 8.5, 1.7, 7.5, -2, -195, 0 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.twin, g.flank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.05248435500000001, pen: 0.9000000000000001, rld: 1299078
        },
      }, {
        POSITION: [1.08, 8.5, 1.7, 7.5, -2, -195, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.mini, g.twin, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.052484355, pen: 0.9, rld: 1299078
        },
      }, {
        POSITION: [-0.9199999999999999, 8.5, 1.7, 7.5, -2, -195, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.mini, g.twin, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      }, {
        POSITION: [6.08, 8.5, 1.7, 15, 0, 180, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.flank, g.twin, g.bent]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.052484355, pen: 0.9, rld: 1299078.0000000002
        },
      }, {
        POSITION: [4.08, 8.5, 1.7, 15, 0, 180, 6 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.mini, g.twin, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.25430282226562495, str: 0.052484355, pen: 0.9, rld: 1299078
        },
      }, {
        POSITION: [2.08, 8.5, 1.7, 15, 0, 180, 8 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.bent, g.mini, g.twin, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        },
      },
    ],
    BODY: {
      SPEED: 0.9 * base.SPEED,
      FOV: 1.2 * base.FOV,
    },
  };
  Class.gnat = {
    PARENT: ["genericTank"],
    LABEL: "Gnat",
    GUNS: [
      /* {
      POSITION: [ 31.6, 8, 1.3, 15, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "drone",
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      MAX_CHILDREN: 6,
      //
      }, },7.5*/
      {
        POSITION: [31.6, 8, 1.3, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, ]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 6,
          // dam: 2.7, str: 0.345, pen: 1.4520000000000002, rld: 696093750
        },
      },
    ],
    BODY: {
      SPEED: 0.85 * base.SPEED,
      FOV: 1.5 * base.FOV,
    },
  };
  Class.moshboss = {
    PARENT: "miniboss",
    LABEL: "Moshrav",
    DANGER: 25,
    SHAPE: 0,
    COLOR: 32,
    SIZE: 26,
    FACING_TYPE: "autospin",
    VALUE: 5e6,
    BODY: {
      FOV: 1.3,
      SPEED: 0.25 * base.SPEED,
      HEALTH: 30 * base.HEALTH,
      DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: Array(4).fill(undefined, undefined, undefined).map((_, i) => ([{
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.strong, g.strong, g.bigdrone, g.veryfast]),
        TYPE: "dorito",
        MAX_CHILDREN: 9,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true
      }
    },{
      POSITION: [2.5, 3, 1.2, 8, 5.5, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.summoner, g.mach, { spray: 50, speed: 3, shudder: 1.25 }]),
        TYPE: "swarm",
        MAX_CHILDREN: 9,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.swarm,
        WAIT_TO_CYCLE: true,
      }
    },{
      POSITION: [2.5, 3, 1.2, 8, -5.5, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.summoner, g.mach, { spray: 150, speed: 3, shudder: 1.25 }]),
        TYPE: "swarm",
        MAX_CHILDREN: 9,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.swarm,
        WAIT_TO_CYCLE: true,
      }
    }])).flat(),
  };
  Class.asswind = {
    PARENT: ["genericTank"],
    LABEL: "Asswind",
    GUNS: [
      /* {
      POSITION: [ 26.8, 6.4375, 1, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },{
      POSITION: [ 3.8600000000000003, 6.4375, 1.7425, 26.8, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.gunner, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [26.8, 6.4375, 1, 0, 0, 0, 0],
      }, {
        POSITION: [3.8600000000000003, 6.4375, 1.7425, 26.8, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.gunner, g.sniper, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [9.0592, 6.4375, -1.5425, 0, 0, 0, 0],
      },
      /* {
      POSITION: [ 16.4, 16.625, 1, 0, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [16.4, 16.625, 1, 0, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.blank, g.blank, g.blank, g.destroy, g.blank, g.blank, g.blank, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 4.613203125000001, str: 0.3366, pen: 1.08, rld: 8314099.2
        },
      },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: base.FOV,
    },
  };
  Class.autogtopowic = makeAuto(Class.gtopowic, "Auto-Gtopowic");
  Class.gearman = makeHybrid(Class.gtopowic, "Gearman");
  Class.gearman.UPGRADES_TIER_6 = ["overflower"];
  Class.overflower = makeOver(Class.gtopowic, "Overflower");
  Class.doublegtopowic = {
    PARENT: ["genericTank"],
    LABEL: "Double Gtopowic",
    GUNS: [
      /* {
      POSITION: [ 16.4, 6.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },{
      POSITION: [ 6.9, 6.5, 1.6000000000000023, 16.4, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [16.4, 6.5, 1, 0, 0, 0, 0],
      }, {
        POSITION: [6.9, 6.5, 1.6000000000000023, 16.4, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [5.5648, 6.5, -1.54, 0, 0, 0, 0],
      },
      {
        POSITION: [16.4, 6.5, 1, 0, 0, 180, 0],
      }, {
        POSITION: [6.9, 6.5, 1.6000000000000023, 16.4, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [5.5648, 6.5, -1.54, 0, 0, 180, 0],
      },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: base.FOV,
    },
  };
  Class.twink = {
    PARENT: ["genericTank"],
    LABEL: "Twink",
    GUNS: [
      /* {
      POSITION: [ 16.4, 6.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },{
      POSITION: [ 6.9, 6.5, 1.6000000000000023, 16.4, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [18, 4.5, 1, 0, 0, 0, 0],
      }, {
        POSITION: [5.5, 6.5, 1.6000000000000023, 17.5, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, ]),
          TYPE: "mech",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [6.5, 10, 1, 6.5, 0, 0, 0],
      },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: base.FOV,
    },
  };
  Class.doutory = {
    PARENT: ["genericTank"],
    LABEL: "Doutory",
    GUNS: [
      /* {
      POSITION: [ 16.32, 5, 1.8, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [16.32, 5, 1.8, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.mach, g.blank, g.blank, g.chain, g.blank, g.blank, g.blank, g.flank]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
          // dam: 0.28255869140625, str: 0.094248, pen: 1.3365000000000002, rld: 1476225
        },
      },
      /* {
      POSITION: [ 36.8, 6.875, 1, 0, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.flank, g.battle]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },{
      POSITION: [ 6.760000000000001, 6.875, 1.3250000000000002, 36.8, 0, 180, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.twin, g.bent, g.mini, g.flank]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [33.8, 6.875, 1, 0, 2, 195, 1 / 6],
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 33.8, 2, 195, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.twin, g.flank, g.bent, g.mini]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 31.799999999999997, 2, 195, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.twin, g.mini, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.14531589843750004, str: 0.26128575000000004, pen: 1.0890000000000002, rld: 185196559.68000004
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 29.799999999999997, 2, 195, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.twin, g.mini, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [33.8, 6.875, 1, 0, -2, -195, 0 / 6],
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 33.8, -2, -195, 0 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.twin, g.mini, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 31.799999999999997, -2, -195, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.mini, g.flank, g.twin, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.14531589843750004, str: 0.26128575000000004, pen: 1.0890000000000002, rld: 185196559.68000004
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 29.799999999999997, -2, -195, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.mini, g.flank, g.twin, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [36.8, 6.875, 1, 0, 0, 180, 4 / 6],
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 36.8, 0, 180, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.mini, g.flank, g.twin, g.bent]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 34.8, 0, 180, 6 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.bent, g.mini, g.flank, g.twin]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.14531589843750004, str: 0.26128575000000004, pen: 1.0890000000000002, rld: 185196559.68000004
        },
      }, {
        POSITION: [6.760000000000001, 6.875, 1.3250000000000002, 32.8, 0, 180, 8 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.sniper, g.blank, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.bent, g.mini, g.flank, g.twin]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [14.883200000000002, 6.875, -1.525, 0, 0, 180, 0],
      },
    ],
    BODY: {
      SPEED: 0.75 * base.SPEED,
      FOV: 1.55 * base.FOV,
    },
  };
  Class.baitshot = {
    PARENT: ["genericTank"],
    LABEL: "Bait Shot",
    GUNS: [
      /* {
      POSITION: [ 9.92, 10.5, 0.6, 0, 0, 0, 0],
      },{
      POSITION: [ 2.6, 6.3, 1.4000000000000004, 9.92, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.battle, g.carrier]),
      TYPE: "trap",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.trap,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [6.92, 10.5, 0.6, 0, 2, 15, 1 / 6],
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 6.92, 2, 15, 1 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 4.92, 2, 15, 3 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.battle, g.carrier]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.29473242187500004, str: 0.34375, pen: 1.25, rld: 113374080
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 2.92, 2, 15, 5 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.battle, g.carrier]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [6.92, 10.5, 0.6, 0, -2, -15, 0 / 6],
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 6.92, -2, -15, 0 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.battle, g.carrier]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 4.92, -2, -15, 2 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.29473242187500004, str: 0.34375, pen: 1.25, rld: 113374080
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 2.92, -2, -15, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [9.92, 10.5, 0.6, 0, 0, 0, 4 / 6],
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 9.92, 0, 0, 4 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini, g.carrier, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 7.92, 0, 0, 6 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.carrier, g.mini, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.29473242187500004, str: 0.34375, pen: 1.25, rld: 113374080
        },
      }, {
        POSITION: [2.6, 6.3, 1.4000000000000004, 5.92, 0, 0, 8 / 6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.carrier, g.mini, g.battle]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
          // dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        },
      }, {
        POSITION: [16.630399999999998, 3.78, -1.3800000000000001, 0, 0, 0, 0],
      },
    ],
    BODY: {
      SPEED: 0.9 * base.SPEED,
      FOV: 1.15 * base.FOV,
    },
  };
  Class.nerd = {
    PARENT: ["genericTank"],
    LABEL: "Nerd",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/ {
        POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 7, 1.2, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 7, 1.2, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
      RELOAD: 10 * base.RELOAD,
    },
    UPGRADES_TIER_2: [],
  };
  Class.autonerd = makeAuto(Class.nerd, "Auto-Nerd");
  Class.autonerd.UPGRADES_TIER_3 = ["nerdception"];
  Class.nerdception = makeCeption(Class.nerd, "Nerdception");
  Class.nerdbrid = makeHybrid(Class.nerd, "Nerdbrid");
  Class.nerdbrid.UPGRADES_TIER_3 = ["overnerd"];
  Class.overnerd = makeOver(Class.nerd, "Overnerd");
  Class.incel = {
    PARENT: ["genericTank"],
    LABEL: "Incel",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [ 15.44, 7, 1.2, 0, 0, 0, 0/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
      {
        POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 1/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 7, 1.2, 0, 0, 0, 2/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 7, 1.2, 0, 0, 0, 3/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.3 * base.FOV,
    },
    UPGRADES_TIER_5: ["fatass"],
  };
  Class.healception = makeCeption(Class.healer, "Healception");
  Class.healception.UPGRADES_TIER_4 = [];
  Class.healcursion = makeCeption(Class.healception, "Healcursion");
  Class.fortception = makeCeption(Class.fortress, "Fortception");
  Class.geek = {
    PARENT: ["genericTank"],
    LABEL: "Geek",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/ {
        POSITION: [ 13.44, 12, 1.2, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 12, 1.2, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 12, 1.2, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
    },
    UPGRADES_TIER_3: ["smartass"],
  };
  Class.smartass = {
    PARENT: ["genericTank"],
    LABEL: "Smartass",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/ {
        POSITION: [ 13.44, 14, 1.2, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 14, 1.2, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 14, 1.2, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
    },
    UPGRADES_TIER_4: ["genius"],
  };
  Class.genius = {
    PARENT: ["genericTank"],
    LABEL: "Genius",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/ {
        POSITION: [ 13.44, 16, 1.2, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 16, 1.2, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 16, 1.2, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
    },
    UPGRADES_TIER_5: ["fatass"]
  };
  Class.dumbass = {
    PARENT: ["genericTank"],
    LABEL: "Dumbass",
    GUNS: [
      {
        POSITION: [ 13.44, 5, 0.8, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 5, 0.8, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 5, 0.8, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
      BULLET_PENETRATION: 0.4 * base.BULLET_PENETRATION,
      BULLET_DAMAGE: 0.8 * base.BULLET_DAMAGE,
      BULLET_HEALTH: 0.8 * base.BULLET_HEALTH,
    },
    UPGRADES_TIER_3: ["retard"],
  };
  Class.retard = {
    PARENT: ["genericTank"],
    LABEL: "Retard",
    GUNS: [
      {
        POSITION: [ 15.44, 5, 0.8, 0, 0, 0, 0/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },
      {
        POSITION: [ 13.44, 5, 0.8, 0, 0, 0, 1/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 5, 0.8, 0, 0, 0, 2/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 5, 0.8, 0, 0, 0, 3/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.puregunner, g.hurricane, g.triplereload, g.mini, g.doublereload, g.halfrange, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
      BULLET_PENETRATION: 0.4 * base.BULLET_PENETRATION,
      BULLET_DAMAGE: 0.8 * base.BULLET_DAMAGE,
      BULLET_HEALTH: 0.8 * base.BULLET_HEALTH,
    },
  };
  Class.fatass = {
    PARENT: ["genericTank"],
    LABEL: "Fatass",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [ 15.44, 17, 1.2, 0, 0, 0, 0/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 13.44, 17, 1.2, 0, 0, 0, 1/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 17, 1.2, 0, 0, 0, 2/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 17, 1.2, 0, 0, 0, 3/4 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.pound, g.pound, g.destroy, g.lotsmorrecoil, g.halfrange, g.bitlessspeed, g.anni, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
    },
  };
  Class.momfucker69 = {
    PARENT: ["genericTank"],
    LABEL: "Mom smasher 69",
    DANGER: 7,
    BODY: {
      SPEED: 0.8 * base.SPEED,
      FOV: 2 * base.FOV,
    },
    GUNS: [
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [100, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.assass, g.sniper,]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [5, 8, -1.4, 8, 0, 0, 0],
      },
    ],
  };
  Class.dork = {
    PARENT: ["genericTank"],
    LABEL: "Dork",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/
      {
        POSITION: [ 5.44, 7, 1.8, 14, 0, 0, 0 ],
      },
      {
        POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },
      {
        POSITION: [ 11.44, 7, 1.2, 0, 0, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 7, 1.2, 0, 0, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.halfrange, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.3 * base.FOV,
    },
  };
  Class.minibosses = {
    PARENT: ["genericTank"],
    TYPE: "miniboss",
    DANGER: 6,
    SKILL: skillSet({
      rld: 0.7,
      dam: 0.5,
      pen: 0.8,
      str: 0.8,
      spd: 0.2,
      atk: 0.3,
      hlt: 1,
      shi: 0.7,
      rgn: 0.7,
      mob: 0,
    }),
    LEVEL: 50,
    CONTROLLERS: ["nearestDifferentMaster", "minion", "canRepel"],
    AI: {
      NO_LEAD: true,
    },
    FACING_TYPE: "autospin",
    HITS_OWN_TYPE: "hardOnlyBosses",
    BROADCAST_MESSAGE: "A visitor has left!",
    UPGRADES_TIER_0: [],
  };
  Class.minielite = {
    PARENT: ["miniboss"],
    LABEL: "Elite Crasher",
    SHAPE: 3,
    VALUE: 15e4,
    BODY: {
      FOV: 1.25,
      SPEED: 0.2 * base.SPEED,
      HEALTH: 5 * base.HEALTH,
      DAMAGE: 2 * base.DAMAGE,
    },
  };
  Class.minieliteDestroyer = makeMiniElite(Class.eliteDestroyer);
  Class.miniEliteSkimmer = makeMiniElite(Class.eliteSkimmer);
  Class.oversmasher = makeOver(Class.autoSmasher, "Oversmasher");
  Class.autoSmasher.UPGRADES_TIER_4 = [];
  // newline
  Class.overoverseer = makeOver(Class.overseer);
  Class.autohealer = makeAuto(Class.healer);
  Class.healer.UPGRADES_TIER_2.push("autohealer", "auraHealer");
  Class.autonurse = makeAuto(Class.nurse);
  Class.nurse.UPGRADES_TIER_3.push(["autonurse"]);
  Class.autotriHealer = makeAuto(Class.triHealer);
  Class.triHealer.UPGRADES_TIER_3 = ["autotriHealer"];
  Class.automedic = makeAuto(Class.medic);
  Class.medic.UPGRADES_TIER_3.push( ["automedic"]);
  Class.autopsychiatrist = makeAuto(Class.psychiatrist);
  Class.psychiatrist.UPGRADES_TIER_3.push(["autopsychiatrist"]);
  Class.autosoother = makeAuto(Class.soother);
  Class.soother.UPGRADES_TIER_3.push( ["autosoother"]);
  Class.autoanalyzer = makeAuto(Class.analyzer);
  Class.analyzer.UPGRADES_TIER_3.push( ["autoanalyzer"]);
  Class.autoscientist = makeAuto(Class.scientist);
  Class.autohealer.UPGRADES_TIER_3 = ["autonurse", "autotriHealer", "automedic", "autopsychiatrist", "autosoother", "autoanalyzer", "autoscientist"];
  Class.autoBuilder.UPGRADES_TIER_4 = []
  //newline
  Class.biception = makeCeption(Class.builder, "Biception");
  Class.autoBuilder.UPGRADES_TIER_4.push("biception");
  //newline
  Class.shard = {
    PARENT: ["genericTank"],
    LABEL: "Shard",
    GUNS : [
      /* {
	  POSITION: [ 28.4, 13.5, 1.8, 14, 0, 0, 0],
	  PROPERTIES: {
	  SHOOT_SETTINGS: combineStats([ g.drone, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.flank, g.battle, g.carrier]),
	  TYPE: "drone",
	  AUTOFIRE: true,
	  SYNCS_SKILLS: true,
	  STAT_CALCULATOR: gunCalcNames.drone,
	  MAX_CHILDREN: 4,
	  //
	  }, },7*/ {
        POSITION: [ 25.4, 13.5, 1.8, 7, 2, 15, 1/2 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.drone, g.sniper, g.mehdrone, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.twin, g.bent]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
// dam: 1.5309000000000001, str: 0.49881824999999996, pen: 1.0454400000000001, rld: 765703125
        }, },{
        POSITION: [ 25.4, 13.5, 1.8, 7, -2, -15, 0/2 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.drone, g.sniper, g.mehdrone, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.bent, g.flank, g.twin]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
// dam: 1.5309000000000001, str: 0.49881824999999996, pen: 1.0454400000000001, rld: 765703125
        }, },{
        POSITION: [ 28.4, 13.5, 1.8, 14, 0, 0, 0/2 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.drone, g.mehdrone, g.sniper, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.twin, g.bent, g.flank]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          MAX_CHILDREN: 4,
// dam: 1.5309, str: 0.49881824999999996, pen: 1.0454400000000001, rld: 765703125
        }, },
      /* {
	  POSITION: [ 26.88, 6, 0.6, 0, 0, 180, 0],
	  },{
	  POSITION: [ 7.605000000000001, 3.5999999999999996, 1.56, 26.88, 0, 180, 0],
	  PROPERTIES: {
	  SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.gunner, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.mini]),
	  TYPE: "trap",
	  AUTOFIRE: false,
	  SYNCS_SKILLS: false,
	  STAT_CALCULATOR: gunCalcNames.trap,
	  MAX_CHILDREN: 0,
	  //
	  }, },0*/ {
        POSITION: [ 26.88, 6, 0.6, 0, 0, 180, 0/3 ],
      },{
        POSITION: [ 7.605000000000001, 3.5999999999999996, 1.56, 26.88, 0, 180, 0/3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.gunner, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.flank, g.mini]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
// dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        }, },{
        POSITION: [ 7.605000000000001, 3.5999999999999996, 1.56, 24.88, 0, 180, 1/3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.gunner, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.mini, g.flank]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
// dam: 0.07265794921875002, str: 0.322575, pen: 1.8376875000000006, rld: 210450636
        }, },{
        POSITION: [ 7.605000000000001, 3.5999999999999996, 1.56, 22.88, 0, 180, 2/3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.trap, g.sniper, g.gunner, g.blank, g.blank, g.assass, g.blank, g.blank, g.blank, g.mini, g.flank]),
          TYPE: "trap",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: gunCalcNames.trap,
          MAX_CHILDREN: 0,
// dam: 0.94921875, str: 0.5, pen: 1, rld: 1679616
        }, },{
        POSITION: [ 10.7776, 2.1599999999999997, -1.76, 0, 0, 180, 0],
      }, ],
    BODY: {
      SPEED: 0.85 * base.SPEED,
      FOV: 1.55 * base.FOV,
    },
  };
  Class.autoanni = makeAuto(Class.annihilator);
  Class.overanni = makeOver(Class.autoanni);
  Class.indominus = makeHybrid(Class.overanni, "Indominus");
  Class.hybrid.UPGRADES_TIER_4 = ["indominus"];
  Class.minisorcerer = makeMiniBoss(Class.sorcerer);
  Class.miniarsummoner = makeMiniBoss(Class.arsummoner);
  Class.minisummoner = makeMiniBoss(Class.summoner);
  Class.minishinyomegasorcerer = makeMiniBoss(Class.shinyomegaSorcerer);
  Class.minienchantress = makeMiniBoss(Class.enchantress);
  Class.miniexorcistor = makeMiniBoss(Class.exorcistor);
  Class.miniapostal = makeMiniBoss(Class.shaman);
  Class.smartie = {
    PARENT: ["genericTank"],
    LABEL: "Smartie",
    GUNS : [
      /* {
      POSITION: [ 13.44, 7, 1.2, 0, 0, 0, 0],
      PROPERTIES: {
      SHOOT_SETTINGS: combineStats([ g.swarm, g.gunner, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
      TYPE: "swarm",
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: 0,
      MAX_CHILDREN: 0,
      //
      }, },0*/ {
        POSITION: [ 13.44, 7, 1.2, 0, 5, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 7, 1.2, 0, 5, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 7, 1.2, 0, 5, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
      {
        POSITION: [ 13.44, 7, 1.2, 0, -5, 0, 0/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 11.44, 7, 1.2, 0, -5, 0, 1/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 0.64072265625, str: 0.09075000000000001, pen: 1.25, rld: 2361960
        }, },{
        POSITION: [ 9.44, 7, 1.2, 0, -5, 0, 2/3 ],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([ g.basic, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.blank, g.mini]),
          TYPE: "bullet",
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          STAT_CALCULATOR: 0,
          MAX_CHILDREN: 0,
// dam: 1.8984375, str: 0.165, pen: 1, rld: 104976
        }, },
    ],
    BODY: {
      SPEED: base.SPEED,
      FOV: 1.2 * base.FOV,
    },
  };
  Class.minideltaturret = {
    PARENT: ["genericTank"],
    COLOR: 16,
    SHAPE: 3,
    GUNS: [
      {
        POSITION: [4, 7, 0.6, 8, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 7, 0.6, 8, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [4, 7, 0.6, 8, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ]
  }
  Class.minideltafortress = {
    PARENT: ["minielite"],
    DANGER: 11,
    STAT_NAMES: statnames.mixed,
    LABEL: "Delta Crasher",
    SIZE: 26,
    GUNS: [
      {
        POSITION: [15, 12, 1, 0, 0, 180, 0],
      },
      {
        POSITION: [3, 12, 1.7, 15, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.block, g.construct]),
          TYPE: "pellbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 12, 1, 0, 0, 60, 0],
      },
      {
        POSITION: [3, 12, 1.7, 15, 0, 60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.block, g.construct]),
          TYPE: "pellbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 12, 1, 0, 0, -60, 0],
      },
      {
        POSITION: [3, 12, 1.7, 15, 0, -60, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.block, g.construct]),
          TYPE: "pellbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
    TURRETS: [
      {
        POSITION: [ 9, 0, 0, 0, 360, 1],
        TYPE: ["minideltaturret"],
      },
      {
        POSITION: [ 7, 0, 0, 0, 360, 1],
        TYPE: ["auraBasicGen"],
      },
    ],
  };
  Class.crow = makeBird(Class.nerd, "Crow");
  Class.cycloption = makeCeption(Class.cyclone, "Cycloption");
  Class.cyclocursion = makeCeption(Class.cycloption, "Cyclocursion");
  Class.cyclone.UPGRADES_TIER_4 = [];
  Class.cycloption.UPGRADES_TIER_5 = [];
  Class.booster.UPGRADES_TIER_5 = [];
  Class.ranger.UPGRADES_TIER_5 = [];
  Class.triTrapper.UPGRADES_TIER_5 = [];
  Class.machineGun.UPGRADES_TIER_5 = [];
  Class.pentaShot.UPGRADES_TIER_5 = [];

  Class.supremetripleturret = {
    PARENT: ["genericTank"],
    LABEL: "Triplet",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    COLOR: 16,
    GUNS: [
      {
        POSITION: [18, 10, 1, 0, 5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [18, 10, 1, 0, -5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [17, 10, 1, 0, 5, 0, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [17, 10, 1, 0, -5, 0, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [16, 10, 1, 0, 5, 0, 1 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [16, 10, 1, 0, -5, 0, 1 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [15, 10, 1, 0, -5, 0, 3 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [15, 10, 1, 0, 5, 0, 2 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [14, 10, 1, 0, -5, 0, 2 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [14, 10, 1, 0, 5, 0, 3 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [21, 13.5, 1.2, 0, 0, 0, 0,],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 11.5, 1.2, 0, 0, 0, 2 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [23, 10, 1.2, 0, 0, 0, 1 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
    ],
  };
  Class.guard = {
    PARENT: ["genericTank"],
    LABEL: "Guard",
    DANGER: 10,
    COLOR: "lavender",
    SHAPE: 9,
    SIZE: 15,
    SKILL: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    SKILL_CAP: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    HAS_NO_RECOIL: true,
    VALUE: 1e5,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    AI: {
      NO_LEAD: true,
      STRAFE: true,
    },
    BODY: {
      FOV: 0.8,
      ACCELERATION: 0.8,
      DAMAGE: base.DAMAGE,
      HEALTH: 0.8 * base.HEALTH,
      SPEED: 0.45 * base.SPEED,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothToTarget",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
  };
  Class.guardGunnerScratch = {
    PARENT: ["guard"],
    LABEL: "Guard Gunner",
    UPGRADE_LABEL: "Guard Gunner",
    GUNS: [
      {
        POSITION: [18, 10, 1, 0, 5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [18, 10, 1, 0, -5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [17, 10, 1, 0, 5, 0, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [17, 10, 1, 0, -5, 0, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [16, 10, 1, 0, 5, 0, 1 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [16, 10, 1, 0, -5, 0, 1 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [15, 10, 1, 0, -5, 0, 3 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [15, 10, 1, 0, 5, 0, 2 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [14, 10, 1, 0, -5, 0, 2 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [14, 10, 1, 0, 5, 0, 3 / 4, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 13.5, 1.2, 0, 0, 0, 0,],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [21, 11.5, 1.2, 0, 0, 0, 2 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [23, 10, 1.2, 0, 0, 0, 1 / 3],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.mach]),
          TYPE: "bullet",
        },
      },
    ],
  };
  Class.guardGunner = makeAuto(Class.guardGunnerScratch, "Guard", {
    type: "artilleryTurret",
    size: 12
  });
  Class.guardGunner.UPGRADE_LABEL = "Minigun Guard"
  Class.guardAura = {
    PARENT: ["guard"],
    LABEL: "Guard",
    UPGRADE_LABEL: "Aura Guard",
    TURRETS: []
  };
  Class.aurashooter = {
    PARENT: ["genericTank"],
    LABEL: "Aura Shooter",
    BODY: {
      PUSHABILITY: 1,
      HETERO: 3,
    },
    GUNS: [
      {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic]),
          TYPE: "trplnrBossBulletHellFormPentagonsAuraBullet",
          COLOR: 16,
          LABEL: "",
          STAT_CALCULATOR: 0,
          WAIT_TO_CYCLE: false,
          AUTOFIRE: false,
          SYNCS_SKILLS: false,
          MAX_CHILDREN: 0,
          ALT_FIRE: false,
          NEGATIVE_RECOIL: false,
        },
      },
    ],
    TURRETS: [
      {
        POSITION: [3, 0, 0, 0, 360, 1],
        TYPE: "assemblerDot"
      }
    ],
    UPGRADES_TIER_4: ["aurashoottwin"],
  };
  Class.aurashoottwin = {
    PARENT: ["genericTank"],
    LABEL: "Aura Shooter Twin",
    GUNS: [
      {
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
          TYPE: "trplnrBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
          TYPE: "trplnrBossBulletHellFormPentagonsAuraBullet",
        },
      },
    ],
    TURRETS: [
      {
        POSITION: [3, 0, 0, 0, 360, 1],
        TYPE: "assemblerDot"
      }
    ],
  };
  Class.rogueMedbayBulletHealAura = addAura(-1, 1);
  Class.rogueMedbayMinionHealAuraBullet = {
    PARENT: 'bullet',
    TURRETS: [{
      POSITION: {SIZE: 15, LAYER: 1},
      TYPE: "rogueMedbayBulletHealAura"
    }]
  };
  Class.rogueMedbayMinion = {
    PARENT: 'minion',
    LABEL: 'Rogue Healer Minion',
    SHAPE: 0,
    SIZE: 18,
    GUNS: [
      {
        POSITION: { WIDTH: 7.5, HEIGHT: 5, ASPECT: 1.2, ANGLE: 0, X: 5},
      },
      {
        POSITION: { WIDTH: 10, HEIGHT: 10, ANGLE: 0, DELAY: 1 },
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.healer, {reload: 0.8}]),
          TYPE: 'rogueMedbayMinionHealAuraBullet',
          AUTOFIRE: true,
        },
      },
    ],
    TURRETS: [
      {
        POSITION: {SIZE: 8, LAYER: 1},
        TYPE: "healerSymbol",
      },
    ],
    DRAW_HEALTH: true,
  };
  Class.rogueMedbayAnniHealTurret = {
    PARENT: ["genericTank"],
    LABEL: "Healer Turret",
    COLOR: 16,
    BODY: {
      FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
      {
        POSITION: {WIDTH: 10, LENGHT: 15, X: 6.5, ASPECT: 1.6},
      },
      {
        POSITION: [21, 20, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni, { damage: -2, size: 1.3, reload: 3 }]),
          TYPE: "rogueMedbayMinionHealAuraBullet",
        },
      },
      {
        POSITION: {WIDTH: 5, LENGHT: 2, ASPECT: 3, Y: 10, X: -8, ANGLE: -30},
      },
      {
        POSITION: {WIDTH: 5, LENGHT: 2, ASPECT: 3, Y: -10, X: -8, ANGLE: 30},
      },
    ],
  };
  Class.rogueMedbay = {
    PARENT: ["miniboss"],
    LABEL: "Rogue Medbay",
    COLOR: 17,
    SHAPE: 4,
    SIZE: 30,
    VALUE: 5e5,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
      FOV: 1.4,
      SPEED: 0.01 * base.SPEED,
      HEALTH: 10 * base.HEALTH,
      SHIELD: 3 * base.SHIELD,
      DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: [
      { POSITION: [4, 10, -1.2, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([ g.factory, g.pound, g.halfreload, g.halfreload, ]), TYPE: ["rogueMedbayMinion", {INDEPENDENT: true}], STAT_CALCULATOR: gunCalcNames.drone, AUTOFIRE: true, MAX_CHILDREN: 1, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, reload: 0.8 }},
      { POSITION: [4, 10, -1.2, 8, 0, 90, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([ g.factory, g.pound, g.halfreload, g.halfreload, ]), TYPE: ["rogueMedbayMinion", {INDEPENDENT: true}], STAT_CALCULATOR: gunCalcNames.drone, AUTOFIRE: true, MAX_CHILDREN: 1, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, reload: 0.8 }},
      { POSITION: [4, 10, -1.2, 8, 0, 180, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([ g.factory, g.pound, g.halfreload, g.halfreload, ]), TYPE: ["rogueMedbayMinion", {INDEPENDENT: true}], STAT_CALCULATOR: gunCalcNames.drone, AUTOFIRE: true, MAX_CHILDREN: 1, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, reload: 0.8 }},
      { POSITION: [4, 10, -1.2, 8, 0, 270, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([ g.factory, g.pound, g.halfreload, g.halfreload,]), TYPE: ["rogueMedbayMinion", {INDEPENDENT: true}], STAT_CALCULATOR: gunCalcNames.drone, AUTOFIRE: true, MAX_CHILDREN: 1, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, reload: 0.8 }},
    ],
    TURRETS: [
      {
        POSITION: {SIZE: 8, X: 8, ANGLE: 45, LAYER: 0},
        TYPE: ["rogueMedbayAnniHealTurret"],
      },
      {
        POSITION: {SIZE: 8, X: 8, ANGLE: 135, LAYER: 0},
        TYPE: ["rogueMedbayAnniHealTurret"],
      },
      {
        POSITION: {SIZE: 8, X: 8, ANGLE: -135, LAYER: 0},
        TYPE: ["rogueMedbayAnniHealTurret"],
      },
      {
        POSITION: {SIZE: 8, X: 8, ANGLE: -45, LAYER: 0},
        TYPE: ["rogueMedbayAnniHealTurret"],
      },
      {
        POSITION: {SIZE: 11, LAYER: 1},
        TYPE: ["healerSymbol"],
      },
    ],
  };
  Class.titanAura = addAura(1, 1)
  Class.titanPillbox = {
    PARENT: ["unsetTrap"],
    LABEL: "Pillbox",
    BODY: {
      SPEED: 1,
      DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
      {
        POSITION: [11, 0, 0, 0, 360, 1],
        TYPE: "gunnerCruiserTurret",
      },
    ],
  };
  Class.rogueTitan = {
    PARENT: ["eternal"],
    SIZE: 150,
    SHAPE: -3.5,
    COLOR: 17,
    BODY: {
      SPEED: base.SPEED * 0.01,
      HEALTH: base.HEALTH * 2,
    },
    LABEL: "Rogue Titan",
    GUNS: [
      {
        POSITION: [9, 13, 1, 0, 0, 120, 0],
      },
      {
        POSITION: [3, 13, 1.7, 9, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.halfrange, {size: 0.6, reload: 1.1}]),
          TYPE: "titanPillbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [9, 13, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [3, 13, 1.7, 9, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.halfrange, {size: 0.6, reload: 1.1}]),
          TYPE: "titanPillbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [9, 13, 1, 0, 0, 240, 0],
      },
      {
        POSITION: [3, 13, 1.7, 9, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.block, g.pound, g.destroy, g.halfrange, {size: 0.6, reload: 1.1}]),
          TYPE: "titanPillbox",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
  Class.kushielLowerBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    COLOR: 6,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 30,
    SHAPE: 5,
    INDEPENDENT: true,
    FACING_TYPE: "autospin",
    TURRETS: [],
  };
  for(let i = 0; i < 5; i++) {
    Class.kushielLowerBody.TURRETS.push(
        {
          POSITION: [8.5, 9, 0, 360/5*(i+0.5), 160, 0],
          TYPE: ["cruiserTurret", { INDEPENDENT: true, COLOR: 16 }],
        },
    )
  }
  Class.tripleShotTurret = {
    PARENT: ["genericTank"],
    LABEL: "Triple Shot",
    DANGER: 6,
    BODY: {
      FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 16,
    GUNS: [
      {
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [19, 8, 1, 0, 2, 17.5, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [22, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
          TYPE: "bullet",
        },
      },
    ],
  };
  Class.kushielUpperBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: 0.005 }]],
    AUTOSPIN: true,
    COLOR: 6,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 30,
    SHAPE: 3,
    INDEPENDENT: true,
    TURRETS: [],
  };
  for(let i = 0; i < 3; i++) {
    Class.kushielUpperBody.TURRETS.push(
        {
          POSITION: [9.5, 7.5, 0, 360/3*(i+0.5), 160, 0],
          TYPE: ["tripleShotTurret", { INDEPENDENT: true, COLOR: 16 }],
        },
    )
  }
  Class.kushiel = {
    PARENT: ["terrestrial"],
    NAME: "Kushiel",
    UPGRADE_LABEL: "Kushiel",
    COLOR: 6,
    TURRETS: [
      {
        POSITION: [14.5, 0, 0, 0, 360, 1],
        TYPE: ["kushielLowerBody"],
      },
      {
        POSITION: [8.5, 0, 0, 0, 360, 1],
        TYPE: ["kushielUpperBody"],
      },
    ],
  };
  for(let i = 0; i < 7; i++) {
    Class.kushiel.TURRETS.push(
        {
          POSITION: [7, 9, 0, 360/7*(i+0.5), 180, 0],
          TYPE: ["terrestrialTrapTurret", { INDEPENDENT: true, }],
        },
    )
  }
  Class.armarosLowerBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    COLOR: 6,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 28,
    SHAPE: 7,
    INDEPENDENT: true,
    FACING_TYPE: "autospin",
    TURRETS: [
      {
        //*********    SIZE         X             Y         ANGLE        ARC
        POSITION: [8.5, 9, 0, 26, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 77, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 129, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 180, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 231, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 282, 180, 0],
        TYPE: ["cruiserTurret"],
      },
      {
        POSITION: [8.5, 9, 0, 333, 180, 0],
        TYPE: ["cruiserTurret"],
      },
    ],
  };
  Class.armarosUpperBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: 0.005 }]],
    COLOR: 6,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 28,
    SHAPE: 5,
    INDEPENDENT: true,
    TURRETS: [
      {
        //**     SIZE         X             Y         ANGLE        ARC
        POSITION: [10.6, 7.5, 0, 35, 160, 0],
        TYPE: ["tripletTurretWeak"],
      },
      {
        POSITION: [10.6, 7.5, 0, 110, 160, 0],
        TYPE: ["tripletTurretWeak"],
      },
      {
        POSITION: [10.6, 7.5, 0, 180, 160, 0],
        TYPE: ["tripletTurretWeak"],
      },
      {
        POSITION: [10.6, 7.5, 0, 252, 160, 0],
        TYPE: ["tripletTurretWeak"],
      },
      {
        POSITION: [10.6, 7.5, 0, 325, 160, 0],
        TYPE: ["tripletTurretWeak"],
      },
    ],
  };
  Class.tripletTurretWeak = {
    PARENT: ["genericTank"],
    DANGER: 6,
    LABEL: "Triplet",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: [
      "canRepel",
      "onlyAcceptInArc",
      "mapAltToFire",
      "nearestDifferentMaster",
    ],
    GUNS: [
      {
        POSITION: [18, 10, 1, 0, 5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [18, 10, 1, 0, -5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [21, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
          TYPE: "bullet",
        },
      },
    ],
  };
  Class.armaros = {
    PARENT: ["celestial"],
    NAME: "Armaros",
    UPGRADE_LABEL: "Armaros",
    COLOR: 6,
    TURRETS: [
      {
        /*********    SIZE         X             Y         ANGLE        ARC */
        POSITION: [6.5, 9, 0, 260, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 219, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 180, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 300, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 339, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 380, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 420, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 459, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [6.5, 9, 0, 500, 180, 0],
        TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
      },
      {
        POSITION: [14.77, 0, 0, 0, 360, 1],
        TYPE: ["armarosLowerBody"],
      },
      {
        POSITION: [8.7, 0, 0, 0, 360, 1],
        TYPE: ["armarosUpperBody"],
      },
    ],
  };
  Class.basicCruiserTurret = {
    PARENT: ["genericTank"],
    LABEL: "",
    BODY: {
      FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 16,
    GUNS: [
      {
        POSITION: [22, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
          TYPE: "bullet",
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, 5, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
      {
        POSITION: [7, 7.5, 0.6, 7, -5, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.swarm]),
          TYPE: "swarm",
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ],
  };
  Class.ragnaresstrialLowerBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    COLOR: 0,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 20,
    SHAPE: 5,
    INDEPENDENT: true,
    FACING_TYPE: "autospin",
    GUNS: [],
  };
  for(let i = 0; i < 5; i++) {
    Class.ragnaresstrialLowerBody.GUNS.push(
        {
          POSITION: [2.5, 6, -1.8, 9, 0, 360/5*(i+0.5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.factory, g.celeslower, g.pound, {size: 1.7}]),
            TYPE: ["gemDrone", {INDEPENDENT: true,}],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
          },
        },
    )
  }
  Class.ragnaresstrialUpperBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: 0.005 }]],
    AUTOSPIN: true,
    COLOR: 0,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 20,
    SHAPE: 3,
    INDEPENDENT: true,
    TURRETS: [],
  };
  for(let i = 0; i < 3; i++) {
    Class.ragnaresstrialUpperBody.TURRETS.push(
        {
          POSITION: [9.5, 7.5, 0, 360/3*(i+0.5), 160, 0],
          TYPE: ["basicCruiserTurret", { INDEPENDENT: true, COLOR: 16 }],
        },
    )
  }
  Class.ragnaresstrial = {
    PARENT: ["terrestrial"],
    NAME: "Vesosis",
    UPGRADE_LABEL: "Vesosis",
    COLOR: 0,
    TURRETS: [
      {
        POSITION: [14.5, 0, 0, 0, 360, 1],
        TYPE: ["ragnaresstrialLowerBody"],
      },
      {
        POSITION: [8.5, 0, 0, 0, 360, 1],
        TYPE: ["ragnaresstrialUpperBody"],
      },
    ],
  };
  for(let i = 0; i < 7; i++) {
    Class.ragnaresstrial.TURRETS.push(
        {
          POSITION: [7, 9, 0, 360/7*(i+0.5), 180, 0],
          TYPE: ["terrestrialTrapTurret", { INDEPENDENT: true, }],
        },
    )
  }
  Class.ragnalestialLowerBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    COLOR: 0,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 21,
    SHAPE: 7,
    INDEPENDENT: true,
    FACING_TYPE: "autospin",
    GUNS: [],
  };
  for(let i = 0; i < 7; i++) {
    Class.ragnalestialLowerBody.GUNS.push(
        {
          POSITION: [2.5, 4.5, -1.8, 9, 0, 360/7*(i+0.5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.factory, g.celeslower, g.pound, {size: 1.7}]),
            TYPE: ["gemDrone", {INDEPENDENT: true,}],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
          },
        },
    )
  }
  Class.ragnalestialUpperBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: 0.005 }]],
    AUTOSPIN: true,
    COLOR: 0,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 21,
    SHAPE: 5,
    INDEPENDENT: true,
    TURRETS: [],
  };
  for(let i = 0; i < 5; i++) {
    Class.ragnalestialUpperBody.TURRETS.push(
        {
          POSITION: [9.5, 7.5, 0, 360/5*(i+0.5), 160, 0],
          TYPE: ["gunnerCruiserTurret", { INDEPENDENT: true, COLOR: 16 }],
        },
    )
  }
  Class.ragnalestial = {
    PARENT: ["celestial"],
    NAME: "Trojan",
    UPGRADE_LABEL: "Trojan",
    COLOR: 0,
    TURRETS: [
      {
        POSITION: [14.5, 0, 0, 0, 360, 1],
        TYPE: ["ragnalestialLowerBody"],
      },
      {
        POSITION: [8.5, 0, 0, 0, 360, 1],
        TYPE: ["ragnalestialUpperBody"],
      },
    ],
  };
  for(let i = 0; i < 9; i++) {
    Class.ragnalestial.TURRETS.push(
        {
          POSITION: [6.5, 9, 0, 360/9*(i+0.5), 180, 0],
          TYPE: ["baseTrapTurret", { INDEPENDENT: true, }],
        },
    )
  }
  Class.lavenderBossAutoSwarm = makeAuto(Class.autoswarm, "Autonomous Swarm Mechanism");
  Class.lavenderBossAuraBulletAura = addAura(1, 1, 0.3, "#c679fc");
  Class.lavenderBossAuraBulletAuraBig = addAura(1, 1.85, 0.15, "#c679fc");
  Class.lavenderBossAuraBulletAuraHuge = addAura(1.5, 2.1, 0.3, "#c679fc")
  Class.lavenderBossAuraBullet = {
    PARENT: 'genericTank',
    LABEL: 'Nest',
    SHAPE: -4,
    PERSISTS_AFTER_DEATH: true,
    BODY: {
      HEALTH: 100,
    },
    SIZE: 26,
    COLOR: '#F49EFF',
    GLOW: {
      STRENGTH: 25,
      COLOR: -1,
      ALPHA: 1
    },
    DRAW_HEALTH: true,
    GUNS: (() => {
      let output = []
      for (let i = 0; i < 4; i++) {
        output.push({
          POSITION: { ANGLE: (360/4)*i, ASPECT: -0.35, X: -5 },
          PROPERTIES: {
            COLOR: 'white',
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.small, {reload: 0.8, damage: 1.25}]),
            TYPE: 'lavenderBossAutoSwarm',
            AUTOFIRE: true,
          },
        })
      }
      return output
    })(),
    TURRETS: [
      {
        POSITION: {SIZE: 8, LAYER: 1},
        TYPE: "lavenderBossAuraBulletAuraHuge"
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 45, X: 7.5},
        TYPE: "lavenderBossAuraBulletAuraBig"
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: -45, X: 7.5},
        TYPE: "lavenderBossAuraBulletAuraBig"
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: 135, X: 7.5},
        TYPE: "lavenderBossAuraBulletAuraBig"
      },
      {
        POSITION: {SIZE: 3, LAYER: 1, ANGLE: -135, X: 7.5},
        TYPE: "lavenderBossAuraBulletAuraBig"
      }
    ]
  }
  const lavenderBossDecor = {
    COLOR: '#F49EFF',
    LABEL: 'Lavender-Advance',
    NAME: 'Umbra',
    SHAPE: 3,
    SIZE: 25,
    VALUE: 3141592653589793238462643383279,
    DANGER: 10,
    GLOW: {
      RADIUS: 15,
      COLOR: -1,
      ALPHA: 1,
      RECURSION: 5
    },
    TURRETS: [{
      POSITION: { SIZE: 75 ** Math.SQRT1_2, ANGLE: 180 },
      TYPE: ['triangle', { COLOR: 'black', MIRROR_MASTER_ANGLE: true }]
    },{
      POSITION: { SIZE: 25 ** Math.SQRT1_2, ANGLE: 180, LAYER: 1 },
      TYPE: ['triangle', { COLOR: 'black', MIRROR_MASTER_ANGLE: true }]
    },{
      POSITION: { SIZE: 25 ** Math.SQRT1_2, LAYER: 1 },
      TYPE: ['triangle', { COLOR: -1, MIRROR_MASTER_ANGLE: true }]
    }, {
      POSITION: { SIZE: 8 ** Math.SQRT1_2, ANGLE: 180, LAYER: 1  },
      TYPE: ['triangle', { COLOR: "#d3d3ca", MIRROR_MASTER_ANGLE: true }]
    }, {
      POSITION: { SIZE: 25 },
      TYPE: ['triangle', { COLOR: 'black', MIRROR_MASTER_ANGLE: true }]
    },],
  }
  Class.lavenderBoss = {
    PARENT: "miniboss",
    ...lavenderBossDecor,
    BODY: {
      HEALTH: 2000,
      SHIELD: 3 * base.SHIELD,
      REGEN: 3 * base.REGEN,
    },
    AI: {STRAFE: true},
    ON: [
      {
        event: 'fire',
        handler: ({ body, gun }) => {
          if (gun.identifier !== 'onHandler') return
          const messages = [
            'Lavender-AdV4nC3 ON!',
            'Attack, my little swarms!',
            'Deploying, Attack swarms',
            'You really think you can defeat me? Here\'s a challenge for you.',
            'This thing is really gonna annoy you, MUAHAHA!',
            'I don\'t know what to say uhhh, die ig.'
          ]
          body.sendMessage(messages[Math.floor(Math.random() * messages.length)])
          body.sendMessage('Lavender-AdV4nC3 will turn into `BULL3T HELL F0rM`, Run!')
          for (let i = 0; i < 24; i++) {
            i < 12 ?
                setTimeout(() => { body.SIZE /= 1.1; body.alpha /= 1.2 }, i * 50)
                :
                setTimeout(() => { body.SIZE *= 1.1; body.alpha *= 1.2 }, i * 50)
          }
          setTimeout(() => {
            let range = 100
            let whereToGoX = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
            let whereToGoY = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
            body.x += whereToGoX
            body.y += whereToGoY
          }, 24 * 50);
          setTimeout(() => body.define('lavenderBossBulletHellForm'), 48 * 50)
        }
      }
    ],
    GUNS: (() => {
      let output = []
      for (let i = 0; i<2; i++) {
        output.push({
          POSITION: { WIDTH: 10, X: -5, ASPECT: -0.7, ANGLE: ((360 / 3) * i) - 180 },
          PROPERTIES: {
            COLOR: 'white',
            SHOOT_SETTINGS: combineStats([g.basic, {reload: 100}]),
            TYPE: "lavenderBossAuraBullet",
            INDEPENDENT_CHILDREN: true,
          }
        })
      }
      output.push({
        POSITION: { WIDTH: 10, X: -5, ASPECT: -0.7, ANGLE: ((360 / 3) * 2) - 180 },
        PROPERTIES: {
          COLOR: 'white',
          SHOOT_SETTINGS: combineStats([g.basic, {reload: 100}]),
          TYPE: "lavenderBossAuraBullet",
          INDEPENDENT_CHILDREN: true,
          IDENTIFIER: 'onHandler'
        }
      })
      for (let i = 0; i < 3; i++) {
        output.push({
          POSITION: { WIDTH: 5, ASPECT: -0.7, ANGLE: ((360 / 3) * i) - 180 },
          PROPERTIES: {
            COLOR: 'black'
          }
        })
        output.push({
          POSITION: { WIDTH: 5, HEIGHT: 5, X: -30, ASPECT: 0, ANGLE: ((360 / 3) * i) - 180 },
          PROPERTIES: {
            COLOR: 'black'
          }
        }, {
          POSITION: { WIDTH: 5, HEIGHT: 5, X: -25, ASPECT: 0, ANGLE: ((360 / 3) * i) - 180 },
          PROPERTIES: {
            COLOR: 'white'
          }
        })
      }
      return output
    })()
  }
	Class.lavenderBossBulletHellFormPentagonsAuraBullet = {
		PARENT: 'bullet',
		TURRETS: [{
			POSITION: {SIZE: 15, LAYER: 1},
			TYPE: "lavenderBossAuraBulletAura"
		}]
	}
  Class.lavenderBossBulletHellFormPentagonsAuraBulletChronic = {
    PARENT: 'bullet',
    TURRETS: [{
      POSITION: {SIZE: 8.5, LAYER: 1},
      TYPE: "lavenderBossAuraBulletAuraHuge"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 60, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 120, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 180, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 240, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 300, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },{
	    POSITION: {SIZE: 3, LAYER: 1, ANGLE: 360, X: 7.3},
	    TYPE: "lavenderBossAuraBulletAuraBig"
    },]
  }
	Class.lavenderBossBulletHellFormPentagonsAuraBulletPhotonic = {
		PARENT: 'bullet',
		TURRETS: [{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 60, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 120, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 180, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 240, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 300, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 360, X: 4},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 30, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 90, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 150, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 210, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 270, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},{
			POSITION: {SIZE: 3, LAYER: 1, ANGLE: 330, X: 7.3},
			TYPE: "lavenderBossAuraBulletAuraBig"
		},]
	}
  Class.lavenderBossBulletHellFormPentagons = {
    PARENT: 'bullet',
    LABEL: 'Pentagon',
    SHAPE: -5,
    TURRETS: [{
      POSITION: { SIZE: 40 ** Math.SQRT1_2, ANGLE: 180, LAYER: 1 },
      TYPE: ['pentagon', {COLOR: 'black', MIRROR_MASTER_ANGLE: true}]
    }, {
      POSITION: {SIZE: 12, LAYER: 1},
      TYPE: "lavenderBossAuraBulletAura"
    }],
    GUNS: (() => {
      let output = []
      for (let i = 0; i < 5; i++) {
        output.push({
          POSITION: { WIDTH: 10, HEIGHT: 10, ANGLE: ((360/5)*i) - 180, DELAY: 1, ASPECT: 1.6 },
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.mach, { reload: 1.1 }]),
            TYPE: 'lavenderBossBulletHellFormPentagonsAuraBullet',
            AUTOFIRE: true,
            COLOR: 'white'
          }
        })
      }
      return output
    })()
  }
  Class.lavenderBossBulletHellForm = {
    PARENT: "miniboss",
    ...lavenderBossDecor,
    LABEL: 'Lavender - Advance Bullet Hell Form',
    BODY: {
      HEALTH: 2000,
      SHIELD: 3 * base.SHIELD,
      REGEN: 3 * base.REGEN,
    },
    AI: {STRAFE: true},
    ON: [
      {
        event: "fire",
        handler: ({ body, masterStore, gun }) => {
          if (gun.identifier !== 'onHandler') return
          masterStore.shotsFired ??= 0
          masterStore.shotsFired++

          for (let i = 0; i < 24; i++) {
            i < 12 ?
                setTimeout(() => { body.SIZE /= 1.1; body.alpha /= 1.2 }, i * 50)
                :
                setTimeout(() => { body.SIZE *= 1.1; body.alpha *= 1.2 }, i * 50)
          }
          setTimeout(() => {
            let range = 100
            let whereToGoX = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
            let whereToGoY = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
            body.x += whereToGoX
            body.y += whereToGoY
          }, 12 * 50)

          if (masterStore.shotsFired > 10) {
            body.define('lavenderBossVulnerableForm')
            const messages = [
              'I\'m a little tired rn',
              'Ouch, my leg! Shit!',
              'i sleep',
              'Bruh my keyboard isn\'t working man',
              'bruh I chose the wrong form'
            ]
            body.sendMessage(messages[Math.floor(Math.random() * messages.length)])
            body.sendMessage('Lavender is in its `VULN3RABLE F0RM`, Attack!')
          }
        }
      }
    ],
    GUNS: (() => {
      let output = []
      for (let i = 0; i<3; i++) {
        output.push({
              POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: ((360 / 3) * i)-180, ASPECT: 0, X: -25 },
              PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni, { reload: 1 }]),
                TYPE: 'lavenderBossBulletHellFormPentagonsAuraBulletChronic',
                COLOR: 'black'
              }
            }, {
              POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: ((360 / 3) * i)-180, ASPECT: 0, X: -20 },
              PROPERTIES: {
                COLOR: 'white'
              }
            },
            {
              POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: ((360 / 3) * i)-180, ASPECT: 0, X: -25, DELAY: 0.5 },
              PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni, { reload: 1 }]),
                TYPE: 'lavenderBossBulletHellFormPentagonsAuraBulletPhotonic',
                COLOR: 'black'
              }
            }, {
              POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: ((360 / 3) * i)-180, ASPECT: 0, X: -20 },
              PROPERTIES: {
                COLOR: 'white'
              }
            }, {
              POSITION: { WIDTH: 10, HEIGHT: 5, ASPECT: 1.5, ANGLE: ((360 / 3) * i) - 180 },
              PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni, { reload: 2 }]),
                TYPE: 'lavenderBossBulletHellFormPentagons',
                COLOR: 'white'
              }
            }, {
              POSITION: { WIDTH: 8, HEIGHT: 3, X: -1, ASPECT: 1.5, ANGLE: ((360 / 3) * i) - 180 },
              PROPERTIES: {
                COLOR: 'pureWhite',
              }
            }, {
              POSITION: { WIDTH: 5, HEIGHT: 10, X: 5, ASPECT: 0.2, ANGLE: ((360 / 3) * i) - 180 },
              PROPERTIES: {
                COLOR: -1,
              }
            })
      }
      output.push({
        POSITION: { WIDTH: 0, HEIGHT: 0 },
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni, { reload: 2 }, g.fake]),
          TYPE: 'bullet',
          IDENTIFIER: 'onHandler'
        }
      })
      return output
    })()
  }
  Class.lavenderBossVulnerableForm = {
    PARENT: "miniboss",
    ...lavenderBossDecor,
    LABEL: 'Lavender Advance - Vulnerable Form',
    BODY: {
      HEALTH: 300,
      SPEED: 0.01
    },
    DANGER: 3141592653,
    ON: [
      {
        event: "fire",
        handler: ({ body, gun }) => {
          if (gun.identifier !== 'onHandler') return
          setTimeout(() => {
            body.define('lavenderBoss')
            body.sendMessage('im awake')
          }, 15000)
          setTimeout(() => body.sendMessage('Lavender will activate in 10 seconds and turn into S4nctuary F0rM'), 5000)
        }
      }
    ],
    GUNS: [{
      POSITION: {LENGTH: 0, WIDTH: 0},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, {reload: 500}]),
        TYPE: 'bullet',
        AUTOFIRE: true,
        IDENTIFIER: 'onHandler'
      }
    }]
  };
  // AdV4nC3
  Class.mortarTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    DANGER: 7,
    BODY: {
      FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 16,
    GUNS: [
      {
        POSITION: [13, 3, 1, 0, -8, -7, 0.6],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, {reload: 0.2}]),
          TYPE: "bullet",
          LABEL: "Secondary",
        },
      },
      {
        POSITION: [13, 3, 1, 0, 8, 7, 0.8],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, {reload: 0.2}]),
          TYPE: "bullet",
          LABEL: "Secondary",
        },
      },
      {
        POSITION: [17, 3, 1, 0, -6, -7, 0.2],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, {reload: 0.2}]),
          TYPE: "bullet",
          LABEL: "Secondary",
        },
      },
      {
        POSITION: [17, 3, 1, 0, 6, 7, 0.4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, {reload: 0.2}]),
          TYPE: "bullet",
          LABEL: "Secondary",
        },
      },
      {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, {reload: 0.2}]),
          TYPE: "bullet",
          LABEL: "Heavy",
        },
      },
    ],
  };
  Class.legendarySentry = { // if you're gonna mald about the shape not being 0 save yourself time by changing it yourself in your own private servers ok
    PARENT: ["sentry"],
    COLOR: 0,
    DANGER: 6,
    SIZE: 15,
    VALUE: 150000,
    SHAPE: 4.5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: {
      HEALTH: 0.8 * base.HEALTH
    },
  };
  Class.fortifierTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
      FOV: 0.8,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 16,
    AI: {
      SKYNET: true,
      FULL_VIEW: true,
    },
    GUNS: [
      {
        POSITION: [28, 8, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [4, 8, 1.3, 26, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange, {reload: 0.2}]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 22, 0, 0, 1/4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange, {reload: 0.2}]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 18, 0, 0, 2/4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange, {reload: 0.2}]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [4, 8, 1.3, 14, 0, 0, 3/4],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange, {reload: 0.2}]),
          TYPE: "trap",
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
  Class.legendarySentryGun = makeAuto(Class.legendarySentry, "Sentry", {
    type: "mortarTurret",
    size: 12,
  });
  Class.legendarySentryGun.UPGRADE_LABEL = "Legendary Gun Sentry";
  Class.legendarySentryTrap = makeAuto(Class.legendarySentry, "Sentry", {
    type: "fortifierTurret",
    size: 12,
  });
  Class.legendarySentryTrap.UPGRADE_LABEL = "Legendary Trap Sentry";
  Class.legendarySentrySwarm = makeAuto(Class.legendarySentry, "Sentry", {
    type: "monsoonTurretARDreadV2",
    size: 12.
  });
  Class.legendarySentrySwarm.UPGRADE_LABEL = "Legendary Swarm Sentry"
  Class.hyperOctoTank = {
    PARENT: ["genericTank"],
    LABEL: "Hyper Octo Tank",
    DANGER: 10,
    GUNS: [
      {
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 90, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 270, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 45, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 135, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 225, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
      {
        POSITION: [18, 8, 1, 0, 0, 315, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
          TYPE: "lavenderBossBulletHellFormPentagonsAuraBullet",
        },
      },
    ],
  };
  Class.bean = {
    PARENT: ["genericTank"],
    LABEL: "Bean",
    DANGER: 6,
    BODY: {
      FOV: 1.05 * base.FOV,
      DENSITY: 2 * base.DENSITY,
    },
    GUNS: [
      {
        POSITION: [48, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
          COLOR: 'blue',
        }
      },
    ],
    TURRETS: [
      {
        POSITION: [21.5, 50, 0, 0, 360, 1],
        TYPE: ["basic", {COLOR: 'blue'}]
      },
      {
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: "smasherBody",
      },
    ],
    IS_SMASHER: true,
    SKILL_CAP: [smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl, smshskl],
    STAT_NAMES: statnames.mixed,
  };
  Class.empressAddon = {
    PARENT: "menu",
    LABEL: "Empress' (Umbra's) Addon",
    UPGRADES_TIER_0: ["moshrav", "hyperOctoTank", "bean"],
  };

  Class.addons.UPGRADES_TIER_0.push("empressAddon");
  Class.bosses.UPGRADES_TIER_0.push("shinyomegaMysticals", "rogueEmpressTier", "deltas", "shinydeltas");
  Class.rogues.UPGRADES_TIER_0.push("arroguepalisade", "rogueAnni", "rogueRammer", "rogueEmpress", "rogueMedbay", "rogueTitan", "rogueKamikaze");
  Class.eternals.UPGRADES_TIER_0.push("rogueEmpress");
  Class.tanks.UPGRADES_TIER_0.push("armageddonMenu");
  Class.elites.UPGRADES_TIER_0.push("eliteFortress", "legionarySkimmer");
  Class.deltas.UPGRADES_TIER_0.push("deltaFortress", "deltaSkimmer", "deltaDestroyer", "deltaSprayer");
  Class.shinydeltas.UPGRADES_TIER_0.push("shinydeltaFortress");
  Class.nesters.UPGRADES_TIER_0.push("arnestGuardian", "arnestWarden", "arnestKeeper", "nestking");
  Class.armageddonMenu.UPGRADES_TIER_0.push("armageddonBasic", "armageddonTrapper", "armageddonDroners");
  Class.armageddonBasic.UPGRADES_TIER_0.push("empress", "vanquisher", "warrior", "bombardationer", "tractor");
  Class.armageddonTrapper.UPGRADES_TIER_0.push("empire");
  Class.armageddonDroners.UPGRADES_TIER_0.push("ac130");
  Class.rogueEmpressTier.UPGRADES_TIER_0.push("rogueEmpress", "rogueEmpressBase", "rogueEmpressLowerBody", "rogueEmpressBottomBody", "rogueEmpressMiddleBody", "rogueEmpressTopBody", "rogueWarrior", "askshybridMissile", "askshybridTurret", "autoSmasherDrone");
  Class.shinyomegaMysticals.UPGRADES_TIER_0.push("shinyomegaSorcerer", "shinyomegasummoner", "shinyomegaenchantress", "shinyomegaexorcistor");
  Class.mysticals.UPGRADES_TIER_0.push("arsummoner", "perseus", "dardanos", "cora", "concordia", "lilith", "moshboss");
  Class.basic.UPGRADES_TIER_1.push("nerd", "switcheroo", "minibosses", "aurashooter");
  Class.destroyer.UPGRADES_TIER_3.push("unchimaverry", "asswind");
  Class.overseer.UPGRADES_TIER_3.push("unchimaverry", "baverc", "overoverseer", "shard");
  Class.assassin.UPGRADES_TIER_3.push("gtopowic");
  Class.trapper.UPGRADES_TIER_3.push("gtopowic", "asswind", "dork");
  Class.builder.UPGRADES_TIER_3.push("baverc");
  Class.minigun.UPGRADES_TIER_3.push("gutotorheirlsic");
  Class.booster.UPGRADES_TIER_5.push("marbler");
  Class.director.UPGRADES_TIER_3.push("gnat");
  Class.gtopowic.UPGRADES_TIER_5.push("autogtopowic", "gearman", "twink");
  Class.gtopowic.UPGRADES_TIER_6.push("doublegtopowic");
  Class.ranger.UPGRADES_TIER_5.push("doutory", "momfucker69");
  Class.triTrapper.UPGRADES_TIER_5.push("doutory");
  Class.machineGun.UPGRADES_TIER_5.push("doutory");
  Class.pentaShot.UPGRADES_TIER_5.push("baitshot");
  Class.nerd.UPGRADES_TIER_2.push("minigun", "nerdbrid", "autonerd", "incel", "geek", "dumbass", "dork", "smartie", "crow");
  Class.healer.UPGRADES_TIER_3.push("healception");
  Class.healception.UPGRADES_TIER_4.push("healcursion");
  Class.minibosses.UPGRADES_TIER_0.push("minieliteDestroyer", "miniEliteSkimmer", "minisorcerer", "minisummoner", "minienchantress", "miniexorcistor", "miniarsummoner", "miniapostal", "minideltafortress");
  Class.autoSmasher.UPGRADES_TIER_4.push("oversmasher");
  Class.cyclone.UPGRADES_TIER_4.push("cycloption");
  Class.cycloption.UPGRADES_TIER_5.push("cyclocursion");
  Class.terrestrials.UPGRADES_TIER_0.push("kushiel", "ragnaresstrial");
  Class.celestials.UPGRADES_TIER_0.push("armaros", "ragnalestial");
  Class.sentries.UPGRADES_TIER_0.push("legendarySentryGun", "legendarySentrySwarm", "legendarySentryTrap", "guardGunner", "guardAura");
  Class.devBosses.UPGRADES_TIER_0.push("lavenderBoss");

  console.log("[Empress' (Umbra's) Addons] loaded");
};
