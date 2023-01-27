import { writeToString } from "fast-csv";
import { createReadStream } from "fs"
import iconv from "iconv-lite";

import { Token } from "../infrastructures/Container"

import { DefaultEncoding, getFlagIdByFlags, getFlagsByFlagId, KoreanEncoding, parseProtoStream } from "../helpers/Game";
import { readStreamToBuffer } from "../helpers/Stream";
import { getEnumValues } from "../helpers/Enum";
import { isNumber } from "../helpers/Number";

import { GameMobItemType, GameMobProtoAiFlag, GameMobProtoBattleType, GameMobProtoFormat, GameMobProtoImmuneFlag, GameMobProtoRaceFlag, GameMobProtoRank, GameMobProtoSize, GameMobProtoType } from "../interfaces/GameMob";
import { MobBattleType, MobGroupGroupMobGroupTable, MobGroupGroupTable, MobGroupMobTable, MobGroupTable, MobItemType, MobRank, MobTable, MobType } from "../interfaces/Mob"

import { IMobRankItem } from "../entities/MobRankItem";
import { IMobGroupMob } from "../entities/MobGroupMob";
import { IGameMob } from "../entities/GameMob";
import { IMobItem } from "../entities/MobItem";
import { IMob } from "../entities/Mob";

import Service, { IService } from "./Service"
import { IMobGroupGroupMobGroup } from "../entities/MobGroupGroupMobGroup";

export const GameMobServiceToken = new Token<IGameMobService>("GameMobService")

export type MobProtoParseOptions = {
  format?: GameMobProtoFormat
}

export type CSVReadOptions<T> = {
  transform?: (row: any) => T
}

export type CSVWriteOptions = {
  transform: (row: any) => any
}


export type IGameMobService = IService & {
  readMobNames<T = any>(path: string, options?: CSVReadOptions<T>): Promise<T[]>
  readMobProto(path: string, options?: MobProtoParseOptions): Promise<Partial<MobTable>[]>
  readMobDropItem(path: string): Promise<[any[], any[]]>
  readCommonDropItem(path: string): Promise<[any[], any[]]>
  readMobGroup(path: string): Promise<[Partial<MobGroupTable>[], Partial<MobGroupMobTable>[]]>
  readMobGroupGroup(path: string): Promise<[Partial<MobGroupGroupTable>[], Partial<MobGroupGroupMobGroupTable>[]]>

  parseMobProto(stream: NodeJS.ReadableStream, options?: MobProtoParseOptions): Promise<Partial<MobTable>[]>
  parseMobDropItem(stream: NodeJS.ReadableStream): Promise<[any[], any[]]>
  parseCommonDropItem(stream: NodeJS.ReadableStream): Promise<[any[], any[]]>
  parseMobGroup(stream: NodeJS.ReadableStream): Promise<[Partial<MobGroupTable>[], Partial<MobGroupMobTable>[]]>
  parseMobGroupGroup(stream: NodeJS.ReadableStream): Promise<[Partial<MobGroupGroupTable>[], Partial<MobGroupGroupMobGroupTable>[]]>

  transformGameMobToMob(gameMob: IGameMob): Partial<MobTable>

  createMobNames<T = any>(mobs: T[], options?: CSVWriteOptions): Promise<Buffer>
  createMobProto(mobs: IMob[]): Promise<Buffer>
  createMobDropItem(mobItems: IMobItem[]): Promise<Buffer>
  createCommonDropItem(mobRankItems: IMobRankItem[]): Promise<Buffer>
  createMobGroup(mobGroupMobs: IMobGroupMob[]): Promise<Buffer>
  createMobGroupGroup(mobGroupGroupMobGroups: IMobGroupGroupMobGroup[]): Promise<Buffer>
}

export default class GameMobService extends Service<any> implements IGameMobService {

