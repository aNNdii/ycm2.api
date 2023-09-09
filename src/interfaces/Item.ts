import { EntityTable } from "./Entity";

export type ItemTable = EntityTable & {
  item_id: number
  item_name: string
  item_locale_name: string
  item_end_id: number
  item_type: ItemType
  item_subtype: number
  item_size: number
  item_flag_id: number
  item_anti_flag_id: number
  item_wear_flag_id: number
  item_immune_flag_id: number
  item_shop_buy_price: number
  item_shop_sell_price: number
  item_refine_id: number
  item_refine_item_id: number
  item_attribute_probability: number
  item_limit_type0: ItemLimitType
  item_limit_value0: number
  item_limit_type1: ItemLimitType
  item_limit_value1: number
  item_attribute0: ItemAttribute
  item_attribute_value0: number
  item_attribute1: ItemAttribute
  item_attribute_value1: number
  item_attribute2: ItemAttribute
  item_attribute_value2: number
  item_attribute3: ItemAttribute
  item_attribute_value3: number
  item_value0: number
  item_value1: number
  item_value2: number
  item_value3: number
  item_value4: number
  item_value5: number
  item_socket0: number
  item_socket1: number
  item_socket2: number
  item_socket3: number
  item_socket4: number
  item_socket5: number
  item_specular_percent: number
  item_socket_count: number
  item_attribute_type: number
  item_mask_type: number
  item_mask_subtype: number
  item_refine_element_apply_type: number
  item_refine_element_grade: number
  item_refine_element_value: number
  item_refine_element_bonus: number
  item_rare_attribute_item_id: number
  item_icon: string
  item_model: string
  item_blend_attribute: ItemAttribute
  item_blend_attribute_value0: number
  item_blend_attribute_duration0: number
  item_blend_attribute_value1: number
  item_blend_attribute_duration1: number
  item_blend_attribute_value2: number
  item_blend_attribute_duration2: number
  item_blend_attribute_value3: number
  item_blend_attribute_duration3: number
  item_blend_attribute_value4: number
  item_blend_attribute_duration4: number
  item_special_type: ItemSpecialType
  item_special_effect: string
  item_created_date: string
  item_modified_date: string
}

export type ItemSpecialActionTable = EntityTable & {
  item_special_action_id: number
  item_special_action_parent_item_id: number
  item_special_action_type: number
  item_special_action_item_id: number
  item_special_action_mob_id: number
  item_special_action_mob_group_id: number
  item_special_action_attribute: number
  item_special_action_quantity: number
  item_special_action_probability: number
  item_special_action_rare_probability: number
  item_special_action_created_date: string
  item_special_action_modified_date: string
}

export type ItemCraftingTable = EntityTable & {
  item_crafting_id: number
  item_crafting_mob_id: number
  item_crafting_item_id: number
  item_crafting_item_quantity: number
  item_crafting_price: number
  item_crafting_probability: number
  item_crafting_created_date: string
  item_crafting_modified_date: string
}

export type ItemCraftingItemTable = EntityTable & {
  item_crafting_item_id: number
  item_crafting_item_item_crafting_id: number
  item_crafting_item_item_id: number
  item_crafting_item_quantity: number
  item_crafting_item_created_date: string
  item_crafting_item_modified_date: string
}

export enum ItemSpecialType {
  DEFAULT,
  MULTIPLE,
  QUEST,
  SPECIAL,
  ATTRIBUTE
}

export enum ItemSpecialActionType {
  ITEM = 1,
  EXP,
  MOB,
  MOB_GROUP,
  SLOW,
  POISON,
  DRAIN_HP,
  ATTRIBUTE
}

/*****************************************************************************
 * Type
 *****************************************************************************/
export enum ItemType {
  NONE = 0,
  WEAPON = 1,
  ARMOR = 2,
  USE = 3,
  AUTOUSE = 4,
  MATERIAL = 5,
  SPECIAL = 6,
  TOOL = 7,
  LOTTERY = 8,
  ELK = 9,
  METIN = 10,
  CONTAINER = 11,
  FISH = 12,
  ROD = 13,
  RESOURCE = 14,
  CAMPFIRE = 15,
  UNIQUE = 16,
  SKILLBOOK = 17,
  QUEST = 18,
  POLYMORPH = 19,
  TREASURE_BOX = 20,
  TREASURE_KEY = 21,
  SKILLFORGET = 22,
  GIFTBOX = 23,
  PICK = 24,
  HAIR = 25,
  TOTEM = 26,
  BLEND = 27,
  COSTUME = 28,
  DRAGON_SOUL = 29,
  SPECIAL_DRAGON_SOUL = 30,
  EXTRACT = 31,
  SECONDARY_COIN = 32,
  RING = 33,
  BELT = 34,
  PET = 35,
  MEDIUM = 36,
  GACHA = 37,
  SOUL = 38,
  PASSIVE = 39,
  MERCENARY = 40,
  UNKNOWN_41 = 41
}


