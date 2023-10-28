import { EntityTable } from "./Entity";

export enum LogType {
  UNKNOWN = 0,

  ACCOUNT_PASSWORD_CHANGE = 100,
  ACCOUNT_PASSWORD_RECOVERY_REQUEST,
  ACCOUNT_PASSWORD_RECOVERY_CONFIRMATION,

  ACCOUNT_USERNAME_CHANGE = 200,
  ACCOUNT_USERNAME_RECOVERY,

  ACCOUNT_MAIL_CHANGE_REQUEST = 300,
  ACCOUNT_MAIL_CHANGE_CONFIRMATION,

  ACCOUNT_SAFEBOX_CODE_RECOVERY = 400,

  ACCOUNT_DELETE_CODE_RECOVERY = 500,
}

export type LogTable = EntityTable & {
  log_id: number
  log_type: LogType
  log_account_id: number
  log_data: string
  log_remote_address: string
  log_created_date: string
}