  async createMobNames<T = any>(mobs: T[], options?: CSVWriteOptions) {
    const { transform } = options || {}

    const content = await writeToString(mobs as any, {
      delimiter: '\t',
      headers: ['VNUM', 'LOCALE_NAME'],
      transform,
      // transform: (mob: ILocaleMob) => mob.name ? [mob.mobId, mob.name] : undefined
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async createMobProto(mobs: IMob[]) {
    const content = await writeToString(mobs, {
      delimiter: '\t',
      escape: "",
      quote: "",
      headers: [
        'VNUM',
        'NAME',
        'RANK',
        'TYPE',
        'BATTLE_TYPE',
        'LEVEL',
        'SIZE',
        'AI_FLAG',
        'MOUNT_CAPACITY',
        'RACE_FLAG',
        'IMMUNE_FLAG',
        'EMPIRE',
        'FOLDER',
        'ON_CLICK',
        'ST',
        'DX',
        'HT',
        'IQ',
        'DAMAGE_MIN',
        'DAMAGE_MAX',
        'MAX_HP',
        'REGEN_CYCLE',
        'REGEN_PERCENT',
        'GOLD_MIN',
        'GOLD_MAX',
        'EXP',
        'DEF',
        'ATTACK_SPEED',
        'MOVE_SPEED',
        'AGGRESSIVE_HP_PCT',
        'AGGRESSIVE_SIGHT',
        'ATTACK_RANGE',
        'DROP_ITEM',
        'RESURRECTION_VNUM',
        'ENCHANT_CURSE',
        'ENCHANT_SLOW',
        'ENCHANT_POISON',
        'ENCHANT_STUN',
        'ENCHANT_CRITICAL',
        'ENCHANT_PENETRATE',
        'RESIST_SWORD',
        'RESIST_TWOHAND',
        'RESIST_DAGGER',
        'RESIST_BELL',
        'RESIST_FAN',
        'RESIST_BOW',
        'RESIST_FIRE',
        'RESIST_ELECT',
        'RESIST_MAGIC',
        'RESIST_WIND',
        'RESIST_POISON',
        'DAM_MULTIPLY',
        'SUMMON',
        'DRAIN_SP',
        'MOB_COLOR',
        'POLYMORPH_ITEM',
        'SKILL_LEVEL0',
        'SKILL_VNUM0',
        'SKILL_LEVEL1',
        'SKILL_VNUM1',
        'SKILL_LEVEL2',
        'SKILL_VNUM2',
        'SKILL_LEVEL3',
        'SKILL_VNUM3',
        'SKILL_LEVEL4',
        'SKILL_VNUM4',
        'SP_BERSERK',
        'SP_STONESKIN',
        'SP_GODSPEED',
        'SP_DEATHBLOW',
        'SP_REVIVE'
      ],
      transform: (row: any) => this.transformMobToMobProtoRow(row)
    })

    return iconv.encode(content, KoreanEncoding)
  }

  async createMobDropItem(mobItems: IMobItem[]) {
    let content = ""

    const itemGroups: { [key: string]: IMobItem[] } = mobItems.reduce((itemGroups: any, mobItem: IMobItem) => {
      const key = `${mobItem.mobId}:${mobItem.typeId}:${mobItem.levelLimit}:${mobItem.delta}`

      itemGroups[key] = itemGroups[key] || []
      itemGroups[key].push(mobItem)

      return itemGroups
    }, {})

    for (const [key, items] of Object.entries(itemGroups)) {
      const [mobId, typeId, levelLimit, delta] = key.split(':')

      const type = GameMobItemType[typeId as any]
      if (!type) continue

      content += `Group\t${key}\n{\n`
      content += `\tMob\t${mobId}\n`
      content += `\tType\t${type?.toLowerCase()}\n`

      if (typeId as any == MobItemType.LEVEL_LIMIT) content += `\tLevel_limit\t${levelLimit}\n`
      if (typeId as any == MobItemType.DELTA) content += `\tKill_drop\t${delta}\n`

      items.map((item, index) => {
        content += `\t${index + 1}\t${item.itemId}\t${item.quantity}\t${item.probability}`
        if (typeId as any == MobItemType.DELTA) content += `\t${item.rareProbability}`
        content += `\n`
      })

      content += `}\n`
    }

    return iconv.encode(content, KoreanEncoding)
  }

  async createCommonDropItem(mobRankItems: IMobRankItem[]) {
    let content = ""

    const ranks = [
      MobRank.PAWN,
      MobRank.SUPER_PAWN,
      MobRank.KNIGHT,
      MobRank.SUPER_KNIGHT
    ]

    const rankItems: { [key: string]: IMobRankItem[] } = {}

    mobRankItems.map(mobRankItem => {
      rankItems[mobRankItem.mobRankId] = rankItems[mobRankItem.mobRankId] || []
      rankItems[mobRankItem.mobRankId]?.push(mobRankItem)
    })

    const rankItemCounts = ranks.map(rank => rankItems[rank]?.length || 0)
    const maxItemCount = Math.max(...rankItemCounts)

    ranks.map(rank => content += `${GameMobProtoRank[rank] || ""}\t\t\t\t\t\t`)
    content += "\n"

    for (let i = 0; i < maxItemCount; i++) {
      ranks.map(rank => {
        const rankItem = rankItems[rank][i]
        content += `\t${rankItem?.minLevel || ""}\t${rankItem?.maxLevel || ""}\t${rankItem?.probability || ""}\t${rankItem?.itemId || ""}\t${rankItem?.itemId ? 10000 : ""}\t`
      })

      content += `\n`
    }

    return iconv.encode(content, KoreanEncoding)
  }

  async createMobGroup(mobGroupMobs: IMobGroupMob[]) {
    let content = ""

    const groups: { [key: string]: any } = {}

    mobGroupMobs.map(mobGroupMob => {
      groups[mobGroupMob.mobGroupId] = groups[mobGroupMob.mobGroupId] || { leaderMobId: 0, name: mobGroupMob.mobGroupName,  mobs: [] }

      if (mobGroupMob.leader) {
        groups[mobGroupMob.mobGroupId]["leaderMobId"] = mobGroupMob.mobId
      } else {
        groups[mobGroupMob.mobGroupId]["mobs"].push(mobGroupMob)
      }
    })

    for (const [groupId, group] of Object.entries(groups)) {
      let { leaderMobId, name, mobs } = group
      leaderMobId = leaderMobId || mobs[0]?.mobId

      if (!leaderMobId) continue

      content += `Group\t${name || groupId}\n{\n`
      content += `\tVnum\t${groupId}\n`
      content += `\tLeader\t.\t${leaderMobId}\n`

      mobs?.map((mob: any, index: number) => content += `\t${index + 1}\t.\t${mob.mobId}\n`)

      content += `}\n`
    }

    return iconv.encode(content, KoreanEncoding)
  }

  async createMobGroupGroup(mobGroupGroupMobGroups: IMobGroupGroupMobGroup[]) {
    let content = ""

    const groups: { [key: string]: any } = {}

    mobGroupGroupMobGroups.map(mobGroupGroupMobGroup => {
      groups[mobGroupGroupMobGroup.mobGroupGroupId] = groups[mobGroupGroupMobGroup.mobGroupGroupId] || { name: mobGroupGroupMobGroup.mobGroupGroupName,  groups: [] }
      groups[mobGroupGroupMobGroup.mobGroupGroupId]["groups"].push(mobGroupGroupMobGroup)
    })

    for (const [groupGroupId, group] of Object.entries(groups)) {
      let { name, groups } = group

      content += `Group\t${name || groupGroupId}\n{\n`
      content += `\tVnum\t${groupGroupId}\n`

      groups?.map((mobGroupGroupMobGroup: IMobGroupGroupMobGroup, index: number) => content += `\t${index + 1}\t${mobGroupGroupMobGroup.mobGroupId}\t${mobGroupGroupMobGroup.probability}\n`)

      content += `}\n`
    }

    return iconv.encode(content, KoreanEncoding)

  }

  async readMobProto(path: string, options?: MobProtoParseOptions) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseMobProto(stream, options)
  }

  async readMobNames<T = any>(path: string, options?: CSVReadOptions<T>) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(DefaultEncoding))
    return this.parseMobNames(stream, options)
  }