/*****************************************************************************
 * SubType
 *****************************************************************************/
export enum ItemTypeWeapon {
  SWORD = 0,
  DAGGER = 1,
  BOW = 2,
  TWO_HANDED = 3,
  BELL = 4,
  FAN = 5,
  ARROW = 6,
  MOUNT_SPEAR = 7,
  CLAW = 8,
  QUIVER = 9,
  BOUQUET = 10,
}

export enum ItemTypeArmor {
  BODY = 0,
  HEAD = 1,
  SHIELD = 2,
  WRIST = 3,
  FOOTS = 4,
  NECK = 5,
  EAR = 6,
  PENDANT = 7,
  GLOVE = 8,
}

export enum ItemTypeUse {
  POTION = 0,
  TALISMAN = 1,
  TUNING = 2,
  MOVE = 3,
  TREASURE_BOX = 4,
  MONEYBAG = 5,
  BAIT = 6,
  ABILITY_UP = 7,
  AFFECT = 8,
  CREATE_STONE = 9,
  SPECIAL = 10,
  POTION_NODELAY = 11,
  CLEAR = 12,
  INVISIBILITY = 13,
  DETACHMENT = 14,
  BUCKET = 15,
  POTION_CONTINUE = 16,
  CLEAN_SOCKET = 17,
  CHANGE_ATTRIBUTE = 18,
  ADD_ATTRIBUTE = 19,
  ADD_ACCESSORY_SOCKET = 20,
  PUT_INTO_ACCESSORY_SOCKET = 21,
  ADD_ATTRIBUTE2 = 22,
  RECIPE = 23,
  CHANGE_ATTRIBUTE2 = 24,
  BIND = 25,
  UNBIND = 26,
  TIME_CHARGE_PER = 27,
  TIME_CHARGE_FIX = 28,
  PUT_INTO_BELT_SOCKET = 29,
  PUT_INTO_RING_SOCKET = 30,
  CHANGE_COSTUME_ATTR = 31,
  RESET_COSTUME_ATTR = 32,
  // UNKNOWN                                       = 33,
  SELECT_ATTRIBUTE = 34,
  // UNKNOWN                                       = 35,
  EMOTION_PACK = 36,
  ELEMENT_UPGRADE = 37,
  ELEMENT_DOWNGRADE = 38,
  ELEMENT_CHANGE = 39,
  CALL = 40,
  POTION_TOWER = 41,
  POTION_NODELAY_TOWER = 42,
  REMOVE_AFFECT = 43,
  EMOTION_TOWER = 44,
  SECRET_DUNGEON_SCROLL = 45,
}

export enum ItemTypeMaterial {
  LEATHER = 0,
  BLOOD = 1,
  ROOT = 2,
  NEEDLE = 3,
  JEWEL = 4,
  DRAGON_SOUL_REFINE_NORMAL = 5,
  DRAGON_SOUL_REFINE_BLESSED = 6,
  DRAGON_SOUL_REFINE_HOLLY = 7,
  DRAGON_SOUL_CHANGE_ATTR = 8,
  PASSIVE_WEAPON = 9,
  PASSIVE_ARMOR = 10,
  PASSIVE_ACCE = 11,
  PASSIVE_ELEMENT = 12,

}

export enum ItemTypeSpecial {
  MAP = 0,
  KEY = 1,
  DOC = 2,
  SPIRIT = 3,
}

export enum ItemTypeLottery {
  TICKET = 0,
  INSTANT = 1,
}

export enum ItemTypeMetin {
  NORMAL = 0,
  GOLD = 1,
  SUNGMA = 2
}

export enum ItemTypeFish {
  ALIVE = 0,
  DEAD = 1
}

export enum ItemTypeResource {
  FISHBONE = 0,
  WATERSTONEPIECE = 1,
  WATERSTONE = 2,
  BLOOD_PEARL = 3,
  BLUE_PEARL = 4,
  WHITE_PEARL = 5,
  BUCKET = 6,
  CRYSTAL = 7,
  GEM = 8,
  STONE = 9,
  METIN = 10,
  ORE = 11,
  AURA = 12,
}

export enum ItemTypeUnique {
  NONE = 0,
  BOOK = 1,
  SPECIAL_RIDE = 2,
  SPECIAL_MOUNT_RIDE = 3,
  UNIQUE_4 = 4,
  UNIQUE_5 = 5,
  UNIQUE_6 = 6,
  UNIQUE_7 = 7,
  UNIQUE_8 = 8,
  UNIQUE_9 = 9,
  SPECIAL = 10
}

export enum ItemTypeQuest {
  NONE = 0,
  PET_PAY = 1,
  WARP = 2,
}

export enum ItemTypeGiftbox {
  UNKNOWN_1 = 1,
  UNKNOWN_2 = 2
}

