import Container, { Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import { MapEntityTable, MapTable } from "../interfaces/Map";

import MapEntity, { IMapEntity, MapEntityProperties } from "../entities/MapEntity";
import Map, { IMap, MapProperties } from "../entities/Map";

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryToken, MariaRepositoryUpdateOptions } from "./MariaRepository";
import Repository, { IRepository } from "./Repository";
import { GameRepositoryToken } from "./GameRepository";

export const MapRepositoryToken = new Token<IMapRepository>("MapRepository")

export type IMapRepository = IRepository & {
  getMaps<Entity = IMap, Filter = MapProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getMapEntities<Entity = IMapEntity, Filter = MapEntityProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createMaps<Entity = MapTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  createMapEntities<Entity = MapEntityTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
  
  updateMaps<Table = MapTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response> 

  deleteMapEntities<Table = MapEntityTable, Response = any>(options?: MariaRepositoryUpdateOptions<Table>): Promise<Response>
}

export default class MapRepository extends Repository implements IMapRepository {

  getMaps<Entity = IMap, Filter = MapProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMaps", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Map(row),
      table: `${cmsDatabase}.map`
    }, options))
  }

  getMapEntities<Entity = IMapEntity, Filter = MapEntityProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getMapEntities", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new MapEntity(row),
      table: `${cmsDatabase}.map_entity`
    }, options))
  }

  createMaps<Entity = MapTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMaps", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.map`
    }, options))
  }

  createMapEntities<Entity = MapEntityTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createMapEntities", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.map_entity`
    }, options))
  }

  updateMaps<Table = MapTable, Response = any>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("updateMaps", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.updateEntities<Table, Response>(merge({
      table: `${cmsDatabase}.map`
    }, options))
  }

  deleteMapEntities<Table = MapEntityTable, Response = any>(options?: MariaRepositoryUpdateOptions<Table>) {
    this.log("deleteMapEntities", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.deleteEntities<Table, Response>(merge({
      table: `${cmsDatabase}.map_entity`
    }, options))
  }
}