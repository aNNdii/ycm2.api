import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MobGroupMobTable, MobGroupTable } from "../interfaces/Mob";

import { MobServiceToken } from "../services/MobService";

import Entity, { IEntity } from "./Entity";

export type MobGroupMobProperties = EntityTableFilter<"mob_group_mob", MobGroupMobTable>
                                  & EntityTableFilter<"mob_group", MobGroupTable>

export type IMobGroupMob = IEntity & {
  id: number
  hashId: string
  mobId: number
  mobGroupId: number
  mobGroupName: string
  leader: number
  createdDate: string
  modifiedDate: string
}

export default class MobGroupMob extends Entity<MobGroupMobProperties> implements IMobGroupMob {

  get id() {
    return this.getProperty("mob_group_mob.mob_group_mob_id")
  }

  get hashId() {
    const mobService = Container.get(MobServiceToken)
    return mobService.obfuscateMobGroupMobId(this.id)
  }

  get mobId() {
    return this.getProperty("mob_group_mob.mob_group_mob_mob_id")
  }

  get mobGroupId() {
    return this.getProperty("mob_group_mob.mob_group_mob_mob_group_id")
  }

  get mobGroupName() {
    return this.getProperty("mob_group.mob_group_name")
  }

  get leader() {
    return this.getProperty("mob_group_mob.mob_group_mob_leader")
  }

  get createdDate() {
    return this.getProperty("mob_group_mob.mob_group_mob_created_date")
  }
  
  get modifiedDate() {
    return this.getProperty("mob_group_mob.mob_group_mob_modified_date")
  }

}