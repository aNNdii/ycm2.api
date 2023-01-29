import { Token } from "../infrastructures/Container"

import { merge } from "../helpers/Object"

import { ItemTable } from "../interfaces/Item"

import ItemAttribute, { IItemAttribute, ItemAttributeProperties } from "../entities/ItemAttribute"
import Item, { IItem, ItemProperties } from "../entities/Item"

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions } from "./MariaRepository"
import GameRepository, { GameDatabase, IGameRepository } from "./GameRepository"

export const ItemRepositoryToken = new Token<IItemRepository>("ItemRepository")

export type IItemRepository = IGameRepository & {
  getItems<Entity = IItem, Filter = ItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getItemRareAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  
  createItems<Entity = ItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  
  importDatabaseItemProto(options: any): Promise<any>
}

export default class ItemRepository extends GameRepository implements IItemRepository {

  getItems<Entity = IItem, Filter = ItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Item(row),
      table: `${cmsDatabase}.item`
    }, options))
  }

  createItems<Entity = ItemTable, Response = any>(options?: MariaRepositoryInsertOptions<Entity>) {
    this.log("createItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.item`
    }, options))
  }

  getItemAttributes<Entity = IItemAttribute, Filter = ItemAttributeProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getItemAttributes", options)
  
    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)

    return this.getEntities<Entity, Filter>(merge({
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
  
    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)

    return this.getItemAttributes<Entity, Filter>(merge({
      table: `${playerDatabase}.item_attr_rare as item_attr`
    }, options))
  }

  importDatabaseItemProto(options: any) {
    const { ignore, update } = options || {}

    this.log("importDatabaseItemProto", { ignore, update })

    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)
    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

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
                      item_apply_type_0,
                      item_apply_value_0,
                      item_apply_type_1,
                      item_apply_value_1,
                      item_apply_type_2,
                      item_apply_value_2,
                      item_apply_type_3,
                      item_apply_value_3,
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

    return this.query(query)
  }

}