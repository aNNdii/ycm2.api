import { EntityTable } from "./Entity";

export enum GuildSkill {
  EYE = 151,
  BLOOD = 152,
  BLESS = 153,
  SEONGHWI = 154,
  ACCEL = 155,
  BUNNO = 156,
  JUMUN = 157,
}

export type GuildTable = EntityTable & {
  id: number
  name: string
  sp: number
  master: number
  level: number
  exp: number
  skill_point: number
  skill: any
  win: number
  draw: number
  loss: number
  ladder_point: number
  gold: number
}

export type GuildMemberTable = EntityTable & {
  pid: number
  guild_id: number
  grade: number
  is_general: number
  offer: number
}

export type GuildGradeTable = EntityTable & {
  guild_id: number
  grade: number
  name: string
  auth: any
}

export type GuildCommentTable = EntityTable & {
  id: number
  guild_id: number
  name: string
  notice: number
  content: string
  time: string
}