import { EntityTable } from "./Entity"

export enum AccountStatus {
  OK = "OK",
  BLOCK = "BLOCK"
}

export type AccountTable = EntityTable & {
  id: number
  login: string
  password: string
  social_id: string
  availDt: string
  create_time: string
  status: AccountStatus
  securitycode: string
  gold_expire: string
  silver_expire: string
  safebox_expire: string
  autoloot_expire: string
  fish_mind_expire: string
  marriage_fast_expire: string
  money_drop_rate_expire: string
  ip: string
  last_play: string
}


