import { EntityFilter, EntityTable } from "./Entity";

export type MobTable = EntityTable & {
  mob_id: number
  mob_name: string
  mob_locale_name: string
  mob_rank: number
  mob_type: number
  mob_battle_type: number
  mob_level: number
  mob_scale_percent: number
  mob_size: number
  mob_mount: number // Not used
  mob_ai_flag_id: number
  mob_race_flag_id: number
  mob_immune_flag_id: number
  mob_empire_id: number
  mob_folder: string
  mob_click_type: number
  mob_strength: number
  mob_dexterity: number
  mob_health: number
  mob_intelligence: number
  mob_experience: number
  mob_sung_ma_strength: number
  mob_sung_ma_dexterity: number
  mob_sung_ma_health: number
  mob_sung_ma_intelligence: number
  mob_sung_ma_experience: number
  mob_defense: number
  mob_attack_speed: number
  mob_attack_range: number
  mob_movement_speed: number
  mob_damage_min: number
  mob_damage_max: number
  mob_money_min: number
  mob_money_max: number
  mob_regeneration_cycle: number
  mob_regeneration_percent: number
  mob_aggressive_health_percent: number
  mob_aggressive_sight: number
  mob_resurrection_mob_id: number
  mob_enchant_curse: number
  mob_enchant_slow: number
  mob_enchant_poison: number
  mob_enchant_stun: number
  mob_enchant_critical: number
  mob_enchant_penetrate: number
  mob_resistance_fist: number
  mob_resistance_sword: number
  mob_resistance_two_hand: number
  mob_resistance_dagger: number
  mob_resistance_bell: number
  mob_resistance_fan: number
  mob_resistance_bow: number
  mob_resistance_claw: number
  mob_resistance_fire: number
  mob_resistance_electric: number
  mob_resistance_magic: number
  mob_resistance_wind: number
  mob_resistance_poison: number
  mob_resistance_bleed: number
  mob_resistance_dark: number
  mob_resistance_ice: number
  mob_resistance_earth: number
  mob_attribute_electric: number
  mob_attribute_fire: number
  mob_attribute_ice: number
  mob_attribute_wind: number
  mob_attribute_earth: number
  mob_attribute_dark: number
  mob_damage_multiplier: number
  mob_summon_mob_id: number
  mob_color: number // Not used
  mob_polymorph_item_id: number
  mob_skill_id0: number
  mob_skill_level0: number
  mob_skill_id1: number
  mob_skill_level1: number
  mob_skill_id2: number
  mob_skill_level2: number
  mob_skill_id3: number
  mob_skill_level3: number
  mob_skill_id4: number
  mob_skill_level4: number
  mob_drain: number
  mob_berserk: number
  mob_stone_skin: number
  mob_god_speed: number
  mob_death_blow: number
  mob_revive: number
  mob_heal: number
  mob_range_attack_speed: number
  mob_range_cast_speed: number
  mob_health_max: number
  mob_health_regeneration: number
  mob_hit_range: number
  mob_created_date: string
  mob_modified_date: string
}

export type MobItemTable = EntityTable & {
  mob_item_id?: number
  mob_item_mob_id?: number
  mob_item_type?: number
  mob_item_level_limit?: number
  mob_item_delta?: number
  mob_item_item_id?: number
  mob_item_quantity?: number
  mob_item_probability?: number
  mob_item_rare_probability?: number
  mob_item_created_date?: string
  mob_item_modified_date?: string
}

export type MobRankItemTable = EntityTable & {
  mob_rank_item_id?: number
  mob_rank_item_mob_rank?: number
  mob_rank_item_item_id?: number
  mob_rank_item_level_min?: number
  mob_rank_item_level_max?: number
  mob_rank_item_probability?: number
  mob_rank_item_created_date?: string
  mob_rank_item_modified_date?: string
}

export type MobGroupTable = EntityTable & {
  mob_group_id?: number
  mob_group_name?: string
  mob_group_created_date?: string
  mob_group_modified_date?: string
}

export type MobGroupMobTable = EntityTable & {
  mob_group_mob_id?: number
  mob_group_mob_mob_group_id?: number
  mob_group_mob_mob_id?: number
  mob_group_mob_leader?: number
  mob_group_mob_created_date?: string
  mob_group_mob_modified_date?: string
}

export type MobGroupGroupTable = EntityTable & {
  mob_group_group_id?: number
  mob_group_group_name?: string
  mob_group_group_created_date?: string
  mob_group_group_modified_date?: string
}