export enum ItemTypeCostume {
  BODY = 0,
  HAIR = 1,
  MOUNT = 2,
  ACCE = 3,
  WEAPON = 4,
  AURA = 5,
}

export enum ItemTypeDragonSoul {
  SLOT1 = 0,
  SLOT2 = 1,
  SLOT3 = 2,
  SLOT4 = 3,
  SLOT5 = 4,
  SLOT6 = 5,
}

export enum ItemTypeExtract {
  DRAGON_SOUL = 0,
  DRAGON_HEART = 1,
}

export enum ItemTypePet {
  EGG = 0,
  UPBRINGING = 1,
  BAG = 2,
  FEEDSTUFF = 3,
  SKILL = 4,
  SKILL_DEL_BOOK = 5,
  NAME_CHANGE = 6,
  EXPFOOD = 7,
  SKILL_ALL_DEL_BOOK = 8,
  EXPFOOD_PER = 9,
  ATTR_DETERMINE = 10,
  ATTR_CHANGE = 11,
  PAY = 12,
  PRIMIUM_FEEDSTUFF = 13,
  ITEM_TYPE = 14
}

export enum ItemTypeMedium {
  MOVE_COSTUME_ATTR = 0,
  MOVE_ACCE_ATTR = 1,
}

export enum ItemTypeGacha {
  USE = 0,
  SPECIAL_LUCKY_BOX = 1,
  GEM_LUCKY_BOX = 2,
}

export enum ItemTypeSoul {
  RED = 0,
  BLUE = 1,
}

export enum ItemTypePassive {
  JOB = 1
}

export enum ItemTypeMercenary {
  MERCENARY_0 = 0,
  MERCENARY_1 = 1,
  MERCENARY_2 = 2,
  MERCENARY_3 = 3,
  MERCENARY_4 = 4,
  MERCENARY_5 = 5,
  MERCENARY_6 = 6,
}

export const ItemTypeSubTypes = {
  [ItemType.NONE]: {},
  [ItemType.WEAPON]: ItemTypeWeapon,
  [ItemType.ARMOR]: ItemTypeArmor,
  [ItemType.USE]: ItemTypeUse,
  [ItemType.AUTOUSE]: {},
  [ItemType.MATERIAL]: ItemTypeMaterial,
  [ItemType.SPECIAL]: ItemTypeSpecial,
  [ItemType.TOOL]: {},
  [ItemType.LOTTERY]: ItemTypeLottery,
  [ItemType.ELK]: {},
  [ItemType.METIN]: ItemTypeMetin,
  [ItemType.CONTAINER]: {},
  [ItemType.FISH]: ItemTypeFish,
  [ItemType.ROD]: {},
  [ItemType.RESOURCE]: ItemTypeResource,
  [ItemType.CAMPFIRE]: {},
  [ItemType.UNIQUE]: ItemTypeUnique,
  [ItemType.SKILLBOOK]: {},
  [ItemType.QUEST]: ItemTypeQuest,
  [ItemType.POLYMORPH]: {},
  [ItemType.TREASURE_BOX]: {},
  [ItemType.TREASURE_KEY]: {},
  [ItemType.SKILLFORGET]: {},
  [ItemType.GIFTBOX]: ItemTypeGiftbox,
  [ItemType.PICK]: {},
  [ItemType.HAIR]: {},
  [ItemType.TOTEM]: {},
  [ItemType.BLEND]: {},
  [ItemType.COSTUME]: ItemTypeCostume,
  [ItemType.DRAGON_SOUL]: ItemTypeDragonSoul,
  [ItemType.SPECIAL_DRAGON_SOUL]: {},
  [ItemType.EXTRACT]: ItemTypeExtract,
  [ItemType.SECONDARY_COIN]: {},
  [ItemType.RING]: {},
  [ItemType.BELT]: {},
  [ItemType.PET]: ItemTypePet,
  [ItemType.MEDIUM]: ItemTypeMedium,
  [ItemType.GACHA]: ItemTypeGacha,
  [ItemType.SOUL]: ItemTypeSoul,
  [ItemType.PASSIVE]: ItemTypePassive,
  [ItemType.MERCENARY]: ItemTypeMercenary,
  [ItemType.UNKNOWN_41]: {},
}

/*****************************************************************************
 * Flag
 *****************************************************************************/
export enum ItemFlag {
  NONE = 0,
  REFINEABLE = (1 << 0),
  SAVE = (1 << 1),
  STACKABLE = (1 << 2),
  COUNT_PER_1GOLD = (1 << 3),
  SLOW_QUERY = (1 << 4),
  RARE = (1 << 5),
  UNIQUE = (1 << 6),
  MAKECOUNT = (1 << 7),
  IRREMOVABLE = (1 << 8),
  CONFIRM_WHEN_USE = (1 << 9),
  QUEST_USE = (1 << 10),
  QUEST_USE_MULTIPLE = (1 << 11),
  QUEST_GIVE = (1 << 12),
  LOG = (1 << 13),
  APPLICABLE = (1 << 14),
}


