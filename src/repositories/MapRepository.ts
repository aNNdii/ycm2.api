import { Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import { MapEntityTable, MapTable } from "../interfaces/Map";

import MapEntity, { IMapEntity, MapEntityProperties } from "../entities/MapEntity";
import Map, { IMap, MapProperties } from "../entities/Map";

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryUpdateOptions } from "./MariaRepository";
import GameRepository, { GameDatabase, IGameRepository } from "./GameRepository";

export const MapRepositoryToken = new Token<IMapRepository>("MapRepository")

export type IMapRepository = IGameRepository & {
  getMaps<Entity = IMap, Filter = MapProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMapEntities<Entity = IMapEntity, Filter = MapEntityProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createMaps<Entity = MapTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMapEntities<Entity = MapEntityTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  
  updateMaps<Table = MapTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response> 

  deleteMapEntities<Table = MapEntityTable, Response = any>(options?: MariaRepositoryUpdateOptions<Table>): Promise<Response>
}

export default class MapRepository extends GameRepository implements IMapRepository {

  getMaps<Entity = IMap, Filter = MapProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMaps", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Map(row),
      table: `${cmsDatabase}.map`
    }, options))
  }

  getMapEntities<Entity = IMapEntity, Filter = MapEntityProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMapEntities", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MapEntity(row),
      table: `${cmsDatabase}.map_entity`
    }, options))
  }

  createMaps<Entity = MapTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMaps", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.map`
    }, options))
  }

  createMapEntities<Entity = MapEntityTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMapEntities", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.map_entity`
    }, options))
  }

  updateMaps<Table = MapTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("updateMaps", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.updateEntities<Table, Response>(merge({
      table: `${cmsDatabase}.map`
    }, options))
  }

  deleteMapEntities<Table = MapEntityTable, Response = any>(options?: MariaRepositoryUpdateOptions<Table>) {
    this.log("deleteMapEntities", options)

    const cmsDatabase = this.getDatabaseName(GameDatabase.CMS)

    return this.deleteEntities<Table, Response>(merge({
      table: `${cmsDatabase}.map_entity`
    }, options))
  }
}