  async readMobDropItem(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseMobDropItem(stream)
  }

  async readCommonDropItem(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseCommonDropItem(stream)
  }

  async readMobGroup(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseMobGroup(stream)
  }

  async readMobGroupGroup(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseMobGroupGroup(stream)
  }

  async parseMobNames<T = any>(stream: NodeJS.ReadableStream, options?: CSVReadOptions<T>) {
    return parseProtoStream<T>(stream, {
      headers: ['id', 'name'],
      skipRows: 1,
      ...options,
    })
  }

  async parseMobProto(stream: NodeJS.ReadableStream, options?: MobProtoParseOptions) {
    const {
      format = GameMobProtoFormat.DEFAULT
    } = options || {}

    return parseProtoStream<Partial<MobTable>>(stream, {
      headers: this.getMobProtoHeadersByFormat(format),
      skipRows: 1,
      transform: (row: any) => this.transformMobProtoRowToMob(format, row),
    })
  }

  async parseMobDropItem(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const mobItemsByName: any[] = []
    const mobItemsById: any[] = []

    const matches = content.match(/Group[^{]+{([^}]+)}/gmi)
    matches?.map(match => {

      const [mobMatch] = [...match.matchAll(/\sMob\s+(\d+)/gmi)]
      const [typeMatch] = [...match.matchAll(/\sType\s+(drop|limit|kill|thiefgloves)/gmi)]
      const [levelLimitMatch] = [...match.matchAll(/\Level_limit\s+(\d+)/gmi)]
      const [deltaMatch] = [...match.matchAll(/\Kill_drop\s+(\d+)/gmi)]

      let [_1, mobId] = mobMatch || []
      let [_2, type] = typeMatch || [null, GameMobItemType[GameMobItemType.DROP]]
      let [_3, levelLimit] = levelLimitMatch || [null, 0]
      let [_4, delta] = deltaMatch || [null, 1]

      if (!mobId) return

      const [typeId] = getEnumValues(GameMobItemType, type)

      mobId = parseInt(mobId) as any
      levelLimit = parseInt(levelLimit) || 0 as any
      delta = parseInt(delta) || 1 as any

      const groupItems = [...match.matchAll(/\s(\d+)\s([^\s]+)\s(\d+)\s([^\s]+)(\s(\d+))?/gm)]
      groupItems?.map(item => {
        const [_1, _2, itemIdOrName, quantity, probability, _3, rareProbability] = item

        const isItemId = isNumber(itemIdOrName)

        const itemId = isItemId ? itemIdOrName : undefined
        const itemName = isItemId ? undefined : itemIdOrName

        const mobItems = isItemId ? mobItemsById : mobItemsByName

        mobItems.push({
          mobId,
          typeId,
          levelLimit,
          delta,
          itemId,
          itemName,
          quantity: parseInt(quantity) || 1,
          probability: parseFloat(probability) || 0,
          rareProbability: parseInt(rareProbability) || 0
        })
      })
    })

    return [mobItemsById, mobItemsByName] as [any[], any[]]
  }

