import { Token } from "../infrastructures/Container"

import { merge } from "../helpers/Object"

import { MobGroupGroupMobGroupTable, MobGroupGroupTable, MobGroupMobTable, MobGroupTable, MobItemTable, MobRankItemTable, MobTable } from "../interfaces/Mob"

import MobGroupGroupMobGroup, { IMobGroupGroupMobGroup, MobGroupGroupMobGroupProperties } from "../entities/MobGroupGroupMobGroup"
import MobGroupGroup, { IMobGroupGroup, MobGroupGroupProperties } from "../entities/MobGroupGroup"
import MobGroupMob, { IMobGroupMob, MobGroupMobProperties } from "../entities/MobGroupMob"
import MobRankItem, { IMobRankItem, MobRankItemProperties } from "../entities/MobRankItem"
import MobGroup, { IMobGroup, MobGroupProperties } from "../entities/MobGroup"
import GameMob, { GameMobProperties, IGameMob } from "../entities/GameMob"
import MobItem, { IMobItem, MobItemProperties } from "../entities/MobItem"
import Mob, { IMob, MobProperties } from "../entities/Mob"

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryUpdateOptions } from "./MariaRepository"
import GameRepository, { GameDatabase, IGameRepository } from "./GameRepository"

export const MobRepositoryToken = new Token<IMobRepository>("MobRepository")

export type IMobRepository = IGameRepository & {
  getMobs<Entity = IMob, Filter = MobProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobItems<Entity = IMobItem, Filter = MobItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobRankItems<Entity = IMobRankItem, Filter = MobRankItemProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobGroups<Entity = IMobGroup, Filter = MobGroupProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobGroupMobs<Entity = IMobGroupMob, Filter = MobGroupMobProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobGroupGroups<Entity = IMobGroupGroup, Filter = MobGroupGroupProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMobGroupGroupMobGroups<Entity = IMobGroupGroupMobGroup, Filter = MobGroupGroupMobGroupProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  getGameMobs<Entity = IGameMob, Filter = GameMobProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createMobs<Entity = MobTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobItems<Entity = MobItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobRankItems<Entity = MobRankItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobGroups<Entity = MobGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobGroupMobs<Entity = MobGroupMobTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobGroupGroups<Entity = MobGroupGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMobGroupGroupMobGroups<Entity = MobGroupGroupMobGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  
  truncateMobItems(): Promise<any>
  truncateMobRankItems(): Promise<any>
  truncateMobGroups(): Promise<any>
  truncateMobGroupMobs(): Promise<any>
  truncateMobGroupGroups(): Promise<any>
  truncateMobGroupGroupMobGroups(): Promise<any>
}

export default class MobRepository extends GameRepository implements IMobRepository {

  getMobs<Entity = IMob, Filter = MobProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobs", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Mob(row),
      table: `${cmsDatabase}.mob`
    }, options))
  }

  getGameMobs<Entity = IGameMob, Filter = GameMobProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getGameMobs", options)

    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new GameMob(row),
      table: `${playerDatabase}.mob_proto`
    }, options))
  }

  getMobItems<Entity = IMobItem, Filter = MobItemProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobItem(row),
      table: `${cmsDatabase}.mob_item`
    }, options))
  }

  getMobRankItems<Entity = any, Filter = any>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobRankItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobRankItem(row),
      table: `${cmsDatabase}.mob_rank_item`
    }, options))
  }

  getMobGroups<Entity = IMobGroup, Filter = MobGroupProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobGroups", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobGroup(row),
      table: `${cmsDatabase}.mob_group`
    }, options))
  }

  getMobGroupMobs<Entity = IMobGroupMob, Filter = MobGroupMobProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobGroupMobs", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobGroupMob(row),
      table: `${cmsDatabase}.mob_group_mob`,
      joins: [
        `LEFT JOIN ${cmsDatabase}.mob_group ON mob_group_mob.mob_group_mob_mob_group_id = mob_group.mob_group_id`
      ]
    }, options))
  }

  getMobGroupGroups<Entity = IMobGroupGroup, Filter = MobGroupGroupProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobGroups", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobGroupGroup(row),
      table: `${cmsDatabase}.mob_group_group`
    }, options))
  }

  getMobGroupGroupMobGroups<Entity = IMobGroupGroupMobGroup, Filter = MobGroupGroupMobGroupProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMobGroupGroupMobGroups", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MobGroupGroupMobGroup(row),
      table: `${cmsDatabase}.mob_group_group_mob_group`,
      joins: [
        `LEFT JOIN ${cmsDatabase}.mob_group_group ON mob_group_group_mob_group.mob_group_group_mob_group_mob_group_group_id = mob_group_group.mob_group_group_id`
      ]
    }, options))
  }

  createMobs<Entity = MobTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobs", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob`
    }, options))
  }

  createMobItems<Entity = MobItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_item`
    }, options))
  }

  createMobRankItems<Entity = MobRankItemTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobRankItems", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_rank_item`
    }, options))
  }

  createMobGroups<Entity = MobGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobGroupMembers", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_group`
    }, options))
  }

  createMobGroupMobs<Entity = MobGroupMobTable, Response = any>(options: MariaRepositoryUpdateOptions<Entity>) {
    this.log("createMobGroupMembers", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_group_mob`
    }, options))
  }

  createMobGroupGroups<Entity = MobGroupGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobGroupGroups", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_group_group`
    }, options))
  }

  createMobGroupGroupMobGroups<Entity = MobGroupGroupTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMobGroupGroupMobGroups", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.mob_group_group_mob_group`
    }, options))
  }

  truncateMobItems() {
    this.log("truncateMobItems")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_item`)
  }

  truncateMobRankItems() {
    this.log("truncateMobRankItems")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_rank_item`)
  }

  truncateMobGroups() {
    this.log("truncateMobGroups")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_group`)
  }

  truncateMobGroupMobs() {
    this.log("truncateMobGroupMobs")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_group_mob`)
  }

  truncateMobGroupGroups() {
    this.log("truncateMobGroupGroups")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_group_group`)
  }

  truncateMobGroupGroupMobGroups() {
    this.log("truncateMobGroupGroupMobGroups")

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)
    return this.truncateTable(`${cmsDatabase}.mob_group_group_mob_group`)
  }

}