/*****************************************************************************
 * Anti flag
 *****************************************************************************/
export enum ItemAntiFlag {
  NONE = 0,
  FEMALE = (1 << 0),
  MALE = (1 << 1),
  WARRIOR = (1 << 2),
  ASSASSIN = (1 << 3),
  SURA = (1 << 4),
  SHAMAN = (1 << 5),
  GET = (1 << 6),
  DROP = (1 << 7),
  SELL = (1 << 8),
  EMPIRE_A = (1 << 9),
  EMPIRE_B = (1 << 10),
  EMPIRE_C = (1 << 11),
  SAVE = (1 << 12),
  GIVE = (1 << 13),
  PKDROP = (1 << 14),
  STACK = (1 << 15),
  MYSHOP = (1 << 16),
  SAFEBOX = (1 << 17),
  WOLFMAN = (1 << 18),
  RT_REMOVE = (1 << 19),
  QUICKSLOT = (1 << 20),
  CHANGELOOK = (1 << 21),
  REINFORCE = (1 << 22),
  ENCHANT = (1 << 23),
  ENERGY = (1 << 24),
  PETFEED = (1 << 25),
  APPLY = (1 << 26),
  ACCE = (1 << 27),
  MAIL = (1 << 28)
}


/*****************************************************************************
 * Wear flag
 *****************************************************************************/
export enum ItemWearFlag {
  NONE = 0,
  BODY = (1 << 0),
  HEAD = (1 << 1),
  FOOTS = (1 << 2),
  WRIST = (1 << 3),
  WEAPON = (1 << 4),
  NECK = (1 << 5),
  EAR = (1 << 6),
  UNIQUE = (1 << 7),
  SHIELD = (1 << 8),
  ARROW = (1 << 9),
  HAIR = (1 << 10),
  ABILITY = (1 << 11),
  PENDANT = (1 << 12),
  GLOVE = (1 << 13)
}


/*****************************************************************************
 * Immune flag
 *****************************************************************************/
export enum ItemImmuneFlag {
  NONE = 0,
  PARA = (1 << 0),
  CURSE = (1 << 1),
  STUN = (1 << 2),
  SLEEP = (1 << 3),
  SLOW = (1 << 4),
  POISON = (1 << 5),
  TERROR = (1 << 6)
}


/*****************************************************************************
 * Limit types
 *****************************************************************************/
export enum ItemLimitType {
  NONE = 0,
  LEVEL = 1,
  STR = 2,
  DEX = 3,
  INT = 4,
  CON = 5,
  REAL_TIME = 6,
  REAL_TIME_FIRST_USE = 7,
  TIMER_BASED_ON_WEAR = 8,
  NEWWORLD_LEVEL = 9,
  DURATION = 10
}


/*****************************************************************************
 * Apply types
 *****************************************************************************/
