import { Container, Token } from "../infrastructures/Container";

import { chunks } from "../helpers/Array"

import { EntityFilter, EntityFilterMethod } from "../interfaces/Entity";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { MobItemTable, MobRankItemTable } from "../interfaces/Mob";

import { ItemRepositoryToken } from "../repositories/ItemRepository";
import { MobRepositoryToken } from "../repositories/MobRepository";

import { IMobGroupGroupMobGroup, MobGroupGroupMobGroupProperties } from "../entities/MobGroupGroupMobGroup";
import { IMobGroupGroup, MobGroupGroupProperties } from "../entities/MobGroupGroup";
import { IMobGroupMob, MobGroupMobProperties } from "../entities/MobGroupMob";
import { IMobRankItem, MobRankItemProperties } from "../entities/MobRankItem";
import { IMobGroup, MobGroupProperties } from "../entities/MobGroup";
import { IMobItem, MobItemProperties } from "../entities/MobItem";
import { IMob, MobProperties } from "../entities/Mob";

import { EntityService, EntityOptions, IEntityService } from "./EntityService";
import { GameMobServiceToken } from "./GameMobService";
import { PaginationOptions } from "./PaginationService";

export const MobServiceToken = new Token<IMobService>("MobService")

export type MobImportOptions = {
  update?: boolean
}

export type MobItemsImportOptions = {
  override?: boolean
}

export type MobOptions = PaginationOptions & {
  id?: EntityFilter<number>
  rankId?: EntityFilter<number>
}

export type MobItemOptions = PaginationOptions & {
  id?: EntityFilter<number>
  itemId?: EntityFilter<number>
  mobId?: EntityFilter<number>
}

export type MobRankItemOptions = PaginationOptions & {
  id?: EntityFilter<number>
  mobRankId?: EntityFilter<number>
  itemId?: EntityFilter<number>
}

export type MobGroupOptions = PaginationOptions & {
  id?: EntityFilter<number>
}

export type MobGroupMobOptions = PaginationOptions & {
  id?: EntityFilter<number>
  mobId?: EntityFilter<number>
  mobGroupId?: EntityFilter<number>
}

export type MobGroupGroupMobGroupOptions = PaginationOptions & {
  id?: EntityFilter<number>
  mobGroupGroupId?: EntityFilter<number>
  mobGroupId?: EntityFilter<number>
}

export type MobProtoImportOptions = MobImportOptions & {
  format?: any
}

export type MobServiceOptions = EntityOptions & {
  mobItemObfuscationSalt: string
  mobRankItemObfuscationSalt: string
  mobGroupObfuscationSalt: string
  mobGroupMobObfuscationSalt: string
  mobGroupGroupObfuscationSalt: string
  mobGroupGroupMobGroupObfuscationSalt: string
}

export type IMobService = IEntityService & {
  obfuscateMobItemId(id: any): string
  deobfuscateMobItemId(value: string | string[]): number[]
  obfuscateMobRankItemId(id: any): string
  deobfuscateMobRankItemId(value: string | string[]): number[]
  obfuscateMobGroupId(id: any): string
  deobfuscateMobGroupId(value: string | string[]): number[]
  obfuscateMobGroupMobId(id: any): string
  deobfuscateMobGroupMobId(value: string | string[]): number[]
  obfuscateMobGroupGroupId(id: any): string
  deobfuscateMobGroupGroupId(value: string | string[]): number[]
  obfuscateMobGroupGroupMobGroupId(id: any): string
  deobfuscateMobGroupGroupMobGroupId(value: string | string[]): number[]

  getMobGroupGroupMobGroupPaginationOptions(args: any): PaginationOptions
  getMobGroupGroupPaginationOptions(args: any): PaginationOptions
  getMobGroupMobPaginationOptions(args: any): PaginationOptions
  getMobGroupPaginationOptions(args: any): PaginationOptions
  getMobRankItemPaginationOptions(args: any): PaginationOptions
  getMobItemPaginationOptions(args: any): PaginationOptions
  getMobPaginationOptions(args: any): PaginationOptions

  getMobs(options?: MobOptions): Promise<IMob[]>
  getMobItems(options?: MobItemOptions): Promise<IMobItem[]>
  getMobRankItems(options?: MobRankItemOptions): Promise<IMobRankItem[]>
  getMobGroups(options?: MobGroupOptions): Promise<IMobGroup[]>
  getMobGroupMobs(options?: MobGroupMobOptions): Promise<IMobGroupMob[]>
  getMobGroupGroups(options?: MobGroupOptions): Promise<IMobGroupGroup[]>
  getMobGroupGroupMobGroups(options?: MobGroupGroupMobGroupOptions): Promise<IMobGroupGroupMobGroup[]>

  importMobProto(path: string, options?: MobProtoImportOptions): Promise<any>
  importMobProtoFromDatabase(options?: MobImportOptions): Promise<any>
  importMobNames(path: string, options?: MobImportOptions): Promise<any>
  importMobDropItem(path: string, options?: MobItemsImportOptions): Promise<any>
  importCommonDropItem(path: string, options?: MobItemsImportOptions): Promise<any>
  importMobGroup(path: string, options?: MobItemsImportOptions): Promise<any>
  importMobGroupGroup(path: string, options?: MobItemsImportOptions): Promise<any>
}

