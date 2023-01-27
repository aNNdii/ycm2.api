import Container, { Token } from "../infrastructures/Container";

import { chunks } from "../helpers/Array";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { EntityFilter } from "../interfaces/Entity";

import { MapRepositoryToken } from "../repositories/MapRepository";

import { IMap, MapProperties } from "../entities/Map";

import { GameMapServiceToken } from "./GameMapService";
import { PaginationOptions } from "./PaginationService";
import EntityService from "./EntityService";
import { IService } from "./Service";

export const MapServiceToken = new Token<IMapService>("MapService")

export type MapIndexImportOptions = {
  update?: boolean
}

export type MapOptions = PaginationOptions & {
  id?: EntityFilter<number>
}

export type MapServiceOptions = {
  mapObfuscationSalt: string
}

export type IMapService = IService & {
  obfuscateMapId(id: any): string
  deobfuscateMapId(value: string | string[]): number[]

  getMapPaginationOptions(args: any): PaginationOptions

  getMaps(options?: MapOptions): Promise<IMap[]>

  importMapIndex(path: string, options?: MapIndexImportOptions): Promise<any>
  importMapSettings(mapId: number, path: string): Promise<any>
}

export default class MapService extends EntityService<MapServiceOptions> implements IMapService {

  obfuscateMapId(id: any) {
    return this.obfuscateId(id, { salt: this.options.mapObfuscationSalt })
  }

  deobfuscateMapId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.MAP_INVALID_ID,
      salt: this.options.mapObfuscationSalt,
    })
  }

  getMapPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateMapId(offset) })
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
    const map = await gameMapService.readMapSettings(path)

    const mapRepository = Container.get(MapRepositoryToken)
    return mapRepository.updateMaps({
      entity: map,
      filter: {
        map_id: mapId
      }
    })
  }

}
