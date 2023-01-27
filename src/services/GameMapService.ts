import { readFile } from "fs/promises";
import { createReadStream } from "fs";

import { parseProtoStream } from "../helpers/Game";

import { Token } from "../infrastructures/Container";

import { MapTable } from "../interfaces/Map";

import Service, { IService } from "./Service";

export const GameMapServiceToken = new Token<IGameMapService>("GameMapService")

export type IGameMapService = IService & {
  readMapIndex(path: string): Promise<Partial<MapTable>[]>
  readMapSettings(path: string): Promise<Partial<MapTable>>

  parseMapIndex(stream: NodeJS.ReadableStream): Promise<Partial<MapTable>[]>
  parseMapSettings(content: Buffer): Promise<Partial<MapTable>>
}

export default class GameMapService extends Service<any> implements IGameMapService {

  readMapIndex(path: string) {
    const stream = createReadStream(path)
    return this.parseMapIndex(stream)
  }

  async readMapSettings(path: string) {
    const content = await readFile(path)
    return this.parseMapSettings(content)
  }

  parseMapIndex(stream: NodeJS.ReadableStream) {
    return parseProtoStream(stream, {
      headers: ['map_id', 'map_name'],
      ignoreEmpty: true,
      skipRows: 0,
    })
  }

  async parseMapSettings(buffer: Buffer) {
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

}