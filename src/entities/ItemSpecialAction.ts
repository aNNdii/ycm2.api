import { ItemSpecialActionTable, ItemTable } from "../interfaces/Item";
import { EntityTableFilter } from "../interfaces/Entity";
import Container from "../infrastructures/Container";

import { ItemServiceToken } from "../services/ItemService";

import Entity, { IEntity } from "./Entity";

export type ItemSpecialActionProperties = EntityTableFilter<"item_special_action", ItemSpecialActionTable>
                                        & EntityTableFilter<"item", ItemTable>

export type IItemSpecialAction = IEntity & {
  id: number
  hashId: string
  parentItemId: number
  parentItemSpecialTypeId: number
  parentItemSpecialEffect: string
  typeId: number
  itemId: number
  mobId: number
  mobGroupId: number
  attributeId: number
  quantity: number
  probability: number
  rareProbability: number
  createdDate: string
  modifiedDate: string
}

export default class ItemSpecialAction extends Entity<ItemSpecialActionProperties> implements IItemSpecialAction {

  get id() {
    return this.getProperty("item_special_action.item_special_action_id")
  }

  get hashId() {
    const itemService = Container.get(ItemServiceToken)
    return itemService.obfuscateItemSpecialActionId(this.id)
  }

  get parentItemId() {
    return this.getProperty("item_special_action.item_special_action_parent_item_id")
  }

  get parentItemSpecialTypeId() {
    return this.getProperty("item.item_special_type")
  }

  get parentItemSpecialEffect() {
    return this.getProperty("item.item_special_effect")
  }

  get typeId() {
    return this.getProperty("item_special_action.item_special_action_type")
  }

  get itemId() {
    return this.getProperty("item_special_action.item_special_action_item_id")
  }

  get mobId() {
    return this.getProperty("item_special_action.item_special_action_mob_id")
  }

  get mobGroupId() {
    return this.getProperty("item_special_action.item_special_action_mob_group_id")
  }

  get attributeId() {
    return this.getProperty("item_special_action.item_special_action_attribute")
  }

  get quantity() {
    return this.getProperty("item_special_action.item_special_action_quantity")
  }

  get probability() {
    return this.getProperty("item_special_action.item_special_action_probability")
  }

  get rareProbability() {
    return this.getProperty("item_special_action.item_special_action_rare_probability")
  }

  get createdDate() {
    return this.getProperty("item_special_action.item_special_action_created_date")
  }

  get modifiedDate() {
    return this.getProperty("item_special_action.item_special_action_modified_date")
  }

}