  async parseCommonDropItem(stream: NodeJS.ReadableStream) {

    const rankPrefix = {
      'pawn': MobRank.PAWN,
      'superPawn': MobRank.SUPER_PAWN,
      'knight': MobRank.KNIGHT,
      'superKnight': MobRank.SUPER_KNIGHT
    }

    const mobRankItemsByName: any[] = []
    const mobRankItemsById: any[] = []

    const rows = await parseProtoStream(stream, {
      headers: [
        'pawnName',
        'pawnLevelMin',
        'pawnLevelMax',
        'pawnProbability',
        'pawnItemIdOrName',
        'pawnDelta',
        'superPawnName',
        'superPawnLevelMin',
        'superPawnLevelMax',
        'superPawnProbability',
        'superPawnItemIdOrName',
        'superPawnDelta',
        'knightName',
        'knightLevelMin',
        'knightLevelMax',
        'knightProbability',
        'knightItemIdOrName',
        'knightDelta',
        'superKnightName',
        'superKnightLevelMin',
        'superKnightLevelMax',
        'superKnightProbability',
        'superKnightItemIdOrName',
        'superKnightDelta',
      ],
      skipRows: 1,
    })

    rows?.map(row => {
      for (const [prefix, rankId] of Object.entries(rankPrefix)) {

        const itemIdOrName = row[`${prefix}ItemIdOrName`]
        const minLevel = ~~(row[`${prefix}LevelMin`])
        const maxLevel = ~~(row[`${prefix}LevelMax`])
        const probability = parseFloat(row[`${prefix}Probability`])

        if (!itemIdOrName || !minLevel || !maxLevel || !probability) continue

        const isItemId = isNumber(itemIdOrName)

        const itemId = isItemId ? itemIdOrName : undefined
        const itemName = isItemId ? undefined : itemIdOrName

        const mobRankItems = isItemId ? mobRankItemsById : mobRankItemsByName

        mobRankItems.push({
          rankId,
          itemId,
          itemName,
          minLevel,
          maxLevel,
          probability
        })
      }
    })

    return [mobRankItemsById, mobRankItemsByName] as [any[], any[]]
  }

