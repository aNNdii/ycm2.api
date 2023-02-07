import Container, { Token } from "../infrastructures/Container";

import { chunks } from "../helpers/Array"

import { EntityFilter, EntityFilterMethod } from "../interfaces/Entity";

import { GameItemProtoFormat } from "../interfaces/GameItem";
import { ItemAttribute, ItemSpecialActionTable, ItemTable } from "../interfaces/Item";

import { ItemRepositoryToken } from "../repositories/ItemRepository";

import { IItemAttribute, ItemAttributeProperties } from "../entities/ItemAttribute";
import { IItem, ItemProperties } from "../entities/Item";

import EntityService, { EntityOptions, IEntityService } from "./EntityService";
import { GameItemServiceToken } from './GameItemService';
import { PaginationOptions } from "./PaginationService";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { IItemSpecialAction, ItemSpecialActionProperties } from "../entities/ItemSpecialAction";

export const ItemServiceToken = new Token<IItemService>("ItemService")

export type ItemImportOptions = {
  update?: boolean
  override?: boolean
}

export type ItemProtoImportOptions = ItemImportOptions & {
  format?: GameItemProtoFormat
}

export type ItemOptions = PaginationOptions & {
  id?: EntityFilter<number>
  name?: EntityFilter<string>
}

export type ItemAttributeOptions = PaginationOptions & {
  id?: EntityFilter<ItemAttribute>
  rare?: boolean
}

export type ItemSpecialActionOptions = PaginationOptions & {
  id?: EntityFilter<number>
  parentItemId?: EntityFilter<number>
  itemId?: EntityFilter<number>
  mobId?: EntityFilter<number>
  mobGroupId?: EntityFilter<number>
}

export type ItemServiceOptions = EntityOptions & {
  itemSpecialActionObfuscationSalt: string
}

export type IItemService = IEntityService & {
  obfuscateItemSpecialActionId(id: any): string
  deobfuscateItemSpecialActionId(value: string | string[]): number[]

  getItemPaginationOptions(args: any): PaginationOptions
  getItemSpecialActionPaginationOptions(args: any): PaginationOptions

  getItems(options?: ItemOptions): Promise<IItem[]>
  getItemAttributes(options?: ItemAttributeOptions): Promise<IItemAttribute[]>
  getItemSpecialActions(options?: ItemSpecialActionOptions): Promise<IItemSpecialAction[]>

  importItemProto(path: string, options?: ItemProtoImportOptions): Promise<any>
  importItemNames(path: string, options?: ItemImportOptions): Promise<any>
  importItemList(path: string, options?: ItemImportOptions): Promise<any>
  importItemBlend(path: string, options?: ItemImportOptions): Promise<any>
  importItemSpecialGroup(path: string, options?: ItemImportOptions): Promise<any>
}

export default class ItemService extends EntityService<ItemServiceOptions> implements IItemService {

  obfuscateItemSpecialActionId(id: any) {
    return this.obfuscateId(id, { salt: this.options.itemSpecialActionObfuscationSalt })
  }

