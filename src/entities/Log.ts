import { Container } from "../infrastructures/Container";

import { EntityTableFilter } from "../interfaces/Entity";
import { LogTable, LogType } from "../interfaces/Log";

import { LogServiceToken } from "../services/LogService";

import { Entity, IEntity } from "./Entity";

export type LogProperties = EntityTableFilter<"log", LogTable>

export type ILog = IEntity & {
  id: number
  hashId: string
  typeId: LogType
  accountId: number
  data: any
  createdDate: string
  remoteAddress: string
}

export class Log extends Entity<LogProperties> implements ILog {

  get id() {
    return this.getProperty("log.log_id")
  }

  get hashId() {
    const logService = Container.get(LogServiceToken)
    return logService.obfuscateLogId(this.id)
  }

  get typeId() {
    return this.getProperty("log.log_type")
  }

  get accountId() {
    return this.getProperty("log.log_account_id")
  }

  get data() {
    return this.getProperty("log.log_data")
  }

  get createdDate() {
    return this.getProperty("log.log_created_date")
  }

  get remoteAddress() {
    return this.getProperty("log.log_remote_address")
  }

}