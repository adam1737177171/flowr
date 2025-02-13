//import { setDefaultHighWaterMark } from "stream"
// avoiding require

if(typeof window === 'undefined')var calculateDrops = require("../server/game/drops.js");

const attackPetalDistanceMult = 1.91;
const defendPetalDistanceMult = 0.6;

const BaseStats = (typeof global !== 'undefined' ? global : window).baseStats = {
  petals: {
    "default": {
      radius: 10,
      knockback: 0.1
    },
    "Basic": {
      damage: 10,
      health: 10,
      reload: 2.5,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Compass": {
      damage: 5,
      health: 9,
      reload: 20,
      override: {
        6: {reload: 10},
        7: {reload: 7},
        8: {reload: 4},
        9: {reload: 1},
        10: {reload: 0.5, 
        damage: 1/2,
        health: 1/2,
        petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 18
            },
            { //petal 2
              offsetAngle: Math.PI,
              offsetRadius: 18
            }
          ]
        ]},
        11: {reload: 0.3,
        damage: 2/3,
        health: 2/3,
         petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 20
            },
            { //petal 2
              offsetAngle: Math.PI * 2/3,
              offsetRadius: 20
            },
            { //petal 3
              offsetAngle: Math.PI * 4/3,
              offsetRadius: 20
            },
          ]
        ]},
        12: {reload: 0.1, 
        damage: 3/5,
        health: 3/5,
        petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 30
            },
            { //petal 2
              offsetAngle: Math.PI * 2/5,
              offsetRadius: 30
            },
            { //petal 3
              offsetAngle: Math.PI * 4/5,
              offsetRadius: 30
            },
            { //petal 3
              offsetAngle: Math.PI * 6/5,
              offsetRadius: 30
            },
            { //petal 4
              offsetAngle: Math.PI * 8/5,
              offsetRadius: 30
            },
          ]
        ]},
      },
      pvpOverride: {

      },
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Dark Compass": {
      damage: 5,
      health: 9,
      reload: 20,
      override: {
        6: {reload: 10},
        7: {reload: 7},
        8: {reload: 4},
        9: {reload: 1},
        10: {reload: 0.5, 
        damage: 1/2,
        health: 1/2,
        petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 18
            },
            { //petal 2
              offsetAngle: Math.PI,
              offsetRadius: 18
            }
          ]
        ]},
        11: {reload: 0.3,
        damage: 2/3,
        health: 2/3,
         petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 20
            },
            { //petal 2
              offsetAngle: Math.PI * 2/3,
              offsetRadius: 20
            },
            { //petal 3
              offsetAngle: Math.PI * 4/3,
              offsetRadius: 20
            },
          ]
        ]},
        12: {reload: 0.1, 
        damage: 3/5,
        health: 3/5,
        petalLayout: [
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 30
            },
            { //petal 2
              offsetAngle: Math.PI * 2/5,
              offsetRadius: 30
            },
            { //petal 3
              offsetAngle: Math.PI * 4/5,
              offsetRadius: 30
            },
            { //petal 3
              offsetAngle: Math.PI * 6/5,
              offsetRadius: 30
            },
            { //petal 4
              offsetAngle: Math.PI * 8/5,
              offsetRadius: 30
            },
          ]
        ]},
      },
      pvpOverride: {

      },
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Waterlogged Compass": {
      damage: 5,
      health: 9,
      reload: 4,
      highestRarity: 0,
      override: {
        1: {highestRarity: 1},
        2: {highestRarity: 2},
        3: {highestRarity: 3},
        4: {highestRarity: 4},
        5: {highestRarity: 5},
        6: {highestRarity: 6},
        7: {highestRarity: 7},
        8: {highestRarity: 8},
        9: {highestRarity: 9},
        10: {highestRarity: 10},
        11: {highestRarity: 11},
        12: {highestRarity: 12},
        13: {highestRarity: 13},
        14: {highestRarity: 14},
        15: {highestRarity: 15},
        16: {highestRarity: 16},
        17: {highestRarity: 17},
        18: {highestRarity: 18},

      },
      pvpOverride: {

      },
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Token": {
      damage: 20,
      health: 20,
      reload: 2.5,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Bone": {
      damage: 22.5,
      health: 4.25,
      armor: 9.95,
      radius: 14.5,
      reload: 2.3,
      override: {
        9: {radius: 19}, //Fab
      },
      pvpOverride: {
        0: {armor: 0.5}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health", "armor"]
    },
    "Corn": {
      damage: 2.9,
      health: 30000,
      reload: 9,
      radius: 12,
      override: {
        9: {radius: 17},
        12: {radius: 38}, //Omni
        13: {radius: 55}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Soil": {
      damage: 6,
      health: 30,
      reload: 2,
      healthBuff: 200,
      radius: 10,
      petalLayout: [[{}]],
      override: {
          12: {
            healthBuff: 65000,
            damage: 1/3,
            petalLayout: [
              [ //position 0 in rotation
                { //petal 1
                  offsetAngle: 0,
                  offsetRadius: 9//*20
                },
                { //petal 2
                  offsetAngle: Math.PI * 2/3,
                  offsetRadius: 9//*20
                },
                { //petal 3
                  offsetAngle: Math.PI * 4/3,
                  offsetRadius: 9//*20
                },
                
              ]
            ]  
        }
      },
      pvpOverride: {
        12: {
          healthBuff: 330,
          damage: 1/3,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI * 2/3,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: Math.PI * 4/3,
                offsetRadius: 9//*20
              },
              
            ]
          ]  
        }
      },
      healScalers: ["healthBuff"],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Husk": {
      damage: 6,
      health: 6,
      reload: 1,
      healthBuff: 35,
      flowerArmor: 3,
      radius: 11,
      override: {
        12: {radius: 24}, //Omni
        13: {radius: 30}
      },
      pvpOverride: {
        0: {flowerArmor: 6}
      },
      petalLayout: [[{}]],
      healScalers: ["healthBuff", "flowerArmor"],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Cactus": {
      damage: 56,
      health: 9,
      reload: 2.1,
      healthBuff: 70,
      radius: 15,
      override: {
        12: {
          healthBuff: 23000,
          damage: 1/3,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI * 2/3,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: Math.PI * 4/3,
                offsetRadius: 9//*20
              },
              
            ]
          ]  
        }
      },
      pvpOverride: {
        12: {
          healthBuff: 115,
          damage: 1/3,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI * 2/3,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: Math.PI * 4/3,
                offsetRadius: 9//*20
              },
              
            ]
          ]  
        }
      },
      

      petalLayout: [[{}]],
      healScalers: ["healthBuff"],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Leaf": {
      damage: 24,
      health: 12,
      reload: 1,
      passiveHealingBuff: 7,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      healScalers: ["passiveHealingBuff"],
      override: {
        5: {radius: 14}, //Myth
        7: {radius: 17}, //Sup
        9: {
          radius: 18,
          damage: 1/3,
          health: 1/3,
          passiveHealingBuff: 646/3,
          petalLayout: [
            [{}],
            [{}],
            [{}]
          ],
        }, //Fab
        12: {radius: 24}, //Omni
        13: {radius: 30}
      },
      
      pvpOverride: {
        0: {passiveHealingBuff: 8.9},
        5: {radius: 14}, //Myth
        7: {radius: 17}, //Sup
        9: {
          radius: 18,
        }, //Fab
        12: {radius: 24}, //Omni
        13: {radius: 30}
      },
    },
    "Starfish": {
      damage: 30,
      health: 11,
      reload: 2,
      passiveHealingBuff: 12,
      radius: 20,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      healScalers: ["passiveHealingBuff"],
      override: {
      },
    },
    "Yucca": {
      damage: 4.5,
      health: 170,
      reload: 1,
      passiveHealingBuff: 14,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      healScalers: ["passiveHealingBuff"],
      override: {
        5: {radius: 14}, //Myth
        7: {radius: 17}, //Sup
        12: {radius: 19}, 
        13: {radius: 22}
      },
      pvpOverride: {
        0: {passiveHealingBuff: 15}
      }
    },
    "Rose": {
      damage: 5,
      health: 5,
      reload: 3.5,
      heal: 40,
      healScalers: ["heal"],
      override: {
        7: {radius: 17}, //Sup
        12: {radius: 19, health: 5, heal: 55000}
      },
      pvpOverride: {
        0: {heal: 37}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "RoseProjectile": {
      damage: 1,
      health: 25,
      reload: 3.5,
      heal: 40,
      healScalers: ["heal"],
      override: {
        7: {radius: 17}, //Sup
        12: {radius: 19, health: 5, heal: 55000}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Trident": {
      damage: 1,
      health: 1000,
      reload: 5,
      poison: [4.5/30, 4.5],
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {
        5: {radius: 14}, //Myth
        7: {radius: 16}, //Sup
        12: {radius: 18}, //Omni
        13: {radius: 20}, //Astra
      },
      pvpOverride: {
        0: {reload: 120}
      },
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "Dahlia": {
      damage: 1,
      health: 100,
      reload: 3.5,
      heal: 14.26,
      radius: 7,
      healScalers: ["heal"],
      override: {
        12: {radius: 8, heal: 950, reload: 0.1, damage: 3/5, petalLayout: [ 
          [ //position 0 in rotation
            { //petal 1
              offsetAngle: 0,
              offsetRadius: 9//*20
            },
            { //petal 2
              offsetAngle: Math.PI/5 * 2,
              offsetRadius: 9//*20
            },
            { //petal 3
              offsetAngle: Math.PI/5 * 4,
              offsetRadius: 9//*20
            },
            { //petal 4
              offsetAngle: Math.PI/5 * 6,
              offsetRadius: 9//*20
            },
            { //petal 5
              offsetAngle: Math.PI/5 * 8,
              offsetRadius: 9//*20
            },
            
          ]
        ]
        }
      },
      pvpOverride: {
        0: {heal: 13}
      },
      petalLayout: [[{}, 
        {
          offsetAngle: -Math.PI/6,
          offsetRadius: 16
        },
        {
          offsetAngle: Math.PI/6,
          offsetRadius: 16
        },
        
      ]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "DahliaProjectile": {
      damage: 1,
      health: 100,
      reload: 3.5,
      heal: 14.26,
      radius: 7,
      healScalers: ["heal"],
      override: {
        12: {radius: 8, heal: 950, damage: 3/5}
      },
      pvpOverride: {

      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Shell": {
      damage: 5,
      health: 5,
      reload: 1.7,
      shield: 17,
      override: {
        12: {
          shield: 1340,
          reload: 0.1,
          radius: 20,
          health: 4,
          damage: 1/2,
          petalLayout: [[{}], [{}], [{}]]
        }
      },
      pvpOverride: {

      },
      healScalers: ["shield"],
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "ShellProjectile": {
      damage: 5,
      health: 5,
      reload: 1.7,
      shield: 17,
      override: {
        12: {
          shield: 1340,
          reload: 0.1,
          radius: 20,
          health: 4,
          damage: 1/2,
          petalLayout: [[{}], [{}], [{}]]
        }
      },
      pvpOverride: {

      },
      healScalers: ["shield"],
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    
    "Yin Yang": {
      damage: 18,
      health: 10,
      reload: 1,
      override: {
        12: {
          radius: 40
        },
        13: {
          radius: 55
        }
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Wing": {
      damage: 28,
      health: 6,
      reload: 1.5,
      radius: 14,
      override: {
        7: {radius: 28},
        12: {radius: 40},
        13: {radius: 55}
      },
      wingExtraRange: 0.5,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Oranges": {
      damage: 14.4,
      health: 6,
      reload: 2.3,
      radius: 12,
      stickParentRotation: true,
      petalLayout: [[{}, 
        {
          offsetAngle: -Math.PI/6,
          offsetRadius: 30
        },
        {
          offsetAngle: Math.PI/6,
          offsetRadius: 30
        },
        
      ]],
      override: {
        7: { //Super
          damage: 3/4,
          radius: 13,
          petalLayout: [[{}, 
            {
              offsetAngle: -Math.PI/6,
              offsetRadius: 30
            },
            {
              offsetAngle: Math.PI/6,
              offsetRadius: 30
            },
            {
              offsetAngle: 0,
              offsetRadius: 51.9
            },
          ]],
        },
        12: { //Omnipotent
          damage: 4.3,
          radius: 35,
          petalLayout: [[{}]],
        },
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Ikea": {
      damage: 12,
      health: 12,
      reload: 2.8,
      radius: 16,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "IkeaChair": {
      damage: 3,
      health: 40,
      reload: 2,
      radius: 16,
      pvpOverride: {
        damage: 0.5,
        health: 0.1
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Ruby": {
      damage: 10,
      health: 10,
      reload: 3,
      radius: 12,
      petLifespan: 10,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    }, 
    "Sapphire": {
      damage: 0,
      health: 500,
      reload: 8,
      radius: 12,
      petalLayout: [[{}]],
      override: {
        12: {reload: 5},
        13: {reload: 4}
      },
      pvpOverride: {
        0: {reload: 1e9}
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    }, 
     
    "Emerald": {
      damage: 0,
      health: 500,
      reload: 10,
      radius: 12,
      petalLayout: [[{}]],
      override: {
        12: {reload: 7},
        13: {reload: 4},
        14: {reload: 2},
        15: {reload: 1},
        16: {reload: 0.3},
        17: {reload: 0.15},
        18: {reload: 0},
        
      },
      pvpOverride: {
        0: {reload: 1e9}
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    }, 
    "Thomas": {
      damage: 0,
      health: 100,
      reload: 15,
      radius: 16,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "ThomasProjectile": {
      damage: 2000,
      health: 2000,
      reload: 2,
      radius: 1000,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Rock": {
      damage: 23,
      health: 235,
      reload: 3.2,
      radius: 14,
      petalLayout: [[{}]],
      override: {
        7: { //Super
          radius: 19
        },
        11: { //Supreme
          radius: 24
        },
        12: { //Omnipotent
          radius: 29
        }
        ,
        13: { //Astral
          radius: 34
        }
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Heavy": {
      damage: 6.4,
      health: 580,
      reload: 4.4,
      radius: 20,
      petalLayout: [[{}]],
      override: {
        8: {
          radius: 25
        },
        12: {
          radius: 45
        },
        13: {
          radius: 55,
        },
      },
      pvpOverride: {
        8: {
          radius: 25
        },
        12: {
          radius: 35
        },
        13: {
          radius: 45,
        },
        18: {
          radius: 140
        }
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: Math.sqrt(1 / attackPetalDistanceMult),// neutral petal distance
    },
    "Pearl": {
      damage: 222,
      health: 911,
      armor: -14.1,
      reload: 360,
      radius: 30,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health", "armor"],
      attackDistanceMult: Math.sqrt(1 / attackPetalDistanceMult),// neutral petal distance
    },
    "Third Eye": {
      damage: 18,
      health: 10,
      reload: 1,
      extraRange: 1.1,
      petalLayout: [[{}]],
      override: {
        1: {extraRange: 1.2},
        2: {extraRange: 1.3},
        3: {extraRange: 1.4},
        //Obtainable:
        4: {extraRange: 1.5},
        5: {extraRange: 1.9}, 
        6: {extraRange: 2.2}, 
        7: {extraRange: 2.4, damage: 1.25}, 
        8: {extraRange: 2.55, damage: 1.15}, 
        9: {extraRange: 2.7},
        10: {extraRange: 2.85},
        11: {extraRange: 3},
        12: {extraRange: 3.15},
        13: {extraRange: 3.3},
        
      },
      pvpOverride: {
        4: {extraRange: 1.15},
        5: {extraRange: 1.2},
        6: {extraRange: 1.25},
        7: {extraRange: 1.3},
        8: {extraRange: 1.35},
        9: {extraRange: 1.4},
        10: {extraRange: 1.45},
        11: {extraRange: 1.5},
        12: {extraRange: 1.55},
        13: {extraRange: 1.6},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
    },
    "Salt": {
      damage: 5,
      health: 15,
      maxDamage: 22,
      salt: 20,
      reload: 1,
      petalLayout: [[{}]],
      override: {
        1: {salt: 40}, 
        2: {salt: 60}, 
        3: {salt: 100},
        4: {salt: 175},
        5: {salt: 250}, 
        6: {salt: 375}, 
        7: {salt: 750}, 
        8: {salt: 1250}, 
        9: {salt: 2500},
        10: {salt: 5000},
        11: {salt: 10500},
        12: {salt: 22000, radius: 20},
        13: {salt: 40000, radius: 25},
        
      },
      pvpOverride: {
        0: {salt: 4, maxDamage: 1}
      },
      damageScalers: ["damage", "maxDamage"],
      healthScalers: ["health"],
    },
    "Powder": {
      damage: 16,
      health: 10,
      reload: 1,
      petalLayout: [[{}]],
      speedBuff: 8, //UNOBTAINABLE
      healthNerf: 25,
      override: {
        1: {speedBuff: 9, healthNerf: 23}, //UNOBTAINABLE
        2: {speedBuff: 10, healthNerf: 21},
        3: {speedBuff: 11, healthNerf: 19},
        4: {speedBuff: 13, healthNerf: 17},
        5: {speedBuff: 16, healthNerf: 15},
        6: {speedBuff: 22, healthNerf: 13},
        7: {speedBuff: 30, healthNerf: 11},
        8: {speedBuff: 38, healthNerf: 9},
        9: {speedBuff: 42, healthNerf: 7},
        10: {speedBuff: 47, healthNerf: 5},
        11: {speedBuff: 52, healthNerf: 3},
        12: {speedBuff: 60, healthNerf: 1},
        13: {speedBuff: 68, healthNerf: 0.1},
        
        
      },
      pvpOverride: {
        0: {speedBuff: 10, healthNerf: 20}, //UNOBTAINABLE
        2: {speedBuff: 11, healthNerf: 21},
        3: {speedBuff: 12, healthNerf: 19},
        4: {speedBuff: 13, healthNerf: 17},
        5: {speedBuff: 14, healthNerf: 15},
        6: {speedBuff: 15, healthNerf: 13},
        7: {speedBuff: 16, healthNerf: 11},
        8: {speedBuff: 17, healthNerf: 9},
        9: {speedBuff: 18, healthNerf: 7},
        10: {speedBuff: 19, healthNerf: 5},
        11: {speedBuff: 20, healthNerf: 3},
        12: {speedBuff: 21, healthNerf: 1},
        13: {speedBuff: 22, healthNerf: 0.1},
        
        18: {speedBuff: 100, healthNerf: 0},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
    },
    
    "Missile": {
      damage: 17,
      health: 26,
      reload: 0.95,
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {
        7: {
          radius: 17
        },
        8: {
          radius: 24
        },
        9: {
          radius: 32
        },
        12: {
          radius: 40
        },
        13: {
          radius: 50
        }
      },
      pvpOverride: {
        0: {radius: 35, damage: 0.9, health: 0.1}
      },
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "MissileProjectile": {
      damage: 17,
      health: 26,
      reload: 0.95,
      radius: 12,
      override: {
        7: {
          radius: 17
        },
        8: {
          radius: 24
        },
        9: {
          radius: 32
        },
        12: {
          radius: 40
        },
        13: {
          radius: 50
        }
      },
      pvpOverride: {
        0: {radius: 35, damage: 0.9, health: 0.1}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Fire Missile": {
      damage: 17,
      poison: [18, 18],
      health: 90,
      reload: 0.95,
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {

        7: {
          radius: 17
        },
        8: {
          radius: 24
        },
        9: {
          radius: 32
        },
        12: {
          radius: 40
        },
        13: {
          radius: 50
        }
      },
      pvpOverride: {
        0: {radius: 35, damage: 0.6, health: 0.1}
      },
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "Fire MissileProjectile": {
      damage: 17,
      poison: [18, 18],
      health: 90,
      reload: 0.95,
      radius: 12,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {

        7: {
          radius: 17
        },
        8: {
          radius: 24
        },
        9: {
          radius: 32
        },
        12: {
          radius: 40
        },
        13: {
          radius: 50
        }
      },
      pvpOverride: {
        0: {radius: 35, damage: 0.6, health: 0.1}
      },
    },
    "Bud": {
      damage: 0.01,
      health: 150,
      reload: 40,
      radius: 12,
      lifespan: 40,
      reviveHealth: 0.1,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {
        1: {lifespan: 30, reload: 30, reviveHealth: 0.13}, //60s
        2: {lifespan: 20, reload: 20, reviveHealth: 0.16}, //40s
        3: {lifespan: 10, reload: 10, reviveHealth: 0.19}, //20s
        //OBTAINABLE:
        4: {lifespan: 8.5, reload: 6.5, reviveHealth: 0.22}, //15s
        5: {lifespan: 6.2, reload: 5.2, reviveHealth: 0.25}, //11s
        6: {lifespan: 4.2, reload: 3.7, reviveHealth: 0.28}, //7.5s
        7: {lifespan: 3.6, reload: 3.6, reviveHealth: 0.31}, //5s
        8: {lifespan: 3.2, reload: 3.2, reviveHealth: 0.34}, 
        9: {lifespan: 3, reload: 3, reviveHealth: 0.37}, 
        10: {lifespan: 2.8, reload: 2.8, reviveHealth: 0.4}, 
        11: {lifespan: 2.6, reload: 2.6, reviveHealth: 0.43}, 
        12: {lifespan: 2.4, reload: 2.4, reviveHealth: 0.46}, 
        13: {lifespan: 2.2, reload: 2.2, reviveHealth: 0.49}, 


      },
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "BudProjectile": {
      damage: 0.01,
      health: 150,
      reload: 15,
      radius: 12,
      reviveHealth: 0.1,
      override: {
        1: {lifespan: 30, reload: 30, reviveHealth: 0.13}, //60s
        2: {lifespan: 20, reload: 20, reviveHealth: 0.16}, //40s
        3: {lifespan: 10, reload: 10, reviveHealth: 0.19}, //20s
        //OBTAINABLE:
        4: {lifespan: 8.5, reload: 6.5, reviveHealth: 0.22}, //15s
        5: {lifespan: 6.2, reload: 5.2, reviveHealth: 0.25}, //11s
        6: {lifespan: 4.2, reload: 3.7, reviveHealth: 0.28}, //7.5s
        7: {lifespan: 3.6, reload: 3.6, reviveHealth: 0.31}, //5s
        8: {lifespan: 3.2, reload: 3.2, reviveHealth: 0.34}, 
        9: {lifespan: 3, reload: 3, reviveHealth: 0.37}, 
        10: {lifespan: 2.8, reload: 2.8, reviveHealth: 0.4}, 
        11: {lifespan: 2.6, reload: 2.6, reviveHealth: 0.43}, 
        12: {lifespan: 2.4, reload: 2.4, reviveHealth: 0.46}, 
        13: {lifespan: 2.2, reload: 2.2, reviveHealth: 0.49}, 

      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    
    "Mandible": {
      damage: 21,
      criticalDamage: 21*20,
      health: 0.1,
      reload: 1.2,
      radius: 12,
      override: {
        12: {radius: 18},
        13: {radius: 24}
      },
      pvpOverride: {
        0: {
          damage: 1/1.35,
          criticalDamage: 1/1.35
        }
      },
      petalLayout: [[{}]],
      damageScalers: ["damage", "criticalDamage"],
      healthScalers: ["health"]
    },
    "Claw": {
      damage: 0,
      maxDamage: 228,
      damagePercent: 12,
      health: 5,
      reload: 3.5,
      radius: 12,
      override: {
        1: {damagePercent: 15},
        2: {damagePercent: 18},
        3: {damagePercent: 21},
        4: {damagePercent: 24},
        5: {damagePercent: 27},
        6: {damagePercent: 30},
        7: {damagePercent: 33},
        8: {damagePercent: 36},
        9: {damagePercent: 39},
        10: {damagePercent: 42},
        11: {damagePercent: 45},
        12: {radius: 30, damagePercent: 48},
        13: {radius: 45, damagePercent: 51}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage", "maxDamage"],
      healthScalers: ["health"],
      attackDistanceMult: 1.2
    },
    "Lightning": {
      damage: 20,
      bounces: 5,
      health: 0.1,
      reload: 2,
      radius: 8,
      override: {
        4: {bounces: 5},
        5: {bounces: 6, damage: 5.25/6},
        6: {bounces: 6},
        7: {bounces: 7, damage: 6.25/7},
        8: {bounces: 7},
        9: {bounces: 8, damage: 7.25/8},
        10: {bounces: 8},
        11: {bounces: 11, damage: 8.25/10},
        12: {bounces: 11},
        13: {bounces: 15, damage: 11.25/13}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage", "maxDamage"],
      healthScalers: ["health"]
    },
    "Fangs": {
      damage: 11,
      health: 100,
      reload: 1,
      damageHeal: 5.5,
      radius: 11,
      petalLayout: [[{}]],
      healScalers: ["damageHeal"],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Jelly": {
      damage: 12,
      health: 70,
      reload: 2,
      radius: 11,
      knockbackMass: 2,
      petalLayout: [[{}]],
      override: {
        12: {radius: 22},
        13: {radius: 44}
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      massScalers: ["knockbackMass"]
    },
    "Sponge": {
      damage: 1,
      health: 50000,
      reload: 7.6,
      radius: 15,
      period: 1,
      override: {
        1: {period: 2, reload: 7.2},
        2: {period: 3, reload: 6.8},
        3: {period: 4, reload: 6.4},
        4: {period: 5, reload: 6},
        5: {period: 6, reload: 5.6},
        6: {period: 7, reload: 5.2},
        7: {period: 8, reload: 4.8},
        8: {period: 9, reload: 4.4},
        9: {period: 10, reload: 4},
        10: {period: 11, reload: 3.6},
        11: {period: 13, reload: 3.2},
        12: {period: 15, reload: 2.8},
        13: {period: 17, reload: 2.6},
        
      },
      pvpOverride: {
        
        0: {period: 1, reload: 5},
        1: {period: 1.1, reload: 5},
        2: {period: 1.2, reload: 5},
        3: {period: 1.3, reload: 5},
        4: {period: 1.4, reload: 5},
        5: {period: 1.5, reload: 5},
        6: {period: 1.6, reload: 5},
        7: {period: 1.7, reload: 5},
        8: {period: 1.8, reload: 5},
        9: {period: 1.9, reload: 5},
        10: {period: 2, reload: 5},
        11: {period: 2.1, reload: 5},
        12: {period: 2.2, reload: 5},
        13: {period: 2.3, reload: 5}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult * 0.7
    },
    "Dandelion": {
      damage: 10,
      health: 5,
      reload: 1,
      radius: 10,
      effect: 10*3,
      override: {
        1: {effect: 16*3},
        2: {effect: 32*3},
        3: {effect: 64*3},
        4: {effect: 140*3},
        5: {effect: 400*2.95, petalLayout: [[{}], [{}]], damage: 1/2},
        6: {effect: 1200*2.9, petalLayout: [[{}], [{}], [{}]], damage: 2/3},
        7: {effect: 3600*2.85, petalLayout: [[{}], [{}], [{}], [{}]], damage: 3/4, radius: 12},
        8: {effect: 9600*2.8, petalLayout: [[{}], [{}], [{}], [{}], [{}]], damage: 4/5},
        9: {effect: 28800*2.75, petalLayout: [[{}], [{}], [{}], [{}], [{}], [{}]], damage: 5/6},
        10: {effect: 100800*2.7},
        11: {effect: 352800*2.65},
        12: {effect: 1234800*2.6, petalLayout: [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]], damage: 6/12},
        13: {effect: 1234800*6},
      },
      pvpOverride: {
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "DandelionProjectile": {
      damage: 10,
      health: 5,
      reload: 1,
      radius: 10,
      effect: 10*3,
      override: {
        1: {effect: 16*3},
        2: {effect: 32*3},
        3: {effect: 64*3},
        4: {effect: 140*3},
        5: {effect: 400*2.95, petalLayout: [[{}], [{}]], damage: 1/2},
        6: {effect: 1200*2.9, petalLayout: [[{}], [{}], [{}]], damage: 2/3},
        7: {effect: 3600*2.85, petalLayout: [[{}], [{}], [{}], [{}]], damage: 3/4, radius: 12},
        8: {effect: 9600*2.8, petalLayout: [[{}], [{}], [{}], [{}], [{}]], damage: 4/5},
        9: {effect: 28800*2.75, petalLayout: [[{}], [{}], [{}], [{}], [{}], [{}]], damage: 5/6},
        10: {effect: 100800*2.7},
        11: {effect: 352800*2.65},
        12: {effect: 1234800*2.6, petalLayout: [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]], damage: 6/12},
        13: {effect: 1234800*6},

      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    
    "Web": {
      damage: 8,
      health: 5,
      reload: 2.5,
      radius: 10,
      slowdown: 0.7,
      slowdownTime: 0.04,
      stickParentRotation: true,
      override: {
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "WebProjectile": {
      damage: 0.8,
      health: 500,
      reload: 2.5,
      radius: 10,
      override: {
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "WebProjectileWeb": {
      damage: 0,
      health: 250000000000,
      reload: 3,
      radius: 40,
      slowdown: 0.7,
      slowdownTime: 0.04,
      override: {
        1: {radius: 55*1.3},
        2: {radius: 70*1.3},
        3: {radius: 95*1.3},
        4: {radius: 110*1.3},
        5: {radius: 130*1.3},
        6: {radius: 160*1.3},
        7: {radius: 200*1.3},
        8: {radius: 250*1.3},
        9: {radius: 310*1.3},
        10: {radius: 380*1.3},
        11: {radius: 460*1.3},
        12: {radius: 550*1.3},
        13: {radius: 640*1.3},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Egg": {
      damage: 1,
      health: 35,
      reload: 3,
      radius: 12,
      hatchTime: 1,
      spawnRarity: 0,
      override: {
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        
        4: {hatchTime: 9, spawnRarity: 4},
        5: {hatchTime: 7, spawnRarity: 5},
        6: {hatchTime: 5, spawnRarity: 6},
        7: {hatchTime: 3, spawnRarity: 7},
        8: {hatchTime: 2, reload: 2, spawnRarity: 8},
        9: {spawnRarity: 9}, 
        10: {hatchTime: 2.8, reload: 2.8, spawnRarity: 10},
        11: {hatchTime: 3.6, reload: 3.6, spawnRarity: 11},
        12: {hatchTime: 4.4, reload: 4.4, spawnRarity: 12},
        
        13: {hatchTime: 14, reload: 14, spawnRarity: 13},
        14: {spawnRarity: 14},
        15: {spawnRarity: 15},
        16: {spawnRarity: 16},
        17: {spawnRarity: 17},
        18: {spawnRarity: 18},
         
      },
      pvpOverride: {
        0: {spawnRarity: 3, hatchTime: 4, reload: 3.5},
        1: {spawnRarity: 3, hatchTime: 3.9, reload: 3.5},
        2: {spawnRarity: 3, hatchTime: 3.8, reload: 3.5},
        3: {spawnRarity: 3, hatchTime: 3.7, reload: 3.5},
        4: {spawnRarity: 3, hatchTime: 3.6, reload: 3.5},
        5: {spawnRarity: 3, hatchTime: 3.5, reload: 3.5},
        6: {spawnRarity: 3, hatchTime: 3.4, reload: 3.4},
        7: {spawnRarity: 3, hatchTime: 3.3, reload: 3.3},
        8: {spawnRarity: 3, hatchTime: 3.2, reload: 3.2},
        9: {spawnRarity: 3, hatchTime: 3.1, reload: 3},
        10: {spawnRarity: 3, hatchTime: 3, reload: 2.8},
        11: {spawnRarity: 3, hatchTime: 2.8, reload: 2.6},
        12: {spawnRarity: 3, hatchTime: 2.6, reload: 2.4},
        13: {spawnRarity: 4, hatchTime: 2.4, reload: 2.2},
        14: {spawnRarity: 5, hatchTime: 2.2, reload: 2},
        15: {spawnRarity: 6, hatchTime: 2, reload: 2},
        16: {spawnRarity: 7, hatchTime: 1.8, reload: 2},
        17: {spawnRarity: 8, hatchTime: 1.6, reload: 2},
        18: {spawnRarity: 9, hatchTime: 1.4, reload: 2},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult,
    },
    "Jellyfish Egg": {
      damage: 1,
      health: 35,
      reload: 3,
      radius: 12,
      spawnRarity: 0,
      hatchTime: 1,
      override: {
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        4: {hatchTime: 9, spawnRarity: 4},
        5: {hatchTime: 7, spawnRarity: 5},
        6: {hatchTime: 5, spawnRarity: 6},
        7: {hatchTime: 3, spawnRarity: 7},
        8: {hatchTime: 2, reload: 2, spawnRarity: 8},
        9: {spawnRarity: 9},
        10: {hatchTime: 2.8, reload: 2.8, spawnRarity: 10},
        11: {hatchTime: 3.6, reload: 3.6, spawnRarity: 11},
        12: {hatchTime: 4.4, reload: 4.4, spawnRarity: 12},
        13: {hatchTime: 14, reload: 14, spawnRarity: 13},
        14: {spawnRarity: 14},
        15: {hatchTime: 0.1, reload: 0.1, spawnRarity: 15},
        16: {spawnRarity: 16},
        17: {spawnRarity: 17},
        18: {spawnRarity: 18},
         
      },
      pvpOverride: {
        0: {spawnRarity: 3, hatchTime: 5, reload: 3.5},
        1: {spawnRarity: 3, hatchTime: 4.9, reload: 3.5},
        2: {spawnRarity: 3, hatchTime: 4.8, reload: 3.5},
        3: {spawnRarity: 3, hatchTime: 4.7, reload: 3.5},
        4: {spawnRarity: 3, hatchTime: 4.6, reload: 3.5},
        5: {spawnRarity: 3, hatchTime: 4.5, reload: 3.5},
        6: {spawnRarity: 3, hatchTime: 4.4, reload: 3.4},
        7: {spawnRarity: 3, hatchTime: 4.3, reload: 3.3},
        8: {spawnRarity: 3, hatchTime: 4.2, reload: 3.2},
        9: {spawnRarity: 3, hatchTime: 4.1, reload: 3},
        10: {spawnRarity: 3, hatchTime: 4, reload: 2.8},
        11: {spawnRarity: 3, hatchTime: 3.8, reload: 2.6},
        12: {spawnRarity: 3, hatchTime: 3.6, reload: 2.4},
        13: {spawnRarity: 3, hatchTime: 3.4, reload: 2.2},
        14: {spawnRarity: 3, hatchTime: 3.2, reload: 2},
        15: {spawnRarity: 3, hatchTime: 3, reload: 2},
        16: {spawnRarity: 4, hatchTime: 1.8, reload: 2},
        17: {spawnRarity: 5, hatchTime: 1.6, reload: 2},
        18: {spawnRarity: 6, hatchTime: 1.4, reload: 2},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult,
    },
    
    "Plastic Egg": {
      damage: 1,
      health: 40,
      reload: 0.5,
      radius: 12,
      hatchTime: 1,
      spawnRarity: 0,
      override: {
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        4: {hatchTime: 4, spawnRarity: 4},
        5: {hatchTime: 3, spawnRarity: 5},
        6: {hatchTime: 2, spawnRarity: 6},
        7: {hatchTime: 1.25, spawnRarity: 7},
        8: {hatchTime: 0.8, spawnRarity: 8},
        9: {hatchTime: 0.5, spawnRarity: 9},
        10: {spawnRarity: 10},
        11: {spawnRarity: 11},
        12: {spawnRarity: 12, hatchTime: 1},
        13: {spawnRarity: 13, hatchTime: 2},
        14: {spawnRarity: 14},
        15: {spawnRarity: 15},
        16: {spawnRarity: 16},
        17: {spawnRarity: 17},
        18: {spawnRarity: 18},
          
      },
      pvpOverride: {
        0: {spawnRarity: 2, hatchTime: 4, reload: 3.5},
        1: {spawnRarity: 2, hatchTime: 3.9, reload: 3.5},
        2: {spawnRarity: 2, hatchTime: 3.8, reload: 3.5},
        3: {spawnRarity: 2, hatchTime: 3.7, reload: 3.5},
        4: {spawnRarity: 2, hatchTime: 3.6, reload: 3.5},
        5: {spawnRarity: 2, hatchTime: 3.5, reload: 3.5},
        6: {spawnRarity: 2, hatchTime: 3.4, reload: 3.4},
        7: {spawnRarity: 2, hatchTime: 3.3, reload: 3.3},
        8: {spawnRarity: 2, hatchTime: 3.2, reload: 3.2},
        9: {spawnRarity: 2, hatchTime: 3.1, reload: 3},
        10: {spawnRarity: 2, hatchTime: 3, reload: 2.8},
        11: {spawnRarity: 2, hatchTime: 2.8, reload: 2.6},
        12: {spawnRarity: 2, hatchTime: 2.6, reload: 2.4},
        13: {spawnRarity: 2, hatchTime: 2.4, reload: 2.2},
        14: {spawnRarity: 2, hatchTime: 2.2, reload: 2},
        15: {spawnRarity: 2, hatchTime: 2, reload: 2},
        16: {spawnRarity: 2, hatchTime: 1.8, reload: 2},
        17: {spawnRarity: 2, hatchTime: 1.6, reload: 2},
        18: {spawnRarity: 2, hatchTime: 1.4, reload: 2},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult,
    },
    "Mini Flower": {
      damage: 1,
      health: 40,
      reload: 15,
      radius: 12,
      petalNum: 2,
      override: {
        0: {petalNum: 2, damage: 1, reload: 10},
        1: {petalNum: 3, damage: 1, reload: 8},
        2: {petalNum: 3, damage: 1, reload: 6},
        3: {petalNum: 4, reload: 5.5},
        4: {petalNum: 4, reload: 5},
        5: {petalNum: 5, reload: 4.5},
        14: {petalNum: 10, reload: 0.5},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult,
    },
    "Stick": {
      damage: 0.1,
      health: 100,
      reload: 3,
      radius: 12,
      spawnSystem: [0, 48, 2], //Common every 48s
      petalLayout: [[{}]],
      override: {
        1: {spawnSystem: [0, 24, 2]}, //Unobtainable
        2: {spawnSystem: [0, 12, 2]}, //Unobtainable

        3: {spawnSystem: [1, 4, 2]}, 
        4: {spawnSystem: [2, 2, 2]},
        5: {spawnSystem: [4, 9.5, 2]},
        6: {spawnSystem: [5, 8, 2]},
        7: {spawnSystem: [6, 6.5, 2]},
        8: {spawnSystem: [7, 5, 2]},
        9: {spawnSystem: [8, 4.8, 2]},
        10: {spawnSystem: [9, 4.6, 2]},
        11: {spawnSystem: [10, 4.4, 2]},
        12: {spawnSystem: [11, 4.2, 3]},
        13: {spawnSystem: [12, 10, 3]},
        14: {spawnSystem: [13, 4.2, 3]},
        15: {spawnSystem: [14, 4.2, 3]},

      },
      pvpOverride: {
        1: {spawnSystem: [0, 12, 2]},
        2: {spawnSystem: [0, 8, 2]},
        3: {spawnSystem: [0, 7.5, 2]},
        4: {spawnSystem: [0, 7, 2]},
        5: {spawnSystem: [0, 6.5, 2]},
        6: {spawnSystem: [0, 6, 2]},
        7: {spawnSystem: [0, 5.5, 2]},
        8: {spawnSystem: [0, 5, 2]},
        9: {spawnSystem: [0, 4.5, 2]},
        10: {spawnSystem: [0, 4, 2]},
        11: {spawnSystem: [0, 3.5, 2]},
        12: {spawnSystem: [0, 3, 2]},
        13: {spawnSystem: [0, 2.5, 2]},

      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult:  1/attackPetalDistanceMult
    },
    
    "Square": {
      damage: 1,
      health: 450,
      reload: 1,
      radius: 17,
      hatchTime: 6,
      spawnRarity: 0,
      petalLayout: [[{}]],
      override: {
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        
        4: {spawnRarity: 4},
        5: {spawnRarity: 5},
        6: {spawnRarity: 6},
        7: {spawnRarity: 7},
        8: {spawnRarity: 8},
        9: {spawnRarity: 9}, 
        10: {spawnRarity: 10},
        11: {spawnRarity: 11},
        12: {spawnRarity: 12},
        
        13: {spawnRarity: 13},
        14: {spawnRarity: 14},
        15: {spawnRarity: 15},
        16: {spawnRarity: 16},
        17: {spawnRarity: 17},
        18: {spawnRarity: 18},
         
      },
      pvpOverride: {
        0: {spawnRarity: 0, hatchTime: 4, reload: 3.5},
        1: {spawnRarity: 1, hatchTime: 3.9, reload: 3.5},
        2: {spawnRarity: 2, hatchTime: 3.8, reload: 3.5},
        3: {spawnRarity: 3, hatchTime: 3.7, reload: 3.5},
        4: {spawnRarity: 3, hatchTime: 3.6, reload: 3.5},
        5: {spawnRarity: 3, hatchTime: 3.5, reload: 3.5},
        6: {spawnRarity: 3, hatchTime: 3.4, reload: 3.4},
        7: {spawnRarity: 3, hatchTime: 3.3, reload: 3.3},
        8: {spawnRarity: 3, hatchTime: 3.2, reload: 3.2},
        9: {spawnRarity: 3, hatchTime: 3.1, reload: 3},
        10: {spawnRarity: 3, hatchTime: 3, reload: 2.8},
        11: {spawnRarity: 3, hatchTime: 2.8, reload: 2.6},
        12: {spawnRarity: 3, hatchTime: 2.6, reload: 2.4},
        13: {spawnRarity: 4, hatchTime: 2.4, reload: 2.2},
        14: {spawnRarity: 5, hatchTime: 2.2, reload: 2},
        15: {spawnRarity: 6, hatchTime: 2, reload: 2},
        16: {spawnRarity: 7, hatchTime: 1.8, reload: 2},
        17: {spawnRarity: 8, hatchTime: 1.6, reload: 2},
        18: {spawnRarity: 9, hatchTime: 1.4, reload: 2},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult:  1/attackPetalDistanceMult
    },
    "Pentagon": {
      damage: 1,
      health: 450,
      reload: 2,
      radius: 17,
      hatchTime: 9,
      spawnRarity: 0,
      petalLayout: [[{}]],
      override: {
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        
        4: {spawnRarity: 4},
        5: {spawnRarity: 5},
        6: {spawnRarity: 6},
        7: {spawnRarity: 7},
        8: {spawnRarity: 8},
        9: {spawnRarity: 9}, 
        10: {spawnRarity: 10},
        11: {spawnRarity: 11},
        1: {spawnRarity: 1},
        2: {spawnRarity: 2},
        3: {spawnRarity: 3},
        
        4: {spawnRarity: 4},
        5: {spawnRarity: 5},
        6: {spawnRarity: 6},
        7: {spawnRarity: 7},
        8: {spawnRarity: 8},
        9: {spawnRarity: 9}, 
        10: {spawnRarity: 10},
        11: {spawnRarity: 11},
        12: {spawnRarity: 12, hatchTime: 10},
        
        13: {spawnRarity: 13, hatchTime: 27},
        14: {spawnRarity: 14, hatchTime: 0.5},
        15: {spawnRarity: 15},
        16: {spawnRarity: 16},
        17: {spawnRarity: 17},
        18: {spawnRarity: 18},
         
      },
      pvpOverride: {
        0: {spawnRarity: 0, hatchTime: 4, reload: 3.5},
        1: {spawnRarity: 1, hatchTime: 3.9, reload: 3.5},
        2: {spawnRarity: 2, hatchTime: 3.8, reload: 3.5},
        3: {spawnRarity: 2, hatchTime: 3.7, reload: 3.5},
        4: {spawnRarity: 2, hatchTime: 3.6, reload: 3.5},
        5: {spawnRarity: 2, hatchTime: 3.5, reload: 3.5},
        6: {spawnRarity: 3, hatchTime: 3.4, reload: 3.4},
        7: {spawnRarity: 3, hatchTime: 3.3, reload: 3.3},
        8: {spawnRarity: 3, hatchTime: 3.2, reload: 3.2},
        9: {spawnRarity: 3, hatchTime: 3.1, reload: 3},
        10: {spawnRarity: 3, hatchTime: 3, reload: 2.8},
        11: {spawnRarity: 3, hatchTime: 2.8, reload: 2.6},
        12: {spawnRarity: 3, hatchTime: 2.6, reload: 2.4},
        13: {spawnRarity: 4, hatchTime: 2.4, reload: 2.2},
        14: {spawnRarity: 5, hatchTime: 2.2, reload: 2},
        15: {spawnRarity: 6, hatchTime: 2, reload: 2},
        16: {spawnRarity: 7, hatchTime: 1.8, reload: 2},
        17: {spawnRarity: 8, hatchTime: 1.6, reload: 2},
        18: {spawnRarity: 9, hatchTime: 1.4, reload: 2},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult:  1/attackPetalDistanceMult
    },
    
    "Honey": {
      damage: 0,
      health: 7000,
      reload: 6,
      radius: 10,
      attractionRadius: 400,
      override: {
        6: {attractionRadius: 450,},
        7: {attractionRadius: 500,},
        8: {attractionRadius: 550, radius: 15},
        9: {attractionRadius: 600, radius: 20},
        10: {attractionRadius: 650, radius: 25},
        11: {attractionRadius: 700, radius: 30},
        12: {attractionRadius: 750, radius: 35},
        13: {attractionRadius: 800, radius: 40},
        
      },
      pvpOverride: {
        0: {attractionRadius: 100},

      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "HoneyProjectile": {
      damage: 0,
      health: 7000,
      reload: 6,
      radius: 10,
      attractionRadius: 400,
      override: {
        6: {attractionRadius: 450,},
        7: {attractionRadius: 500,},
        8: {attractionRadius: 550, radius: 15},
        9: {attractionRadius: 600, radius: 20},
        10: {attractionRadius: 650, radius: 25},
        11: {attractionRadius: 700, radius: 30},
        12: {attractionRadius: 750, radius: 35},
        13: {attractionRadius: 800, radius: 40},
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Neutron Star": {
      damage: 0,
      health: 5000,
      poison: [5, 5],
      reload: 8,
      radius: 10,
      attractionRadius: 200,
      override: {
        6: {attractionRadius: 230,},
        7: {attractionRadius: 260,},
        8: {attractionRadius: 290, radius: 15},
        9: {attractionRadius: 320, radius: 20},
        10: {attractionRadius: 350, radius: 25},
        11: {attractionRadius: 380, radius: 30},
        12: {attractionRadius: 410, radius: 32.5},
        13: {attractionRadius: 440, radius: 35},
        15: {reload: 0.1, attractionRadius: 540},
        16: {reload: 0.05, attractionRadius: 740},
        17: {reload: 0.01, attractionRadius: 940},
        18: {reload: 0, attractionRadius: 1e5},
        
      },
      pvpOverride: {
        0: {attractionRadius: 100},

      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "NeutronStarProjectile": {
      damage: 0,
      health: 5000,
      poison: [5, 5],
      reload: 8,
      radius: 10,
      attractionRadius: 200,
      override: {
        6: {attractionRadius: 230,},
        7: {attractionRadius: 260,},
        8: {attractionRadius: 290, radius: 15},
        9: {attractionRadius: 320, radius: 20},
        10: {attractionRadius: 350, radius: 25},
        11: {attractionRadius: 380, radius: 30},
        12: {attractionRadius: 410, radius: 32.5},
        13: {attractionRadius: 440, radius: 35},
        
        15: {reload: 0.1, attractionRadius: 540},
        16: {reload: 0.05, attractionRadius: 740},
        17: {reload: 0.01, attractionRadius: 940},
        18: {reload: 0, attractionRadius: 1e5},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Peas": {
      damage: 7,
      health: 20,
      reload: 3,
      radius: 8,
      stickParentRotation: true,
      petalLayout: [
        [ //position 0 in rotation
          { //petal 1
            offsetAngle: 0,
            offsetRadius: 9//*20
          },
          { //petal 2
            offsetAngle: Math.PI/2,
            offsetRadius: 9//*20
          },
          { //petal 4
            offsetAngle: 3 * Math.PI/2,
            offsetRadius: 9//*20
          },
          { //petal 3
            offsetAngle: Math.PI,
            offsetRadius: 9//*20
          },
        ]
      ],
      override: {
        "8": {
          radius: 12
        },
        "9": {
          radius: 16
        },
        "12": {
          damage: 4/5,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: 2 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 4
                offsetAngle: 3 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 5
                offsetAngle: 4 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
            ]
          ],
        }
      },
      pvpOverride: {
        0: {reload: 5},
        1: {reload: 5},
        2: {reload: 5},
        3: {reload: 5},
        4: {reload: 5},
        5: {reload: 5},
        6: {reload: 5},
        7: {reload: 5},
        8: {reload: 5},
        9: {reload: 5},
        10: {reload: 5},
        11: {reload: 5},
        12: {reload: 5},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "PeasProjectile": {
      damage: 7,
      health: 200,
      reload: 3,
      radius: 8,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      override: {
        "8": {
          radius: 12
        },
        "9": {
          radius: 16
        },
        "12": {
          damage: 4/5,
        }
      },
    },
    "Grapes": {
      damage: 2,
      health: 10,
      poison: [28, 28],
      reload: 3,
      radius: 8,
      stickParentRotation: true,
      petalLayout: [
        [ //position 0 in rotation
          { //petal 1
            offsetAngle: 0,
            offsetRadius: 9//*20
          },
          { //petal 2
            offsetAngle: Math.PI/2,
            offsetRadius: 9//*20
          },
          { //petal 3
            offsetAngle: Math.PI,
            offsetRadius: 9//*20
          },
          { //petal 4
            offsetAngle: 3 * Math.PI/2,
            offsetRadius: 9//*20
          },
          
        ]
      ],
      override: {
        "8": {
          radius: 12
        },
        "9": {
          radius: 16
        },
        "12": {
          damage: 4/5,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: 2 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 4
                offsetAngle: 3 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
              { //petal 5
                offsetAngle: 4 * Math.PI*2/5,
                offsetRadius: 9//*20
              },
            ]
          ],
        }
      },
      pvpOverride: {
        0: {reload: 5},
        1: {reload: 5},
        2: {reload: 5},
        3: {reload: 5},
        4: {reload: 5},
        5: {reload: 5},
        6: {reload: 5},
        7: {reload: 5},
        8: {reload: 5},
        9: {reload: 5},
        10: {reload: 5},
        11: {reload: 5},
        12: {reload: 5},
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1 / attackPetalDistanceMult,
    },
    "GrapesProjectile": {
      damage: 2,
      health: 100,
      poison: [28, 28],
      reload: 3,
      radius: 8,
      petalLayout: [
        [ //position 0 in rotation
          { //petal 1
            offsetAngle: 0,
            offsetRadius: 9//*20
          },
          { //petal 2
            offsetAngle: Math.PI/2,
            offsetRadius: 9//*20
          },
          { //petal 3
            offsetAngle: Math.PI,
            offsetRadius: 9//*20
          },
          { //petal 4
            offsetAngle: 3 * Math.PI/2,
            offsetRadius: 9//*20
          },
          
        ]
      ],
      override: {
        "8": {
          radius: 12
        },
        "9": {
          radius: 16
        },
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    
    "Stinger": {
      damage: 240,
      health: 5,
      reload: 5,
      radius: 7,
      stickParentRotation: true,
      petalLayout: [[{}]],
      override: {
        5: { //Mythic (Tringer)
          damage: 1/3,
          //health: 1/3,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 10
              },
              { //petal 2
                offsetAngle: Math.PI * 2/3,
                offsetRadius: 10
              },
              { //petal 3
                offsetAngle: Math.PI * 4/3,
                offsetRadius: 10
              },
            ]
          ]
        },
        6: { //Ultra (Pinger)
          damage: 3/5,
          //health: 3/5,
          radius: 9,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 12
              },
              { //petal 2
                offsetAngle: Math.PI * 2/5,
                offsetRadius: 12
              },
              { //petal 3
                offsetAngle: Math.PI * 4/5,
                offsetRadius: 12
              },
              { //petal 4
                offsetAngle: Math.PI * 6/5,
                offsetRadius: 12
              },
              { //petal 5
                offsetAngle: Math.PI * 8/5,
                offsetRadius: 12
              },
              
            ]
          ]
        },
        8: { //bigger size for omegas 
          radius: 15,
        },
        9: { //rotated thingy
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 12
              },
              { //petal 2
                offsetAngle: Math.PI * 2/5,
                offsetRadius: 12
              },
              { //petal 3
                offsetAngle: Math.PI * 4/5,
                offsetRadius: 12
              },
              { //petal 4
                offsetAngle: Math.PI * 6/5,
                offsetRadius: 12
              },
              { //petal 5
                offsetAngle: Math.PI * 8/5,
                offsetRadius: 12
              },
              
            ]
          ]
        },
        11: { //supreme stinger is huge
          radius: 19,
        },
        12: { //omni stinger is huger
          radius: 38,
        },
        13: { //astral stinger is huger
          radius: 45,
        },
        
      },
      pvpOverride: {
        0: {damage: 4/5},
        8: { //bigger size for omegas 
          radius: 17,
        },
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Sand": {
      damage: 10.4,//2.2 on release
      health: 1,
      reload: 1.2,
      radius: 7,
      stickParentRotation: true,
      petalLayout: [
        [ //position 0 in rotation
          { //petal 1
            offsetAngle: 0,
            offsetRadius: 9//*20
          },
          { //petal 2
            offsetAngle: Math.PI/2,
            offsetRadius: 9//*20
          },
          { //petal 3
            offsetAngle: Math.PI,
            offsetRadius: 9//*20
          },
          { //petal 4
            offsetAngle: 3 * Math.PI/2,
            offsetRadius: 9//*20
          },
          
        ]
      ],
      override: {
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Light": {
      damage: 26,// 7
      health: 1,
      reload: 0.6,// 0.8
      radius: 6,
      petalLayout: [[{}]],
      override: {
        1: {
          damage: 1/2,
          petalLayout: [[{}], [{}]]
        },
        3: {
          damage: 2/3,
          petalLayout: [[{}], [{}], [{}]]
        },
        4: { //Leg gets a radius buff
          radius: 8
        },
        5: {
          damage: 3/5,
          petalLayout: [[{}], [{}], [{}], [{}], [{}]]
        },
        7: {
          radius: 12
        },
        8: {
          radius: 15
        },
        12: {
          petalLayout: [[{}]],
          radius: 25,
          damage: 5.5
        },
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Pollen": {
      damage: 10.8,  
      health: 9,
      armor: 8,
      reload: 1,
      radius: 8,
      petalLayout: [[{}], [{}]],
      override: {
        3: {
          damage: 2/3*8/7,
          petalLayout: [[{}], [{}], [{}]]
        },
        7: {
          radius: 20,
          damage: 1.2,
          health: 1.2
        },
        8: {
          radius: 30,
          health: 1.05
        },
        9: {
          radius: 40,
          health: 1.05
        },
        12: {
          damage: 3/5,
          petalLayout: [[{}], [{}], [{}], [{}], [{}]]
        },
        13: {
          damage: 5/6,
          petalLayout: [[{}], [{}], [{}], [{}], [{}], [{}]]
        },
        
        
      },
      pvpOverride: {
        0: {armor: 0.5}
      },
      damageScalers: ["damage"],
      healthScalers: ["health", "armor"],
      // defendDistanceMult: defendPetalDistance,
      // normalDistanceMult: neutralPetalDistance,
      attackDistanceMult: Math.sqrt(1 / attackPetalDistanceMult),// neutral petal distance
    },
    "PollenProjectile": {
      damage: 10.6,  
      health: 9,
      armor: 8,
      reload: 1,
      radius: 8,
      petalLayout: [[{}]],
      override: {
        3: {
          damage: 2/3*8/7
        },
        7: {
          radius: 20,
          health: 1.2,
          damage: 1.2,
        },
        8: {
          radius: 30,
          health: 1.05
        },
        9: {
          radius: 40,
          health: 1.05
        },
        
      },
      damageScalers: ["damage"],
      healthScalers: ["health", "armor"]
    },
    
    "Magnet": {
      damage: 1,
      health: 180,
      reload: 2.2,
      radius: 18,
      petalLayout: [[{}]],
      range: 400,
      override: {
        1: {range: 600*1.5},
        2: {range: 800*1.5},
        3: {range: 1000*1.5},
        4: {range: 1300*1.5},
        5: {range: 1600*1.5},
        6: {range: 2000*1.5},
        7: {range: 2400*1.5},
        8: {range: 2800*1.5},
        9: {range: 3200*1.5},
        10: {range: 3700*1.5},
        11: {range: 4400*1.5},        
        12: {range: 7500*1.5},
        13: {range: 15000*1.5}
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    
    "Faster": {
      damage: 14.5,
      health: 10,
      reload: 1,
      radius: 7,
      rotateSpeedBuff: 0.5,
      petalLayout: [[{}]],
      override: {
        1: {rotateSpeedBuff: 0.7}, //Un
        2: {rotateSpeedBuff: 0.9}, //Rare
        3: {rotateSpeedBuff: 1.1}, //Epic
        4: {rotateSpeedBuff: 1.4}, //Leg
        5: {rotateSpeedBuff: 2.5}, //Myth
        6: {rotateSpeedBuff: 2.7}, //Ult
        7: {rotateSpeedBuff: 1.1,
          damage: 1/3,
          stickParentRotation: true,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI*2/3,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: Math.PI*4/3,
                offsetRadius: 9//*20
              },
              
            ]
          ],}, //Sup
        8: {rotateSpeedBuff: 1.3, reload: 0.7},
        9: {rotateSpeedBuff: 1.5},
        10: {rotateSpeedBuff: 1.7},
        11: {rotateSpeedBuff: 1.9},
        12: {rotateSpeedBuff: 2.1},
        13: {rotateSpeedBuff: 2.3}
        
      },
      pvpOverride: {
        0: {rotateSpeedBuff: 0.25},
        1: {rotateSpeedBuff: 0.35}, //Un
        2: {rotateSpeedBuff: 0.45}, //Rare
        3: {rotateSpeedBuff: 0.55}, //Epic
        4: {rotateSpeedBuff: 0.7}, //Leg
        5: {rotateSpeedBuff: 1.25}, //Myth
        6: {rotateSpeedBuff: 1.35}, //Ult
        7: {rotateSpeedBuff: 0.55,
          damage: 1/3,
          stickParentRotation: true,
          petalLayout: [
            [ //position 0 in rotation
              { //petal 1
                offsetAngle: 0,
                offsetRadius: 9//*20
              },
              { //petal 2
                offsetAngle: Math.PI*2/3,
                offsetRadius: 9//*20
              },
              { //petal 3
                offsetAngle: Math.PI*4/3,
                offsetRadius: 9//*20
              },
              
            ]
          ],}, //Sup
        8: {rotateSpeedBuff: 0.65, reload: 0.7},
        9: {rotateSpeedBuff: 0.75},
        10: {rotateSpeedBuff: 0.85},
        11: {rotateSpeedBuff: 0.95},
        12: {rotateSpeedBuff: 1.05},
        13: {rotateSpeedBuff: 1.15}
      },
      
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Iris": {
      damage: 1, 
      health: 70,
      poison: [90, 63],
      reload: 1.2,
      radius: 6,
      petalLayout: [[{}]],
      override: {
        7: {
          radius: 7
        },
        8: {
          radius: 8
        },
        9: {
          radius: 16
        },
        12: {
          radius: 24
        },
        13: {
          radius: 30
        }
      },
      pvpOverride: {
        0: {poison: [250, 60], health: 1/2}
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1.2
    },
    "Pincer": {
      damage: 1, 
      health: 240,
      poison: [30, 10],
      reload: 1.5,
      radius: 10,
      slowdown: 0.35,
      slowdownTime: 3,
      petalLayout: [[{}]],
      override: {
      },
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1.4
    },
    "Rubber": {
      damage: 12,
      health: 5,
      reload: 0.7,
      radius: 13,
      bodyKnockback: 0.4,
      pvpOverride: {
        0: {bodyKnockback: 2.4},
        18: {bodyKnockback: 1000}
      },
      massScalers: ["bodyKnockback"],
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Coral": {
      damage: 19,
      health: 10,
      reload: 1.2,
      extraDamage: 26,
      petalLayout: [[{}]],
      damageScalers: ["damage", "extraDamage"],
      healthScalers: ["health"],
      overhealConversion: 3,
      radius: 16,
      override: { //Unobtainable until Mythic
        1: {overhealConversion: 5},
        2: {overhealConversion: 7},
        3: {overhealConversion: 10},
        4: {overhealConversion: 15},
        //Obtainable
        5: {overhealConversion: 30},
        6: {overhealConversion: 40},
        7: {overhealConversion: 50},
        8: {overhealConversion: 60},
        9: {overhealConversion: 67.5},
        10: {overhealConversion: 75},
        11: {overhealConversion: 82.5},
        12: {overhealConversion: 100},
        13: {overhealConversion: 117.5},
        
      },
    },
    "Rice": {
      damage: 13.4,
      health: 1,
      reload: 0,// i can't make it .11 as it originally was, that breaks
      radius: 12,
      petalLayout: [
        [ //position 0 in rotation
          { //petal 1
            
          }
        ]
      ],
      override: {
        5: {
          radius: 16
        },
        7: {
          radius: 20
        },
        8: {
          radius: 24
        },
        9: {
          radius: 28
        },
        12: {
          radius: 34
        },
        13: {
          radius: 40
        }
      },
      pvpOverride: {
        0: {damage: 0.65},
        5: {
          radius: 16
        },
        7: {
          radius: 20
        },
        8: {
          radius: 24
        },
        9: {
          radius: 28
        },
        12: {
          radius: 34
        },
        13: {
          radius: 40
        }
      },
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Bubble": {
      damage: 0.001,
      health: 1,
      radius: 14,
      reload: 5,
      timeToPop: 0.5,
      maxEnemyBoost: 0,
      override: {
        1: {reload: 4, timeToPop: 0.45},
        2: {reload: 3, timeToPop: 0.4},
        3: {reload: 2, timeToPop: 0.35},
        4: {reload: 1.5, timeToPop: 0.3},
        5: {reload: 1, timeToPop: 0.25},
        6: {reload: 0.6, timeToPop: 0.2},
        7: {reload: 0.3, timeToPop: 0.15, maxEnemyBoost: 2000},
        8: {reload: 0.2, maxEnemyBoost: 8000},
        9: {reload: 0.12, maxEnemyBoost: 40000},
        10: {reload: 0.05,  timeToPop: 0.12, maxEnemyBoost: 120000},
        11: {reload: 0.05,  timeToPop: 0.07, maxEnemyBoost: 300000},
        12: {reload: 0,  timeToPop: 0.07, maxEnemyBoost: 800000},
        13: {reload: 0,  timeToPop: 0.07, maxEnemyBoost: 1600000},
        
      },
      pvpOverride: {
        0: {reload: 2.2, timeToPop: 0.25},
        1: {reload: 2, timeToPop: 0.15},
        2: {reload: 1.8},
        3: {reload: 1.6},
        4: {reload: 1.4},
        5: {reload: 1.2},
        6: {reload: 1},
        7: {reload: 0.9},
        8: {reload: 0.8},
        9: {reload: 0.75},
        10: {reload: 0.7},
        11: {reload: 0.65},
        12: {reload: 0.6},
        13: {reload: 0.55},
        14: {reload: 0.06, timeToPop: 0.06},
        15: {reload: 0.03, timeToPop: 0.03},
        
        18: {reload: 0, timeToPop: 0},
        
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"],
      attackDistanceMult: 1/attackPetalDistanceMult
    },
    "Air": {
      damage: 0,
      health: 0,
      radius: 10,
      reload: 1e10,
      inflation: 12,
      override: {
        1: {inflation: 24},
        2: {inflation: 36},
        3: {inflation: 48},
        4: {inflation: 60},
        5: {inflation: 72},
        6: {inflation: 84},
        7: {inflation: 96},
        8: {inflation: 108},
        9: {inflation: 120},
        10: {inflation: 150},
        11: {inflation: 180},
        12: {inflation: 300},
        13: {inflation: 400},
        14: {inflation: 500},
        15: {inflation: 600},
        16: {inflation: 700},
        17: {inflation: 800},
        18: {inflation: 900},
      },
      pvpOverride: {
        1: {inflation: 13},
        2: {inflation: 14},
        3: {inflation: 15},
        4: {inflation: 16},
        5: {inflation: 17},
        6: {inflation: 18},
        7: {inflation: 19},
        8: {inflation: 20},
        9: {inflation: 21},
        10: {inflation: 22},
        11: {inflation: 23},
        12: {inflation: 24},
        13: {inflation: 25}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    "Card": {
      damage: 4,
      health: 25,
      reload: 3,
      radius: 15,
      waveSpeed: 2,
      override: {
        9: {waveSpeed: 1.4}, //SECONDS
        10: {waveSpeed: 0.7},
        11: {waveSpeed: 0.3},
        12: {waveSpeed: 0.1},
        13: {waveSpeed: 0.05}
      },
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    /*    "Basic": {
      damage: 10,
      health: 10,
      reload: 2.5,
      petalLayout: [[{}]],
      damageScalers: ["damage"],
      healthScalers: ["health"]
    },
    */
  },
  enemies: { //Player speed is around ???
    "Rock": {
      health: 30,
      damage: 10,
      radius: 40,
      speed: 0, 
			mass: 4,
      personality: "stationary",
			drops: {
        "Rock": [0.25, 0],
        "Heavy": [0.05, 0],
        "Emerald": [0.5, 11, 15 /*only drops from seraphics*/]
      },
      boss: [
        {type: 'spawnAround', spawnCooldown: 12, cooldown: 150, spawnType: "Rock Tank", randomChoices: [2]},
        {type: 'spawnAround', spawnCooldown: 35, cooldown: 150, spawnType: "Rock Tank"},
        {type: 'growAndShrink', switchTimer: 80, cooldown: 160, magnitude: 12},
        {type: 'spinShoot', spawnCooldown: 1, cooldown: 120, rotateSpeed: 0.2, spawnType: "RockMissile", raritiesBelow: 1},
        {type: 'shootNearest', spawnCooldown: 1, onlyShootOnce: true, cooldown: 60, rotateSpeed: 0.2, spawnType: "BigRockMissile"},
        {type: 'spinShoot', spawnCooldown: 1, cooldown: 60, rotateSpeed: 0.6, spawnType: "RockMissile", raritiesBelow: 1},
        {type: 'stationary', cooldown: 40, randomChoices: [1]},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Soil": {
      health: 90,
      damage: 10,
      radius: 25,
      speed: 0, 
			mass: 4,
      personality: "stationary",
			drops: {
        "Soil": [0.05, 0],
        "Neutron Star": [0.02, 8]
      },
    },
    "Plastic": {
      health: 9,
      damage: 10,
      radius: 40,
      speed: 0, 
			mass: 1,
      personality: "stationary",
			drops: {
        "Air": [0.25, 0],
        "Rubber": [0.25, 0],
        "Sapphire": [1, 11, 15 /*only drops from seraphics*/]
      }
    },
    "Shiny Plastic": {
      health: 18,
      damage: 10,
      radius: 40,
      speed: 0, 
			mass: 1,
      personality: "stationary",
			drops: {
        "Bud": [0.005, 4],
        "Rubber": [0.5, 0],
        "Plastic Egg": [0.5, 0],
        
      }
    },
    
    "Dandelion": {
      health: 30,
      damage: 5,
      radius: 40,
      speed: 0, 
			mass: 4,
      personality: "stationary",
			drops: {
        "Dandelion": [0.75, 1],
				"Pollen": [0.1, 1],
      },
      boss: [
        // start
        {type: 'stationary', cooldown: 150, randomChoices: [1,2,3,4,5]},
        {type: 'spinShoot', spawnCooldown: 1, cooldown: 120, rotateSpeed: 0.2, spawnDistance: 0.9, spawnType: "BossDandelionMissile", raritiesBelow: 0, randomChoices: [0]},
        {type: 'spinShoot', spawnCooldown: 1, cooldown: 120, rotateSpeed: -0.2, spawnDistance: 0.9, spawnType: "BossDandelionMissile", raritiesBelow: 0, randomChoices: [0]},
        {type: 'spinShoot', spawnCooldown: 3, cooldown: 60, spawnAmount: 4, spawnDistance: 0.9, spawnSpacing: Math.PI * 2, rotateSpeed: Math.PI / 30, spawnType: "BossDandelionMissile", raritiesBelow: 0, randomChoices: [0]},
        {type: 'spinShoot', spawnCooldown: 6, cooldown: 60, spawnAmount: 12, spawnDistance: 0.9, spawnSpacing: Math.PI * 2, rotateSpeed: Math.PI / 480, spawnType: "BossDandelionMissile", raritiesBelow: 0, randomChoices: [0]},
        {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, spawnAmount: 1, spawnDistance: 0.9, spawnSpacing: Math.PI * 2, rotateSpeed: 1.94165, spawnType: "BossDandelionMissile", raritiesBelow: 0, randomChoices: [0]},
        
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
		"Ladybug": {
      health: 25,
      damage: 10,
      radius: 35,
      speed: 5/3,// temp value, pls change later to make game feel better
			mass: 1,
      personality: "passive",
			drops: {
        "Rose": [0.25, 0],// JUST FOR TESTING, UNCOMMMENT REAL DROP LATER
        "Light": [0.25, 0],
      },
      override: {
        2: {
          personality: "neutral"
        }
      },
      boss: [
        // start
        
        /*0*/ {type: 'spinShoot', spawnCooldown: 1, cooldown: 30, rotateSpeed: Math.PI/15, spawnDistance: 0.9, spawnType: "BossRose", raritiesBelow: 2},

        /*1*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*2*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*3*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, spawnAmount: 3, spawnSpacing: Math.PI * 2, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, spawnDistance: 0.7, randomChoices: [2,4,5,7]},
        /*4*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*5*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*6*/ {type: 'smallDash', cooldown: 240, dashLength: 40, sizeChangeLength: 40, targetRadius: 0.3, dashSpeed: 7},
        /*7*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*8*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*9*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnDistance: 0.7, spawnType: "Ladybug", raritiesBelow: 3},
          ],
          cooldown: 60
        },
        /*10*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*11*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*12*/ {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 15},
        /*13*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*14*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},

      ],
      bossOverride: {
        changeStateOnHpThresholds: {
          0.2: [0]
        },
        bossForceStartIndex: 0
      }
    },
		"Dark Ladybug": {
      health: 35,
      damage: 10,
      radius: 35,
      speed: 5/3,
			mass: 1,
      personality: "neutral",  
			drops: {
        "Yin Yang": [0.25, 0],
        "Dahlia": [0.25, 0]
      },
      override: {
        /*
        5: {
          personality: "aggressive"
        }
        */
      },
      boss: [
        // start
        
        /*0*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*1*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*2*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*3*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*4*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, spawnAmount: 3, spawnSpacing: Math.PI * 2, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, spawnDistance: 0.7, randomChoices: [2,4,5,7]},
        /*5*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*6*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*7*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*8*/ {type: 'smallDash', cooldown: 240, dashLength: 40, sizeChangeLength: 40, targetRadius: 0.3, dashSpeed: 7},
        /*9*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*10*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*11*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*12*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*13*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnDistance: 0.7, spawnType: "Dark Ladybug", raritiesBelow: 3},
          ],
          cooldown: 60
        },
        /*14*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*15*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*16*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*17*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*18*/ {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 15},
        /*19*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*20*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 5, rotateSpeed: Math.PI/15, spawnDistance: 0, spawnType: "BossRose2", raritiesBelow: 2},
        /*21*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},

      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Baby Ant": {
      health: 15,
      damage: 10,
      radius: 20,
      speed: 1.7,
			mass: 1,
      personality: "passive",
			drops: {
        "Rice": [0.25, 2],
        "Light": [0.15, 0],
        "Leaf": [0.15, 0], 
        
      },
      boss: [
        // start
        
        /*0*/ {type: 'passive', cooldown: 1e9},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Worker Ant": {
      health: 25,
      damage: 10,
      radius: 20,
      speed: 1.7,
			mass: 1,
      personality: "neutral",
			drops: {
        "Corn": [0.25, 0],
        "Leaf": [0.25, 0],
        "Light": [0.05, 0],
      },
    },
    "Soldier Ant": {
      health: 35,
      damage: 10,
      radius: 20,
      speed: 1.7,
			mass: 1,
      detectionDistance: 550,
      personality: "aggressive",
			drops: {
        "Wing": [0.25, 0],
        "Corn": [0.05, 0],
        "Husk": [0.05, 7],
      },
      boss: [
        // start
        /*0*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*1*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*2*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*3*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*4*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*5*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*6*/ {type: 'spawnAround', spawnCooldown: 15, cooldown: 45, spawnType: "Soldier Ant", raritiesBelow: 1},
        

      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Queen Ant": {
      health: 175, // 5x as strong as a soldier ant.
      damage: 10,
      radius: 68*3/4,
      speed: 1.7,
      mass: 4,
      detectionDistance: 750,
      personality: "aggressive",
      drops: {
        "Heavy": [0.25, 0],
        "Wing": [0.5, 0],
        "Egg": [0.5, 0]
      },
      boss: [
        // start
        /*0*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*1*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*2*/ {type: 'spinShoot', spawnCooldown: 9, cooldown: 45, rotateSpeed: 0.139, spawnDistance: 1, spawnType: "Ant Egg", raritiesBelow: 1},
        /*3*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*4*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*5*/ {type: 'spinShoot', spawnCooldown: 25, cooldown: 45, rotateSpeed: 0.139, spawnDistance: 1, spawnType: "Ant Egg", raritiesBelow: 0},
        /*6*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*7*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*8*/ {type: 'spinShootMove', spawnCooldown: 2, moveSpeed: 11, cooldown: 60, shootOffset: Math.PI, rotateSpeed: Math.PI / 30, spawnType: "Ant Egg", raritiesBelow: 2, spawnDistance: 1}, 
        /*10*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*11*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*12*/ {type: 'spawnAround', spawnCooldown: 25, cooldown: 45, spawnType: "Baby Ant", raritiesBelow: 1},
        /*13*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*14*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
      
    },
    "Queen Fire Ant": {
      health: 150, //weaker than queen ant but more damage 
      damage: 40, //TONS of damage
      poison: [200, 10], //20 seconds of poison
      radius: 70*3/4,
      speed: 1.6,
      mass: 4,
      detectionDistance: 750,
      personality: "aggressive",
      drops: {
        "Egg": [1, 0],
        "Wing": [1, 0],
        "Fire Missile": [1, 0]
      },
    },
    
    "Fire Ant Burrow": {
      health: 300000,
      damage: 15,
      radius: 15,
      speed: 0,
			mass: 5,
      personality: "stationary",
      detectionDistance: 400,
      collideOtherEnemies: false,
			drops: {
        "Magnet": [1, 0],
        "Compass": [0.001, 6]
      },
      override: {
        1: {detectionDistance: 420},
        2: {detectionDistance: 440},
        3: {detectionDistance: 460},
        4: {detectionDistance: 480},
        5: {detectionDistance: 500},
        6: {detectionDistance: 520},
        7: {detectionDistance: 540},
        8: {detectionDistance: 560},
        9: {detectionDistance: 580},
        10: {detectionDistance: 590},
        11: {detectionDistance: 600},
        12: {detectionDistance: 610},
        13: {detectionDistance: 620},
        14: {detectionDistance: 630},
        15: {detectionDistance: 640},
        
      }
    },
    "Fire Ant": {
      health: 18,
      damage: 10,
      radius: 20,
      poison: [21, 7],
      speed: 1.6,
			mass: 1,
      detectionDistance: 750,
      personality: "aggressive",
			drops: {
        "Yucca": [0.05, 0], 
        "Bone": [0.01, 0],
        "Wing": [0.05, 0],
      },
      boss: [
        // start
        /*0*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*1*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*2*/ {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 9},
        /*3*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*4*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*5*/ {type: 'spawnAround', spawnCooldown: 10, cooldown: 45, spawnType: "Fire Ant", raritiesBelow: 1},
        /*6*/ {type: 'chaseAggro', cooldown: 120, turnSpeed: 1},
        /*7*/ {type: 'fly', cooldown: 60, speedMultiplier: 5},
        /*8*/ {type: 'spinShoot', spawnCooldown: 10, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "FireMissile", spawnDistance: 1, raritiesBelow: 1},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Ant Egg": {
      health: 25,
      damage: 2, 
      radius: 25, 
      speed: 0,
      mass: 1,
      xp: 0,
      personality: "projectile",   
      drops: {},
      collideOtherEnemies: false
    },
    "Fire Ant Egg": {
      health: 25,
      damage: 2, 
      radius: 25, 
      speed: 0,
      mass: 1,
      xp: 0,
      personality: "projectile",   
      drops: {},
      collideOtherEnemies: false
    },
    
    "Ant Burrow": {
      health: 150,
      damage: 10,
      radius: 30,
      speed: 0,
      mass: 10000,
      personality: "stationary",
      detectionDistance: 400,
      drops: {
        "Soil": [0.25, 0],
        "Heavy": [0.5, 0],
        "Egg": [1, 0]
      },
      boss: [
        // start
        /*0*/ {type: 'stationary', cooldown: 1e6}
      ],
      bossOverride: {
        bossForceStartIndex: 0
      },
      collideOtherEnemies: false
    },
    "Locust": {
      health: 12,//30,
      damage: 25,
      radius: 32,
      speed: 1.25,//1.65,
			mass: 7,
      turnSpeed: 0.45,
      detectionDistance: 500,
      personality: "stationary",
			drops: {
        "Egg": [0.1, 0],
        "Sand": [0.01, 0],
        "Ruby": [1, 11, 15 /*only drops from seraphics*/]
      },
      boss: [
        // {type: 'spinShoot', spawnCooldown: 24, cooldown: 60, rotateSpeed: Math.PI / 15, spawnType: "Locust"},
        // {type: 'spinShoot', spawnCooldown: 24, cooldown: 60, rotateSpeed: Math.PI / 15, spawnType: "Locust"},

        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        {type: 'chaseAggro', cooldown: 90, turnSpeed: 0.5},
        {type: 'shootAggro', cooldown: 180, shootCooldown: 50, spawnAmount: 1, spawnSpacing: 0, predictionChance: 0, spawnType: 'LocustMissile'},

        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        {type: 'spawnAround', spawnCooldown: 30, cooldown: 90 * 2.3, spawnType: "Locust", raritiesBelow: 3},
        {type: 'chaseAggro', cooldown: 75, turnSpeed: 0.5},
        {type: 'spawnAround', spawnCooldown: 72, cooldown: 90 * 2.3, spawnType: "Locust", raritiesBelow: 2},

        // {type: 'spawnAround', spawnCooldown: 12, cooldown: 120, spawnType: "Locust", raritiesBelow: 3},
        
        // {type: 'shootAggro', cooldown: 180, shootCooldown: 24, spawnAmount: 3, spawnSpacing: 1.4, predictionChance: 1, spawnType: 'Locust'},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    
    "Desert Centipede": {
      health: 20,
      damage: 10,
      radius: 35,
      speed: 13,
			mass: 1.6,
      personality: "passive",  
			drops: {
        "Powder": [0.05, 2],
        "Salt": [0.1, 1],
        "Faster": [0.25, 0]
      }
    },
    "Evil Desert Centipede": {
      health: 10,
      damage: 10,
      radius: 35,
      speed: 13,
			mass: 0.5,
      personality: "passive",  
			drops: {
        "Powder": [0.25, 2],
        "Dark Compass": [0.001, 6],
        "Faster": [1, 0]
      }
    },
    
    "Cactus": {
      health: 30,
      damage: 35,
      radius: 45,
      speed: 0,
			mass: 10,
      personality: "stationary",  
			drops: {
        "Cactus": [0.25, 0],
        "Stinger": [0.01, 0]
      },
      boss: [
        /* init*/
        
        /*0*/  {type: 'heal', heal: 0.05, cooldown: 45},
        /*1*/  {type: 'moveCenter', cooldown: 90, speedMult: 5},
        /*2*/  {type: 'heal', heal: 0.05, cooldown: 45},
        /*3*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*4*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*5*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*6*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*7*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*8*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*9*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*10*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*11*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},
        /*12*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Stinger'},

        /* boss*/
        {type: 'spinShoot', spawnCooldown: 1e9, cooldown: 420, rotateSpeed: -0.01},
        {type: 'growAndShrink', switchTimer: 10, cooldown: 40, magnitude: 3.5, randomChoices: [9, 10, 11, 12]},
      ],
      bossOverride: {
        bossForceStartIndex: 0,
        childrenRotateSpeed: 0.046,
        childrenDistance: 150,
        collideOtherEnemies: false,
        childrenWanderAngle: false,
        childrenWanderDistance: false,
        spawnRarityOffset: 1,
        spawnAmount: 1
      }
    },
    "Shiny Ladybug": {
      health: 35,
      damage: 10,
      radius: 40,
      speed: 1.65,
			mass: 1.5,
      personality: "neutral",  
			drops: {
        "Rose": [1, 0],
        "Dahlia": [1, 0],
        "Bud": [0.25, 4]
      }
    },
    "Ocean Ladybug": {
      health: 100,
      damage: 10,
      radius: 40,
      speed: 1.65,
			mass: 1.5,
      personality: "neutral",  
			drops: {
        "Air": [1, 0],
        "Rose": [1, 0],
        "Trident": [0.5, 4]
      }
    },
    "1v1text": { //Not a real mob
      health: 100,
      damage: 10,
      radius: 60,
      speed: 2,
			mass: 1,
      personality: "neutral",  
			drops: {}
    },
    
    "Agar.io Cell": {
      health: 100,
      damage: 100,
      radius: 60,
      speed: 1.77,
			mass: 2,
      detectionDistance: 1E9,
      personality: "neutral",
      override: {
        1: {
          health: 200,
          damage: 120
        },
        2: {
          health: 400,
          damage: 140
        },
        3: {
          health: 800,
          damage: 160
        },
        4: {
          health: 1600,
          damage: 180
        },
        5: {
          health: 3200,
          damage: 200
        },
        6: {
          health: 6400,
          damage: 220
        },
        7: {
          health: 10000,
          damage: 240
        },
        8: {
          health: 15000,
          damage: 260
        },
        9: {
          health: 22500,
          damage: 280
        },
        10: {
          health: 37500,
          damage: 300
        },
        11: {
          health: 60000,
          damage: 320
        },
        12: {
          health: 100000,
          damage: 340
        },

      },
			drops: {/*Mini flower, hardcoded*/}
    },
    "Scorpion": {
      health: 40,
      damage: 10,
      poison: [80, 20],
      radius: 40,
      speed: 1.65,
			mass: 1.5,
      detectionDistance: 700,
      personality: "aggressive",  
			drops: {
        "Iris": [0.25, 0],
        "Pincer": [0.25, 0],
        "Missile": [0.15, 0]
      },
      boss: [
        // {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, randomChoices: [0,2]},
        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        {type: 'shootAggro', cooldown: 180, shootCooldown: 32, spawnAmount: 10, spawnSpacing: Math.PI * 2, predictionChance: 0, spawnType: 'ScorpionMissile', randomChoices: [0, 2, 3, 5, 7]},

        {type: 'spawnAround', spawnCooldown: 0.1, cooldown: 120, spawnType: "ScorpionMissile", raritiesBelow: 2, randomChoices: [0, 2, 3, 5, 7]},
        
        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        {type: 'shootAggro', cooldown: 180, shootCooldown: 24, spawnAmount: 3, spawnSpacing: 1.4, predictionChance: 1, spawnType: 'ScorpionMissile', randomChoices: [0, 2, 3, 5, 7]},

        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        {type: 'chaseAggro', cooldown: 90, turnSpeed: 1, randomChoices: [0, 2, 3, 5, 7]},

        {type: 'growAndShrink', switchTimer: 10000, cooldown: 40, magnitude: 3.5, randomChoices: [0, 2, 3, 5]},
      ],
      bossOverride: {
        bossForceStartIndex: 0,
        childrenRotateSpeed: 0,
        childrenDistance: 220,
        childrenWanderAngle: true,
        childrenWanderDistance: true,
        spawnRarityOffset: 2,
        spawnAmount: 1
      }
    },
    "Beetle": {
      health: 32,
      damage: 30,
      radius: 40,
      speed: 1.9,
			mass: 1.5,
      turnSpeed: 0.1,
      detectionDistance: 700,
      personality: "aggressive",  
			drops: {
        "Bone": [0.25, 0],
        "Egg": [0.15, 0]
      },
      boss: [
        {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        {type: 'chaseAggro', cooldown: 160, turnSpeed: 0.04},
        {type: 'smallDash', cooldown: 240, dashLength: 40, sizeChangeLength: 40, targetRadius: 0.3, dashSpeed: 7},
        {type: 'spinShoot', spawnCooldown: 3, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "ScorpionMissile", spawnDistance: 1, raritiesBelow: 1},
        {type: 'spawnGrows', cooldown: 1, spawnType: 'Beetle'},
        {type: 'spinShoot', spawnCooldown: 10000, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "Beetle"},
      ],
      bossOverride: {
        bossForceStartIndex: 0,
        childrenRotateSpeed: 0.023,
        childrenDistance: 180,
        childrenWanderAngle: false,
        childrenWanderDistance: false,
        spawnRarityOffset: 2,
        spawnAmount: 2
      }
    },
		"Sandstorm": {
      health: 39,
      damage: 40,
      radius: 45,
      speed: 4,
			mass: 2,
      personality: "sandstorm",  
			drops: {
        "Stick": [0.05, 3],
        "Sand": [0.25, 0]
      },
      boss: [
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 9},
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 16},
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 23},
        {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, rotateSpeed: Math.PI / 30, raritiesBelow: 3, spawnType: "Sandstorm"},
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 9},
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 16},
        {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 23},
        {type: 'growAndShrink', switchTimer: 5, cooldown: 40, magnitude: 30},
        {type: 'spinPlayers', magnitude: 30000, cooldown: 240},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
		"Bee": {
      health: 15,
      damage: 50,
      radius: 30,
      speed: 1.7,
			mass: 1,
      personality: "passive",   
			drops: {
        "Stinger": [0.25, 0],
        "Honey": [0.1, 2],
				"Pollen": [0.05, 1],
				
      },
      override: {
        2: {
          personality: "neutral"
        }
      },
      boss: [
        // start
        /*0*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*1*/ {type: 'chaseAggro', cooldown: 90, turnSpeed: 1},
        /*2*/ {type: 'smallDash', cooldown: 240, dashLength: 40, sizeChangeLength: 40, targetRadius: 0.3, dashSpeed: 7},
        /*3*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "BeeMissile", spawnDistance: 0.5, raritiesBelow: 1},
        /*4*/ {type: 'spinShoot', spawnCooldown: 6, cooldown: 45, rotateSpeed: Math.PI / 30, spawnType: "Bee", spawnDistance: 0.5, raritiesBelow: 2},
        /*5*/ {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 15},
        /*6*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*7*/ {type: 'chaseAggro', cooldown: 40, turnSpeed: 1},
        /*8*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnDistance: 0.9, spawnType: "Bee", raritiesBelow: 4},
          ],
          cooldown: 60
        },
        /*9*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*10*/ {type: 'chaseAggro', cooldown: 6, turnSpeed: 1},
        /*11*/ {type: 'smallDash', cooldown: 120, dashLength: 30, sizeChangeLength: 30, targetRadius: 0.6, dashSpeed: 4},
        /*12*/ {type: 'growAndShrink', switchTimer: 40, cooldown: 80, magnitude: 12},
        /*13*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*14*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.2, spawnType: "BeeMissile", raritiesBelow: 2},
            {spawnCooldown: 12, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnType: "Bee", raritiesBelow: 3},
            {aim: true, spawnCooldown: 60, predictionChance: 0.5, spawnType: "BeeMissile", raritiesBelow: 0},
            
          ],
          cooldown: 180
        },
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Desert Moth": {
      health: 25,
      damage: 10,
      radius: 35,
      speed: 2.3,
			mass: 1,
      personality: "passive",   
			drops: {
        "Wing": [0.25, 0],
				"Powder": [0.25, 0],
				"Mandible": [0.1, 0],
				
      },
      override: {
        2: {
          personality: "neutral"
        }
      },
      
      boss: [
        // start
        /*0*/ {type: 'passive', cooldown: 1e9, speedMultiplier: 10},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Hornet": {
      health: 30,// 2023
      damage: 50,
      radius: 42,
      speed: 1,
			mass: 1.2,
      personality: "shoot",
      detectionDistance: 700,
			drops: {
        "Missile": [0.25, 2],
        "Oranges": [0.25, 0],
        "Husk": [0.15, 7],
      },
      boss: [
        // start
        /*0*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*1*/ {type: 'shootAggro', cooldown: 180, shootCooldown: 42, spawnAmount: 3, spawnSpacing: 1.38, predictionChance: 0.5, spawnType: 'Missile'},

        // repeat patterns
        /*2*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*3*/ {type: 'shootAggro', cooldown: 90 * 2.3, shootCooldown: 18 * 2, spawnAmount: 1, spawnSpacing: Math.PI, predictionChance: 0, raritiesBelow: 2, spawnType: 'Hornet', randomChoices: [4,5,7,8]},

        /*4*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, spawnDistance: 1, randomChoices: [2,5]},
        /*5*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*6*/ {type: 'shootAggro', cooldown: 180, shootCooldown: 42, spawnAmount: 3, spawnSpacing: 1.38, predictionChance: 0.5, spawnType: 'Missile', randomChoices: [2,4,5,7]},
        /*7*/ {type: 'spinShootMove', spawnCooldown: 2, moveSpeed: 11, cooldown: 60, shootOffset: Math.PI, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, spawnDistance: 1, randomChoices: [2,5,5,8]}, //5 is twice more likely
        /*8*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, spawnAmount: 5, spawnSpacing: Math.PI * 2, rotateSpeed: Math.PI / 30, spawnType: "Missile", raritiesBelow: 1, spawnDistance: 0.7, randomChoices: [2,4,5,7]},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Rock Tank": {
      health: 30,
      damage: 10,
      radius: 40,
      speed: 0.76, 
			mass: 4,
      personality: "stationary",
      detectionDistance: 570,
			drops: {
        "Rock": [0.15, 0],
        "scrap barrel": [0.05, 0]
      },
      spawnType: "RockMissile"
    },
    "RockMissile": {
      health: 10,
      damage: 8, 
      radius: 40 * 0.4, 
      speed: 28,
			mass: 2,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "BossRose": {
      health: 6,
      damage: 10, 
      radius: 24, 
      speed: 0,
			mass: 2,
      xp: 0,
      personality: "stationary",   
			drops: {},
      collideOtherEnemies: false
    },
    "BossRose2": {
      health: 18,
      damage: 10, 
      radius: 24, 
      speed: 0,
			mass: 2,
      xp: 0,
      personality: "stationary",   
			drops: {},
      collideOtherEnemies: false
    },
    
    "BigRockMissile": {
      health: 100,
      damage: 100,// if you get hit by this you're fucked lmao 
      radius: 40 * 2, 
      speed: 16,
			mass: 200,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "Spider": {
      health: 30,// 2023
      damage: 25,
      radius: 20,
      speed: 1.8,
			mass: 0.8,
      personality: "aggressive",
      detectionDistance: 700,
			drops: {
        "Faster": [0.25, 0],
        "Web": [0.25, 2],
        "Third Eye": [0.02, 4],
      },
      boss: [
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'spawnGrows', cooldown: 5, spawnType: 'Spider'},
        {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},

        {type: 'chaseAggro', cooldown: 65, turnSpeed: 1, randomChoices: [13, 12, 13, 14]},
        {type: 'spawnGrows', cooldown: 0, spawnType: 'Spider', randomChoices: [12]},
      ],
      bossOverride: {
        bossForceStartIndex: 0,
        childrenRotateSpeed: -0.033,
        childrenDistance: 450,
        childrenWanderAngle: false,
        childrenWanderDistance: false,
        spawnRarityOffset: 2,
        spawnAmount: 3,
        speed: 1.68,
        health: 25// slight nerf, giving more of a trojan horse effect
      }
    },
    "Centipede": {
      health: 20,
      damage: 8,
      radius: 35,
      speed: 1.65,
			mass: 1.6,
      personality: "passive",
			drops: {
        "Leaf": [0.1, 0],
        "Peas": [0.1, 0]
      }
    },
    "Evil Centipede": {
      health: 20,
      damage: 8,
      radius: 35,
      speed: 1.65,
			mass: 1.6,
      detectionDistance: 700,
      personality: "aggressive",
			drops: {
        "Iris": [0.1, 0],
        "Grapes": [0.1, 0]
      }
    },
    
    "Square": {
      health: 45,
      damage: 7.5,
      radius: 35,
      speed: 0.8,
			mass: 0.5,
      personality: "passive",
			drops: {
        "Square": [1, 0]
      },
    },
    "Pentagon": {
      health: 90,
      damage: 7.5,
      radius: 40,
      speed: 0.8,
			mass: 0.5,
      personality: "passive",
			drops: {
        "Pentagon": [1, 0]
      },
    },
    
    "Hexagon": {
      health: 180,
      damage: 7.5,
      radius: 45,
      speed: 0.8,
			mass: 0.5,
      personality: "passive",
			drops: {
        "Air": [1, 0],
        "Token": [1, 0],
        "Mini Flower": [0.0000001, 0],
        
      },
    },
    "Dummy": {
      health: 1e9,
      damage: 10,
      radius: 120,
      speed: 0,
			mass: 1e6,
      personality: "stationary",
			drops: {
        "Basic": [1, 0]
      },
    },
    
    "Missile": {
      health: 5,
      damage: 14, 
      radius: 11, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
        
    "BeeMissile": {
      health: 10,
      damage: 18, 
      radius: 11, 
      speed: 35,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "StarfishMissile": {
      health: 15,
      damage: 12, 
      radius: 11, 
      speed: 35,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "FireMissile": {
      health: 10,
      damage: 15, 
      poison: [30, 15],
      radius: 15, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "UrchinMissile": {
      health: 15,
      damage: 1,
      poison: [12, 3],
      radius: 9, 
      speed: 35,
			mass: 0.3,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "BossUrchinMissile": {
      health: 22,
      damage: 8,
      poison: [36, 9],
      radius: 8, 
      speed: 40,
			mass: 0.3,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "BigBossUrchinMissile": {
      health: 100,
      damage: 24,
      poison: [72, 18],
      radius: 21, 
      speed: 30,
			mass: 0.3,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    
    "ScorpionMissile": {
      health: 5,
      damage: 5,
      poison: [45, 15],
      radius: 8, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "LocustMissile": {
      health: 50,
      damage: 20,
      radius: 10, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "SplitLocustMissile": {
      health: 5,
      damage: 2,
      radius: 6, 
      speed: 60,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    
    "DandelionMissile": {
      health: 7,
      damage: 3, 
      radius: 40/3, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    "BossDandelionMissile": {
      health: 7,
      damage: 3, 
      radius: 40/3, 
      speed: 30,
			mass: 0.5,
      xp: 0,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    
    "Bubble": {
      health: 1,
      damage: 3,
      radius: 60,
      speed: 0, 
			mass: 0.5,
      personality: "stationary",
			drops: {
        "Bubble": [0.25, 0],
        "Air": [1, 0]
      },
      boss: [
        {type: 'spawnAround', spawnCooldown: 8.3, cooldown: 150, spawnType: "Bubble", raritiesBelow: 1},
        {type: 'growAndShrink', switchTimer: 100 / 4, cooldown: 200 / 4, magnitude: 16},
        {type: 'spinShoot', spawnCooldown: 1, cooldown: 120, rotateSpeed: 0.2, spawnType: "Bubble"},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Pearl": {
      health: 9,
      damage: 190,
      radius: 23,
      speed: 0,
			mass: 1,
      personality: "stationary",
      agroState: "hop",
      drops: {
        "Pearl": [0.25, 0],
      }
    },
    "Stinger": {
      health: 1,
      damage: 380,
      radius: 19,
      speed: 0,
			mass: 1,
      personality: "stationary",
      agroState: "aggressive",
      collideOtherEnemies: false,
      drops: {
        "Stinger": [0.25, 0],
      }
    },
    
    "PearlMissile": {
      health: 40,
      damage: 100,
      radius: 18,
      speed: 30,
			mass: 1,
      personality: "projectile",   
			drops: {},
      collideOtherEnemies: false
    },
    
    "Shell": {
      health: 30,
      damage: 15,
      radius: 30,
      speed: 56,
			mass: 0.8,
      personality: "neutral",
      agroState: "hop",
			drops: {
        "Pearl": [0.15, 0],
        "Shell": [0.25, 1],
        "Magnet": [0.02, 0],
      },
      boss: [

        // start
        /*0*/ {type: 'spinShoot', spawnCooldown: 5000000, cooldown: 60, rotateSpeed: 0.5, spawnType: "Shell", raritiesBelow: 1},
        /*1*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl'},
        /*2*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl'},
        /*3*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl'},
        /*4*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl'},
        /*5*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl'},

        // repeat
        /*6*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*7*/ {type: 'shellAggro', cooldown: 200},
        /*8*/ {type: 'spinShoot', spawnCooldown: 2, cooldown: 60, rotateSpeed: 0.2, raritiesBelow: 4, spawnType: "Shell"},
        /*9*/ {type: 'shellAggro', cooldown: 200},
        /*10*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*11*/ {type: 'smallDash', cooldown: 80, dashLength: 60, sizeChangeLength: 20, targetRadius: 0.2, dashSpeed: 10},
        /*12*/ {type: 'shellAggro', cooldown: 200},
        /*13*/ {type: 'spinShoot', spawnCooldown: 1, cooldown: 60, rotateSpeed: 0.2, raritiesBelow: 1, spawnType: "PearlMissile"},
        /*14*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Pearl', randomChoices: [6]},
      ],
      bossOverride: {
        bossForceStartIndex: 0,
        childrenRotateSpeed: 0.046,
        childrenDistance: 160,
        collideOtherEnemies: false,
        childrenWanderAngle: false,
        childrenWanderDistance: false,
        spawnRarityOffset: 1,
        spawnAmount: 2,
        speed: 44
      }
    },
    "Crab": {
      health: 25,
      damage: 35,
      radius: 33,
      speed: 2.5,
			mass: 1,
      detectionDistance: 900,
      personality: "aggressive",
			drops: {
        "Claw": [0.25, 0],
        "Sand": [0.02, 0]
      },
      boss: [
        /*1*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*2*/ {type: 'crabAggro', cooldown: 300},
        /*3*/ {type: 'growAndShrink', switchTimer: 25, cooldown: 50, magnitude: 16},
        /*4*/ {type: 'smallDash', cooldown: 240, dashLength: 40, sizeChangeLength: 40, targetRadius: 0.2, dashSpeed: 9},
        /*4.5*/ {type: 'shockwave', cooldown: 0},
        /*5*/ {type: 'spinShoot', spawnCooldown: 5, cooldown: 120, rotateSpeed: 0.2, raritiesBelow: 4, spawnType: "Crab"},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Starfish": {
      health: 25,
      damage: 25,
      radius: 35,
      speed: 1.65,
			mass: 1,
      healing: 0.007,
      detectionDistance: 800,
      personality: "aggressive",
			drops: {
        "Starfish": [0.15, 0],
        "Salt": [0.15, 1],
        "Sand": [0.02, 0],
      },
      boss: [
        // override at 20% hp
        /*0*/ {type: 'heal', heal: 0.100, cooldown: 60, randomChoices: [3]},

        // start
        /*1*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        /*2*/ {type: 'chaseAggroScared', cooldown: 120, toSpawnAround: true, spawnCooldown: 38, spawnType: "Starfish"},
        /*3*/ {type: 'moveCenter', cooldown: 120, speedMult: 2.6},
        /*4*/ {type: 'growAndShrink', switchTimer: 8, cooldown: 32, magnitude: 6*45/32},
        /*5*/ {type: 'spawnGrows', cooldown: 1, spawnType: 'Starfish'},

        // repeat
        /*6*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest', randomChoices: [7, 8]},

        /*7*/ {type: 'spinShoot', spawnCooldown: 5, cooldown: 90, spawnAmount: 5, spawnSpacing: Math.PI * 2, rotateSpeed: 0.03, spawnType: "StarfishMissile", raritiesBelow: 1, spawnDistance: 0, randomChoices: [9]},
        /*8*/ {type: 'spinShoot', spawnCooldown: 5, cooldown: 90, spawnAmount: 5, spawnSpacing: Math.PI * 2, rotateSpeed: -0.03, spawnType: "StarfishMissile", raritiesBelow: 1, spawnDistance: 0, randomChoices: [9]},
        
        /*9*/ {type: 'chaseAggroScared', toSpawnAround: true, spawnCooldown: 65, cooldown: 300, spawnType: "Starfish", randomChoices: [6]},
      ],
      bossOverride: {
        changeStateOnHpThresholds: {
          0.2: [0]
        },
        bossForceStartIndex: 1,
        childrenRotateSpeed: 0.046,
        childrenDistance: 142,
        collideOtherEnemies: false,
        childrenWanderAngle: false,
        childrenWanderDistance: false,
        spawnRarityOffset: 1,
        spawnAmount: 5,
        speed: 0.84,
        healing: 0.0058,
      }
    },
    "Sponge": {
      health: 25,
      damage: 10,
      radius: 35,
      speed: 0,
			mass: 6,
			drops: {
        "Sponge": [0.25, 0],
        "Air": [0.25, 0],
        "Waterlogged Compass": [0.02, 6]
      },
      boss: [
        {type: 'growAndShrink', switchTimer: 25, cooldown: 5e6, magnitude: 16}
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "BudLeech": {
      health: 18,
      damage: 38,
      radius: 20,
      speed: 4.5,
			mass: 1.2,
      detectionDistance: 700,
			drops: {
        "Fangs": [0.25, 0],
        "Faster": [0.25, 0]
      },
    },
    "Leech": {
      health: 18,
      damage: 38,
      radius: 20,
      speed: 3,
			mass: 1.2,
      detectionDistance: 700,
			drops: {
        "Fangs": [0.25, 0],
        "Faster": [0.25, 0]
      },
      boss: [
        // start
        /*0*/ {type: 'leech', cooldown: 1e12, turnSpeed: 1, spawnCooldown: 6, rotateSpeed: Math.PI / 20, spawnType: "Missile", spawnDistance: 1, raritiesBelow: 1},
      ],
      bossOverride: {
        bossForceStartIndex: 0
      }
    },
    "Jellyfish": {
      health: 35,
      damage: 10,
      radius: 40,
      speed: 0.75,
			mass: 2,
      detectionDistance: 1200,
			drops: {
        "Lightning": [0.15, 0],
        "Jelly": [0.25, 0],
        "Jellyfish Egg": [0.01, 11, 14 /*only drops from celestials+*/]
      },
      boss: [
        {type: 'aggroDifferent', cooldown: 0, detectionType: 'closest'},
        {type: 'spinShoot', spawnCooldown: 5, cooldown: 30, rotateSpeed: 0.2, spawnType: "Jellyfish", raritiesBelow: 3},
        {type: 'shockwave', cooldown: 0},
        {type: 'chaseZap', cooldown: 120, turnSpeed: 0.04},
        {type: 'generateShock', cooldown: 0},
        {type: 'chaseZap', cooldown: 60, turnSpeed: 0.04},
        {type: 'deployShock', cooldown: 0},
        {type: 'chaseZap', cooldown: 90, turnSpeed: 0.04},
        
      ],
      bossOverride: {
        bossForceStartIndex: 0,
      }
    },
    "Sea Urchin": {
      health: 25,
      damage: 25,
      radius: 33,
      speed: 2.2,
			mass: 1.2,
      detectionDistance: 700, 
			drops: {
        "Missile": [0.25, 0],
        "Shell": [0.15, 0],
        "Coral": [0.05, 5]
      },
      boss: [
        // Initialization

        /*0*/  {type: 'spinShoot', spawnCooldown: 30, cooldown: 60, spawnAmount: 5, spawnSpacing: Math.PI * 2, rotateSpeed: 0, spawnType: "Invincible Urchin", raritiesBelow: 2, spawnDistance: 1},
        /*1*/  {type: 'moveCenter', cooldown: 90, speedMult: 2},
        /*2*/  {type: 'heal', heal: 0.005, cooldown: 45},

        // Actual boss
        /*3*/ {
          type: 'spinShoot', spawnCooldown: 1, cooldown: 120, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.2, spawnType: "BossUrchinMissile", raritiesBelow: 1
        },
        /*4*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        /*5*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: 0.2, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 2, spawnAmount: 2, spawnSpacing: Math.PI * 2, rotateSpeed: -0.2, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            {aim: true, spawnCooldown: 80, predictionChance: 0, spawnType: "BigBossUrchinMissile", raritiesBelow: 0},
            
          ],
          cooldown: 240
        },
        /*6*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 12, spawnAmount: 6, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            {spawnCooldown: 12, spawnAmount: 6, spawnSpacing: Math.PI * 2, rotateSpeed: -0.05, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 24, spawnAmount: 24, spawnSpacing: Math.PI * 2, rotateSpeed: 0.1, spawnType: "BossUrchinMissile", raritiesBelow: 2},
          ],
          cooldown: 240
        },
        /*7*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 11, spawnAmount: 3, spawnSpacing: 0.5, rotateSpeed: 0.02, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 11, spawnAmount: 3, spawnSpacing: 0.5, rotateSpeed: 0.04, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            {spawnCooldown: 11, spawnAmount: 3, spawnSpacing: 0.5, rotateSpeed: 0.06, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 11, spawnAmount: 3, spawnSpacing: 0.5, rotateSpeed: 0.08, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            
          ],
          cooldown: 240
        },
        /*8*/ {type: 'aggroDifferent', cooldown: 0, detectionType: 'random'},
        /*9*/ {
          type: 'complexShoot',
          shoot: [
            {aim: true, spawnCooldown: 18, predictionChance: 1, spawnType: "BigBossUrchinMissile", raritiesBelow: 2},
            {spawnCooldown: 4, spawnAmount: 4, spawnSpacing: Math.PI * 2, rotateSpeed: 0.2, spawnType: "BossUrchinMissile", raritiesBelow: 1},
          ],
          cooldown: 240
        },
        /*10*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 1, spawnAmount: 3, spawnSpacing: 0.8, rotateSpeed: 1.94165, spawnType: "BossUrchinMissile", raritiesBelow: 1},
          ],
          cooldown: 240
        },
        /*11*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 12, spawnAmount: 5, spawnSpacing: 1.5, rotateSpeed: -0.1, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 36, spawnAmount: 10, spawnSpacing: 1.5, rotateSpeed: 0.2, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            {spawnCooldown: 6, spawnAmount: 2, spawnSpacing: 0.3, rotateSpeed: 0.03, spawnType: "BossUrchinMissile", raritiesBelow: 1},
          ],
          cooldown: 240
        },
        /*12*/ {
          type: 'complexShoot',
          shoot: [
            {spawnCooldown: 12, spawnAmount: 6, spawnSpacing: Math.PI * 2, rotateSpeed: -0.05, spawnType: "BossUrchinMissile", raritiesBelow: 1},
            {spawnCooldown: 12, spawnAmount: 6, spawnSpacing: Math.PI * 2, rotateSpeed: 0.15, spawnType: "BossUrchinMissile", raritiesBelow: 2},
            {spawnCooldown: 12, spawnAmount: 12, spawnSpacing: Math.PI * 2, rotateSpeed: 0.05, spawnType: "BossUrchinMissile", raritiesBelow: 2},
          ],
          cooldown: 240
        },
        /*13*/ {type: 'spinShoot', spawnCooldown: 175, cooldown: 350, spawnAmount: 1, spawnSpacing: 0, rotateSpeed: 0, spawnType: "Invincible Urchin", raritiesBelow: 2, spawnDistance: 1, randomChoices: [3]},
      ],
      bossOverride: {
        changeStateOnHpThresholds: {
          0.2: [0]
        },
        bossForceStartIndex: 0
      }
    },
    "Invincible Urchin": {
      health: 1e7,
      damage: 25,
      radius: 15,
      speed: 3.3,
			mass: 1000, 
			drops: {},
      collideOtherEnemies: false
    },
  },
  rarities: [{// NOTE: DO NOT CHANGE ANY OF THESE. THEY WERE SUPPOSED TO BE FINAL.
    // IF YOU DO CHANGE THEM PLEASE UPDATE THEM CLIENT SIDE SO THAT STATS ARE ACCURATE
      name: "Common",
      health: 1,
      damage: 1, 
      radius: 1, 
      mass: 1,
      petalDamage: 1,
      petalHealth: 1,
      petalHeal: 1,
      petalMass: 1,
      detectionDistance: 1,
      xp: 1 
    }, {
      name: "Unusual",
      health: 2,
      damage: 1.2,
      radius: 1.1, 
      mass: 1.52,
      petalDamage: 1.4,
      petalHealth: 1.2,
      petalHeal: 1.51,
      petalMass: 1.52,
      detectionDistance: 1.1,
      xp: 3
    }, {
      name: "Rare",
      health: 4,
      damage: 1.5,
      radius: 1.3, 
      mass: 2.46,
      petalDamage: 2,
      petalHealth: 1.5,
      petalHeal: 2.23,
      petalMass: 2.46,
      detectionDistance: 1.2,
      xp: 9
    }, {
      name: "Epic",
      health: 8*1.72/1.6,
      damage: 1.9,
      radius: 1.72,//1.6, 
      mass: 5.7,
      petalDamage: 2.9,
      petalHealth: 1.9,
      petalHeal: 3.17,
      petalMass: 5.7,
      detectionDistance: 1.3,
      xp: 27
    }, {
      name: "Legendary",
      health: 50,
      damage: 2.7,
      radius: 3, 
      mass: 18.6, 
      petalDamage: 4.8,
      petalHealth: 2.7,
      petalHeal: 4.94,
      petalMass: 18.6,
      detectionDistance: 1.7,
      xp: 81
    }, {
      name: "Mythic",
      health: 110,
      damage: 4.3,
      radius: 5, 
      mass: 43, 
      petalDamage: 9.7,//9.1
      petalHealth: 4.3,
      petalHeal: 10.2,
      petalMass: 43,
      detectionDistance: 2.1,
      xp: 243
    }, {
      name: "Ultra",
      health: 310,
      damage: 8.6,
      radius: 7, 
      mass: 100,  
      petalDamage: 23,//18.3
      petalHealth: 8.6,
      petalHeal: 21.45,
      petalMass: 100,
      detectionDistance: 2.5,
      xp: 729
    }, {
      name: "Super",
      health: 1350,
      damage: 17.2,
      radius: 9.5, 
      mass: 216,  
      petalDamage: 90,
      petalHealth: 17.2,
      petalHeal: 40.3,
      petalMass: 216,
      detectionDistance: 2.5,
      xp: 2187
    }, {
      name: "Omega",
      health: 4941,
      damage: 34.4,
      radius: 13, 
      mass: 500,  
      petalDamage: 315, 
      petalHealth: 34.4,
      petalHeal: 74,
      petalMass: 480,
      detectionDistance: 2.5,
      xp: 6561
    }, {
      name: "Fabled",
      health: 18084,
      damage: 68.8,
      radius: 17.7, 
      mass: 1250,  
      petalDamage: 1100, 
      petalHealth: 68.8,
      petalHeal: 140.6,
      petalMass: 1100,
      detectionDistance: 2.5,
      xp: 26244
    }, {
      name: "Divine",
      health: 66188,
      damage: 137.6,
      radius: 24.1, 
      mass: 3125,  
      petalDamage: 3850, 
      petalHealth: 137.6,
      petalHeal: 267.14,
      petalMass: 2500,
      detectionDistance: 2.5,
      xp: 131220
    }, {
      name: "Supreme",
      health: 242247,
      damage: 275.2,
      radius: 33, 
      mass: 9375,  
      petalDamage: 13475, 
      petalHealth: 275.2,
      petalHeal: 507,
      petalMass: 7000,
      detectionDistance: 2.5,
      xp: 721710
    }, {
      name: "Omnipotent",
      health: 968988,
      damage: 550,
      radius: 45, 
      mass: 33750,  
      petalDamage: 47162.5, 
      petalHealth: 550,
      petalHeal: 963,
      petalMass: 20000,
      detectionDistance: 2.5,
      xp: 4428675
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Astral",
      health: 4844940,
      damage: 1100,
      radius: 62, 
      mass: 194400,  
      petalDamage: 165068, 
      petalHealth: 1100,
      petalHeal: 1829,
      petalMass: 60000,
      detectionDistance: 2.5,
      xp: 26244000
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Celestial",
      health: 9689880,
      damage: 1650,
      radius: 72, 
      mass: 194400*2,  
      petalDamage: 577738, 
      petalHealth: 2200,
      petalHeal: 3475,
      petalMass: 144000,
      detectionDistance: 2.5,
      xp: 73811250
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Seraphic",
      health: 19379760,
      damage: 2475,
      radius: 84, 
      mass: 194400*4,  
      petalDamage: 2022083, 
      petalHealth: 4400,
      petalHeal: 6602,
      petalMass: 288000,
      detectionDistance: 2.5,
      xp: 205031250
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Transcendent",
      health: 248060928,
      damage: 8800,
      radius: 161.9, //Becomes small!! ?? 
      mass: 3280500,  
      petalDamage: 7077290, 
      petalHealth: 8800,
      petalHeal: 12543,
      petalMass: 600000,
      detectionDistance: 2.5,
      xp: 0
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Quantum",
      health: 992243712,
      damage: 17600,
      radius: 222.9, //Becomes small!! ?? 
      mass: 9841500,  
      petalDamage: 24770516, 
      petalHealth: 17600,
      petalHeal: 23831,
      petalMass: 1200000,
      detectionDistance: 2.5,
      xp: 0
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Galactic",
      health: 3968974848,
      damage: 35200,
      radius: 306.9, //Becomes small!! ?? 
      mass: 29524500,  
      petalDamage: 86696806, 
      petalHealth: 35200,
      petalHeal: 45279,
      petalMass: 2400000,
      detectionDistance: 2.5,
      xp: 0
    }

  ]




//Radius should be x1.36 per rarity
}

// petals and enemies or just 1? just the petals theyre 500x damage instead of 400

// wtf.... thats interesting
// o ye maybe like late tiers act differently almost like bosses or somethin

//idk we could try and if it stoo complicated just remove it 
// ok I understand what this is now still seems weird but uh
// k, I was thinking of making like "corrupted" mnormal or demonic normal or smth like that that way they can both be buffed and possibly have some like "demonic" ability


function getSlowdown(n) {
  const mobS = [/*c*/25000,/*un*/7500,/*r*/2000,/*e*/675,/*l*/145,/*m*/19,/*u*/2.1,/*s*/0.25,/*o*/0.029,/*f*/0.0034, 0.00039, 0.000044, 0.0000049, 0.00000054, 0.000000054, 0.000000054, 0.0000000054, ];
  const logDrops = [0, -1.4,-2.8,-4.2,/*l*/-6.2,-8.3, -10.4, -12.6, -14.8, -17, -19.2, -21.4, -23.6, -25.8, -28, -30.2, -32.4, -34.6]
  const dropS = [];

  for(let i = 0; i < logDrops.length; i++){
    if (i == 0){
      dropS.push(0);
    }
    else{
      dropS.push(1-Math.pow(Math.E, logDrops[i]))
    }
  }

  const ret = new Array(15).fill(0).map(_ => new Array(14).fill(0));
  for (let mob = 0; mob < 15; ++mob) {
    let percent = 100;
    for (let drop = 0; drop <= 14; ++drop) {
      if (drop > 14) break;
      let start = dropS[drop], end = dropS[drop+1];
      if (drop === 14) end = 1;
      const ret1 = Math.pow(n*start+(1-n),300000/mobS[mob]);
      const ret2 = Math.pow(n*end+(1-n),300000/mobS[mob]);
      ret[mob][drop] = Math.max((percent*n).toFixed(2), 0);
      percent -= (100*(ret2-ret1));
    }
    if (ret[mob][14] >= 0 && mob < 3){
      let reduce = ret[mob][14];
      for(let drop = 0; drop <= 14; ++drop){
        ret[mob][drop] -= reduce;
        ret[mob][drop] = Math.max((ret[mob][drop]).toFixed(2), 0);
      }
    }
  }

  for(let i of ret){
    i.push(0);
    i.push(0);
    i.push(0);
    i.push(0);
    i.push(0);
    i.push(0);
    
  }

  return ret;
}


let Stats = {
  petals: {},
  enemies: {},
  rarities: {}
}
Stats.rarities = BaseStats.rarities;

let pvpStats = {
  petals: {},
  enemies: {},
  rarities: {}
}
pvpStats.rarities = BaseStats.rarities;


let smallerEnemies = {
  Leech: 2,
  BudLeech: 2,
  "Desert Centipede": 1.4,
  "Centipede": 1.4,
  "Evil Desert Centipede": 1.4,
  "Evil Centipede": 1.4
}
let raritiesAmount = BaseStats.rarities.length;


(typeof global !== 'undefined' ? global : window).calculateStats = (pvp) => {
  for(let enemyName of Object.keys(BaseStats.enemies)){
    // let enemyObject = BaseStats.enemies[enemyName];
    Stats.enemies[enemyName] = {};
    for(let i = 0; i<raritiesAmount; i++){
      if (i == 0){
        Stats.enemies[enemyName][i] = structuredClone(BaseStats.enemies[enemyName]);
        if (BaseStats.enemies[enemyName].xp == undefined){
          Stats.enemies[enemyName][i].xp = Math.round(BaseStats.rarities[i].xp);
        }
      }
      else{
        let newRarityEnemyStats = {};
        newRarityEnemyStats = structuredClone(Stats.enemies[enemyName][i-1]);
        newRarityEnemyStats.health = Math.round(newRarityEnemyStats.health * BaseStats.rarities[i].health/BaseStats.rarities[i-1].health * 100)/100;
        newRarityEnemyStats.damage = Math.round(newRarityEnemyStats.damage * BaseStats.rarities[i].damage/BaseStats.rarities[i-1].damage * 100)/100;
        if (Object.keys(smallerEnemies).includes(enemyName) && i < 8){
          newRarityEnemyStats.radius = Math.round(newRarityEnemyStats.radius  * ((BaseStats.rarities[i].radius/BaseStats.rarities[i-1].radius - 1)/smallerEnemies[enemyName] + 1) * 100)/100;
        }
        else{
          newRarityEnemyStats.radius = Math.round(newRarityEnemyStats.radius  * BaseStats.rarities[i].radius/BaseStats.rarities[i-1].radius * 100)/100;
        }
        newRarityEnemyStats.xp = Math.round(newRarityEnemyStats.xp  * BaseStats.rarities[i].xp/BaseStats.rarities[i-1].xp * 100)/100;
        newRarityEnemyStats.mass = Math.round(newRarityEnemyStats.mass * BaseStats.rarities[i].mass/BaseStats.rarities[i-1].mass * 100)/100;
        newRarityEnemyStats.detectionDistance = Math.round(newRarityEnemyStats.detectionDistance * BaseStats.rarities[i].detectionDistance/BaseStats.rarities[i-1].detectionDistance * 100)/100;
        
        if (newRarityEnemyStats.poison){
          newRarityEnemyStats.poison[0] = Math.round(newRarityEnemyStats.poison[0] * BaseStats.rarities[i].damage/BaseStats.rarities[i-1].damage * 100)/100;
          newRarityEnemyStats.poison[1] = Math.round(newRarityEnemyStats.poison[1] * BaseStats.rarities[i].damage/BaseStats.rarities[i-1].damage * 100)/100;
          
        }
        for(let j of Object.keys(Stats.enemies[enemyName][i-1])){
          if (BaseStats.enemies[enemyName]["override"] != undefined){
            if (BaseStats.enemies[enemyName]["override"][i] != undefined){
              if (Object.keys(BaseStats.enemies[enemyName]['override'][i]).includes(j)){
                newRarityEnemyStats[j] = BaseStats.enemies[enemyName]["override"][i][j]
              }
            }
          }
        }
        Stats.enemies[enemyName][i] = newRarityEnemyStats;
      }
    }
    let baseDrops = structuredClone(BaseStats.enemies[enemyName].drops);
    for(let i of Object.keys(baseDrops)){
      let newDrops = calculateDrops(baseDrops[i][0], baseDrops[i][1], baseDrops[i][2]);
      for(let j of Object.keys(Stats.enemies[enemyName])){
        if(newDrops[j] !== undefined) Stats.enemies[enemyName][j].drops[i] = newDrops[j];
        else Stats.enemies[enemyName][j].drops[i] = {};
      }
    }
  }
  
  
  for (let petalName of Object.keys(BaseStats.petals)) {
    if (petalName != "default") {
      let petalObject = BaseStats.petals[petalName];
      Stats.petals[petalName] = {};
      for (let i = 0; i < raritiesAmount; i++) {
        if (i == 0) {
          Stats.petals[petalName][i] = structuredClone(BaseStats.petals['default']);
          for (let j of Object.keys(petalObject)) {
            Stats.petals[petalName][i][j] = petalObject[j];

            if (pvp){
              if (petalObject["pvpOverride"] != undefined){
                if (petalObject["pvpOverride"][i] != undefined) {
                  if (Object.keys(petalObject["pvpOverride"][i]).includes(j)) {
                    if (petalObject.damageScalers.includes(j) || petalObject.healthScalers.includes(j)){
                      Stats.petals[petalName][i][j] *= petalObject["pvpOverride"][i][j];
                    }
                    else{
                      Stats.petals[petalName][i][j] = petalObject["pvpOverride"][i][j];
                    }
                  }
                }
              }
            }
            

          }
        } else {
          let damageMultiplier = BaseStats.rarities[i].petalDamage / BaseStats.rarities[i - 1].petalDamage
          let healthMultiplier = BaseStats.rarities[i].petalHealth / BaseStats.rarities[i - 1].petalHealth
          let healMultiplier = BaseStats.rarities[i].petalHeal / BaseStats.rarities[i - 1].petalHeal
          let massMultiplier = BaseStats.rarities[i].petalMass / BaseStats.rarities[i - 1].petalMass
          
  
          let newRarityPetalStats = {};
  
    
          
          for (let j of Object.keys(Stats.petals[petalName][i - 1])) {
            let scaler = false;
  
            if (petalObject.damageScalers.includes(j)) {
              scaler = true;
              newRarityPetalStats[j] = Math.round(Stats.petals[petalName][i - 1][j] * damageMultiplier * 100) / 100;
            } else if (petalObject.healthScalers.includes(j)) {
              scaler = true;
              newRarityPetalStats[j] = Math.round(Stats.petals[petalName][i - 1][j] * healthMultiplier * 100) / 100;
            } else if (petalObject.healScalers){
              if (petalObject.healScalers.includes(j)){
                scaler = true;
                newRarityPetalStats[j] = Math.round(Stats.petals[petalName][i - 1][j] * healMultiplier * 100) / 100;
              }
            } else if (petalObject.massScalers){
              if (petalObject.massScalers.includes(j)){
                scaler = true;
                newRarityPetalStats[j] = Math.round(Stats.petals[petalName][i - 1][j] * massMultiplier * 100) / 100;
              }
            }
            if (j == "poison") {
              newRarityPetalStats.poison = [];
              newRarityPetalStats.poison[0] = Math.round(Stats.petals[petalName][i - 1].poison[0] * damageMultiplier * 100) / 100;
              newRarityPetalStats.poison[1] = Math.round(Stats.petals[petalName][i - 1].poison[1] * damageMultiplier * 100) / 100;
            } else if (!scaler){
              newRarityPetalStats[j] = Stats.petals[petalName][i - 1][j];
            }
            if (!pvp){
              if (petalObject["override"] != undefined){
                if (petalObject["override"][i] != undefined) {
                  if (Object.keys(petalObject["override"][i]).includes(j)) {
                    if (petalObject.damageScalers.includes(j) || petalObject.healthScalers.includes(j)){
                      newRarityPetalStats[j] *= petalObject["override"][i][j];
                    }
                    else{
                      newRarityPetalStats[j] = petalObject["override"][i][j];
                    }
                  }
                }
              }
            }
            else{
              if (petalObject["pvpOverride"] != undefined){
                if (petalObject["pvpOverride"][i] != undefined) {
                  if (Object.keys(petalObject["pvpOverride"][i]).includes(j)) {
                    if (petalObject.damageScalers.includes(j) || petalObject.healthScalers.includes(j)){
                      newRarityPetalStats[j] *= petalObject["pvpOverride"][i][j];
                    }
                    else{
                      newRarityPetalStats[j] = petalObject["pvpOverride"][i][j];
                    }
                  }
                }
              }
              else{
                if (petalObject["override"] != undefined){
                  if (petalObject["override"][i] != undefined) {
                    if (Object.keys(petalObject["override"][i]).includes(j)) {
                      if (petalObject.damageScalers.includes(j) || petalObject.healthScalers.includes(j)){
                        newRarityPetalStats[j] *= petalObject["override"][i][j];
                      }
                      else{
                        newRarityPetalStats[j] = petalObject["override"][i][j];
                      }
                    }
                  }
                }
              }
            }
          }
          Stats.petals[petalName][i] = newRarityPetalStats;
        }
      }
    }
    if (BaseStats.petals[petalName].slowdown){
      let slowdown = JSON.parse(JSON.stringify(BaseStats.petals[petalName].slowdown));
      let balancedSlowdown = getSlowdown(slowdown);
      for(let j of Object.keys(Stats.petals[petalName])){
        if (pvp){
          Stats.petals[petalName][j].slowdown = balancedSlowdown[1];
        }
        else{
          Stats.petals[petalName][j].slowdown = balancedSlowdown[j];
        }
      }
    }
  }
  // console.log(BaseStats.enemies.drops.drops);
  // console.log(Stats.enemies.drops[3].drops);

  // generateEnemyStatsToSend();
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const alphabetUpper = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
const numbers = '0123456789'.split('');
const chars = alphabet.concat(alphabetUpper).concat(numbers);

const letterToNumber = {};

for(let i = 0; i < chars.length; i++){
  letterToNumber[chars[i]] = i;
}

function stringToNumberArray(str){
  return str.split('').map(a => letterToNumber[a]);
}

// PVP STATS
if(typeof window === 'undefined'){
  // make new stats
  const oldStats = Stats;
  const oldRarityStats = Stats.rarities;
  Stats.rarities = [Stats.rarities[0]];
  for(let i = 1; i < oldRarityStats.length; i++){
      Stats.rarities[i] = {};
      for(let key in oldRarityStats[i]){
          Stats.rarities[i][key] = Stats.rarities[i-1][key] * 1.15;
      }
      Stats.rarities[i].name = oldRarityStats[i].name;
  } 
  BaseStats.rarities = Stats.rarities;
  global.calculateStats(true);
  global.pvpStats = Stats;
  Stats = {
    petals: {},
    enemies: {},
    rarities: {}
  }
  
  Stats.rarities = BaseStats.rarities = oldRarityStats;
  global.calculateStats(false);
}


// SCRAPPED, stats.js now lives on the client side because sending a mb of data every single time is idiotic
// global.enemyStatsToSend = [];
// function generateEnemyStatsToSend() {
  
//   // console.log(Stats.enemies["Rock"][7].drops)
//   // global.enemyStatsToSend = [];

//   // calculating the size
  
//   global.enemyStatsToSend = new ArrayBuffer(8);
//   const view = new Float32Array(global.enemyStatsToSend);

//   let ind = 0;
  
// 	// we're also going to send enemy stats here
// 	for(let key in global.baseStats.enemies){
// 		const stats = global.baseStats.enemies[key];
// 		// global.enemyStatsToSend.push(key, stats.health, stats.damage, stats.speed, stats.mass);

//     const enemyRarities = Stats.enemies[key];
//     for(let key2 in enemyRarities){
//       // enemy stats of rarity key2 is enemyRarities[key2]
//       global.enemyStatsToSend.push(enemyRarities[key2].drops);
//     }
//     // so we'll end up pushing common drops, unusual drops, rare drops, ...
//     // ok this could actually end up being a lot larger than it was originally, hmm
// 	}
// }


// this exists in client util.js. If you modify this then modify util.js as well.
Stats.levelPerXp = (xp) => {
  // returns level (should be decimal)
 return 11.18213 * Math.log(0.000480827337943866 * (2080 + xp));
}

Stats.hpPerLevel = (level) => {
  // returns level
  let floored = Math.floor(level);
  return (floored**3/3600 + floored**2/25 + 4 * floored) ** 1.35 / 10 + 100;
  
  /*
  recommended values imo
  1: 100hp
  15: 140hp
  30: 200hp
  45: 270hp
  60: 430hp
  75: 800hp
  90: 1000hp
  100: 1100hp (cap)
  */
}

// this exists in client util.js. If you modify this then modify util.js client side as well.
Stats.basePetalSlots = 5;
Stats.petalSlotThresholds = [15, 30, 45, 60, 75, 1000];

Stats.validTypeAndRarity = (/*{type, rarity}*/obj) => {
  // we might be addPetal'ing these petals and we dont want any unnecessary keys that could potentially fuck things up
  if (typeof obj != 'object'){
    return false;
  }
  if (obj == null){
    return false;
  }
  if(Object.keys(obj).length !== 2){
    return false;
  }
  if (typeof obj.type != "string"){
    return false;
  }
  if (typeof obj.rarity != "number"){
    return false;
  }
  if(Stats.petals[obj.type] === undefined){
    return false;
  }
  if(Stats.petals[obj.type][obj.rarity] === undefined){
    return false;
  }
  return true;
}

// for ENEMIES
Stats.validEnemyTypeAndRarity = (/*{type, rarity}*/obj) => {
  // we might be addPetal'ing these petals and we dont want any unnecessary keys that could potentially fuck things up
  if(obj.toString === undefined) return false;
  if(Object.keys(obj).length !== 2){
    return false;
  }
  if(Stats.enemies[obj.type] === undefined){
    return false;
  }
  if(Stats.enemies[obj.type][obj.rarity] === undefined){
    return false;
  }
  return true;
}

// (for petals)
Stats.getPetalCustomBiome = global.getPetalCustomBiome = (type) => {
  if(type === "Basic") return undefined;
  return BaseStats.petals[type]?.customBiome;
}

if(typeof window === 'undefined')module.exports = {Stats, BaseStats};
