import { EntityTable } from "./Entity";
import { MobAiFlag, MobBattleType, MobElementType, MobImmuneFlag, MobItemType, MobRaceFlag, MobRank, MobResistance, MobSize, MobType } from "./Mob";

export type GameMobTable = EntityTable & {
  vnum: number
  name: string
  locale_name: string
  rank: number
  type: number
  battle_type: number
  level: number
  size: number
  ai_flag: string
  mount_capacity: number
  setRaceFlag: string
  setImmuneFlag: string
  empire: number
  folder: string
  on_click: number
  st: number
  dx: number
  ht: number
  iq: number
  damage_min: number
  damage_max: number
  max_hp: number
  regen_cycle: number
  regen_percent: number
  gold_min: number
  gold_max: number
  exp: number
  def: number
  attack_speed: number
  move_speed: number
  aggressive_hp_pct: number
  aggressive_sight: number
  attack_range: number
  drop_item: number
  resurrection_vnum: number
  enchant_curse: number
  enchant_slow: number
  enchant_poison: number
  enchant_stun: number
  enchant_critical: number
  enchant_penetrate: number
  resist_sword: number
  resist_twohand: number
  resist_dagger: number
  resist_bell: number
  resist_fan: number
  resist_bow: number
  resist_fire: number
  resist_elect: number
  resist_magic: number
  resist_wind: number
  resist_poison: number
  dam_multiply: number
  summon: number
  drain_sp: number
  mob_color: number
  polymorph_item: number
  skill_level0: number
  skill_vnum0: number
  skill_level1: number
  skill_vnum1: number
  skill_level2: number
  skill_vnum2: number
  skill_level3: number
  skill_vnum3: number
  skill_level4: number
  skill_vnum4: number
  sp_berserk: number
  sp_stoneskin: number
  sp_godspeed: number
  sp_deathblow: number
  sp_revive: number
}

export enum GameMobProtoFormat {
  DEFAULT,
  VERSION_2022
}

export enum GameMobProtoRank {
  PAWN = MobRank.PAWN,
  S_PAWN = MobRank.SUPER_PAWN,
  KNIGHT = MobRank.KNIGHT,
  S_KNIGHT = MobRank.SUPER_KNIGHT,
  BOSS = MobRank.BOSS,
  KING = MobRank.KING
}

export enum GameMobProtoType {
  MONSTER = MobType.MONSTER,
  NPC = MobType.NPC,
  STONE = MobType.STONE,
  WARP = MobType.WARP,
  DOOR = MobType.DOOR,
  BUILDING = MobType.BUILDING,
  PC = MobType.PC,
  POLYMORPH_PC = MobType.POLYMORPH_PC,
  HORSE = MobType.HORSE,
  GOTO = MobType.GOTO,
  
  // VERSION 2022
  // PET = MobType.PET,
  // PET_PAY = MobType.PET_PAY,
  // PREMIUM_SHOP = MobType.PREMIUM_SHOP
}

export enum GameMobProtoBattleType {
  MELEE = MobBattleType.MELEE,
  RANGE = MobBattleType.RANGE,
  MAGIC = MobBattleType.MAGIC,
  SPECIAL = MobBattleType.SPECIAL,
  POWER = MobBattleType.POWER,
  TANKER = MobBattleType.TANKER,
  SUPER_POWER = MobBattleType.SUPER_POWER,
  SUPER_TANKER = MobBattleType.SUPER_TANKER
}

export enum GameMobProtoSize {
  SMALL = MobSize.SMALL,
  MEDIUM = MobSize.MEDIUM,
  BIG = MobSize.LARGE
}

export enum GameMobProtoAiFlag {
  AGGR = MobAiFlag.AGGRESSIVE,
  NOMOVE = MobAiFlag.NO_MOVE,
  COWARD = MobAiFlag.COWARD,
  NOATTSHINSU = MobAiFlag.NO_ATTACK_EMPIRE_1,
  NOATTCHUNJO = MobAiFlag.NO_ATTACK_EMPIRE_2,
  NOATTJINNO = MobAiFlag.NO_ATTACK_EMPIRE_3,
  ATTMOB = MobAiFlag.ATTACK_MOB,
  BERSERK = MobAiFlag.BERSERK,
  STONESKIN = MobAiFlag.STONE_SKIN,
  GODSPEED = MobAiFlag.GOD_SPEED,
  DEATHBLOW = MobAiFlag.DEATH_BLOW,
  REVIVE = MobAiFlag.REVIVE,

