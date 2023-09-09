import Container, { Token } from "../infrastructures/Container";

import { randomNumber } from "../helpers/Number";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { AccountStatus } from "../interfaces/Account";
import { EntityFilter } from "../interfaces/Entity";

import { AccountRepositoryToken } from "../repositories/AccountRepository";
import { GameRepositoryToken } from "../repositories/GameRepository";

import { AccountGroupProperties, IAccountGroup } from "../entities/AccountGroup";
import { AccountProperties, IAccount } from "../entities/Account";

import EntityService, { EntityOptions, IEntityService } from "./EntityService";
import { PaginationOptions } from "./PaginationService";
import { HashServiceToken } from "./HashService";
import { AccountGroupAccountProperties, IAccountGroupAccount } from "../entities/AccountGroupAccount";
import { AccountGroupAuthorizationProperties, IAccountGroupAuthorization } from "../entities/AccountGroupAuthorization";
import { MariaRepositoryToken } from "../repositories/MariaRepository";

export const AccountServiceToken = new Token<IAccountService>("AccountService")

export type AccountsOptions = PaginationOptions & {
  id?: EntityFilter<number>
  status?: EntityFilter<AccountStatus>
  username?: EntityFilter<string>
}

export type AccountGroupOptions = PaginationOptions & {
  id?: EntityFilter<number>
}

export type AccountGroupAccountOptions = PaginationOptions & {
  accountId?: EntityFilter<number>
  accountGroupId?: EntityFilter<number>
}

export type AccountGroupAuthorizationOptions = PaginationOptions & {
  accountGroupId?: EntityFilter<number>
  accountId?: EntityFilter<number>
}

export type AccountCreateOptions = {
  username: string
  password: string
  deleteCode?: string
}

export type AccountServiceOptions = EntityOptions & {
  accountObfuscationSalt: string
  accountGroupObfuscationSalt: string
}

export type IAccountService = IEntityService & {
  obfuscateAccountId(id: any): string
  deobfuscateAccountId(value: string | string[]): number[]
  obfuscateAccountGroupId(id: any): string
  deobfuscateAccountGroupId(value: string | string[]): number[]

  getAccountPaginationOptions(args: any): PaginationOptions
  getAccountGroupPaginationOptions(args: any): PaginationOptions

  getAccounts(options?: AccountsOptions): Promise<IAccount[]>
  getAccountGroups(options?: AccountGroupOptions): Promise<IAccountGroup[]>
  getAccountGroupAccounts(options?: AccountGroupAccountOptions): Promise<IAccountGroupAccount[]>
  getAccountGroupAuthorizations(options?: AccountGroupAuthorizationOptions): Promise<IAccountGroupAuthorization[]>

  createAccount(options: AccountCreateOptions): Promise<number>
}

export default class AccountService extends EntityService<AccountServiceOptions> implements IAccountService {

  obfuscateAccountId(id: any) {
    return this.obfuscateId(id, { salt: this.options.accountObfuscationSalt })
  }

  deobfuscateAccountId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.ACCOUNT_INVALID_ID,
      salt: this.options.accountObfuscationSalt,
    })
  }

  obfuscateAccountGroupId(id: any) {
    return this.obfuscateId(id, { salt: this.options.accountGroupObfuscationSalt })
  }

  deobfuscateAccountGroupId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.ACCOUNT_GROUP_INVALID_ID,
      salt: this.options.accountGroupObfuscationSalt,
    })
  }

  getAccountPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateAccountId(offset) })
  }

  getAccountGroupPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateAccountGroupId(offset) })
  }

  async getAccounts(options?: AccountsOptions) {
    let {
      id,
      status,
      username,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getAccounts", options)

    const accountRepository = Container.get(AccountRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'account.id' })

    const filter: AccountProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["account.id"] = id
    if (status) filter["account.status"] = status
    if (username) filter["account.login"] = username

    return accountRepository.getAccounts({ filter, where, order, limit })
  }

  async getAccountGroups(options?: AccountGroupOptions) {
    const {
      id,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getAccountGroups", options)

    const accountRepository = Container.get(AccountRepositoryToken)

    const orders = this.getPaginationColumnOptions({ key: 'id', column: 'account_group.account_group_id' })

    const filter: AccountGroupProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders })

    if (id) filter["account_group.account_group_id"] = id

    return accountRepository.getAccountGroups({ filter, where, order, limit })
  }

  async getAccountGroupAccounts(options?: AccountGroupAccountOptions) {
    const {
      accountGroupId,
      accountId,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getAccountGroupAccounts", options)

    const accountRepository = Container.get(AccountRepositoryToken)

    const filter: AccountGroupAccountProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders: {} })

    if (accountGroupId) filter["account_group_account.account_group_account_account_group_id"] = accountGroupId
    if (accountId) filter["account_group_account.account_group_account_account_id"] = accountId

    return accountRepository.getAccountGroupAccounts({ filter, where, order, limit })
  }

  async getAccountGroupAuthorizations(options?: AccountGroupAuthorizationOptions) {
    const {
      accountGroupId,
      accountId,
      orderId,
      limit,
      offset
    } = options || {}

    this.log("getAccountGroupAccounts", options)

    const accountRepository = Container.get(AccountRepositoryToken)
    const mariaRepository = Container.get(MariaRepositoryToken)
    const gameRepository = Container.get(GameRepositoryToken)

    const filter: AccountGroupAuthorizationProperties = {}
    const { where, order } = this.getPaginationQueryOptions({ orderId, offset, orders: {} })

    if (accountGroupId) filter["account_group_authorization.account_group_authorization_account_group_id"] = accountGroupId

    if (accountId) {
      where.push(`account_group_authorization.account_group_authorization_account_group_id IN (
        SELECT account_group_account.account_group_account_account_group_id 
        FROM ${gameRepository.getCmsDatabaseName()}.account_group_account
        WHERE ${mariaRepository.parseEntityFilter('account_group_account.account_group_account_account_id', accountId)} 
      )`)
    }

    return accountRepository.getAccountGroupAuthorizations({ filter, where, order, limit })
  }

  async createAccount(options: AccountCreateOptions) {
    const {
      username, 
      password, 
      deleteCode = randomNumber(1_000_000, 9_999_999)
    } = options

    this.log("createAccount", options)

    const accountRepository = Container.get(AccountRepositoryToken)
    const hashService = Container.get(HashServiceToken)

    const { insertId } = await accountRepository.createAccounts({
      entities: [
        {
          "login": username,
          "password": hashService.mysql41Password(password),
          "social_id": deleteCode
        }
      ]
    })

    return insertId
  }

}