export enum ItemAttribute {
  NONE = 0,
  MAX_HP = 1,
  MAX_SP = 2,
  CON = 3,
  INT = 4,
  STR = 5,
  DEX = 6,
  ATTACK_SPEED = 7,
  MOVE_SPEED = 8,
  CAST_SPEED = 9,
  HP_REGEN = 10,
  SP_REGEN = 11,
  POISON_PCT = 12,
  STUN_PCT = 13,
  SLOW_PCT = 14,
  CRITICAL_PCT = 15,
  PENETRATE_PCT = 16,
  ATTBONUS_HUMAN = 17,
  ATTBONUS_ANIMAL = 18,
  ATTBONUS_ORC = 19,
  ATTBONUS_MILGYO = 20,
  ATTBONUS_UNDEAD = 21,
  ATTBONUS_DEVIL = 22,
  STEAL_HP = 23,
  STEAL_SP = 24,
  MANA_BURN_PCT = 25,
  DAMAGE_SP_RECOVER = 26,
  BLOCK = 27,
  DODGE = 28,
  RESIST_SWORD = 29,
  RESIST_TWOHAND = 30,
  RESIST_DAGGER = 31,
  RESIST_BELL = 32,
  RESIST_FAN = 33,
  RESIST_BOW = 34,
  RESIST_FIRE = 35,
  RESIST_ELEC = 36,
  RESIST_MAGIC = 37,
  RESIST_WIND = 38,
  REFLECT_MELEE = 39,
  REFLECT_CURSE = 40,
  POISON_REDUCE = 41,
  KILL_SP_RECOVER = 42,
  EXP_DOUBLE_BONUS = 43,
  GOLD_DOUBLE_BONUS = 44,
  ITEM_DROP_BONUS = 45,
  POTION_BONUS = 46,
  KILL_HP_RECOVER = 47,
  IMMUNE_STUN = 48,
  IMMUNE_SLOW = 49,
  IMMUNE_FALL = 50,
  SKILL = 51,
  ADD_BOW_DISTANCE = 52,
  ATT_BONUS = 53,
  DEF_BONUS = 54,
  MAGIC_ATT_GRADE = 55,
  MAGIC_DEF_GRADE = 56,
  CURSE_PCT = 57,
  MAX_STAMINA = 58,
  ATT_BONUS_TO_WARRIOR = 59,
  ATT_BONUS_TO_ASSASSIN = 60,
  ATT_BONUS_TO_SURA = 61,
  ATT_BONUS_TO_SHAMAN = 62,
  ATT_BONUS_TO_MONSTER = 63,
  MALL_ATTBONUS = 64,
  MALL_DEFBONUS = 65,
  MALL_EXPBONUS = 66,
  MALL_ITEMBONUS = 67,
  MALL_GOLDBONUS = 68,
  MAX_HP_PCT = 69,
  MAX_SP_PCT = 70,
  SKILL_DAMAGE_BONUS = 71,
  NORMAL_HIT_DAMAGE_BONUS = 72,
  SKILL_DEFEND_BONUS = 73,
  NORMAL_HIT_DEFEND_BONUS = 74,
  EXTRACT_HP_PCT = 75,
  PCBANG_EXP_BONUS = 76,
  PCBANG_DROP_BONUS = 77,
  RESIST_WARRIOR = 78,
  RESIST_ASSASSIN = 79,
  RESIST_SURA = 80,
  RESIST_SHAMAN = 81,
  ENERGY = 82,
  DEF_GRADE = 83,
  COSTUME_ATTR_BONUS = 84,
  MAGIC_ATTBONUS_PER = 85,
  MELEE_MAGIC_ATTBONUS_PER = 86,
  RESIST_ICE = 87,
  RESIST_EARTH = 88,
  RESIST_DARK = 89,
  RESIST_CRITICAL = 90,
  RESIST_PENETRATE = 91,
  BLEEDING_REDUCE = 92,
  BLEEDING_PCT = 93,
  ATTBONUS_WOLFMAN = 94,
  RESIST_WOLFMAN = 95,
  RESIST_CLAW = 96,
  ACCEDRAIN_RATE = 97,
  RESIST_MAGIC_REDUCTION = 98,
  ENCHANT_ELECT = 99,
  ENCHANT_FIRE = 100,
  ENCHANT_ICE = 101,
  ENCHANT_WIND = 102,
  ENCHANT_EARTH = 103,
  ENCHANT_DARK = 104,
  ATTBONUS_CZ = 105,
  ATTBONUS_INSECT = 106,
  ATTBONUS_DESERT = 107,
  ATTBONUS_SWORD = 108,
  ATTBONUS_TWOHAND = 109,
  ATTBONUS_DAGGER = 110,
  ATTBONUS_BELL = 111,
  ATTBONUS_FAN = 112,
  ATTBONUS_BOW = 113,
  ATTBONUS_CLAW = 114,
  RESIST_HUMAN = 115,
  RESIST_MOUNT_FALL = 116,
  RESIST_FIST = 117,
  MOUNT = 118,
  SKILL_DAMAGE_SAMYEON = 119,
  SKILL_DAMAGE_TANHWAN = 120,
  SKILL_DAMAGE_PALBANG = 121,
  SKILL_DAMAGE_GIGONGCHAM = 122,
  SKILL_DAMAGE_GYOKSAN = 123,
  SKILL_DAMAGE_GEOMPUNG = 124,
  SKILL_DAMAGE_AMSEOP = 125,
  SKILL_DAMAGE_GUNGSIN = 126,
  SKILL_DAMAGE_CHARYUN = 127,
  SKILL_DAMAGE_SANGONG = 128,
  SKILL_DAMAGE_YEONSA = 129,
  SKILL_DAMAGE_KWANKYEOK = 130,
  SKILL_DAMAGE_GIGUNG = 131,
  SKILL_DAMAGE_HWAJO = 132,
  SKILL_DAMAGE_SWAERYUNG = 133,
  SKILL_DAMAGE_YONGKWON = 134,
  SKILL_DAMAGE_PABEOB = 135,
  SKILL_DAMAGE_MARYUNG = 136,
  SKILL_DAMAGE_HWAYEOMPOK = 137,
  SKILL_DAMAGE_MAHWAN = 138,
  SKILL_DAMAGE_BIPABU = 139,
  SKILL_DAMAGE_YONGBI = 140,
  SKILL_DAMAGE_PAERYONG = 141,
  SKILL_DAMAGE_NOEJEON = 142,
  SKILL_DAMAGE_BYEURAK = 143,
  SKILL_DAMAGE_CHAIN = 144,
  SKILL_DAMAGE_CHAYEOL = 145,
  SKILL_DAMAGE_SALPOONG = 146,
  SKILL_DAMAGE_GONGDAB = 147,
  SKILL_DAMAGE_PASWAE = 148,
  NORMAL_HIT_DEFEND_BONUS_BOSS_OR_MORE = 149,
  SKILL_DEFEND_BONUS_BOSS_OR_MORE = 150,
  NORMAL_HIT_DAMAGE_BONUS_BOSS_OR_MORE = 151,
  SKILL_DAMAGE_BONUS_BOSS_OR_MORE = 152,
  HIT_BUFF_ENCHANT_FIRE = 153,
  HIT_BUFF_ENCHANT_ICE = 154,
  HIT_BUFF_ENCHANT_ELEC = 155,
  HIT_BUFF_ENCHANT_WIND = 156,
  HIT_BUFF_ENCHANT_DARK = 157,
  HIT_BUFF_ENCHANT_EARTH = 158,
  HIT_BUFF_RESIST_FIRE = 159,
  HIT_BUFF_RESIST_ICE = 160,
  HIT_BUFF_RESIST_ELEC = 161,
  HIT_BUFF_RESIST_WIND = 162,
  HIT_BUFF_RESIST_DARK = 163,
  HIT_BUFF_RESIST_EARTH = 164,
  USE_SKILL_CHEONGRANG_MOV_SPEED = 165,
  USE_SKILL_CHEONGRANG_CASTING_SPEED = 166,
  USE_SKILL_CHAYEOL_CRITICAL_PCT = 167,
  USE_SKILL_SANGONG_ATT_GRADE_BONUS = 168,
  USE_SKILL_GIGUNG_ATT_GRADE_BONUS = 169,
  USE_SKILL_JEOKRANG_DEF_BONUS = 170,
  USE_SKILL_GWIGEOM_DEF_BONUS = 171,
  USE_SKILL_TERROR_ATT_GRADE_BONUS = 172,
  USE_SKILL_MUYEONG_ATT_GRADE_BONUS = 173,
  USE_SKILL_MANASHILED_CASTING_SPEED = 174,
  USE_SKILL_HOSIN_DEF_BONUS = 175,
  USE_SKILL_GICHEON_ATT_GRADE_BONUS = 176,
  USE_SKILL_JEONGEOP_ATT_GRADE_BONUS = 177,
  USE_SKILL_JEUNGRYEOK_DEF_BONUS = 178,
  USE_SKILL_GIHYEOL_ATT_GRADE_BONUS = 179,
  USE_SKILL_CHUNKEON_CASTING_SPEED = 180,
  USE_SKILL_NOEGEOM_ATT_GRADE_BONUS = 181,
  SKILL_DURATION_INCREASE_EUNHYUNG = 182,
  SKILL_DURATION_INCREASE_GYEONGGONG = 183,
  SKILL_DURATION_INCREASE_GEOMKYUNG = 184,
  SKILL_DURATION_INCREASE_JEOKRANG = 185,
  USE_SKILL_PALBANG_HP_ABSORB = 186,
  USE_SKILL_AMSEOP_HP_ABSORB = 187,
  USE_SKILL_YEONSA_HP_ABSORB = 188,
  USE_SKILL_YONGBI_HP_ABSORB = 189,
  USE_SKILL_CHAIN_HP_ABSORB = 190,
  USE_SKILL_PASWAE_SP_ABSORB = 191,
  USE_SKILL_GIGONGCHAM_STUN = 192,
  USE_SKILL_CHARYUN_STUN = 193,
  USE_SKILL_PABEOB_STUN = 194,
  USE_SKILL_MAHWAN_STUN = 195,
  USE_SKILL_GONGDAB_STUN = 196,
  USE_SKILL_SAMYEON_STUN = 197,
  USE_SKILL_GYOKSAN_KNOCKBACK = 198,
  USE_SKILL_SEOMJEON_KNOCKBACK = 199,
  USE_SKILL_SWAERYUNG_KNOCKBACK = 200,
  USE_SKILL_HWAYEOMPOK_KNOCKBACK = 201,
  USE_SKILL_GONGDAB_KNOCKBACK = 202,
  USE_SKILL_KWANKYEOK_KNOCKBACK = 203,
  USE_SKILL_SAMYEON_NEXT_COOLTIME_DECREASE_10PER = 204,
  USE_SKILL_GEOMPUNG_NEXT_COOLTIME_DECREASE_10PER = 205,
  USE_SKILL_GUNGSIN_NEXT_COOLTIME_DECREASE_10PER = 206,
  USE_SKILL_KWANKYEOK_NEXT_COOLTIME_DECREASE_10PER = 207,
  USE_SKILL_YONGKWON_NEXT_COOLTIME_DECREASE_10PER = 208,
  USE_SKILL_MARYUNG_NEXT_COOLTIME_DECREASE_10PER = 209,
  USE_SKILL_BIPABU_NEXT_COOLTIME_DECREASE_10PER = 210,
  USE_SKILL_NOEJEON_NEXT_COOLTIME_DECREASE_10PER = 211,
  USE_SKILL_SALPOONG_NEXT_COOLTIME_DECREASE_10PER = 212,
  USE_SKILL_PASWAE_NEXT_COOLTIME_DECREASE_10PER = 213,
  ATTBONUS_STONE = 214,
  DAMAGE_HP_RECOVERY = 215,
  DAMAGE_SP_RECOVERY = 216,
  ALIGNMENT_DAMAGE_BONUS = 217,
  NORMAL_DAMAGE_GUARD = 218,
  MORE_THEN_HP90_DAMAGE_REDUCE = 219,
  USE_SKILL_TUSOK_HP_ABSORB = 220,
  USE_SKILL_PAERYONG_HP_ABSORB = 221,
  USE_SKILL_BYEURAK_HP_ABSORB = 222,
  FIRST_ATTRIBUTE_BONUS = 223,
  SECOND_ATTRIBUTE_BONUS = 224,
  THIRD_ATTRIBUTE_BONUS = 225,
  FOURTH_ATTRIBUTE_BONUS = 226,
  FIFTH_ATTRIBUTE_BONUS = 227,
  USE_SKILL_SAMYEON_NEXT_COOLTIME_DECREASE_20PER = 228,
  USE_SKILL_GEOMPUNG_NEXT_COOLTIME_DECREASE_20PER = 229,
  USE_SKILL_GUNGSIN_NEXT_COOLTIME_DECREASE_20PER = 230,
  USE_SKILL_KWANKYEOK_NEXT_COOLTIME_DECREASE_20PER = 231,
  USE_SKILL_YONGKWON_NEXT_COOLTIME_DECREASE_20PER = 232,
  USE_SKILL_MARYUNG_NEXT_COOLTIME_DECREASE_20PER = 233,
  USE_SKILL_BIPABU_NEXT_COOLTIME_DECREASE_20PER = 234,
  USE_SKILL_NOEJEON_NEXT_COOLTIME_DECREASE_20PER = 235,
  USE_SKILL_SALPOONG_NEXT_COOLTIME_DECREASE_20PER = 236,
  USE_SKILL_PASWAE_NEXT_COOLTIME_DECREASE_20PER = 237,
  USE_SKILL_CHAYEOL_HP_ABSORB = 238,
  SUNGMA_STR = 239,
  SUNGMA_HP = 240,
  SUNGMA_MOVE = 241,
  SUNGMA_IMMUNE = 242,
  HIT_PCT = 243,
  RANDOM = 244,
  ATTBONUS_PER_HUMAN = 245,
  ATTBONUS_PER_ANIMAL = 246,
  ATTBONUS_PER_ORC = 247,
  ATTBONUS_PER_MILGYO = 248,
  ATTBONUS_PER_UNDEAD = 249,
  ATTBONUS_PER_DEVIL = 250,
  ENCHANT_PER_ELECT = 251,
  ENCHANT_PER_FIRE = 252,
  ENCHANT_PER_ICE = 253,
  ENCHANT_PER_WIND = 254,
  ENCHANT_PER_EARTH = 255,
  ENCHANT_PER_DARK = 256,
  ATTBONUS_PER_CZ = 257,
  ATTBONUS_PER_INSECT = 258,
  ATTBONUS_PER_DESERT = 259,
  ATTBONUS_PER_STONE = 260,
  ATTBONUS_PER_MONSTER = 261,
  RESIST_PER_HUMAN = 262,
  RESIST_PER_ICE = 263,
  RESIST_PER_DARK = 264,
  RESIST_PER_EARTH = 265,
  RESIST_PER_FIRE = 266,
  RESIST_PER_ELEC = 267,
  RESIST_PER_MAGIC = 268,
  RESIST_PER_WIND = 269,
  HIT_BUFF_SUNGMA_STR = 270,
  HIT_BUFF_SUNGMA_MOVE = 271,
  HIT_BUFF_SUNGMA_HP = 272,
  HIT_BUFF_SUNGMA_IMMUNE = 273,
  MOUNT_MELEE_MAGIC_ATTBONUS_PER = 274,
  DISMOUNT_MOVE_SPEED_BONUS_PER = 275,
  HIT_AUTO_HP_RECOVERY = 276,
  HIT_AUTO_SP_RECOVERY = 277,
  USE_SKILL_COOLTIME_DECREASE_ALL = 278,
  HIT_STONE_ATTBONUS_STONE = 279,
  HIT_STONE_DEF_GRADE_BONUS = 280,
  KILL_BOSS_ITEM_BONUS = 281,
  MOB_HIT_MOB_AGGRESSIVE = 282,
  NO_DEATH_AND_HP_RECOVERY30 = 283,
  AUTO_PICKUP = 284,
  MOUNT_NO_KNOCKBACK = 285,
  SUNGMA_PER_STR = 286,
  SUNGMA_PER_HP = 287,
  SUNGMA_PER_MOVE = 288,
  SUNGMA_PER_IMMUNE = 289,
  IMMUNE_POISON100 = 290,
  IMMUNE_BLEEDING100 = 291,
  MONSTER_DEFEND_BONUS = 292,
}


