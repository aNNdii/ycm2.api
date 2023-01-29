import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { getPaginationArguments } from "../helpers/GraphQL";
import { getFlagsByFlagId } from "../helpers/Game";

import { MobAiFlag, MobBattleType, MobClickType, MobImmuneFlag, MobRaceFlag, MobRank, MobSize, MobType } from "../interfaces/Mob";
import { Empire } from "../interfaces/Empire";

import { IGraphQLContext } from "../entities/GraphQLContext";
import { IMob } from "../entities/Mob";

import { MobControllerToken } from "../controllers/MobController";
import { ItemControllerToken } from "../controllers/ItemController";

import GraphQLMobGroupMob from "./MobGroupMob";
import GraphQLMobItem from "./MobItem";
import GraphQLItem from "./Item";

const GraphQLMob: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mob',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (mob: IMob) => mob.id
    },
    name: {
      type: GraphQLString,
      args: {
        locale: { type: GraphQLBoolean }
      },
      resolve: (mob: IMob, args: any) => {
        const { locale } = args || {}
        return locale ? mob.localeName : mob.name
      }
    },
    rank: {
      type: GraphQLString,
      resolve: (mob: IMob) => MobRank[mob.rank]?.toLowerCase()
    },
    type: {
      type: GraphQLString,
      resolve: (mob: IMob) => MobType[mob.type]?.toLowerCase()
    },
    battleType: {
      type: GraphQLString,
      resolve: (mob: IMob) => MobBattleType[mob.battleType]?.toLowerCase()
    },
    level: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.level
    },
    scalePercent: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.scalePercent
    },
    size: {
      type: GraphQLString,
      resolve: (mob: IMob) => MobSize[mob.size]?.toLowerCase()
    },
    aiFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (mob: IMob) => getFlagsByFlagId(MobAiFlag, mob.aiFlagId).map(f => f.toLowerCase())
    },
    raceFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (mob: IMob) => getFlagsByFlagId(MobRaceFlag, mob.raceFlagId).map(f => f.toLowerCase())
    },
    immuneFlags: {
      type: new GraphQLList(GraphQLString),
      resolve: (mob: IMob) => getFlagsByFlagId(MobImmuneFlag, mob.immuneFlagId).map(f => f.toLowerCase())
    },
    empire: {
      type: GraphQLString,
      resolve: (mob: IMob) => Empire[mob.empireId]?.toLowerCase()
    },
    folder: {
      type: GraphQLString,
      resolve: (mob: IMob) => mob.folder
    },
    clickType: {
      type: GraphQLString,
      resolve: (mob: IMob) => MobClickType[mob.clickType]?.toLowerCase()
    },
    strength: {
      type: GraphQLInt,
      args: {
        sungMa: { type: GraphQLBoolean }
      },
      resolve: (mob: IMob, args: any) => {
        const { sungMa } = args || {}
        return sungMa ? mob.sungMaStrength : mob.strength
      }
    },
    dexterity: {
      type: GraphQLInt,
      args: {
        sungMa: { type: GraphQLBoolean }
      },
      resolve: (mob: IMob, args: any) => {
        const { sungMa } = args || {}
        return sungMa ? mob.sungMaDexterity : mob.dexterity
      }
    },
    health: {
      type: GraphQLInt,
      args: {
        sungMa: { type: GraphQLBoolean }
      },
      resolve: (mob: IMob, args: any) => {
        const { sungMa } = args || {}
        return sungMa ? mob.sungMaHealth : mob.health
      }
    },
    intelligence: {
      type: GraphQLInt,
      args: {
        sungMa: { type: GraphQLBoolean }
      },
      resolve: (mob: IMob, args: any) => {
        const { sungMa } = args || {}
        return sungMa ? mob.sungMaIntelligence : mob.intelligence
      }
    },
    experience: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.experience
    },
    defense: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.defense
    },
    attackSpeed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attackSpeed
    },
    movementSpeed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.movementSpeed
    },
    minDamage: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.minDamage
    },
    maxDamage: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.maxDamage
    },
    maxHealth: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.maxHealth
    },
    minMoney: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.minMoney
    },
    maxMoney: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.maxMoney
    },
    regenerationCycle: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.regenerationCycle
    },
    regenerationPercent: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.regenerationPercent
    },
    aggressiveHealthPercent: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.aggressiveHealthPercent
    },
    aggressiveSight: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.aggressiveSight
    },
    attackRange: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attackRange
    },
    resurrectionMob: {
      type: GraphQLMob,
      resolve: (mob: IMob, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mob.resurrectionMobId ? mobController.getMobById(mob.resurrectionMobId, context) : null
      }
    },
    enchantCurse: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantCurse
    },
    enchantSlow: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantSlow
    },
    enchantPoison: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantPoison
    },
    enchantStun: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantStun
    },
    enchantCritical: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantCritical
    },
    enchantPenetrate: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.enchantPenetrate
    },
    resistanceFist: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceFist
    },
    resistanceSword: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceSword
    },
    resistanceTwoHand: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceTwoHand
    },
    resistanceDagger: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceDagger
    },
    resistanceBell: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceBell
    },
    resistanceFan: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceFan
    },
    resistanceBow: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceBow
    },
    resistanceClaw: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceClaw
    },
    resistanceFire: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceFire
    },
    resistanceElectric: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceElectric
    },
    resistanceMagic: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceMagic
    },
    resistanceWind: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceWind
    },
    resistancePoison: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistancePoison
    },
    resistanceBleed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceBleed
    },
    resistanceDark: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceDark
    },
    resistanceIce: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceIce
    },
    resistanceEarth: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.resistanceEarth
    },
    attributeElectric: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attributeElectric
    },
    attributeFire: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attributeFire
    },
    attributeIce: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attributeIce
    },
    attributeWind: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attributeWind
    },
    attributeEarth: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.attributeEarth
    },
    damageMultiplier: {
      type: GraphQLFloat,
      resolve: (mob: IMob) => mob.damageMultiplier
    },
    summonMob: {
      type: GraphQLMob,
      resolve: (mob: IMob, args: any, context: IGraphQLContext) => {
        const mobController = Container.get(MobControllerToken)
        return mob.summonMobId ? mobController.getMobById(mob.summonMobId, context) : null
      }
    },
    color: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.color
    },
    polymorphItem: {
      type: GraphQLItem,
      resolve: (mob: IMob, args: any, context: IGraphQLContext) => {
        const itemController = Container.get(ItemControllerToken)
        return mob.polymorphItemId ? itemController.getItemById(mob.polymorphItemId, context) : null
      }
    },
    drain: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.drain
    },
    berserk: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.berserk
    },
    stoneSkin: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.stoneSkin
    },
    godSpeed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.godSpeed
    },
    deathBlow: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.deathBlow
    },
    revive: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.revive
    },
    heal: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.heal
    },
    rangeAttackSpeed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.rangeAttackSpeed
    },
    rangeCastSpeed: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.rangeCastSpeed
    },
    healthRegeneration: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.healthRegeneration
    },
    hitRange: {
      type: GraphQLInt,
      resolve: (mob: IMob) => mob.hitRange
    },
    items: {
      type: new GraphQLList(GraphQLMobItem),
      resolve: (mob: IMob, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobItemsByMobId(mob.id)
    },
    groups: {
      type: new GraphQLList(GraphQLMobGroupMob),
      resolve: (mob: IMob, args: any, context: IGraphQLContext) => context.dataLoaderService.getMobGroupMobsByMobId(mob.id)
    },
    createdDate: {
      type: GraphQLString,
      resolve: (mob: IMob) => new Date(mob.createdDate).toISOString()
    },
    modifiedDate: {
      type: GraphQLString,
      resolve: (mob: IMob) => new Date(mob.modifiedDate).toISOString()
    }
  })
})

export default GraphQLMob