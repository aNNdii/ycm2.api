import { createReadStream } from "fs";
import iconv from "iconv-lite";

import { Token } from "../infrastructures/Container";

import { KoreanEncoding, parseProtoStream } from "../helpers/Game";
import { readStreamToBuffer } from "../helpers/Stream";
import { getEnumValues } from "../helpers/Enum";

import { MapEntityTable, MapEntityType, MapTable } from "../interfaces/Map";
import { GameMapEntityType } from "../interfaces/GameMap";

import Service, { IService } from "./Service";

export const GameMapServiceToken = new Token<IGameMapService>("GameMapService")

export type IGameMapService = IService & {
  readMapIndex(path: string): Promise<Partial<MapTable>[]>
  readMapSettings(path: string): Promise<Partial<MapTable>>
  readMapRegen(path: string): Promise<Partial<MapEntityTable>[]>

  parseMapIndex(stream: NodeJS.ReadableStream): Promise<Partial<MapTable>[]>
  parseMapSettings(stream: NodeJS.ReadableStream): Promise<Partial<MapTable>>
  parseMapRegen(stream: NodeJS.ReadableStream): Promise<Partial<MapEntityTable>[]>

}

export default class GameMapService extends Service<any> implements IGameMapService {

  readMapIndex(path: string) {
    const stream = createReadStream(path)
    return this.parseMapIndex(stream)
  }

  readMapRegen(path: string) {
    const stream = createReadStream(path).pipe(iconv.decodeStream(KoreanEncoding))
    return this.parseMapRegen(stream)
  }

  readMapSettings(path: string) {
    const stream = createReadStream(path)
    return this.parseMapSettings(stream)
  }

  parseMapIndex(stream: NodeJS.ReadableStream) {
    return parseProtoStream(stream, {
      headers: ['map_id', 'map_name'],
      ignoreEmpty: true,
      skipRows: 0,
    })
  }

  async parseMapSettings(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const [cellScale] = [...content.matchAll(/CellScale\s+(\d+)/g)]
    const [heightScale] = [...content.matchAll(/HeightScale\s+([\d\.]+)/g)]
    const [viewRadius] = [...content.matchAll(/ViewRadius\s+(\d+)/g)]
    const [mapSize] = [...content.matchAll(/MapSize\s+(\d+)\s+(\d+)/g)]
    const [basePosition] = [...content.matchAll(/BasePosition\s+(\d+)\s+(\d+)/g)]
    const [textureSet] = [...content.matchAll(/TextureSet\s+(.+)/g)]
    const [environment] = [...content.matchAll(/Environment\s+(.+)/g)]

    return {
      map_cell_scale: cellScale ? parseInt(cellScale[1]) : undefined,
      map_height_scale: heightScale ? parseFloat(heightScale[1]) : undefined,
      map_view_radius: viewRadius ? parseInt(viewRadius[1]) : undefined,
      map_width: mapSize ? parseInt(mapSize[1]) : undefined,
      map_height: mapSize ? parseInt(mapSize[2]) : undefined,
      map_base_x: basePosition ? parseInt(basePosition[1]) : undefined,
      map_base_y: basePosition ? parseInt(basePosition[2]) : undefined,
      map_texture: textureSet ? textureSet[1] : undefined,
      map_environment: environment ? environment[1] : undefined,
    }
  }

  async parseMapRegen(stream: NodeJS.ReadableStream) {
    const buffer = await readStreamToBuffer(stream)
    const content = buffer.toString()

    const entities: Partial<MapEntityTable>[] = []
    const matches = content.match(/^(\w{1,2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+\w?)\s+(\d+)\s+(\d+)\s+(\d+)/gmi)

    matches?.map((line: any) => {
      const [typeWithAggression, x, y, offsetX, offsetY, z, direction, intervalWithUnit, probability, count, entityId] = line.split(/\s+/)
      
      const [type, aggressive] = typeWithAggression
      const [typeId] = getEnumValues(GameMapEntityType, type) as any

      if (typeId === undefined) return

      const interval = parseInt(intervalWithUnit)
      const intervalUnit = intervalWithUnit.at(-1)
      const intervalMultiplier = intervalUnit === 'h' ? 3600 : intervalUnit === 'm' ? 60 : 1 

      const mobId = (typeId == MapEntityType.MOB_RANDOM_LOCATION || typeId == MapEntityType.MOB) ? entityId : 0
      const mobGroupId = typeId === MapEntityType.MOB_GROUP ? entityId : 0
      const mobGroupGroupId = typeId === MapEntityType.MOB_GROUP_GROUP ? entityId : 0

      entities.push({
        map_entity_type: typeId,
        map_entity_aggressive: aggressive ? 1 : 0,
        map_entity_x: x,
        map_entity_y :y,
        map_entity_x_offset: offsetX,
        map_entity_y_offset: offsetY,
        map_entity_z: z,
        map_entity_direction: direction,
        map_entity_interval: interval * intervalMultiplier,
        map_entity_probability: probability,
        map_entity_count: count,
        map_entity_mob_id: mobId,
        map_entity_mob_group_id: mobGroupId,
        map_entity_mob_group_group_id: mobGroupGroupId,
      })
    })

    return entities
  }

}