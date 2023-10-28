import { Container, Token } from "../infrastructures/Container"

import { EntityFilter } from "../interfaces/Entity"
import { ErrorMessage } from "../interfaces/ErrorMessage"

import { LogRepositoryToken } from "../repositories/LogRepository"

import { ILog, LogProperties } from "../entities/Log"

import { EntityService, EntityServiceOptions, IEntityService } from "./EntityService"
import { PaginationOptions } from "./PaginationService"
import { LogType } from "../interfaces/Log"

export const LogServiceToken = new Token<ILogService>("LogService")

export type LogOptions = PaginationOptions & {
  id?: EntityFilter<number>
  typeId?: EntityFilter<LogType>
  accountId?: EntityFilter<number>
}

export type LogCreateOptions = {
  typeId: LogType
  accountId?: number
  data?: any
  remoteAddress?: string
}

export type LogServiceOptions = EntityServiceOptions & {
  logObfuscationSalt: string
}

export type ILogService = IEntityService & {
  obfuscateLogId(id: any): string
  deobfuscateLogId(value: string | string[]): number[]

  getLogPaginationOptions(args: any): PaginationOptions

  getLogs(options?: LogOptions): Promise<ILog[]>

  createLog(options: LogCreateOptions): Promise<number>
}

export class LogService extends EntityService<LogServiceOptions> implements ILogService {

  obfuscateLogId(id: any) {
    return this.obfuscateId(id, { salt: this.options.logObfuscationSalt })
  }

  deobfuscateLogId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.LOG_ID_INVALID,
      salt: this.options.logObfuscationSalt,
    })
  }

  getLogPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateLogId(offset) })
  }

  getLogs(options?: LogOptions) {
    const {
      id,
      typeId,
      accountId,
      orderId,
      offset,
      limit
    } = options || {}

    this.log("getLogs", options)

    const logRepository = Container.get(LogRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'log.log_id' })

    const filter: LogProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["log.log_id"] = id
    if (typeId) filter["log.log_type"] = typeId
    if (accountId) filter["log.log_account_id"] = accountId

    return logRepository.getLogs({ filter, where, order, limit })
  }

  async createLog(options: LogCreateOptions) {
    const {
      typeId, 
      accountId,
      data,
      remoteAddress 
    } = options

    this.log("createLog", options)

    const logRepository = Container.get(LogRepositoryToken)

    const { insertId } = await logRepository.createLogs({
      entities: [
        {
          "log_type": typeId,
          "log_account_id": accountId,
          "log_data": data ? JSON.stringify(data) : undefined,
          "log_remote_address": remoteAddress
        }
      ]
    })

    return insertId

  }

}