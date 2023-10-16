import { EntityTable } from "./Entity"

export enum AccountStatus {
  OK = "OK",
  BLOCK = "BLOCK"
}

export type AccountTable = EntityTable & {
  // Columns used by game
  id: number
  login: string
  password: string
  securitycode: string
  social_id: string
  status: AccountStatus
  availDt: string
  create_time: string
  gold_expire: string
  silver_expire: string
  safebox_expire: string
  autoloot_expire: string
  fish_mind_expire: string
  marriage_fast_expire: string
  money_drop_rate_expire: string
  last_play: string
  cash: number
  mileage: number

  // Columns used by ycm2
  ycm2_account_mail: string
  ycm2_account_locale_id: number
  ycm2_account_modified_date: string
}

export type AccountGroupTable = EntityTable & {
  account_group_id: number
  account_group_name: string
  account_group_created_date: string
  account_group_modified_date: string
}

export type AccountGroupAccountTable = EntityTable & {
  account_group_account_account_group_id: number
  account_group_account_account_id: number
  account_group_account_created_date: string
}

export type AccountGroupAuthorizationTable = EntityTable & {
  account_group_authorization_account_group_id: number
  account_group_authorization_id: number
  account_group_authorization_created_date: string
}