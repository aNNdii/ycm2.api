import { EntityTableFilter } from "../interfaces/Entity";
import { ItemCraftingItemTable, ItemCraftingTable } from "../interfaces/Item";

import { Entity, IEntity  } from "./Entity";

export type ItemCraftingItemProperties = EntityTableFilter<"item_crafting_item", ItemCraftingItemTable>
                                       & EntityTableFilter<"item_crafting", ItemCraftingTable>

export type IItemCraftingItem = IEntity & {
  id: number
  hashId: string
  itemCraftingId: number
  itemCraftingItemId: number
  itemCraftingItemQuantity: number
  itemCraftingMobId: number
  itemCraftingPrice: number
  itemCraftingProbability: number
  itemId: number
  itemQuantity: number
  createdDate: string
  modifiedDate: string
}

export class ItemCraftingItem extends Entity<ItemCraftingItemProperties> implements IItemCraftingItem {

  get id() {
    return this.getProperty("item_crafting_item.item_crafting_item_id")
  }

  get hashId() {
    return ""
  }

  get itemCraftingId() {
    return this.getProperty("item_crafting_item.item_crafting_item_item_crafting_id")
  }

  get itemCraftingItemId() {
    return this.getProperty("item_crafting.item_crafting_item_id")
  }

  get itemCraftingItemQuantity() {
    return this.getProperty("item_crafting.item_crafting_item_quantity")
  }

  get itemCraftingMobId() {
    return this.getProperty("item_crafting.item_crafting_mob_id")
  }

  get itemCraftingPrice() {
    return this.getProperty("item_crafting.item_crafting_price")
  }

  get itemCraftingProbability() {
    return this.getProperty("item_crafting.item_crafting_probability")
  }

  get itemId() {
    return this.getProperty("item_crafting_item.item_crafting_item_item_id")
  }

  get itemQuantity() {
    return this.getProperty("item_crafting_item.item_crafting_item_quantity")
  }

  get createdDate() {
    return this.getProperty("item_crafting_item.item_crafting_item_created_date")
  }

  get modifiedDate() {
    return this.getProperty("item_crafting_item.item_crafting_item_modified_date")
  }

}