/*****************************************************************************
 * Mask types
 *****************************************************************************/
export enum ItemMaskType {
  NONE = 0,
  MOUNT_PET = 1,
  EQUIPMENT_WEAPON = 2,
  EQUIPMENT_ARMOR = 3,
  EQUIPMENT_JEWELRY = 4,
  TUNING = 5,
  POTION = 6,
  FISHING_PICK = 7,
  DRAGON_STONE = 8,
  COSTUMES = 9,
  SKILL = 10,
  UNIQUE = 11,
  ETC = 12,
}


/*****************************************************************************
 * Mask subtypes
 *****************************************************************************/
export enum ItemMaskTypeMountPet {
  MOUNT = 0,
  CHARGED_PET = 1,
  FREE_PET = 2,
  EGG = 3,
}

export enum ItemMaskTypeEquipmentWeapon {
  SWORD = 0,
  DAGGER = 1,
  BOW = 2,
  TWO_HANDED = 3,
  BELL = 4,
  CLAW = 5,
  FAN = 6,
  MOUNT_SPEAR = 7,
  ARROW = 8,
}

export enum ItemMaskTypeEquipmentArmor {
  BODY = 0,
  GLOVE = 3,
  HEAD = 1,
  SHIELD = 2,
}

export enum ItemMaskTypeEquipmentJewelry {
  ARMOR_WRIST = 0,
  ARMOR_FOOTS = 1,
  ARMOR_NECK = 2,
  ARMOR_EAR = 3,
  ITEM_BELT = 4,
  ARMOR_PENDANT = 5,
}

