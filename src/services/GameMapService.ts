import { writeToString } from "fast-csv";
import { createReadStream } from "fs";
import iconv from "iconv-lite";

import { Token } from "../infrastructures/Container";

import { DefaultEncoding, KoreanEncoding, parseProtoStream } from "../helpers/Game";
import { readStreamToBuffer } from "../helpers/Stream";
import { getEnumValues } from "../helpers/Enum";

import { MapEntityTable, MapEntityType, MapTable } from "../interfaces/Map";
import { GameMapEntityType } from "../interfaces/GameMap";

import { IMapEntity } from "../entities/MapEntity";
import { IMap } from "../entities/Map";

import Service, { IService } from "./Service";

export const GameMapServiceToken = new Token<IGameMapService>("GameMapService")

export type IGameMapService = IService & {
  readMapIndex(path: string): Promise<Partial<MapTable>[]>
  readMapSetting(path: string): Promise<Partial<MapTable>>
  readMapRegen(path: string): Promise<Partial<MapEntityTable>[]>

  parseMapIndex(stream: NodeJS.ReadableStream): Promise<Partial<MapTable>[]>
  parseMapSetting(stream: NodeJS.ReadableStream): Promise<Partial<MapTable>>
  parseMapRegen(stream: NodeJS.ReadableStream): Promise<Partial<MapEntityTable>[]>

  createMapIndex(maps: IMap[]): Promise<Buffer>
  createMapSetting(map: IMap): Promise<Buffer>
  createMapRegen(entities: IMapEntity[]): Promise<Buffer>
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

  readMapSetting(path: string) {
    const stream = createReadStream(path)
    return this.parseMapSetting(stream)
  }

  parseMapIndex(stream: NodeJS.ReadableStream) {
    return parseProtoStream(stream, {
      headers: ['map_id', 'map_name'],
      ignoreEmpty: true,
      skipRows: 0,
    })
  }

  async parseMapSetting(stream: NodeJS.ReadableStream) {
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

  async createMapIndex(maps: IMap[]) {
    const content = await writeToString(maps, {
      delimiter: '\t',
      transform: (map: IMap) => [
        map.id,
        map.name
      ]
    })

    return iconv.encode(content, DefaultEncoding)
  }

  async createMapSetting(map: IMap) {
    let content = ""

    content += `ScriptType\tMapSetting\n`
    content += `\n`
    
    content += `CellScale\t${map.cellScale}\n`
    content += `HeightScale\t${map.heightScale}\n`
    content += `\n`
    
    content += `MapSize\t${map.width}\t${map.height}\n`
    content += `BasePosition\t${map.baseX}\t${map.baseY}\n`
    content += `TextureSet\t${map.texture}\n`
    content += `Environment\t${map.environment}\n`

    return iconv.encode(content, DefaultEncoding)
  }

  async createMapRegen(entities: IMapEntity[]) {
    const content = await writeToString(entities, {
      delimiter: '\t',
      transform: (entity: IMapEntity) => [
        GameMapEntityType[entity.typeId]?.toLowerCase(),
        entity.x,
        entity.y,
        entity.xOffset,
        entity.yOffset,
        entity.z,
        entity.direction,
        `${entity.interval}s`,
        entity.probability,
        entity.count,
        entity.typeId === MapEntityType.MOB_GROUP ? entity.mobGroupId : entity.typeId === MapEntityType.MOB_GROUP_GROUP ? entity.mobGroupGroupId : entity.mobId
      ]
    })

    return iconv.encode(content, DefaultEncoding)

  }

}