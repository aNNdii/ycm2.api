import { Container } from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobItemTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import { Entity, IEntity  } from "./Entity";

export type MobItemProperties = EntityTableFilter<"mob_item", MobItemTable>

export type IMobItem = IEntity & {
  id: number
  hashId: string
  mobId: number
  typeId: number
  levelLimit: number
  delta: number
  itemId: number
  quantity: number
  probability: number
  rareProbability: number
  createdDate: string
  modifiedDate: string
}

export class MobItem extends Entity<MobItemProperties> implements IMobItem {

  get id() {
    return this.getProperty("mob_item.mob_item_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobItemId(this.id)
  }

  get typeId() {
    return this.getProperty("mob_item.mob_item_type")
  }

  get mobId() {
    return this.getProperty("mob_item.mob_item_mob_id")
  }

  get itemId() {
    return this.getProperty("mob_item.mob_item_item_id")
  }

  get levelLimit() {
    return this.getProperty("mob_item.mob_item_level_limit")
  }

  get delta() {
    return this.getProperty("mob_item.mob_item_delta")
  }

  get quantity() {
    return this.getProperty("mob_item.mob_item_quantity")
  }

  get probability() {
    return this.getProperty("mob_item.mob_item_probability")
  }

  get rareProbability() {
    return this.getProperty("mob_item.mob_item_rare_probability")
  }

  get createdDate() {
    return this.getProperty("mob_item.mob_item_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob_item.mob_item_modified_date")
  }

}