export enum ItemMaskTypeTuning {
  RESOURCE = 0,
  STONE = 1,
  ETC = 2,
}

export enum ItemMaskTypePotion {
  ABILITY = 0,
  HAIRDYE = 1,
  ETC = 2,
}

export enum ItemMaskTypeFishingPick {
  FISHING_POLE = 0,
  EQUIPMENT_PICK = 1,
  FOOD = 2,
  STONE = 3,
  ETC = 4,
}

export enum ItemMaskTypeDragonStone {
  DRAGON_DIAMOND = 0,
  DRAGON_RUBY = 1,
  DRAGON_JADE = 2,
  DRAGON_SAPPHIRE = 3,
  DRAGON_GARNET = 4,
  DRAGON_ONYX = 5,
  ETC = 6,
}

export enum ItemMaskTypeCostume {
  COSTUME_WEAPON = 0,
  COSTUME_BODY = 1,
  COSTUME_HAIR = 2,
  SASH = 3,
  ETC = 4,
  AURA = 5,
}

export enum ItemMaskTypeSkill {
  PAHAE = 0,
  SKILL_BOOK = 1,
  BOOK_OF_OBLIVION = 2,
  ETC = 3,
  SKILL_BOOK_HORSE = 4,
}

export enum ItemMaskTypeUnique {
  ABILITY = 0,
  ETC = 1,
}

