import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MapTable } from "../interfaces/Map";

import { MapServiceToken } from "../services/MapService";

import Entity, { IEntity } from "./Entity";

export type MapProperties = EntityTableFilter<"map", MapTable>

export type IMap = IEntity & {
  id: number
  hashId: string
  name: string
  width: number
  height: number
  baseX: number
  baseY: number
  viewRadius: number
  heightScale: number
  cellScale: number
  texture: string
  environment: string
  createdDate: string
  modifiedDate: string
}

export default class Map extends Entity<MapProperties> implements IMap {

  get id() {
    return this.getProperty("map.map_id")
  }

  get hashId() {
    const mapService = Container.get(MapServiceToken)
    return mapService.obfuscateMapId(this.id)
  }

  get name() {
    return this.getProperty("map.map_name")
  }

  get width() {
    return this.getProperty("map.map_width")
  }

  get height() {
    return this.getProperty("map.map_height")
  }

  get baseX() {
    return this.getProperty("map.map_base_x")
  }

  get baseY() {
    return this.getProperty("map.map_base_y")
  }

  get viewRadius() {
    return this.getProperty("map.map_view_radius")
  }

  get heightScale() {
    return this.getProperty("map.map_height_scale")
  }

  get cellScale() {
    return this.getProperty("map.map_cell_scale")
  }

  get texture() {
    return this.getProperty("map.map_texture")
  }

  get environment() {
    return this.getProperty("map.map_environment")
  }

  get createdDate() {
    return this.getProperty("map.map_created_date")
  }

  get modifiedDate() {
    return this.getProperty("map.map_modified_date")
  }

}