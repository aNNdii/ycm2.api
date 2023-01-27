import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobGroupTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import Entity, { IEntity } from "./Entity";

export type MobGroupProperties = EntityTableFilter<"mob_group", MobGroupTable>

export type IMobGroup = IEntity & {
  id: number
  hashId: string
  name: string
  createdDate: string
  modifiedDate: string
}

export default class MobGroup extends Entity<MobGroupProperties> implements IMobGroup {

  get id() {
    return this.getProperty("mob_group.mob_group_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobGroupId(this.id)
  }

  get name() {
    return this.getProperty("mob_group.mob_group_name")
  }

  get createdDate() {
    return this.getProperty("mob_group.mob_group_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob_group.mob_group_modified_date")
  }

}