export type MobGroupGroupMobGroupTable = EntityTable & {
  mob_group_group_mob_group_id?: number
  mob_group_group_mob_group_mob_group_group_id?: number
  mob_group_group_mob_group_mob_group_id?: number
  mob_group_group_mob_group_probability?: number
  mob_group_group_mob_group_created_date?: string
  mob_group_group_mob_group_modified_date?: string
}

export enum MobRank {
  PAWN,
  SUPER_PAWN,
  KNIGHT,
  SUPER_KNIGHT,
  BOSS,
  KING
}

export enum MobType {
  MONSTER,
  NPC,
  STONE,
  WARP,
  DOOR,
  BUILDING,
  PC,
  POLYMORPH_PC,
  HORSE,
  GOTO,
  PET,
  PET_PAY,
  PREMIUM_SHOP
}

export enum MobBattleType {
  MELEE,
  RANGE,
  MAGIC,
  SPECIAL,
  POWER,
  TANKER,
  SUPER_POWER,
  SUPER_TANKER
}

export enum MobSize {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3
}

export enum MobAiFlag {
  AGGRESSIVE = (1 << 0),
  NO_MOVE = (1 << 1),
  COWARD = (1 << 2),
  NO_ATTACK_EMPIRE_1 = (1 << 3),
  NO_ATTACK_EMPIRE_2 = (1 << 4),
  NO_ATTACK_EMPIRE_3 = (1 << 5),
  ATTACK_MOB = (1 << 6),
  BERSERK = (1 << 7),
  STONE_SKIN = (1 << 8),
  GOD_SPEED = (1 << 9),
  DEATH_BLOW = (1 << 10),
  REVIVE = (1 << 11),
  HEALER = (1 << 12),
  COUNT = (1 << 13),
  NO_RECOVERY = (1 << 14),
  REFLECT = (1 << 15),
  FALL = (1 << 16),
  VIT = (1 << 17),
  RANGE_ATTACK_SPEED = (1 << 18),
  RANGE_CAST_SPEED = (1 << 19),
  AI_FLAG_HEALTH_REGENERATION = (1 << 20),
  AI_FLAG_TIME_VIT = (1 << 21),
  UNKNOWN22 = (1 << 22),
  UNKNOWN23 = (1 << 23),
  UNKNOWN24 = (1 << 24),
  UNKNOWN25 = (1 << 25),
}

// export enum MobRaceFlag {
//   ANIMAL = (1 << 0),
//   UNDEAD = (1 << 1),
//   DEVIL = (1 << 2),
//   HUMAN = (1 << 3),
//   ORC = (1 << 4),
//   MILGYO = (1 << 5),
//   INSECT = (1 << 6),
//   DESERT = (1 << 7),
//   TREE = (1 << 8),
//   DECO = (1 << 9),
//   HIDE = (1 << 10),
//   ZODIAC = (1 << 11),
//   AWEAKEN = (1 << 12),
//   SUNGMAHEE = (1 << 13),
//   OUTPOST = (1 << 14)
// }

export enum MobRaceFlag {
  ANIMAL = (1 << 0),
  UNDEAD = (1 << 1),
  DEVIL = (1 << 2),
  HUMAN = (1 << 3),
  ORC = (1 << 4),
  MILGYO = (1 << 5),
  INSECT = (1 << 6),
  FIRE = (1 << 7),
  ICE = (1 << 8),
  DESERT = (1 << 9),
  TREE = (1 << 10),
  ELECTRIC = (1 << 11),
  FIRE_2 = (1 << 12),
  ICE_2 = (1 << 13),
  WIND = (1 << 14),
  EARTH = (1 << 15),
  DARK = (1 << 16)
}

export enum MobImmuneFlag {
  STUN = (1 << 0),
  SLOW = (1 << 1),
  FALL = (1 << 2),
  CURSE = (1 << 3),
  POISON = (1 << 4),
  TERROR = (1 << 5),
  REFLECT = (1 << 6),
}

export enum MobResistance {
  FIST = 1,
  SWORD,
  TWO_HAND,
  DAGGER,
  BELL,
  FAN,
  BOW,
  CLAW,
  FIRE,
  ELECTRIC,
  MAGIC,
  WIND,
  POISON,
  BLEEDING,
}

export enum MobElementType {
  ELECTRIC = 1,
  FIRE,
  ICE,
  WIND,
  EARTH,
  DARK
}

export enum MobClickType {
  NONE,
  SHOP,
  TALK
}

export enum MobItemType {
  DEFAULT,
  DELTA,
  LEVEL_LIMIT,
  THIEF_GLOVES
}