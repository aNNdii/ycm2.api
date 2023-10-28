import { Container, Token } from "../infrastructures/Container"

import { merge } from "../helpers/Object"

import { LogTable } from "../interfaces/Log"

import { ILog, Log, LogProperties } from "../entities/Log"

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryToken } from "./MariaRepository"
import { IRepository, Repository } from "./Repository"
import { GameRepositoryToken } from "./GameRepository"

export const LogRepositoryToken = new Token<ILogRepository>("LogRepository")

export type ILogRepository = IRepository & {
  getLogs<Entity = ILog, Filter = LogProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createLogs<Entity = LogTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>): Promise<Response>
}

export class LogRepository extends Repository implements ILogRepository {

  getLogs<Entity = ILog, Filter = LogProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getLogs", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Log(row),
      table: `${cmsDatabase}.log`
    }, options))
  }

  createLogs<Entity = LogTable, Response = any>(options: MariaRepositoryInsertOptions<Entity>) {
    this.log("createLogs", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Entity, Response>(merge({
      table: `${cmsDatabase}.log`
    }, options))
  }


}