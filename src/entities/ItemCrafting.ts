import { EntityTableFilter } from "../interfaces/Entity";
import { ItemCraftingTable } from "../interfaces/Item";

import Entity, { IEntity } from "./Entity";

export type ItemCraftingProperties = EntityTableFilter<"item_crafting", ItemCraftingTable>

export type IItemCrafting = IEntity & {
  id: number
  hashId: string
  mobId: number
  itemId: number
  itemQuantity: number
  price: number
  probability: number
  createdDate: string
  modifiedDate: string
}

export default class ItemCrafting extends Entity<ItemCraftingProperties> implements IItemCrafting {

  get id() {
    return this.getProperty("item_crafting.item_crafting_id")
  }  

  get hashId() {
    return ""
  }

  get mobId() {
    return this.getProperty("item_crafting.item_crafting_mob_id")
  }

  get itemId() {
    return this.getProperty("item_crafting.item_crafting_item_id")
  }

  get itemQuantity() {
    return this.getProperty("item_crafting.item_crafting_item_quantity")
  }

  get price() {
    return this.getProperty("item_crafting.item_crafting_price")
  }

  get probability() {
    return this.getProperty("item_crafting.item_crafting_probability")
  }

  get createdDate() {
    return this.getProperty("item_crafting.item_crafting_created_date")
  }

  get modifiedDate() {
    return this.getProperty("item_crafting.item_crafting_modified_date")
  }

}