  // VERSION 2022
  // HEALER = MobAiFlag.HEALER,
  // COUNT = MobAiFlag.COUNT,
  // NORECOVERY = MobAiFlag.NO_RECOVERY,
  // REFLECT = MobAiFlag.REFLECT,
  // FALL = MobAiFlag.FALL,
  // VIT = MobAiFlag.VIT,
  // RATTSPEED = MobAiFlag.RANGE_ATTACK_SPEED,
  // RCASTSPEED = MobAiFlag.RANGE_CAST_SPEED,
  // AIFLAG_RHP_REGEN = MobAiFlag.AI_FLAG_HEALTH_REGENERATION,
  // AIFLAG_TIMEVIT = MobAiFlag.AI_FLAG_TIME_VIT,
  // UNK_AI_FLAG22 = MobAiFlag.UNKNOWN22,
  // UNK_AI_FLAG23 = MobAiFlag.UNKNOWN23,
  // UNK_AI_FLAG24 = MobAiFlag.UNKNOWN24,
  // UNK_AI_FLAG25 = MobAiFlag.UNKNOWN25,
}

export enum GameMobProtoRaceFlag {
  ANIMAL = MobRaceFlag.ANIMAL,
  UNDEAD = MobRaceFlag.UNDEAD,
  DEVIL = MobRaceFlag.DEVIL,
  HUMAN = MobRaceFlag.HUMAN,
  ORC = MobRaceFlag.ORC,
  MILGYO = MobRaceFlag.MILGYO,
  INSECT = MobRaceFlag.INSECT,
  FIRE = MobRaceFlag.FIRE,
  ICE = MobRaceFlag.ICE,
  DESERT = MobRaceFlag.DESERT,
  TREE = MobRaceFlag.TREE,
  ATT_ELEC = MobRaceFlag.ELECTRIC,
  ATT_FIRE = MobRaceFlag.FIRE_2,
  ATT_ICE = MobRaceFlag.ICE_2,
  ATT_WIND = MobRaceFlag.WIND,
  ATT_EARTH = MobRaceFlag.EARTH,
  ATT_DARK = MobRaceFlag.DARK,
}

export enum GameMobProtoImmuneFlag {
  STUN = MobImmuneFlag.STUN,
  SLOW = MobImmuneFlag.SLOW,
  FALL = MobImmuneFlag.FALL,
  CURSE = MobImmuneFlag.CURSE,
  POISON = MobImmuneFlag.POISON,
  TERROR = MobImmuneFlag.TERROR,
  REFLECT = MobImmuneFlag.REFLECT,
}

export enum GameMobProtoResistance {
  MOB_RESIST_FIST = MobResistance.FIST,
  MOB_RESIST_SWORD = MobResistance.SWORD,
  MOB_RESIST_TWOHAND = MobResistance.TWO_HAND,
  MOB_RESIST_DAGGER = MobResistance.DAGGER,
  MOB_RESIST_BELL = MobResistance.BELL,
  MOB_RESIST_FAN = MobResistance.FAN,
  MOB_RESIST_BOW = MobResistance.BOW,
  MOB_RESIST_CLAW = MobResistance.CLAW,
  MOB_RESIST_FIRE = MobResistance.FIRE,
  MOB_RESIST_ELECT = MobResistance.ELECTRIC,
  MOB_RESIST_MAGIC = MobResistance.MAGIC,
  MOB_RESIST_WIND = MobResistance.WIND,
  MOB_RESIST_POISON = MobResistance.POISON,
  MOB_RESIST_BLEEDING = MobResistance.BLEEDING,
}

export enum GameMobProtoElementalType {
  MOB_ELEMENTAL_ELEC = MobElementType.ELECTRIC,
  MOB_ELEMENTAL_FIRE = MobElementType.FIRE,
  MOB_ELEMENTAL_ICE = MobElementType.ICE,
  MOB_ELEMENTAL_WIND = MobElementType.WIND,
  MOB_ELEMENTAL_EARTH = MobElementType.EARTH,
  MOB_ELEMENTAL_DARK = MobElementType.DARK,
}

export enum GameMobItemType {
  DROP = MobItemType.DEFAULT,
  KILL = MobItemType.DELTA,
  LIMIT = MobItemType.LEVEL_LIMIT,
  THIEFGLOVES = MobItemType.THIEF_GLOVES
}