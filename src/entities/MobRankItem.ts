import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobRankItemTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import Entity, { IEntity } from "./Entity";

export type MobRankItemProperties = EntityTableFilter<"mob_rank_item", MobRankItemTable>

export type IMobRankItem = IEntity & {
  id: number
  hashId: string
  mobRankId: number
  itemId: number
  minLevel: number
  maxLevel: number
  probability: number
  createdDate: string
  modifiedDate: string
}

export default class MobRankItem extends Entity<MobRankItemProperties> implements IMobRankItem {

  get id() {
    return this.getProperty("mob_rank_item.mob_rank_item_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobRankItemId(this.id)
  }

  get mobRankId() {
    return this.getProperty("mob_rank_item.mob_rank_item_mob_rank")
  }

  get itemId() {
    return this.getProperty("mob_rank_item.mob_rank_item_item_id")
  }

  get minLevel() {
    return this.getProperty("mob_rank_item.mob_rank_item_level_min")
  }

  get maxLevel() {
    return this.getProperty("mob_rank_item.mob_rank_item_level_max")
  }

  get probability() {
    return this.getProperty("mob_rank_item.mob_rank_item_probability")
  }

  get createdDate() {
    return this.getProperty("mob_rank_item.mob_rank_item_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob_rank_item.mob_rank_item_modified_date")
  }

}