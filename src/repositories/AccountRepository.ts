import { Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import { AccountTable } from "../interfaces/Account";

import Account, { AccountProperties, IAccount } from "../entities/Account";

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryUpdateOptions } from "./MariaRepository";
import GameRepository, { IGameRepository, GameDatabase } from "./GameRepository";

export const AccountRepositoryToken = new Token<IAccountRepository>("AccountRepository")

export type IAccountRepository = IGameRepository & {
  getAccounts<Entity = IAccount, Filter = AccountProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  createAccounts<Response = any, Table = AccountTable>(options?: MariaRepositoryInsertOptions<Table>): Promise<Response>
  updateAccounts<Response = any, Table = AccountTable>(options?: MariaRepositoryUpdateOptions<Table>): Promise<Response>
}

export default class AccountRepository extends GameRepository implements IAccountRepository {

  getAccounts<Entity = IAccount, Filter = AccountProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getAccounts", options)

    const accountDatabase = this.getDatabaseName(GameDatabase.ACCOUNT)
    const playerDatabase = this.getDatabaseName(GameDatabase.PLAYER)

    return this.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Account(row),
      table: `${accountDatabase}.account`,
      joins: [
        `LEFT JOIN ${playerDatabase}.safebox ON safebox.account_id = account.id`
      ]
    }, options))
  }

  createAccounts<Response, Table = AccountTable>(options?: MariaRepositoryInsertOptions<Table>) {
    this.log("createAccounts", options)

    const accountDatabase = this.getDatabaseName(GameDatabase.ACCOUNT)

    return this.createEntities<Table, Response>(merge({
      table: `${accountDatabase}.account`
    }, options))
  }

  updateAccounts<Response = any, Table = AccountTable>(options?: MariaRepositoryUpdateOptions<Table>): Promise<Response> {
    this.log("updateAccounts", options)

    const accountDatabase = this.getDatabaseName(GameDatabase.ACCOUNT)

    return this.updateEntities<Table, Response>(merge({
      table: `${accountDatabase}.account`
    }, options))
  }

}