  deobfuscateItemSpecialActionId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.ITEM_SPECIAL_ACTION_INVALID_ID,
      salt: this.options.itemSpecialActionObfuscationSalt,
    })
  }

  getItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => [parseInt(offset)] })
  }

  getItemSpecialActionPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateItemSpecialActionId(offset) })
  }

  getItems(options?: ItemOptions) {
    const {
      id,
      name,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getItems", options)

    const itemRepository = Container.get(ItemRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'item.item_id' })

    const filter: ItemProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["item.item_id"] = id
    if (name) filter["item.item_name"] = name

    return itemRepository.getItems({ filter, where, order, limit })
  }

  getItemAttributes(options?: ItemAttributeOptions) {
    const {
      id,
      rare,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getItemAttributes", options)

    const itemRepository = Container.get(ItemRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'item_attr.apply' })

    const filter: ItemAttributeProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["item_attr.apply"] = id

    return rare ? itemRepository.getItemRareAttributes({ filter, where, order, limit }) : itemRepository.getItemAttributes({ filter, where, order, limit })
  }

  getItemSpecialActions(options?: ItemSpecialActionOptions) {
    const {
      id,
      parentItemId,
      itemId,
      mobId,
      mobGroupId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getItemSpecialActions", options)

    const itemRepository = Container.get(ItemRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'item_special_action.item_special_action_id' })

    const filter: ItemSpecialActionProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["item_special_action.item_special_action_id"] = id
    if (parentItemId) filter["item_special_action.item_special_action_parent_item_id"] = parentItemId
    if (itemId) filter["item_special_action.item_special_action_item_id"] = itemId
    if (mobId) filter["item_special_action.item_special_action_mob_id"] = mobId
    if (mobGroupId) filter["item_special_action.item_special_action_mob_group_id"] = mobGroupId

    return itemRepository.getItemSpecialActions({ filter, where, order, limit })
  }

  async importItemProto(path: string, options?: ItemProtoImportOptions) {
    const { update, format } = options || {}

    this.log("importItemProto", { path, update, format })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    const items = await gameItemService.readItemProto(path, { format })
    const itemChunks = chunks(items, 500)

    const itemPromises = itemChunks.map(entities => itemRepository.createItems({
      entities,
      duplicate: update ? [
        'item_name',
        'item_type',
        'item_subtype',
        'item_end_id',
        'item_size',
        'item_flag_id',
        'item_anti_flag_id',
        'item_wear_flag_id',
        'item_immune_flag_id',
        'item_shop_buy_price',
        'item_shop_sell_price',
        'item_refine_id',
        'item_refine_item_id',
        'item_attribute_probability',
        'item_limit_type0',
        'item_limit_value0',
        'item_limit_type1',
        'item_limit_value1',
        'item_attribute0',
        'item_attribute1',
        'item_attribute2',
        'item_attribute3',
        'item_attribute_value0',
        'item_attribute_value1',
        'item_attribute_value2',
        'item_attribute_value3',
        'item_value0',
        'item_value1',
        'item_value2',
        'item_value3',
        'item_value4',
        'item_value5',
        'item_socket0',
        'item_socket1',
        'item_socket2',
        'item_socket3',
        'item_socket4',
        'item_socket5',
        'item_specular_percent',
        'item_socket_count',
        'item_attribute_type',
        'item_mask_type',
        'item_mask_subtype',
        'item_refine_element_apply_type',
        'item_refine_element_grade',
        'item_refine_element_value',
        'item_refine_element_bonus',
        'item_rare_attribute_item_id',
      ] : undefined
    }))

    return Promise.all(itemPromises)
  }

  async importItemNames(path: string, options?: ItemImportOptions) {
    const { update } = options || {}

    this.log("importItemNames", { path, update })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    const items = await gameItemService.readItemNames<Partial<ItemTable>>(path, {
      transform: (row: any) => {
        const [id] = row.id.split('~')
        return { item_id: id, item_locale_name: row.name }
      }
    })

    const itemChunks = chunks(items, 500)
    const itemPromises = itemChunks.map(entities => itemRepository.createItems({
      entities,
      duplicate: update ? ['item_locale_name'] : undefined
    }))

    return Promise.all(itemPromises)
  }

  async importItemList(path: string, options?: ItemImportOptions) {
    const { update } = options || {}

    this.log("importItemNames", { path, update })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    const items = await gameItemService.readItemList<Partial<ItemTable>>(path, {
      transform: (row: any) => ({ item_id: row.id, item_icon: row.icon, item_model: row.model })
    })

    const itemChunks = chunks(items, 500)
    const itemPromises = itemChunks.map(entities => itemRepository.createItems({
      entities,
      duplicate: update ? ['item_icon', 'item_model'] : undefined
    }))

    return Promise.all(itemPromises)
  }

  async importItemBlend(path: string, options?: ItemImportOptions) {
    const { update } = options || {}

    this.log("importItemBlend", { path, update })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    const items = await gameItemService.readItemBlend(path)

    const itemChunks = chunks(items, 500)
    const itemPromises = itemChunks.map(entities => itemRepository.createItems({
      entities,
      duplicate: update ? [
        'item_blend_attribute',
        'item_blend_attribute_value0',
        'item_blend_attribute_value1',
        'item_blend_attribute_value2',
        'item_blend_attribute_value3',
        'item_blend_attribute_value4',
        'item_blend_attribute_duration0',
        'item_blend_attribute_duration1',
        'item_blend_attribute_duration2',
        'item_blend_attribute_duration3',
        'item_blend_attribute_duration4',
      ] : undefined
    }))

    return Promise.all(itemPromises)
  }

  async importItemSpecialGroup(path: string, options?: ItemImportOptions) {
    const { override } = options || {}

    this.log("importItemSpecialGroup", { path, override })

    const gameItemService = Container.get(GameItemServiceToken)
    const itemRepository = Container.get(ItemRepositoryToken)

    if (override) await itemRepository.truncateItemSpecialActions()

    const [items, actions, actionsByItemName] = await gameItemService.readItemSpecialGroup(path)

    return Promise.all([
      items?.length ? this.importItemSpecialGroupItems(items) : null,
      actions?.length ? this.importItemSpecialGroupActions(actions) : null,
      actionsByItemName?.length ? this.importItemSpecialGroupActionsByItemName(actionsByItemName) : null
    ])
  }

  private async importItemSpecialGroupItems(items: any[]) {
    this.log("importItemSpecialGroupItems", { items })

    const itemRepository = Container.get(ItemRepositoryToken)

    const entities: Partial<ItemTable>[] = []

    items.map(item => {
      const { itemId, specialTypeId, effect } = item

      entities.push({
        item_id: itemId,
        item_special_type: specialTypeId,
        item_special_effect: effect
      })
    })

    const itemChunks = chunks(entities, 500)
    const itemCreatePromises = itemChunks.map((entities: any) => itemRepository.createItems({
      duplicate: ['item_special_type', 'item_special_effect'],
      entities
    }))

    return Promise.all(itemCreatePromises)

  }

  private async importItemSpecialGroupActions(actions: any[]) {
    this.log("importItemSpecialGroupActions", { actions })

    const itemRepository = Container.get(ItemRepositoryToken)

    const entities: Partial<ItemSpecialActionTable>[] = []

    actions.map(action => {
      const { parentItemId, typeId, itemId, mobId, mobGroupId, attributeId, quantity, probability, rareProbability } = action

      entities.push({
        item_special_action_parent_item_id: parentItemId,
        item_special_action_type: typeId,
        item_special_action_item_id: itemId,
        item_special_action_mob_id: mobId,
        item_special_action_mob_group_id: mobGroupId,
        item_special_action_attribute: attributeId,
        item_special_action_quantity: quantity,
        item_special_action_probability: probability,
        item_special_action_rare_probability: rareProbability
      })
    })

    const actionChunks = chunks(entities, 500)
    const actionCreatePromises = actionChunks.map((entities: any) => itemRepository.createItemSpecialActions({ entities }))

    return Promise.all(actionCreatePromises)
  }

  private async importItemSpecialGroupActionsByItemName(actionsByItemName: any[]) {
    this.log("importItemSpecialGroupActionsByItemName", { actionsByItemName })

    const actions: any[] = []

    const itemRepository = Container.get(ItemRepositoryToken)

    const itemNames = actionsByItemName.map(action => action.itemName)
    const items = await itemRepository.getItems({
      filter: { "item.item_name": [EntityFilterMethod.IN, itemNames] }
    })

    const itemsByName = items.reduce((items: any, item) => {
      items[item.name] = items[item.name] || item
      return items
    }, {})

    actionsByItemName.map(action => {
      const { itemName } = action

      const item = itemName ? itemsByName[itemName] : undefined
      if (!item) {
        this.log("importItemSpecialGroupActionsByItemNameItemNotFound", { ...action })
        return
      }

      actions.push({
        ...action,
        itemId: item.id,
      })
    })

    return this.importItemSpecialGroupActions(actions)
  }

}