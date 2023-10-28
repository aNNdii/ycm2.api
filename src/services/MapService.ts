import { Container, Token } from "../infrastructures/Container";

import { chunks } from "../helpers/Array";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { EntityFilter } from "../interfaces/Entity";

import { MapRepositoryToken } from "../repositories/MapRepository";

import { IMapEntity, MapEntityProperties } from "../entities/MapEntity";
import { IMap, MapProperties } from "../entities/Map";

import { EntityService, IEntityService } from "./EntityService";
import { GameMapServiceToken } from "./GameMapService";
import { PaginationOptions } from "./PaginationService";

export const MapServiceToken = new Token<IMapService>("MapService")

export type MapIndexImportOptions = {
  update?: boolean
}

export type MapRegenImportOptions = {
  override?: boolean
}

export type MapOptions = PaginationOptions & {
  id?: EntityFilter<number>
}

export type MapEntityOptions = PaginationOptions & {
  id?: EntityFilter<number>
  mapId?: EntityFilter<number>
  mobId?: EntityFilter<number>
  mobGroupId?: EntityFilter<number>
  mobGroupGroupId?: EntityFilter<number>
}

export type MapServiceOptions = {
  mapObfuscationSalt: string
  mapEntityObfuscationSalt: string
}

export type IMapService = IEntityService & {
  obfuscateMapId(id: any): string
  deobfuscateMapId(value: string | string[]): number[]
  obfuscateMapEntityId(id: any): string
  deobfuscateMapEntityId(value: string | string[]): number[]

  getMapPaginationOptions(args: any): PaginationOptions
  getMapEntityPaginationOptions(args: any): PaginationOptions

  getMaps(options?: MapOptions): Promise<IMap[]>
  getMapEntities(options?: MapEntityOptions): Promise<IMapEntity[]>

  importMapIndex(path: string, options?: MapIndexImportOptions): Promise<any>
  importMapSettings(mapId: number, path: string): Promise<any>
  importMapRegen(mapId: number, path: string, options?: MapRegenImportOptions): Promise<any>
}

export class MapService extends EntityService<MapServiceOptions> implements IMapService {

  obfuscateMapId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mapObfuscationSalt })
  }

  deobfuscateMapId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MAP_ID_INVALID,
      salt: this.options.mapObfuscationSalt,
    })
  }

  obfuscateMapEntityId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mapEntityObfuscationSalt })
  }

  deobfuscateMapEntityId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MAP_ENTITY_ID_INVALID,
      salt: this.options.mapEntityObfuscationSalt,
    })
  }

  getMapPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMapId(offset) })
  }

  getMapEntityPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMapEntityId(offset) })
  }

  getMaps(options?: MapOptions) {
    const {
      id,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMaps", options)

    const mapRepository = Container.get(MapRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'map.map_id' })

    const filter: MapProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["map.map_id"] = id

    return mapRepository.getMaps({ filter, where, order, limit })
  }

  getMapEntities(options?: MapEntityOptions) {
    const {
      id,
      mapId,
      mobId,
      mobGroupId,
      mobGroupGroupId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getMapEntities", options)

    const mapRepository = Container.get(MapRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'map_entity.map_entity_id' })

    const filter: MapEntityProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["map_entity.map_entity_id"] = id
    if (mapId) filter["map_entity.map_entity_map_id"] = mapId
    if (mobId) filter["map_entity.map_entity_mob_id"] = mobId
    if (mobGroupId) filter["map_entity.map_entity_mob_group_id"] = mobGroupId
    if (mobGroupGroupId) filter["map_entity.map_entity_mob_group_group_id"] = mobGroupGroupId

    return mapRepository.getMapEntities({ filter, where, order, limit })
  }

  async importMapIndex(path: string, options: MapIndexImportOptions) {
    const { update } = options || {}

    this.log("importMapIndex", { path, update })

    const gameMapService = Container.get(GameMapServiceToken)
    const maps = await gameMapService.readMapIndex(path)

    const mapChunks = chunks(maps, 500)

    const mapRepository = Container.get(MapRepositoryToken)
    const mapPromises = mapChunks.map(entities => mapRepository.createMaps({
      entities,
      duplicate: update ? ['map_name'] : undefined
    }))

    return Promise.all(mapPromises)
  }

  async importMapSettings(mapId: number, path: string) {
    this.log("importMapSettings", { mapId, path })

    const gameMapService = Container.get(GameMapServiceToken)
    const map = await gameMapService.readMapSetting(path)

    const mapRepository = Container.get(MapRepositoryToken)
    return mapRepository.updateMaps({
      filter: { map_id: mapId },
      entity: map,
    })
  }

  async importMapRegen(mapId: number, path: string, options?: MapRegenImportOptions) {
    const { override } = options || {}

    this.log("importMapRegen", { mapId, path })

    const gameMapService = Container.get(GameMapServiceToken)
    const mapRepository = Container.get(MapRepositoryToken)

    const entities = await gameMapService.readMapRegen(path)

    if (override) {
      await mapRepository.deleteMapEntities({
        filter: { map_entity_map_id: mapId }
      })
    }

    const entityChunks = chunks(entities, 500)
    const entityPromises = entityChunks.map(entities => mapRepository.createMapEntities({
      entities: entities.map(entity => ({ map_entity_map_id: mapId, ...entity }))
    }))

    return Promise.all(entityPromises)
  }

}