export class MobService extends EntityService<MobServiceOptions> implements IMobService {

  obfuscateMobItemId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobItemObfuscationSalt })
  }

  deobfuscateMobItemId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOB_ITEM_INVALID_ID,
      salt: this.options.mobItemObfuscationSalt,
    })
  }

  obfuscateMobRankItemId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobRankItemObfuscationSalt })
  }

  deobfuscateMobRankItemId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOB_RANK_ITEM_INVALID_ID,
      salt: this.options.mobItemObfuscationSalt,
    })
  }

  obfuscateMobGroupId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobGroupObfuscationSalt })
  }

  deobfuscateMobGroupId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOP_GROUP_INVALID_ID,
      salt: this.options.mobGroupObfuscationSalt,
    })
  }

  obfuscateMobGroupMobId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobGroupMobObfuscationSalt })
  }

  deobfuscateMobGroupMobId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOB_GROUP_MOB_INVALID_ID,
      salt: this.options.mobGroupMobObfuscationSalt,
    })
  }

  obfuscateMobGroupGroupId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobGroupGroupObfuscationSalt })
  }

  deobfuscateMobGroupGroupId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOB_GROUP_GROUP_INVALID_ID,
      salt: this.options.mobGroupGroupObfuscationSalt,
    })
  }

  obfuscateMobGroupGroupMobGroupId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mobGroupGroupMobGroupObfuscationSalt })
  }

  deobfuscateMobGroupGroupMobGroupId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MOB_GROUP_GROUP_MOB_GROUP_INVALID_ID,
      salt: this.options.mobGroupGroupMobGroupObfuscationSalt,
    })
  }

  getMobRankItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobRankItemId(offset) })
  }

  getMobGroupGroupMobGroupPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobGroupGroupMobGroupId(offset) })
  }

  getMobGroupGroupPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobGroupGroupId(offset) })
  }

  getMobGroupMobPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobGroupMobId(offset) })
  }

  getMobGroupPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobGroupId(offset) })
  }

  getMobItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMobItemId(offset) })
  }

  getMobPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => [parseInt(offset)] })
  }

  getMobs(options?: MobOptions) {
    const {
      id,
      rankId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMobs", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob.mob_id' })

    const filter: MobProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob.mob_id"] = id
    if (rankId !== undefined) filter["mob.mob_rank"] = rankId

    return mobRepository.getMobs({ filter, where, order, limit })
  }

  getMobItems(options?: MobItemOptions) {
    const {
      id,
      itemId,
      mobId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMobItems", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_item.mob_item_id' })

    const filter: MobItemProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_item.mob_item_id"] = id
    if (itemId) filter["mob_item.mob_item_item_id"] = itemId
    if (mobId) filter["mob_item.mob_item_mob_id"] = mobId

    return mobRepository.getMobItems({ filter, where, order, limit })
  }

  getMobRankItems(options?: MobRankItemOptions) {
    const {
      id, 
      itemId,
      mobRankId, 
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMobRankItems", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_rank_item.mob_rank_item_id' })

    const filter: MobRankItemProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_rank_item.mob_rank_item_id"] = id
    if (itemId) filter["mob_rank_item.mob_rank_item_item_id"] = itemId
    if (mobRankId) filter["mob_rank_item.mob_rank_item_mob_rank"] = mobRankId

    return mobRepository.getMobRankItems({ filter, where, order, limit })
  }

  getMobGroups(options?: MobGroupOptions) {
    const {
      id,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMobGroups", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_group.mob_group_id' })

    const filter: MobGroupProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_group.mob_group_id"] = id

    return mobRepository.getMobGroups({ filter, where, order, limit })
  }

  getMobGroupMobs(options?: MobGroupMobOptions) {
    const {
      id,
      mobGroupId,
      mobId,
      orderId,
      offset,
      limit,
    } = options || {}

    this.log("getMobGroupMobs", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_group_mob.mob_group_mob_id' })

    const filter: MobGroupMobProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_group_mob.mob_group_mob_id"] = id
    if (mobGroupId) filter["mob_group_mob.mob_group_mob_mob_group_id"] = mobGroupId
    if (mobId) filter["mob_group_mob.mob_group_mob_mob_id"] = mobId

    return mobRepository.getMobGroupMobs({ filter, where, order, limit })
  } 

  getMobGroupGroups(options?: MobGroupOptions) {
    const {
      id,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMobGroupGroups", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_group_group.mob_group_group_id' })

    const filter: MobGroupGroupProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_group_group.mob_group_group_id"] = id

    return mobRepository.getMobGroupGroups({ filter, where, order, limit })
  }

  getMobGroupGroupMobGroups(options?: MobGroupGroupMobGroupOptions) {
    const {
      id,
      mobGroupId,
      mobGroupGroupId,
      orderId,
      offset,
      limit,
    } = options || {}

    this.log("getMobGroupGroupMobGroups", options)

    const mobRepository = Container.get(MobRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'mob_group_group_mob_group.mob_group_group_mob_group_id' })

    const filter: MobGroupGroupMobGroupProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["mob_group_group_mob_group.mob_group_group_mob_group_id"] = id
    if (mobGroupId) filter["mob_group_group_mob_group.mob_group_group_mob_group_mob_group_id"] = mobGroupId
    if (mobGroupGroupId) filter["mob_group_group_mob_group.mob_group_group_mob_group_mob_group_group_id"] = mobGroupGroupId

    return mobRepository.getMobGroupGroupMobGroups({ filter, where, order, limit })
  }

  async importMobProto(path: string, options?: MobProtoImportOptions) {
    const { update, format } = options || {}

    this.log("importMobProto", { path, update, format })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const mobs = await gameMobService.readMobProto(path, { format })
    const mobChunks = chunks(mobs, 500)

    const mobPromises = mobChunks.map(entities => mobRepository.createMobs({
      entities,
      ignore: true,
      duplicate: update ? [
        'mob_name',
        'mob_rank',
        'mob_type',
        'mob_battle_type',
        'mob_level',
        'mob_scale_percent',
        'mob_size',
        'mob_mount',
        'mob_ai_flag_id',
        'mob_race_flag_id',
        'mob_immune_flag_id',
        'mob_empire_id',
        'mob_folder',
        'mob_click_type',
        'mob_strength',
        'mob_dexterity',
        'mob_health',
        'mob_intelligence',
        'mob_experience',
        'mob_sung_ma_strength',
        'mob_sung_ma_dexterity',
        'mob_sung_ma_health',
        'mob_sung_ma_intelligence',
        'mob_sung_ma_experience',
        'mob_defense',
        'mob_attack_speed',
        'mob_movement_speed',
        'mob_damage_min',
        'mob_damage_max',
        'mob_health_max',
        'mob_money_min',
        'mob_money_max',
        'mob_regeneration_cycle',
        'mob_regeneration_percent',
        'mob_aggressive_health_percent',
        'mob_aggressive_sight',
        'mob_attack_range',
        'mob_resurrection_mob_id',
        'mob_enchant_curse',
        'mob_enchant_slow',
        'mob_enchant_poison',
        'mob_enchant_stun',
        'mob_enchant_critical',
        'mob_enchant_penetrate',
        'mob_resistance_fist',
        'mob_resistance_sword',
        'mob_resistance_two_hand',
        'mob_resistance_dagger',
        'mob_resistance_bell',
        'mob_resistance_fan',
        'mob_resistance_bow',
        'mob_resistance_claw',
        'mob_resistance_fire',
        'mob_resistance_electric',
        'mob_resistance_magic',
        'mob_resistance_wind',
        'mob_resistance_poison',
        'mob_resistance_bleed',
        'mob_resistance_dark',
        'mob_resistance_ice',
        'mob_resistance_earth',
        'mob_attribute_electric',
        'mob_attribute_fire',
        'mob_attribute_ice',
        'mob_attribute_wind',
        'mob_attribute_earth',
        'mob_attribute_dark',
        'mob_damage_multiplier',
        'mob_summon_mob_id',
        'mob_color',
        'mob_polymorph_item_id',
        'mob_skill_id0',
        'mob_skill_level0',
        'mob_skill_id1',
        'mob_skill_level1',
        'mob_skill_id2',
        'mob_skill_level2',
        'mob_skill_id3',
        'mob_skill_level3',
        'mob_skill_id4',
        'mob_skill_level4',
        'mob_drain',
        'mob_berserk',
        'mob_stone_skin',
        'mob_god_speed',
        'mob_death_blow',
        'mob_revive',
        'mob_heal',
        'mob_range_attack_speed',
        'mob_range_cast_speed',
        'mob_health_regeneration',
        'mob_hit_range',
      ] : undefined
    }))

    return Promise.all(mobPromises)
  }

  async importMobProtoFromDatabase(options?: MobImportOptions) {
    const { update } = options || {}

    this.log("importMobProtoFromDatabase", { update })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const gameMobs = await mobRepository.getGameMobs()

    const mobs = gameMobs.map(gameMobService.transformGameMobToMob)
    const mobChunks = chunks(mobs, 500)

    const mobPromises = mobChunks.map(entities => mobRepository.createMobs({
      entities,
      ignore: true,
      duplicate: update ? [
        'mob_rank',
        'mob_type',
        'mob_battle_type',
        'mob_level',
        'mob_size',
        'mob_mount',
        'mob_ai_flag_id',
        'mob_race_flag_id',
        'mob_immune_flag_id',
        'mob_empire_id',
        'mob_folder',
        'mob_click_type',
        'mob_strength',
        'mob_dexterity',
        'mob_health',
        'mob_intelligence',
        'mob_experience',
        'mob_defense',
        'mob_attack_speed',
        'mob_movement_speed',
        'mob_damage_min',
        'mob_damage_max',
        'mob_health_max',
        'mob_money_min',
        'mob_money_max',
        'mob_regeneration_cycle',
        'mob_regeneration_percent',
        'mob_aggressive_health_percent',
        'mob_aggressive_sight',
        'mob_attack_range',
        'mob_resurrection_mob_id',
        'mob_enchant_curse',
        'mob_enchant_slow',
        'mob_enchant_poison',
        'mob_enchant_stun',
        'mob_enchant_critical',
        'mob_enchant_penetrate',
        'mob_resistance_sword',
        'mob_resistance_two_hand',
        'mob_resistance_dagger',
        'mob_resistance_bell',
        'mob_resistance_fan',
        'mob_resistance_bow',
        'mob_resistance_fire',
        'mob_resistance_electric',
        'mob_resistance_magic',
        'mob_resistance_wind',
        'mob_resistance_poison',
        'mob_damage_multiplier',
        'mob_summon_mob_id',
        'mob_color',
        'mob_polymorph_item_id',
        'mob_skill_id0',
        'mob_skill_level0',
        'mob_skill_id1',
        'mob_skill_level1',
        'mob_skill_id2',
        'mob_skill_level2',
        'mob_skill_id3',
        'mob_skill_level3',
        'mob_skill_id4',
        'mob_skill_level4',
        'mob_drain',
        'mob_berserk',
        'mob_stone_skin',
        'mob_god_speed',
        'mob_death_blow',
        'mob_revive',
      ] : undefined
    }))

    return Promise.all(mobPromises)
  }

  async importMobNames(path: string, options?: MobImportOptions) {
    const { update } = options || {}

    this.log("importMobNames", { path, update })

    const gameMobService = Container.get(GameMobServiceToken)
    const mobRepository = Container.get(MobRepositoryToken)

    const mobs = await gameMobService.readMobNames(path, {
      transform: (row: any) => ({ mob_id: row.id, mob_locale_name: row.name })
    })

    const mobChunks = chunks(mobs, 500)
    const mobPromises = mobChunks.map(entities => mobRepository.createMobs({
      entities,
      duplicate: update ? ['mob_locale_name'] : undefined
    }))

    return Promise.all(mobPromises)

  }

  async importMobDropItem(path: string, options?: MobItemsImportOptions) {
    const { override } = options || {}

    this.log("importMobDropItem", { path, override })

    const mobRepository = Container.get(MobRepositoryToken)   
    const gameMobService = Container.get(GameMobServiceToken)

    if (override) await mobRepository.truncateMobItems()

    const [itemsById, itemsByName] = await gameMobService.readMobDropItem(path)

    return Promise.all([
      itemsById.length ? this.importMobDropItemItems(itemsById) : null,
      itemsByName.length ? this.importMobDropItemItemsByName(itemsByName) : null,
    ])
  }

  async importCommonDropItem(path: string, options?: MobItemsImportOptions) {
    const { override } = options || {}

    this.log("importCommonDropItem", { path, override })

    const mobRepository = Container.get(MobRepositoryToken)   
    const gameMobService = Container.get(GameMobServiceToken)

    if (override) await mobRepository.truncateMobRankItems()

    const [mobRankItemsById, mobRankItemsByName] = await gameMobService.readCommonDropItem(path)

    return Promise.all([
      mobRankItemsById.length ? this.importCommonDropItemItems(mobRankItemsById) : null,
      mobRankItemsByName.length ? this.importCommonDropItemItemsByName(mobRankItemsByName) : null,
    ])
  }

  async importMobGroup(path: string, options?: MobItemsImportOptions) {
    const { override } = options || {}

    this.log("importMobGroup", { path, override })

    const mobRepository = Container.get(MobRepositoryToken)   
    const gameMobService = Container.get(GameMobServiceToken)

    if (override) await Promise.all([
      mobRepository.truncateMobGroups(),
      mobRepository.truncateMobGroupMobs()
    ])

    const [groups, groupMobs] = await gameMobService.readMobGroup(path)

    const groupChunks = chunks(groups, 500)
    const groupMobChunks = chunks(groupMobs, 500)
    
    const groupMobCreatePromise = groupMobChunks.map((entities: any) => mobRepository.createMobGroupMobs({ entities }))
    const groupCreatePromise = groupChunks.map((entities: any) => mobRepository.createMobGroups({ 
      duplicate: ['mob_group_name'],
      entities 
    }))
    
    return Promise.all([
      ...groupCreatePromise,
      ...groupMobCreatePromise
    ])
  }

  async importMobGroupGroup(path: string, options?: MobItemsImportOptions) {
    const { override } = options || {}

    this.log("importMobGroupGroup", { path, override })

    const mobRepository = Container.get(MobRepositoryToken)   
    const gameMobService = Container.get(GameMobServiceToken)

    if (override) await Promise.all([
      mobRepository.truncateMobGroupGroups(),
      mobRepository.truncateMobGroupGroupMobGroups()
    ])

    const [groups, groupMobGroups] = await gameMobService.readMobGroupGroup(path)

    const groupChunks = chunks(groups, 500)
    const groupMobGroupChunks = chunks(groupMobGroups, 500)
    
    const groupMobGroupCreatePromise = groupMobGroupChunks.map((entities: any) => mobRepository.createMobGroupGroupMobGroups({ entities }))
    const groupCreatePromise = groupChunks.map((entities: any) => mobRepository.createMobGroupGroups({ 
      duplicate: ['mob_group_group_name'],
      entities 
    }))
    
    return Promise.all([
      ...groupCreatePromise,
      ...groupMobGroupCreatePromise
    ])
  }

  private async importMobDropItemItems(mobItems: any[]) {
    this.log("importMobDropItemItems", { mobItems })

    const mobRepository = Container.get(MobRepositoryToken)

    const entities: MobItemTable[] = []

    mobItems.map(mobItem => {
      const { mobId, typeId, levelLimit, delta, itemId, quantity, probability, rareProbability } = mobItem

      entities.push({
        mob_item_mob_id: mobId,
        mob_item_type: typeId,
        mob_item_level_limit: levelLimit,
        mob_item_delta: delta,
        mob_item_item_id: itemId,
        mob_item_quantity: quantity,
        mob_item_probability: probability,
        mob_item_rare_probability: rareProbability
      })
    })

    const mobItemChunks = chunks(entities, 500)
    const mobItemCreatePromises = mobItemChunks.map((entities: any) => mobRepository.createMobItems({ entities }))

    return Promise.all(mobItemCreatePromises)
  }

  private async importMobDropItemItemsByName(mobItemsByName: any[]) {
    this.log("importMobDropItemItemsByName", { mobItemsByName })

    const mobItemsById: any[] = []

    const itemRepository = Container.get(ItemRepositoryToken)
    
    const itemNames = mobItemsByName.map(groupItem => groupItem.itemName)
    const items = await itemRepository.getItems({
      filter: { "item.item_name": [EntityFilterMethod.IN, itemNames] }
    })

    const itemsByName = items.reduce((items: any, item) => {
      items[item.name] = items[item.name] || item
      return items
    }, {})

    mobItemsByName.map(mobItem => {
      const { itemName } = mobItem

      const item = itemName ? itemsByName[itemName] : undefined
      if (!item) {
        this.log("importMobDropItemItemsByNameItemNotFound", { ...mobItem })
        return
      }

      mobItemsById.push({
        ...mobItem,
        itemId: item.id,
      })
    })

    return this.importMobDropItemItems(mobItemsById)
  }

  private async importCommonDropItemItems(mobRankItems: any[]) {
    this.log("importCommonDropItemItems", { mobRankItems })

    const mobRepository = Container.get(MobRepositoryToken)

    const entities: MobRankItemTable[] = []

    mobRankItems.map(mobRankItem => {
      const { rankId, itemId, minLevel, maxLevel, probability } = mobRankItem

      entities.push({
        mob_rank_item_mob_rank: rankId,
        mob_rank_item_item_id: itemId,
        mob_rank_item_level_min: minLevel,
        mob_rank_item_level_max: maxLevel,
        mob_rank_item_probability: probability
      })
    })

    const mobRankItemChunks = chunks(entities, 500)
    const mobRankItemCreatePromises = mobRankItemChunks.map((entities: any) => mobRepository.createMobRankItems({ entities }))

    return Promise.all(mobRankItemCreatePromises)

  }

  private async importCommonDropItemItemsByName(mobRankItemsByName: any[]) {
    this.log("importCommonDropItemItemsByName", { mobRankItemsByName })

    const mobItemsById: any[] = []

    const itemRepository = Container.get(ItemRepositoryToken)
    
    const itemNames = mobRankItemsByName.map(rankItem => rankItem.itemName)
    const items = await itemRepository.getItems({
      filter: { "item.item_name": [EntityFilterMethod.IN, itemNames] }
    })

    const itemsByName = items.reduce((items: any, item) => {
      items[item.name] = items[item.name] || item
      return items
    }, {})

    mobRankItemsByName.map(mobRankItem => {
      const { itemName } = mobRankItem

      const item = itemName ? itemsByName[itemName] : undefined
      if (!item) {
        this.log("importCommonDropItemItemsByNameItemNotFound", { ...mobRankItem })
        return
      }

      mobItemsById.push({
        ...mobRankItem,
        itemId: item.id,
      })
    })

    return this.importCommonDropItemItems(mobItemsById)

  }

}