  async parseMobGroup(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const groups: Partial<MobGroupTable>[] = []
    const groupMobs: Partial<MobGroupMobTable>[] = []

    const matches = content.match(/Group[^{]+{([^}]+)}/gmi)

    matches?.map(group => {

      const [idMatch] = [...group.matchAll(/Vnum\s+(\d+)/gmi)]
      const [nameMatch] = [...group.matchAll(/Group\s+(.*)[^{]+/gmi)]
      const [leaderMobMatch] = [...group.matchAll(/Leader\t.*\t(\d+)[^\n]*/gmi)]

      let [_1, id] = idMatch || []
      let [_2, name] = nameMatch || []
      let [_3, leaderMobId] = leaderMobMatch || []

      if (!id || !leaderMobId) return

      groups.push({
        mob_group_id: id as any,
        mob_group_name: name || ""
      })

      groupMobs.push({
        mob_group_mob_mob_group_id: id as any,
        mob_group_mob_mob_id: leaderMobId as any,
        mob_group_mob_leader: 1,
      })

      const members = [...group.matchAll(/\t\d+\t.*\t(\d+)[^\n]*/gm)]
      members?.map(member => {
        const [_1, memberMobId] = member

        groupMobs.push({
          mob_group_mob_mob_group_id: id as any,
          mob_group_mob_mob_id: memberMobId as any,
          mob_group_mob_leader: 0
        })
      })

    })

    return [groups, groupMobs] as any
  }

  async parseMobGroupGroup(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const groups: Partial<MobGroupGroupTable>[] = []
    const groupMobGroups: Partial<MobGroupGroupMobGroupTable>[] = []

    const matches = content.match(/Group[^{]+{([^}]+)}/gmi)

    matches?.map(group => {

      const [idMatch] = [...group.matchAll(/Vnum\s+(\d+)/gmi)]
      const [nameMatch] = [...group.matchAll(/Group\s+([^\s{]*)\s*/gmi)]

      let [_1, id] = idMatch || []
      let [_2, name] = nameMatch || []

      if (!id) return

      groups.push({
        mob_group_group_id: id as any,
        mob_group_group_name: name || ""
      })

      const groupGroups = [...group.matchAll(/\t\d+\t(\d+)\t(\d+)[^\n]*/gm)]
      groupGroups?.map(groupGroup => {
        const [_1, groupId, probability] = groupGroup

        groupMobGroups.push({
          "mob_group_group_mob_group_mob_group_group_id": id as any,
          "mob_group_group_mob_group_mob_group_id": groupId as any,
          "mob_group_group_mob_group_probability": probability as any
        })
      })
    })

    return [groups, groupMobGroups] as any
  }

  transformGameMobToMob(mob: IGameMob): Partial<MobTable> {
    const aiFlagId = getFlagIdByFlags(GameMobProtoAiFlag, mob.aiFlags)
    const raceFlagId = getFlagIdByFlags(GameMobProtoRaceFlag, mob.raceFlags)
    const immuneFlagId = getFlagIdByFlags(GameMobProtoImmuneFlag, mob.immuneFlags)

    return {
      mob_id: mob.id,
      mob_rank: mob.rank,
      mob_type: mob.type,
      mob_battle_type: mob.battleType,
      mob_level: mob.level,
      mob_size: mob.size,
      mob_ai_flag_id: aiFlagId,
      mob_mount: mob.mount,
      mob_race_flag_id: raceFlagId,
      mob_immune_flag_id: immuneFlagId,
      mob_empire_id: mob.empire,
      mob_folder: mob.folder,
      mob_click_type: mob.clickType,
      mob_strength: mob.strength,
      mob_dexterity: mob.dexterity,
      mob_health: mob.health,
      mob_intelligence: mob.intelligence,
      mob_damage_min: mob.minDamage,
      mob_damage_max: mob.maxDamage,
      mob_health_max: mob.maxHealth,
      mob_regeneration_cycle: mob.regenerationCycle,
      mob_regeneration_percent: mob.regenerationPercent,
      mob_money_min: mob.minMoney,
      mob_money_max: mob.maxMoney,
      mob_experience: mob.experience,
      mob_defense: mob.defense,
      mob_attack_speed: mob.attackSpeed,
      mob_movement_speed: mob.movementSpeed,
      mob_aggressive_health_percent: mob.aggressiveHealthPercent,
      mob_aggressive_sight: mob.aggressiveSight,
      mob_attack_range: mob.attackRange,
      mob_resurrection_mob_id: mob.resurrectionMobId,
      mob_enchant_curse: mob.enchantCurse,
      mob_enchant_slow: mob.enchantSlow,
      mob_enchant_poison: mob.enchantPoison,
      mob_enchant_stun: mob.enchantStun,
      mob_enchant_critical: mob.enchantCritical,
      mob_enchant_penetrate: mob.enchantPenetrate,
      mob_resistance_sword: mob.resistanceSword,
      mob_resistance_two_hand: mob.resistanceTwoHand,
      mob_resistance_dagger: mob.resistanceDagger,
      mob_resistance_bell: mob.resistanceBell,
      mob_resistance_fan: mob.resistanceFan,
      mob_resistance_bow: mob.resistanceBow,
      mob_resistance_fire: mob.resistanceFire,
      mob_resistance_electric: mob.resistanceElectric,
      mob_resistance_magic: mob.resistanceMagic,
      mob_resistance_wind: mob.resistanceWind,
      mob_resistance_poison: mob.resistancePoison,
      mob_damage_multiplier: mob.damageMultiplier,
      mob_summon_mob_id: mob.summonMobId,
      mob_drain: mob.drain,
      mob_color: mob.color || 0,
      mob_polymorph_item_id: mob.polymorphItemId,
      mob_skill_id0: mob.skillId0,
      mob_skill_level0: mob.skillLevel0,
      mob_skill_id1: mob.skillId1,
      mob_skill_level1: mob.skillLevel1,
      mob_skill_id2: mob.skillId2,
      mob_skill_level2: mob.skillLevel2,
      mob_skill_id3: mob.skillId3,
      mob_skill_level3: mob.skillLevel3,
      mob_skill_id4: mob.skillId4,
      mob_skill_level4: mob.skillLevel4,
      mob_berserk: mob.berserk,
      mob_stone_skin: mob.stoneSkin,
      mob_god_speed: mob.godSpeed,
      mob_death_blow: mob.deathBlow,
      mob_revive: mob.revive
    }
  }

  private getMobProtoHeadersByFormat(format: GameMobProtoFormat) {
    switch (format) {

      case GameMobProtoFormat.VERSION_2022:
        return [
          'id', 'name', 'rank', 'type', 'battleType', 'level', 'scalePercent', 'size', 'aiFlags',
          '_', 'mount', 'raceFlags', 'immuneFlags', 'empire', 'folder', 'click',
          'strength', 'dexterity', 'health', 'intelligence', 'sungMaStrength', 'sungMaDexterity', 'sungMaHealth', 'sungMaIntelligence',
          'minDamage', 'maxDamage', 'maxHealth', 'regenerationCycle', 'regenerationPercent', 'minMoney', 'maxMoney', 'experience', 'sungMaExperience',
          'defense', 'attackSpeed', 'movementSpeed', 'aggressiveHealthPercent', 'aggressiveSight', 'attackRange', 'dropItemGroup', 'resurrectionMobId',
          'enchantCurse', 'enchantSlow', 'enchantPoison', 'enchantStun', 'enchantCritical', 'enchantPenetrate',
          'resistFist', 'resistSword', 'resistTwoHanded', 'resistDagger', 'resistBell', 'resistFan', 'resistBow', 'resistClaw', 'resistFire', 'resistElectric', 'resistMagic', 'resistWind', 'resistPoison', 'resistBleeding',
          'attributeElectric', 'attributeFire', 'attributeIce', 'attributeWind', 'attributeEarth', 'attributeDark',
          'resistDark', 'resistIce', 'resistEarth',
          'damageMultiplier', 'summonMobId', 'drain', 'color', 'polymorphItemId',
          'skillLevel0', 'skillId0', 'skillLevel1', 'skillId1', 'skillLevel2', 'skillId2', 'skillLevel3', 'skillId3', 'skillLevel4', 'skillId4',
          'berserk', 'stoneSkin', 'godSpeed', 'deathBlow', 'revive', 'heal', 'rangeAttackSpeed', 'rangeCastSpeed', 'healthRegeneration', 'hitRange'
        ]


      default:
        return [
          'id', 'name', 'rank', 'type', 'battleType', 'level', 'size', 'aiFlags',
          'mount', 'raceFlags', 'immuneFlags', 'empire', 'folder', 'click',
          'strength', 'dexterity', 'health', 'intelligence',
          'minDamage', 'maxDamage', 'maxHealth', 'regenerationCycle', 'regenerationPercent', 'minMoney', 'maxMoney', 'experience',
          'defense', 'attackSpeed', 'movementSpeed', 'aggressiveHealthPercent', 'aggressiveSight', 'attackRange', 'dropItemGroup', 'resurrectionMobId',
          'enchantCurse', 'enchantSlow', 'enchantPoison', 'enchantStun', 'enchantCritical', 'enchantPenetrate',
          'resistSword', 'resistTwoHanded', 'resistDagger', 'resistBell', 'resistFan', 'resistBow', 'resistFire', 'resistElectric', 'resistMagic', 'resistWind', 'resistPoison',
          'damageMultiplier', 'summonMobId', 'drain', 'color', 'polymorphItemId',
          'skillLevel0', 'skillId0', 'skillLevel1', 'skillId1', 'skillLevel2', 'skillId2', 'skillLevel3', 'skillId3', 'skillLevel4', 'skillId4',
          'berserk', 'stoneSkin', 'godSpeed', 'deathBlow', 'revive'
        ]

    }
  }

  private transformMobProtoRowToMob(format: GameMobProtoFormat, row: any) {

    const [rank] = getEnumValues(GameMobProtoRank, row.rank)
    const [type] = getEnumValues(GameMobProtoType, row.type)
    const [battleType] = getEnumValues(GameMobProtoBattleType, row.battleType)
    const [size] = getEnumValues(GameMobProtoSize, row.size)

    const aiFlagId = getFlagIdByFlags(GameMobProtoAiFlag, row.aiFlags)
    const raceFlagId = getFlagIdByFlags(GameMobProtoRaceFlag, row.raceFlags)
    const immuneFlagId = getFlagIdByFlags(GameMobProtoImmuneFlag, row.immuneFlags)

    const mob: Partial<MobTable> = {
      mob_id: ~~(row.id),
      mob_name: row.name,
      mob_rank: rank || MobRank.PAWN as any,
      mob_type: type || MobType.MONSTER as any,
      mob_battle_type: battleType || MobBattleType.MELEE as any,
      mob_level: ~~(row.level),
      mob_size: size || 0 as any,
      mob_ai_flag_id: aiFlagId,
      mob_mount: ~~(row.mount),
      mob_race_flag_id: raceFlagId,
      mob_immune_flag_id: immuneFlagId,
      mob_empire_id: ~~(row.empire),
      mob_folder: row.folder,
      mob_click_type: ~~(row.click),
      mob_strength: ~~(row.strength),
      mob_dexterity: ~~(row.dexterity),
      mob_health: ~~(row.health),
      mob_intelligence: ~~(row.intelligence),
      mob_damage_min: ~~(row.minDamage),
      mob_damage_max: ~~(row.maxDamage),
      mob_health_max: ~~(row.maxHealth),
      mob_regeneration_cycle: ~~(row.regenerationCycle),
      mob_regeneration_percent: ~~(row.regenerationPercent),
      mob_money_min: ~~(row.minMoney),
      mob_money_max: ~~(row.maxMoney),
      mob_experience: ~~(row.experience),
      mob_defense: ~~(row.defense),
      mob_attack_speed: ~~(row.attackSpeed),
      mob_movement_speed: ~~(row.movementSpeed),
      mob_aggressive_health_percent: ~~(row.aggressiveHealthPercent),
      mob_aggressive_sight: ~~(row.aggressiveSight),
      mob_attack_range: ~~(row.attackRange),
      mob_resurrection_mob_id: ~~(row.resurrectionMobId),
      mob_enchant_curse: ~~(row.enchantCurse),
      mob_enchant_slow: ~~(row.enchantSlow),
      mob_enchant_poison: ~~(row.enchantPoison),
      mob_enchant_stun: ~~(row.enchantStun),
      mob_enchant_critical: ~~(row.enchantCritical),
      mob_enchant_penetrate: ~~(row.enchantPenetrate),
      mob_resistance_sword: ~~(row.resistSword),
      mob_resistance_two_hand: ~~(row.resistTwoHanded),
      mob_resistance_dagger: ~~(row.resistDagger),
      mob_resistance_bell: ~~(row.resistBell),
      mob_resistance_fan: ~~(row.resistFan),
      mob_resistance_bow: ~~(row.resistBow),
      mob_resistance_fire: ~~(row.resistFire),
      mob_resistance_electric: ~~(row.resistElectric),
      mob_resistance_magic: ~~(row.resistMagic),
      mob_resistance_wind: ~~(row.resistWind),
      mob_resistance_poison: ~~(row.resistPoison),
      mob_damage_multiplier: parseFloat(row.damageMultiplier),
      mob_summon_mob_id: ~~(row.summonMobId),
      mob_drain: ~~(row.drain),
      mob_color: ~~(row.color),
      mob_polymorph_item_id: ~~(row.polymorphItemId),
      mob_skill_id0: ~~(row.skillId0),
      mob_skill_level0: ~~(row.skillLevel0),
      mob_skill_id1: ~~(row.skillId1),
      mob_skill_level1: ~~(row.skillLevel1),
      mob_skill_id2: ~~(row.skillId2),
      mob_skill_level2: ~~(row.skillLevel2),
      mob_skill_id3: ~~(row.skillId3),
      mob_skill_level3: ~~(row.skillLevel3),
      mob_skill_id4: ~~(row.skillId4),
      mob_skill_level4: ~~(row.skillLevel4),
      mob_berserk: ~~(row.berserk),
      mob_stone_skin: ~~(row.stoneSkin),
      mob_god_speed: ~~(row.godSpeed),
      mob_death_blow: ~~(row.deathBlow),
      mob_revive: ~~(row.revive),
    }

    if (format === GameMobProtoFormat.VERSION_2022) {
      mob.mob_scale_percent = ~~(row.scalePercent)

      mob.mob_sung_ma_strength = ~~(row.sungMaStrength)
      mob.mob_sung_ma_dexterity = ~~(row.sungMaDexterity)
      mob.mob_sung_ma_health = ~~(row.sungMaHealth)
      mob.mob_sung_ma_intelligence = ~~(row.sungMaIntelligence)
      mob.mob_sung_ma_experience = ~~(row.sungMaExperience)

      mob.mob_resistance_fist = ~~(row.resistFist)
      mob.mob_resistance_claw = ~~(row.resistClaw)
      mob.mob_resistance_bleed = ~~(row.resistBleeding)
      mob.mob_resistance_dark = ~~(row.resistDark)
      mob.mob_resistance_ice = ~~(row.resistIce)
      mob.mob_resistance_earth = ~~(row.resistEarth)

      mob.mob_attribute_electric = ~~(row.attributeElectric)
      mob.mob_attribute_fire = ~~(row.attributeFire)
      mob.mob_attribute_ice = ~~(row.attributeIce)
      mob.mob_attribute_wind = ~~(row.attributeWind)
      mob.mob_attribute_earth = ~~(row.attributeEarth)
      mob.mob_attribute_dark = ~~(row.attributeDark)

      mob.mob_heal = ~~(row.heal)
      mob.mob_range_attack_speed = ~~(row.rangeAttackSpeed)
      mob.mob_range_cast_speed = ~~(row.rangeCastSpeed)
      mob.mob_health_regeneration = ~~(row.healthRegeneration)
      mob.mob_hit_range = ~~(row.hitRange)
    }

    return mob
  }

  private transformMobToMobProtoRow(mob: IMob) {
    if (!mob.name) return undefined

    const aiFlags = getFlagsByFlagId(GameMobProtoAiFlag, mob.aiFlagId)
    const raceFlags = getFlagsByFlagId(GameMobProtoRaceFlag, mob.raceFlagId)
    const immuneFlags = getFlagsByFlagId(GameMobProtoImmuneFlag, mob.immuneFlagId)

    return [
      mob.id,
      mob.name,
      GameMobProtoRank[mob.rank],
      GameMobProtoType[mob.type],
      GameMobProtoBattleType[mob.battleType],
      mob.level,
      GameMobProtoSize[mob.size],
      aiFlags.length ? aiFlags.join(',') : "",
      mob.mount,
      raceFlags.length ? raceFlags.join(',') : "",
      immuneFlags.length ? immuneFlags.join(',') : "",
      mob.empireId,
      mob.folder,
      mob.clickType,
      mob.strength,
      mob.dexterity,
      mob.health,
      mob.intelligence,
      mob.minDamage,
      mob.maxDamage,
      mob.maxHealth,
      mob.regenerationCycle,
      mob.regenerationPercent,
      mob.minMoney,
      mob.maxMoney,
      mob.experience,
      mob.defense,
      mob.attackSpeed,
      mob.movementSpeed,
      mob.aggressiveHealthPercent,
      mob.aggressiveSight,
      mob.attackRange,
      0,
      mob.resurrectionMobId,
      mob.enchantCurse,
      mob.enchantSlow,
      mob.enchantPoison,
      mob.enchantStun,
      mob.enchantCritical,
      mob.enchantPenetrate,
      mob.resistanceSword,
      mob.resistanceTwoHand,
      mob.resistanceDagger,
      mob.resistanceBell,
      mob.resistanceFan,
      mob.resistanceBow,
      mob.resistanceFire,
      mob.resistanceElectric,
      mob.resistanceMagic,
      mob.resistanceWind,
      mob.resistancePoison,
      mob.damageMultiplier,
      mob.summonMobId,
      mob.drain,
      mob.color,
      mob.polymorphItemId,
      mob.skillLevel0,
      mob.skillId0,
      mob.skillLevel1,
      mob.skillId1,
      mob.skillLevel2,
      mob.skillId2,
      mob.skillLevel3,
      mob.skillId3,
      mob.skillLevel4,
      mob.skillId4,
      mob.berserk,
      mob.stoneSkin,
      mob.godSpeed,
      mob.deathBlow,
      mob.revive
    ]
  }

}