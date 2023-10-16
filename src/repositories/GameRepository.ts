import { Token } from "../infrastructures/Container";

import { Repository, RepositoryOptions } from "./Repository";

export const GameRepositoryToken = new Token<IGameRepository>("GameRepository")

export type GameRepositoryOptions = RepositoryOptions & {
  accountDatabaseName: string
  commonDatabaseName: string
  logDatabaseName: string
  playerDatabaseName: string
  cmsDatabaseName: string
}

export type IGameRepository = {
  getAccountDatabaseName(): string
  getCommonDatabaseName(): string
  getLogDatabaseName(): string
  getPlayerDatabaseName(): string
  getCmsDatabaseName(): string
}

export class GameRepository extends Repository<GameRepositoryOptions> implements IGameRepository {

  getAccountDatabaseName() {
    return this.options?.accountDatabaseName || 'account'
  }

  getCommonDatabaseName() {
    return this.options?.commonDatabaseName || 'common'
  }

  getLogDatabaseName() {
    return this.options?.logDatabaseName || 'log'
  }

  getPlayerDatabaseName() {
    return this.options?.playerDatabaseName || 'player'
  }

  getCmsDatabaseName() {
    return this.options?.cmsDatabaseName || 'ycm2'
  }


}