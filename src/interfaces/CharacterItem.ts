import { EntityTable } from "./Entity";

export enum CharacterItemWindow {
  EQUIPMENT = "EQUIPMENT",
  INVENTORY = "INVENTORY",
  SAFEBOX = "SAFEBOX",
  MALL = "MALL",
  DRAGON_SOUL_INVENTORY = "DRAGON_SOUL_INVENTORY",
  BELT_INVENTORY = "BELT_INVENTORY"
}

export type CharacterItemTable = EntityTable & {
  id: number
  owner_id: number
  window: CharacterItemWindow
  pos: number
  count: number
  vnum: number
  socket0: number
  socket1: number
  socket2: number
  socket3: number
  socket4: number
  socket5: number
  attrtype0: number
  attrvalue0: number
  attrtype1: number
  attrvalue1: number
  attrtype2: number
  attrvalue2: number
  attrtype3: number
  attrvalue3: number
  attrtype4: number
  attrvalue4: number
  attrtype5: number
  attrvalue5: number
  attrtype6: number
  attrvalue6: number
}