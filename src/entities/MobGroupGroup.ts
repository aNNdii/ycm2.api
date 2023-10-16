import { Container } from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobGroupGroupTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import { Entity, IEntity  } from "./Entity";

export type MobGroupGroupProperties = EntityTableFilter<"mob_group_group", MobGroupGroupTable>

export type IMobGroupGroup = IEntity & {
  id: number
  hashId: string
  name: string
  createdDate: string
  modifiedDate: string
}

export class MobGroupGroup extends Entity<MobGroupGroupProperties> implements IMobGroupGroup {

  get id() {
    return this.getProperty("mob_group_group.mob_group_group_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobGroupGroupId(this.id)
  }

  get name() {
    return this.getProperty("mob_group_group.mob_group_group_name")
  }

  get createdDate() {
    return this.getProperty("mob_group_group.mob_group_group_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob_group_group.mob_group_group_modified_date")
  }

}