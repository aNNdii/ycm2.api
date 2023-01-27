import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobGroupGroupMobGroupTable, MobGroupGroupTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import Entity, { IEntity } from "./Entity";


export type MobGroupGroupMobGroupProperties = EntityTableFilter<"mob_group_group_mob_group", MobGroupGroupMobGroupTable>
                                            & EntityTableFilter<"mob_group_group", MobGroupGroupTable>

export type IMobGroupGroupMobGroup = IEntity & {
  id: number
  hashId: string
  mobGroupGroupId: number
  mobGroupGroupName: string
  mobGroupId: number
  probability: number
  createdDate: string
  modifiedDate: string
}

export default class MobGroupGroupMobGroup extends Entity<MobGroupGroupMobGroupProperties> implements IMobGroupGroupMobGroup {

  get id() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobGroupGroupMobGroupId(this.id)
  }

  get mobGroupGroupId() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_mob_group_group_id")
  }

  get mobGroupGroupName() {
    return this.getProperty("mob_group_group.mob_group_group_name")
  }

  get mobGroupId() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_mob_group_id")
  }

  get probability() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_probability")
  }

  get createdDate() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob_group_group_mob_group.mob_group_group_mob_group_modified_date")
  }

}
