const { combineStats} = require('../facilitators.js');
const { base, gunCalcNames, statnames} = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {
// healer arsenal
  Class.healerDrone = {
    PARENT: ["drone"],
    HITS_OWN_TYPE: "normal",
    HEALER: true,
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
};
  Class.healerTrap = {
    PARENT: ["trap"],
    HITS_OWN_TYPE: "normal",
    HEALER: true,
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
};
Class.healerMiniMissile = {
    PARENT: ["minimissile"],
    HITS_OWN_TYPE: "normal",
    HEALER: true,
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
};
Class.healerSwarm = {
    PARENT: ["swarm"],
    HITS_OWN_TYPE: "normal",
    HEALER: true,
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
};
Class.healerMinion = {
    PARENT: ["minion"],
    HITS_OWN_TYPE: "normal",
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [17, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minion, g.healer]),
                WAIT_TO_CYCLE: true,
                TYPE: "healerBullet",
            },
        },
    ],
};
  // tanks
Class.nurse = {
    PARENT: ["genericTank"],
    LABEL: "Nurse",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 5.5, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
         {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, -5.5, 0, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
   STAT_NAMES: statnames.heal,
};
  Class.psychiatrist = {
    PARENT: ["genericTank"],
    LABEL: "Psychiatrist",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.analyzer = {
    PARENT: ["genericTank"],
    LABEL: "Analyzer",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [10.5, 11, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [20.5, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.soother = {
    PARENT: ["genericTank"],
    LABEL: "Soother",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.healer]),
                TYPE: "healerDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                MAX_CHILDREN: 6,
            },
        },
    ],
   STAT_NAMES: statnames.heal,
};
  Class.scientist = {
    PARENT: ["genericTank"],
    LABEL: "Scientist",
    STAT_NAMES: statnames.trap,
        TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.healer]),
                TYPE: "healerTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
    ],
   STAT_NAMES: statnames.heal,
};
  Class.triHealer = {
    PARENT: ["genericTank"],
    LABEL: "Tri-Healer",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 120, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 240, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.clinician = {
    PARENT: ["genericTank"],
    LABEL: "Clinician",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 5.5, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
         {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, -5.5, 0, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 5.5, 180, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
         {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, -5.5, 180, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
Class.therapist = {
    PARENT: ["genericTank"],
    LABEL: "Therapist",
    DANGER: 6,
      TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
              {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [2, 2.5, -0.5, 11.5, 7.25, 0, 0.5],
        },
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.healer]),
                TYPE: "healerBullet",
            },
        },
                    {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [2, 2.5, -0.5, 11.5, -7.25, 0, 0.75],
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.healer]),
                TYPE: "healerBullet",
            },
        },
            {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 2.5, -0.5, 12.5, 3.75, 0, 0.5],
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.healer]),
                TYPE: "healerBullet",
            },
        },
                  {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [6, 2.5, -0.5, 12.5, -3.75, 0, 0.25],
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.ointment = {
    PARENT: ["genericTank"],
    LABEL: "Ointment",
    BODY: {
        FOV: base.FOV * 1.225,
    },
  TURRETS: [
          {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [20, 12, 1, 0, 0, 0, 0],
        },
              {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [14, 6, -0.5, 12.5, 0, 0, 0],
        },

        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.intern = {
    PARENT: ["genericTank"],
    DANGER: 6,
    LABEL: "Intern",
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV,
    },
    TURRETS: [
          {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
            {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [17, 7, -0.5, 12.5, 0, 0, 0],
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.injection = {
    PARENT: ["genericTank"],
    LABEL: "Injection",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25,
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    TURRETS: [
          {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [14, 7, -0.5, 12.5, 0, 0, 0],
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [11, 11, -0.5, 12.5, 0, 0, 0.25],
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.actuary = {
    PARENT: ["genericTank"],
    LABEL: "Actuary",
    DANGER: 6,
    BODY: {
        FOV: 1.2,
    },
    TURRETS: [
          {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
                     {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [11, 7, -0.5, 12.5, 0, 0, 0],
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [21, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.healer]),
                TYPE: "healerBullet",
            },
        },
                    {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [9, 7, -0.5, 12.5, 0, 0, 1 / 3],
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.healer]),
                TYPE: "healerBullet",
            },
        },

         {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [7, 7, -0.5, 12.5, 0, 0, 2 / 3],
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],  
    STAT_NAMES: statnames.heal,
};
  Class.professor = {
    PARENT: ["genericTank"],
    LABEL: "Professor",
    STAT_NAMES: statnames.mixed,
    DANGER: 6,
        TURRETS: [
          {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.healer]),
                TYPE: "healerTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
    Class.chemist = {
    PARENT: ["genericTank"],
    LABEL: "Chemist",
    STAT_NAMES: statnames.trap,
        TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.healer]),
                TYPE: "healerTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
        {
            POSITION: [15, 7, 1, 0, 0, 120, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.healer]),
                TYPE: "healerTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
        {
            POSITION: [15, 7, 1, 0, 0, 240, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.healer]),
                TYPE: "healerTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
    Class.hexaHealer = {
    PARENT: ["genericTank"],
    LABEL: "Hexa-Healer",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 120, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 240, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 60, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 180, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [8, 9, -0.5, 12.5, 0, 300, 0.5],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.guru = {
    PARENT: ["genericTank"],
    DANGER: 6,
    LABEL: "Guru",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [

        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [7, 2, -0.5, 12.5, -6, -7, 0.25],
        },
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Secondary",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [7, 2, -0.5, 12.5, 6, 7, 0.75],
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Secondary",
            },
        },
              {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [9, 11, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Heavy",
            },
        },
    ],
     STAT_NAMES: statnames.heal,
};
  Class.clerk = {
    PARENT: ["genericTank"],
    LABEL: "Clerk",
    BODY: {
        FOV: base.FOV * 1.1,
    },
    DANGER: 6,
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [10, 9, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty, g.healer]),
                TYPE: "healerMiniMissile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
    Class.accountant = {
    PARENT: ["genericTank"],
    LABEL: "Accountant",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [11, 13, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [21, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
};
  Class.antidote = {
    PARENT: ["genericTank"],
    LABEL: "Antidote",
    DANGER: 6,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: 1.2 * base.FOV,
    },
      TURRETS: [
        {
            /** SIZE         X             Y         ANGLE        ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
              {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [8, 5.5, -0.5, 8.5, 4, 0, 0],
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.healer]),
                TYPE: "healerSwarm",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
                    {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [8, 5.5, -0.5, 8.5, -4, 0, 0.5],
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.healer]),
                TYPE: "healerSwarm",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
    ],
   STAT_NAMES: statnames.heal,
};
    Class.doctor = {
    PARENT: ["genericTank"],
    LABEL: "Doctor",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [16, 16, 1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.bigdrone, g.healer]),
                TYPE: "healerDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                MAX_CHILDREN: 1,
            },
        },
    ],
   STAT_NAMES: statnames.heal,
};
  Class.medicare = {
    PARENT: ["genericTank"],
    LABEL: "Medicare",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
        TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            /**** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "healerMinion",
                STAT_CALCULATOR: gunCalcNames.drone,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ],
   STAT_NAMES: statnames.heal,
};
  Class.renovater = {
    PARENT: ["genericTank"],
    LABEL: "Renovater",
    TURRETS: [
        {
            /** SIZE     X       Y     ANGLE    ARC */
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.healer]),
                TYPE: "healerBullet",
            },
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
        },
    ],
};
Class.healer3 = {
    PARENT: ["genericTank"],
    LABEL: "Healer-3",
    DANGER: 6,
    FACING_TYPE: "autospin",
    TURRETS: [
      {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
        {
            POSITION: [11, 8, 0, 0, 190, 0],
            TYPE: "healer",
        },
        {
            POSITION: [11, 8, 0, 120, 190, 0],
            TYPE: "healer",
        },
        {
            POSITION: [11, 8, 0, 240, 190, 0],
            TYPE: "healer",
        },
    ],
};

  Class.healer.UPGRADES_TIER_2 = ["nurse", "medic", "triHealer", "psychiatrist", "soother", "analyzer", "scientist"]
      Class.nurse.UPGRADES_TIER_3 = ["paramedic", "therapist", "clinician"]
      Class.medic.UPGRADES_TIER_3 = ["intern", "injection", "actuary", "ointment"]
      Class.triHealer.UPGRADES_TIER_3 = ["ambulance", "healer3", "hexaHealer", "chemist"]
      Class.psychiatrist.UPGRADES_TIER_3 = ["therapist", "guru", "actuary"]
      Class.soother.UPGRADES_TIER_3 = ["antidote", "doctor", "medicare"]
      Class.analyzer.UPGRADES_TIER_3 = ["accountant", "clerk", "guru"]
      Class.scientist.UPGRADES_TIER_3 = ["surgeon", "professor", "chemist"]
  Class.healer.UPGRADES_TIER_3 = ["renovater"]  
}