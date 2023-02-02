import Container, { Token } from "../infrastructures/Container";

import { chunks } from "../helpers/Array"

import { EntityFilter } from "../interfaces/Entity";

import { GameItemProtoFormat } from "../interfaces/GameItem";
import { ItemAttribute, ItemTable } from "../interfaces/Item";

import { ItemRepositoryToken } from "../repositories/ItemRepository";

import { IItemAttribute, ItemAttributeProperties } from "../entities/ItemAttribute";
import { IItem, ItemProperties } from "../entities/Item";

import EntityService, { EntityOptions, IEntityService } from "./EntityService";
import { GameItemServiceToken } from './GameItemService';
import { PaginationOptions } from "./PaginationService"; 

export const ItemServiceToken = new Token<IItemService>("ItemService")

export type ItemImportOptions = {
  update?: boolean
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

export type ItemServiceOptions = EntityOptions & {}

export type IItemService = IEntityService & {
  getItemPaginationOptions(args: any): PaginationOptions

  getItems(options?: ItemOptions): Promise<IItem[]>
  getItemAttributes(options?: ItemAttributeOptions): Promise<IItemAttribute[]>

  importItemProto(path: string, options?: ItemProtoImportOptions): Promise<any>
  importItemNames(path: string, options?: ItemImportOptions): Promise<any>
  importItemList(path: string, options?: ItemImportOptions): Promise<any>
  importItemBlend(path: string, options?: ItemImportOptions): Promise<any>
}

export default class ItemService extends EntityService<ItemServiceOptions> implements IItemService {

  getItemPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => [parseInt(offset)] })
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

  async getItemAttributes(options?: ItemAttributeOptions) {
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
        'item_apply_type0',
        'item_apply_value0',
        'item_apply_type1',
        'item_apply_value1',
        'item_apply_type2',
        'item_apply_value2',
        'item_apply_type3',
        'item_apply_value3',
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
        'item_blend_apply_type',
        'item_blend_apply_value0',
        'item_blend_apply_duration0',
        'item_blend_apply_value1',
        'item_blend_apply_duration1',
        'item_blend_apply_value2',
        'item_blend_apply_duration2',
        'item_blend_apply_value3',
        'item_blend_apply_duration3',
        'item_blend_apply_value4',
        'item_blend_apply_duration4',
      ] : undefined
    }))

    return Promise.all(itemPromises)
  }

}