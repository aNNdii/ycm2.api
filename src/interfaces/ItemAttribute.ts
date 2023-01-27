import { EntityTable } from "./Entity";

export type ItemAttributeTable = EntityTable & {
  apply: number
  prob: number
  lv1: number
  lv2: number
  lv3: number
  lv4: number
  lv5: number
  weapon: number
  body: number
  wrist: number
  foots: number
  neck: number
  head: number
  shield: number
  ear: number
}