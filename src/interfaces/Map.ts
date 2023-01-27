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