import Container, { Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import HttpRouterError from "../entities/HttpRouterError";

import MariaRepository, { IMariaRepository } from "./MariaRepository";

export const AccountDatabaseToken = new Token<string>("AccountDatabase")
export const CommonDatabaseToken = new Token<string>("CommonDatabase")
export const PlayerDatabaseToken = new Token<string>("PlayerDatabase")
export const LogDatabaseToken = new Token<string>("LogDatabase")
export const CmsDatabaseToken = new Token<string>("CmsDatabase")

export enum GameDatabase {
  ACCOUNT,
  COMMON,
  PLAYER,
  LOG,
  CMS
}

export type IGameRepository = IMariaRepository & {
  getDatabaseName(database: GameDatabase): string
}

export default class GameRepository extends MariaRepository implements IGameRepository {

  getDatabaseName(database: GameDatabase) {
    
    switch (database) {

      case GameDatabase.ACCOUNT:
        return Container.get(AccountDatabaseToken)

      case GameDatabase.COMMON:
        return Container.get(CommonDatabaseToken)

      case GameDatabase.LOG:
        return Container.get(LogDatabaseToken)

      case GameDatabase.PLAYER:
        return Container.get(PlayerDatabaseToken)

      case GameDatabase.CMS:
        return Container.get(CmsDatabaseToken)

    }

    throw new HttpRouterError(HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorMessage.GAME_DATABASE_INVALID)
  }

}