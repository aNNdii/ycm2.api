import { Container, Token } from "../infrastructures/Container"

import { merge } from "../helpers/Object"

import { ItemCraftingItemTable, ItemCraftingTable, ItemSpecialActionTable, ItemTable } from "../interfaces/Item"

import { ItemSpecialAction, IItemSpecialAction, ItemSpecialActionProperties } from "../entities/ItemSpecialAction"
import { ItemCraftingItem, IItemCraftingItem, ItemCraftingItemProperties } from "../entities/ItemCraftingItem"
import { ItemAttribute, IItemAttribute, ItemAttributeProperties } from "../entities/ItemAttribute"
import { ItemCrafting, IItemCrafting, ItemCraftingProperties } from "../entities/ItemCrafting"
import { Item, IItem, ItemProperties } from "../entities/Item"

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryToken } from "./MariaRepository"
import { Repository, IRepository } from "./Repository"
import { GameRepositoryToken } from "./GameRepository"

export const ItemRepositoryToken = new Token<IItemRepository>("ItemRepository")

export type IItemRepository = IRepository & {
  getItems<Entity = IItem, Filter = ItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemRareAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemSpecialActions<Entity = IItemSpecialAction, Filter = ItemSpecialActionProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemCraftings<Entity = IItemCrafting, Filter = ItemCraftingProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemCraftingItems<Entity = IItemCraftingItem, Filter = ItemCraftingItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createItems<Entity = ItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createItemSpecialActions<Entity = ItemSpecialActionTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createItemCraftings<Entity = ItemCraftingTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createItemCraftingItems<Entity = ItemCraftingItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>

  importDatabaseItemProto(options: any): Promise<any>

  truncateItemSpecialActions(): Promise<any>
  truncateItemCraftings(): Promise<any>
  truncateItemCraftingItems(): Promise<any>
}

export class ItemRepository extends Repository implements IItemRepository {

  getItems<Entity = IItem, Filter = ItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItems", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Item(row),
      table: `${cmsDatabase}.item`
    }, options))
  }

  getItemAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemAttributes", options)
  
    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      columns: [
        '*',
        'apply+0 as id',
      ],
      parser: (row: any) => new ItemAttribute(row),
      table: `${playerDatabase}.item_attr`
    }, options))
  }

  getItemRareAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemRareAttributes", options)
  
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()

    return this.getItemAttributes<Entity, Filter>(merge({
      table: `${playerDatabase}.item_attr_rare as item_attr`
    }, options))
  }

  getItemSpecialActions<Entity = IItemSpecialAction, Filter = ItemSpecialActionProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemSpecialActions", options)
  
    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new ItemSpecialAction(row),
      table: `${cmsDatabase}.item_special_action`,
      joins: [
        `LEFT JOIN ${cmsDatabase}.item ON item.item_id = item_special_action.item_special_action_parent_item_id`
      ]
    }, options))
  }

  getItemCraftings<Entity = IItemCrafting, Filter = ItemCraftingProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemCraftings", options)
  
    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new ItemCrafting(row),
      table: `${cmsDatabase}.item_crafting`
    }, options))
  }

  getItemCraftingItems<Entity = IItemCraftingItem, Filter = ItemCraftingItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemCraftingItems", options)
  
    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new ItemCraftingItem(row),
      table: `${cmsDatabase}.item_crafting_item`,
      joins: [
        `LEFT JOIN ${cmsDatabase}.item_crafting ON item_crafting.item_crafting_id = item_crafting_item.item_crafting_item_item_crafting_id`
      ]
    }, options))
  }

  createItems<Entity = ItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createItems", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.item`
    }, options))
  }

  createItemSpecialActions<Entity = ItemSpecialActionTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createItemSpecialActions", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.item_special_action`
    }, options))
  }

  createItemCraftings<Entity = ItemCraftingTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createItemCraftings", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.item_crafting`
    }, options))
  }

  createItemCraftingItems<Entity = ItemCraftingItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createItemCraftingItems", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.item_crafting_item`
    }, options))
  }

  importDatabaseItemProto(options: any) {
    const { ignore, update } = options || {}

    this.log("importDatabaseItemProto", { ignore, update })

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const playerDatabase = gameRepository.getPlayerDatabaseName()
    const cmsDatabase = gameRepository.getCmsDatabaseName()

    const query = ` INSERT ${ignore ? 'IGNORE' : ''} INTO ${cmsDatabase}.item
                    ( 
                      item_id,
                      item_name,
                      item_locale_name,
                      item_type,
                      item_subtype,
                      item_size,
                      item_flag_id,
                      item_anti_flag_id,
                      item_wear_flag_id,
                      item_immune_flag_id,
                      item_shop _buy_price,
                      item_shop_sell_price,
                      item_refine_item_id,
                      item_refine_id,
                      item_magic_percent,
                      item_limit_type_0,
                      item_limit_value_0,
                      item_limit_type_1,
                      item_limit_value_1,
                      item_attribute_0,
                      item_attribute_value_0,
                      item_attribute1,
                      item_attribute_value_1,
                      item_attribute2,
                      item_attribute_value_2,
                      item_attribute3,
                      item_attribute_value_3,
                      item_value_0,
                      item_value_1,
                      item_value_2,
                      item_value_3,
                      item_value_4,
                      item_value_5,
                      item_socket_0,
                      item_socket_1,
                      item_socket_2,
                      item_socket_3,
                      item_socket_4,
                      item_socket_5,
                      item_specular_percent,
                      item_socket_count,
                      item_masked_type,
                      item_masked_subtype,
                      item_refine_element_apply_type,
                      item_refine_element_grade,
                      item_refine_element_value,
                      item_refine_element_bonus,
                      item_67_attribute_item_id
                    )
                    SELECT  vnum,
                            cast(name AS CHAR COLLATE euckr_bin),
                            cast(locale_name AS CHAR COLLATE latin1_swedish_ci),
                            type,
                            subtype,
                            size,
                            flag,
                            antiflag,
                            wearflag,
                            immuneflag,
                            shop_buy_price,
                            gold,
                            refined_vnum,
                            refine_set,
                            magic_pct,
                            limittype0,
                            limitvalue0,
                            limittype1,
                            limitvalue1,
                            applytype0,
                            applyvalue0,
                            applytype1,
                            applyvalue1,
                            applytype2,
                            applyvalue2,
                            0,
                            0,
                            value0,
                            value1,
                            value2,
                            value3,
                            value4,
                            value5,
                            socket0,
                            socket1,
                            socket2,
                            socket3,
                            socket4,
                            socket5,
                            specular,
                            socket_pct,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                    FROM    ${playerDatabase}.item_proto 
                    `

    return mariaRepository.query(query)
  }

  truncateItemSpecialActions() {
    this.log("truncateItemSpecialActions")

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.truncateEntities(`${cmsDatabase}.item_special_action`)
  }

  truncateItemCraftings() {
    this.log("truncateItemCraftings")

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.truncateEntities(`${cmsDatabase}.item_crafting`)
  }

  truncateItemCraftingItems() {
    this.log("truncateItemCraftingItems")

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.truncateEntities(`${cmsDatabase}.item_crafting_item`)
  }

}