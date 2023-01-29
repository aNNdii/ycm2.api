import Container from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { MapEntityTable } from "../interfaces/Map";

import { MapServiceToken } from "../services/MapService";

import Entity, { IEntity } from "./Entity";

export type MapEntityProperties = EntityTableFilter<"map_entity", MapEntityTable>

export type IMapEntity = IEntity & {
  id: number
  hashId: string
  mapId: number
  typeId: number
  aggressive: number
  x: number
  y: number
  xOffset: number
  yOffset: number
  z: number
  direction: number
  probability: number
  count: number
  mobId: number
  mobGroupId: number
  mobGroupGroupId: number
  createdDate: string
  modifiedDate: string
}

export default class MapEntity extends Entity<MapEntityProperties> implements IMapEntity {

  get id() {
    return this.getProperty("map_entity.map_entity_id")
  }

  get hashId() {
    const mapService = Container.get(MapServiceToken)
    return mapService.obfuscateMapEntityId(this.id)
  }

  get mapId() {
    return this.getProperty("map_entity.map_entity_map_id")
  }

  get typeId() {
    return this.getProperty("map_entity.map_entity_type")
  }

  get aggressive() {
    return this.getProperty("map_entity.map_entity_aggressive")
  }

  get x() {
    return this.getProperty("map_entity.map_entity_x")
  }

  get y() {
    return this.getProperty("map_entity.map_entity_y")
  }

  get xOffset() {
    return this.getProperty("map_entity.map_entity_x_offset")
  }

  get yOffset() {
    return this.getProperty("map_entity.map_entity_y_offset")
  }

  get z() {
    return this.getProperty("map_entity.map_entity_z")
  }

  get direction() {
    return this.getProperty("map_entity.map_entity_direction")
  }

  get probability() {
    return this.getProperty("map_entity.map_entity_probability")
  }

  get count() {
    return this.getProperty("map_entity.map_entity_count")
  }

  get mobId() {
    return this.getProperty("map_entity.map_entity_mob_id")
  }

  get mobGroupId() {
    return this.getProperty("map_entity.map_entity_mob_group_id")
  }

  get mobGroupGroupId() {
    return this.getProperty("map_entity.map_entity_mob_group_group_id")
  }

  get createdDate() {
    return this.getProperty("map_entity.map_entity_created_date")
  }

  get modifiedDate() {
    return this.getProperty("map_entity.map_entity_modified_date")
  }

}