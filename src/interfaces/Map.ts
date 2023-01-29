import { EntityTable } from "./Entity";

export type MapTable = EntityTable & {
  map_id: number
  map_name: string
  map_width: number
  map_height: number
  map_base_x: number
  map_base_y: number
  map_view_radius: number
  map_height_scale: number
  map_cell_scale: number
  map_texture: string
  map_environment: string
  map_created_date: string
  map_modified_date: string
}

export type MapEntityTable = EntityTable & {
  map_entity_id: number
  map_entity_map_id: number
  map_entity_type: number
  map_entity_aggressive: number
  map_entity_x: number
  map_entity_y: number
  map_entity_x_offset: number
  map_entity_y_offset: number
  map_entity_z: number
  map_entity_direction: number
  map_entity_interval: number
  map_entity_probability: number
  map_entity_count: number
  map_entity_mob_id: number
  map_entity_mob_group_id: number
  map_entity_mob_group_group_id: number
  map_entity_created_date: string
  map_entity_modified_date: string
}

export enum MapEntityType {
  EXCEPTION,
  MOB,
  MOB_GROUP,
  MOB_GROUP_GROUP,
  MOB_RANDOM_LOCATION,
}