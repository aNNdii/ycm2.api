import { Container, Token } from "../infrastructures/Container";

import { randomNumber } from "../helpers/Number";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { AccountStatus, AccountTable } from "../interfaces/Account";
import { EntityFilter } from "../interfaces/Entity";

import { AccountRepositoryToken } from "../repositories/AccountRepository";
import { MariaRepositoryToken } from "../repositories/MariaRepository";
import { GameRepositoryToken } from "../repositories/GameRepository";

import { AccountGroupAuthorizationProperties, IAccountGroupAuthorization } from "../entities/AccountGroupAuthorization";
import { AccountGroupAccountProperties, IAccountGroupAccount } from "../entities/AccountGroupAccount";
import { AccountGroupProperties, IAccountGroup } from "../entities/AccountGroup";
import { AccountProperties, IAccount } from "../entities/Account";

import { EntityService, EntityOptions, IEntityService } from "./EntityService";
import { ValidateOptions, ValidatorServiceToken } from "./ValidatorService";
import { TokenServiceToken, TokenType } from "./TokenService";
import { PaginationOptions } from "./PaginationService";
import { HashServiceToken } from "./HashService";

export const AccountServiceToken = new Token<IAccountService>("AccountService")

export type AccountsOptions = PaginationOptions & {
  id?: EntityFilter<number>
  status?: EntityFilter<AccountStatus>
  username?: EntityFilter<string>
  mail?: EntityFilter<string>
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

export type AccountUpdateFilter = {

}

export type AccountUpdateProperties = {
  password: string
}

export type AccountCreateOptions = {
  username: string
  password: string
  deleteCode?: string
}

export type AccountPasswordRecoveryTokenCreateOptions = {
  id: number
}

export type AccountServiceOptions = EntityOptions & {
  accountObfuscationSalt: string
  accountGroupObfuscationSalt: string

  accountUsernameMinLength: number
  accountUsernameMaxLength: number

  accountPasswordMinLength: number
  accountPasswordMaxLength: number

  accountPasswordRecoveryTokenObfuscationSalt: string
  accountPasswordRecoveryTokenTtl: number
}

export type IAccountService = IEntityService & {
  obfuscateAccountId(id: any): string
  deobfuscateAccountId(value: string | string[]): number[]
  obfuscateAccountGroupId(id: any): string
  deobfuscateAccountGroupId(value: string | string[]): number[]

  isAccountUsername(value: unknown, options?: ValidateOptions): void
  isAccountPassword(value: unknown, options?: ValidateOptions): void

  createAccountPasswordRecoveryToken(options: AccountPasswordRecoveryTokenCreateOptions): Promise<{ token: string, ttl: number }>
  verifyAccountPasswordRecoveryToken(token: string): Promise<number[]>

  getAccountPaginationOptions(args: any): PaginationOptions
  getAccountGroupPaginationOptions(args: any): PaginationOptions

  getAccounts(options?: AccountsOptions): Promise<IAccount[]>
  getAccountGroups(options?: AccountGroupOptions): Promise<IAccountGroup[]>
  getAccountGroupAccounts(options?: AccountGroupAccountOptions): Promise<IAccountGroupAccount[]>
  getAccountGroupAuthorizations(options?: AccountGroupAuthorizationOptions): Promise<IAccountGroupAuthorization[]>

  setAccountById(id: number, properties: any): Promise<any>

  createAccount(options: AccountCreateOptions): Promise<number>
}

export class AccountService extends EntityService<AccountServiceOptions> implements IAccountService {

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

  isAccountUsername(value: unknown, options?: ValidateOptions) {
    const {
      code = HttpStatusCode.BAD_REQUEST,
      message = ErrorMessage.REQUEST_PARAMETERS_INVALID,
    } = options || {}

    const validatorService = Container.get(ValidatorServiceToken)
    return validatorService.isString(value, {
      code,
      message,
      minLength: this.options.accountUsernameMinLength,
      maxLength: this.options.accountUsernameMaxLength
    })
  }

  isAccountPassword(value: unknown, options?: ValidateOptions) {
    const {
      code = HttpStatusCode.BAD_REQUEST,
      message = ErrorMessage.REQUEST_PARAMETERS_INVALID,
    } = options || {}

    const validatorService = Container.get(ValidatorServiceToken)
    return validatorService.isString(value, {
      code,
      message,
      minLength: this.options.accountPasswordMinLength,
      maxLength: this.options.accountPasswordMaxLength
    })
  }

  async getAccounts(options?: AccountsOptions) {
    let {
      id,
      status,
      username,
      mail,
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
    if (mail) filter["account.ycm2_account_mail"] = mail

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

  async setAccountById(id: number, properties: any) {
    this.log("setAccountById", { id, properties })

    return this.setAccount({
      filter: { id },
      properties
    })
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

  async createAccountPasswordRecoveryToken(options: AccountPasswordRecoveryTokenCreateOptions) {
    const {
      id,
    } = options

    this.log("createAccountPasswordRecoveryToken", { id })

    const tokenService = Container.get(TokenServiceToken)

    const token = await tokenService.createToken({
      obfuscationSalt: this.options.accountPasswordRecoveryTokenObfuscationSalt,
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      type: TokenType.ACCOUNT_PASSWORD_RECOVERY,
      values: [ id ],
    })

    return {
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      token, 
    }
  }

  async verifyAccountPasswordRecoveryToken(token: string) {
    this.log("createAccountPasswordRecoveryToken", { token })

    const tokenService = Container.get(TokenServiceToken)

    return tokenService.verifyToken({
      obfuscationSalt: this.options.accountPasswordRecoveryTokenObfuscationSalt,
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      type: TokenType.ACCOUNT_PASSWORD_RECOVERY,
      token: token,
    })
  }

  private async setAccount(options: any) {
    const {
      filter,
      properties
    } = options 
    
    this.log("setAccount", options)

    const {
      id
    } = filter

    const {
      password
    } = properties

    const updateFilter: Partial<AccountTable> = {}
    const updateProperties: Partial<AccountTable> = {}

    if (id) updateFilter.id = id

    if (password) updateProperties.password = password

    const accountRepository = Container.get(AccountRepositoryToken)
    return accountRepository.updateAccounts({
      filter: updateFilter,
      entity: updateProperties
    })
  }

}