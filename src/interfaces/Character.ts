import { EntityTable } from "./Entity";

export enum CharacterJob {
  WARRIOR_MALE = 0,
  WARRIOR_FEMALE = 4,

  ASSASSIN_FEMALE = 1,
  ASSASSIN_MALE = 5,

  SURA_MALE = 2,
  SURA_FEMALE = 6,

  SHAMAN_FEMALE = 3,
  SHAMAN_MALE = 7
}

export enum CharacterRace {
  WARRIOR,
  ASSASSIN,
  SURA,
  SHAMAN
}

export enum CharacterSex {
  MALE,
  FEMALE
}

export enum CharacterSkillMastery {
  NONE,
  MASTER,
  GRAND_MASTER,
  PERFECT_MASTER
}

export enum CharacterQuickSlotType {
  NONE,
	ITEM,
	SKILL,
	COMMAND,
	MAX_NUM,
}

export enum CharacterSkill {
  WARRIOR_1_1 = 1,
  WARRIOR_1_2 = 2,
  WARRIOR_1_3 = 3,
  WARRIOR_1_4 = 4,
  WARRIOR_1_5 = 5,

  WARRIOR_2_1 = 16,
  WARRIOR_2_2 = 17,
  WARRIOR_2_3 = 18,
  WARRIOR_2_4 = 19,
  WARRIOR_2_5 = 20,

  ASSASSIN_1_1 = 31,
  ASSASSIN_1_2 = 32,
  ASSASSIN_1_3 = 33,
  ASSASSIN_1_4 = 34,
  ASSASSIN_1_5 = 35,

  ASSASSIN_2_1 = 46,
  ASSASSIN_2_2 = 47,
  ASSASSIN_2_3 = 48,
  ASSASSIN_2_4 = 48,
  ASSASSIN_2_5 = 49,

  SURA_1_1 = 61,
  SURA_1_2 = 62,
  SURA_1_3 = 63,
  SURA_1_4 = 64,
  SURA_1_5 = 65,
  SURA_1_6 = 66,

  SURA_2_1 = 76,
  SURA_2_2 = 77,
  SURA_2_3 = 78,
  SURA_2_4 = 79,
  SURA_2_5 = 80,
  SURA_2_6 = 81,

  SHAMAN_1_1 = 91,
  SHAMAN_1_2 = 92,
  SHAMAN_1_3 = 93,
  SHAMAN_1_4 = 94,
  SHAMAN_1_5 = 95,
  SHAMAN_1_6 = 96,

  SHAMAN_2_1 = 106,
  SHAMAN_2_2 = 107,
  SHAMAN_2_3 = 108,
  SHAMAN_2_4 = 109,
  SHAMAN_2_5 = 110,
  SHAMAN_2_6 = 111,

  LEADERSHIP = 121,
  COMBO = 122,
  FISHING = 123,
  MINING = 124,
  LANGUAGE_RED = 126,
  LANGUAGE_YELLOW = 127,
  LANGUAGE_BLUE = 128,
  POLYMORPH = 129,
  HORSE = 130,
  HORSE_SUMMON = 131,

  HORSE_WILD_ATTACK = 137,
  HORSE_CHARGE = 138,
  HORSE_ESCAPE = 139,
  HORSE_WILD_ATTACK_RANGE = 140,
}

export type CharacterTable = EntityTable & {
  id: number
  account_id: number
  name: string
  job: number
  x: number
  y: number
  map_index: number
  exit_x: number
  exit_y: number
  exit_map_index: number
  hp: number
  mp: number
  stamina: number
  random_hp: number
  random_sp: number
  playtime: number
  level: number
  level_step: number
  st: number
  ht: number
  dx: number
  iq: number
  exp: number
  gold: number
  stat_point: number
  skill_point: number
  sub_skill_point: number
  alignment: number
  last_play: string
  ip: string
  part_main: number
  part_base: number
  part_hair: number
  skill_group: number
  skill_level: any
  quickslot: any
  horse_hp: number
  horse_stamina: number
  horse_level: number
  horse_hp_droptime: number
  horse_riding: number
  horse_skill_point: number
  bank_value: number
}

export type CharacterEmpireTable = EntityTable & {
  id: number
  pid1: number
  pid2: number
  pid3: number
  pid4: number
  empire: number
}