import { Container, Token } from "../infrastructures/Container";

import { merge } from "../helpers/Object";

import { AccountGroupAccountTable, AccountGroupAuthorizationTable, AccountGroupTable, AccountTable } from "../interfaces/Account";

import { AccountGroupAuthorization, AccountGroupAuthorizationProperties, IAccountGroupAuthorization } from "../entities/AccountGroupAuthorization";
import { AccountGroupAccount, AccountGroupAccountProperties, IAccountGroupAccount } from "../entities/AccountGroupAccount";
import { AccountGroup, AccountGroupProperties, IAccountGroup } from "../entities/AccountGroup";
import { Account, AccountProperties, IAccount } from "../entities/Account";

import { MariaRepositoryInsertOptions, MariaRepositorySelectOptions, MariaRepositoryToken, MariaRepositoryUpdateOptions } from "./MariaRepository";
import { Repository, IRepository } from "./Repository";
import { GameRepositoryToken } from "./GameRepository";

export const AccountRepositoryToken = new Token<IAccountRepository>("AccountRepository")

export type IAccountRepository = IRepository & {
  getAccounts<Entity = IAccount, Filter = AccountProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getAccountGroups<Entity = IAccountGroup, Filter = AccountGroupProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getAccountGroupAccounts<Entity = IAccountGroupAccount, Filter = AccountGroupAccountProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>
  getAccountGroupAuthorizations<Entity = IAccountGroupAuthorization, Filter = AccountGroupAuthorizationProperties>(options?: MariaRepositorySelectOptions<Filter>): Promise<Entity[]>

  createAccounts<Response = any, Table = AccountTable>(options: MariaRepositoryInsertOptions<Table>): Promise<Response>
  createAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryInsertOptions<Table>): Promise<Response>
  createAccountGroupAccounts<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryInsertOptions<Table>): Promise<Response>
  createAccountGroupAuthorizations<Response = any, Table = AccountGroupAuthorizationTable>(options: MariaRepositoryInsertOptions<Table>): Promise<Response>

  updateAccounts<Response = any, Table = AccountTable>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response>
  updateAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response>

  deleteAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response>
  deleteAccountGroupAccounts<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response>
  deleteAccountGroupAuthorizations<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryUpdateOptions<Table>): Promise<Response>
}

export class AccountRepository extends Repository implements IAccountRepository {

  getAccounts<Entity = IAccount, Filter = AccountProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const accountDatabase = gameRepository.getAccountDatabaseName()
    const playerDatabase = gameRepository.getPlayerDatabaseName()
    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new Account(row),
      table: `${accountDatabase}.account`,
      joins: [
        `LEFT JOIN ${playerDatabase}.safebox ON safebox.account_id = account.id`,
        `LEFT JOIN ${cmsDatabase}.locale ON locale.locale_id = account.ycm2_account_locale_id`
      ]
    }, options))
  }

  getAccountGroups<Entity = IAccountGroup, Filter = AccountGroupProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getAccountGroups", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new AccountGroup(row),
      table: `${cmsDatabase}.account_group`,
    }, options))
  }

  getAccountGroupAccounts<Entity = IAccountGroupAccount, Filter = AccountGroupAccountProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getAccountGroupAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new AccountGroupAccount(row),
      table: `${cmsDatabase}.account_group_account`,
    }, options))
  }

  getAccountGroupAuthorizations<Entity = IAccountGroupAuthorization, Filter = AccountGroupAuthorizationProperties>(options?: MariaRepositorySelectOptions<Filter>) {
    this.log("getAccountGroupAuthorizations", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.getEntities<Entity, Filter>(merge({
      parser: (row: any) => new AccountGroupAuthorization(row),
      table: `${cmsDatabase}.account_group_authorization`,
    }, options))

  }

  createAccounts<Response = any, Table = AccountTable>(options: MariaRepositoryInsertOptions<Table>) {
    this.log("createAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const accountDatabase = gameRepository.getAccountDatabaseName()

    return mariaRepository.createEntities<Table, Response>(merge({
      table: `${accountDatabase}.account`
    }, options))
  }

  createAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryInsertOptions<Table>) {
    this.log("createAccountGroups", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group`
    }, options))
  }

  createAccountGroupAccounts<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryInsertOptions<Table>) {
    this.log("createAccountGroupAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group_account`
    }, options))
  }

  createAccountGroupAuthorizations<Response = any, Table = AccountGroupAuthorizationTable>(options: MariaRepositoryInsertOptions<Table>) {
    this.log("createAccountGroupAuthorizations", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.createEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group_authorization`
    }, options))
  }

  updateAccounts<Response = any, Table = AccountTable>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("updateAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const accountDatabase = gameRepository.getAccountDatabaseName()

    return mariaRepository.updateEntities<Table, Response>(merge({
      table: `${accountDatabase}.account`
    }, options))
  }

  updateAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("updateAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.updateEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group`
    }, options))
  }

  deleteAccountGroups<Response = any, Table = AccountGroupTable>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("deleteAccountGroups", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.deleteEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group`
    }, options))
  }

  deleteAccountGroupAccounts<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("deleteAccountGroupAccounts", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.deleteEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group_account`
    }, options))
  }

  deleteAccountGroupAuthorizations<Response = any, Table = AccountGroupAccountTable>(options: MariaRepositoryUpdateOptions<Table>) {
    this.log("deleteAccountGroupAuthorizations", options)

    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const cmsDatabase = gameRepository.getCmsDatabaseName()

    return mariaRepository.deleteEntities<Table, Response>(merge({
      table: `${cmsDatabase}.account_group_authorization`
    }, options))
  }

}