export enum ItemMaskTypeEtc {
  GIFTBOX = 0,
  MATRIMORY = 1,
  EVENT = 2,
  SEAL = 3,
  PARTI = 4,
  POLYMORPH = 5,
  RECIPE = 6,
  ETC = 7,
}

export const ItemMaskTypeSubTypes = {
  [ItemMaskType.NONE]: {},
  [ItemMaskType.MOUNT_PET]: ItemMaskTypeMountPet,
  [ItemMaskType.EQUIPMENT_WEAPON]: ItemMaskTypeEquipmentWeapon,
  [ItemMaskType.EQUIPMENT_ARMOR]: ItemMaskTypeEquipmentArmor,
  [ItemMaskType.EQUIPMENT_JEWELRY]: ItemMaskTypeEquipmentJewelry,
  [ItemMaskType.TUNING]: ItemMaskTypeTuning,
  [ItemMaskType.POTION]: ItemMaskTypePotion,
  [ItemMaskType.FISHING_PICK]: ItemMaskTypeFishingPick,
  [ItemMaskType.DRAGON_STONE]: ItemMaskTypeDragonStone,
  [ItemMaskType.COSTUMES]: ItemMaskTypeCostume,
  [ItemMaskType.SKILL]: ItemMaskTypeSkill,
  [ItemMaskType.UNIQUE]: ItemMaskTypeUnique,
  [ItemMaskType.ETC]: ItemMaskTypeEtc,
}