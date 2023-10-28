import { Container, Token } from "../infrastructures/Container";

import { randomNumber } from "../helpers/Number";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { AccountStatus, AccountTable } from "../interfaces/Account";
import { SafeBoxTable } from "../interfaces/SafeBox";
import { EntityFilter } from "../interfaces/Entity";

import { AccountRepositoryToken } from "../repositories/AccountRepository";
import { MariaRepositoryToken } from "../repositories/MariaRepository";
import { GameRepositoryToken } from "../repositories/GameRepository";

import { AccountGroupAuthorizationProperties, IAccountGroupAuthorization } from "../entities/AccountGroupAuthorization";
import { AccountGroupAccountProperties, IAccountGroupAccount } from "../entities/AccountGroupAccount";
import { AccountGroupProperties, IAccountGroup } from "../entities/AccountGroup";
import { AccountProperties, IAccount } from "../entities/Account";

import { EntityService, EntityServiceOptions, EntitySetOptions, IEntityService } from "./EntityService";
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

export type AccountUpdateProperties = {
  password: string
}

export type AccountCreateOptions = {
  username: string
  password: string
  deleteCode?: string
}

export type AccountSafeBoxCreateOptions = {
  accountId: number
  money?: number
  size?: number
  code?: string
}

export type AccountSetFilter = {
  id?: number
}

export type AccountSetProperties = {
  mail?: string
  username?: string
  deleteCode?: string  
  password?: string
}

export type AccountSafeBoxSetFilter = {
  accountId?: number
}

export type AccountSafeBoxSetProperties = {
  size?: number
  code?: string
  money?: number
}

export type AccountPasswordRecoveryTokenCreateOptions = {
  accountId: number
}

export type AccountMailChangeTokenCreateOptions = {
  accountId: number
  mail: string
}

export type AccountServiceOptions = EntityServiceOptions & {
  accountObfuscationSalt: string
  accountGroupObfuscationSalt: string

  accountUsernameMinLength: number
  accountUsernameMaxLength: number

  accountPasswordMinLength: number
  accountPasswordMaxLength: number

  accountPasswordRecoveryTokenObfuscationSalt: string
  accountPasswordRecoveryTokenTtl: number

  accountMailChangeTokenObfuscationSalt: string
  accountMailChangeTokenTtl: number
}

export type IAccountService = IEntityService & {
  obfuscateAccountId(id: any): string
  deobfuscateAccountId(value: string | string[]): number[]
  obfuscateAccountGroupId(id: any): string
  deobfuscateAccountGroupId(value: string | string[]): number[]

  isAccountUsername(value: unknown, options?: ValidateOptions): void
  isAccountPassword(value: unknown, options?: ValidateOptions): void

  createAccountPasswordRecoveryToken(options: AccountPasswordRecoveryTokenCreateOptions): Promise<{ token: string, ttl: number }>
  verifyAccountPasswordRecoveryToken(token: string): Promise<number>

  createAccountMailChangeToken(options: AccountMailChangeTokenCreateOptions): Promise<{token: string, ttl: number }>
  verifyAccountMailChangeToken(token: string): Promise<{ accountId: number, mail: string }>

  getAccountPaginationOptions(args: any): PaginationOptions
  getAccountGroupPaginationOptions(args: any): PaginationOptions

  getAccounts(options?: AccountsOptions): Promise<IAccount[]>
  getAccountGroups(options?: AccountGroupOptions): Promise<IAccountGroup[]>
  getAccountGroupAccounts(options?: AccountGroupAccountOptions): Promise<IAccountGroupAccount[]>
  getAccountGroupAuthorizations(options?: AccountGroupAuthorizationOptions): Promise<IAccountGroupAuthorization[]>

  setAccountById(id: number, properties: AccountSetProperties): Promise<any>
  setAccountSafeBoxByAccountId(accountId: number, properties: AccountSafeBoxSetProperties): Promise<any>

  createAccount(options: AccountCreateOptions): Promise<number>
  createAccountSafeBox(options: AccountSafeBoxCreateOptions): Promise<number>
}

export class AccountService extends EntityService<AccountServiceOptions> implements IAccountService {

  obfuscateAccountId(id: any) {
    return this.obfuscateId(id, { salt: this.options.accountObfuscationSalt })
  }

  deobfuscateAccountId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.ACCOUNT_ID_INVALID,
      salt: this.options.accountObfuscationSalt,
    })
  }

  obfuscateAccountGroupId(id: any) {
    return this.obfuscateId(id, { salt: this.options.accountGroupObfuscationSalt })
  }

  deobfuscateAccountGroupId(value: string | string[]) {
    return this.deobfuscateId(value, {
      error: ErrorMessage.ACCOUNT_GROUP_ID_INVALID,
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
      message = ErrorMessage.ACCOUNT_USERNAME_INVALID,
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
      message = ErrorMessage.ACCOUNT_PASSWORD_INVALID,
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

  async setAccountById(id: number, properties: AccountSetProperties) {
    this.log("setAccountById", { id, properties })

    return this.setAccount({
      filter: { id },
      properties
    })
  }

  async setAccountSafeBoxByAccountId(accountId: number, properties: any) {
    this.log("setAccountSafeBoxByAccountId", { accountId, properties })

    return this.setAccountSafeBox({
      filter: { accountId },
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

  async createAccountSafeBox(options: AccountSafeBoxCreateOptions) {
    const {
      accountId, 
      money,
      size, 
      code, 
    } = options

    this.log("createAccountSafeBox", options)

    const accountRepository = Container.get(AccountRepositoryToken)

    const { insertId } = await accountRepository.createAccountSafeBox({
      entities: [
        {
          "account_id": accountId,
          "password": code,
          "gold": money,
          "size": size
        }
      ]
    })

    return insertId
  }


  async createAccountPasswordRecoveryToken(options: AccountPasswordRecoveryTokenCreateOptions) {
    const {
      accountId,
    } = options

    this.log("createAccountPasswordRecoveryToken", { accountId })

    const tokenService = Container.get(TokenServiceToken)

    const token = await tokenService.createToken({
      obfuscationSalt: this.options.accountPasswordRecoveryTokenObfuscationSalt,
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      type: TokenType.ACCOUNT_PASSWORD_RECOVERY,
      values: [ accountId ],
    })

    return {
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      token, 
    }
  }

  async verifyAccountPasswordRecoveryToken(token: string) {
    this.log("createAccountPasswordRecoveryToken", { token })

    const tokenService = Container.get(TokenServiceToken)

    const [accountId] = await tokenService.verifyToken({
      obfuscationSalt: this.options.accountPasswordRecoveryTokenObfuscationSalt,
      ttl: this.options.accountPasswordRecoveryTokenTtl,
      type: TokenType.ACCOUNT_PASSWORD_RECOVERY,
      token: token,
    })

    return accountId
  }

  async createAccountMailChangeToken(options: AccountMailChangeTokenCreateOptions) {
    const {
      accountId,
      mail
    } = options

    this.log("createAccountMailChangeToken", { accountId, mail })

    const tokenService = Container.get(TokenServiceToken)
    const mailCharCodes = mail.split("").map((c: string) => c.charCodeAt(0))

    const token = await tokenService.createToken({
      obfuscationSalt: this.options.accountMailChangeTokenObfuscationSalt,
      ttl: this.options.accountMailChangeTokenTtl,
      type: TokenType.ACCOUNT_MAIL_CHANGE,
      values: [ accountId, ...mailCharCodes ]
    })

    return {
      ttl: this.options.accountMailChangeTokenTtl,
      token
    }
  }

  async verifyAccountMailChangeToken(token: string) {
    this.log("verifyAccountMailChangeToken", { token })

    const tokenService = Container.get(TokenServiceToken)

    const [tokenType, tokenTimestamp, tokenAccountId, ...tokenMailCharCodes] = await tokenService.verifyToken({
      obfuscationSalt: this.options.accountMailChangeTokenObfuscationSalt,
      ttl: this.options.accountMailChangeTokenTtl,
      type: TokenType.ACCOUNT_MAIL_CHANGE,
      token: token,
    })

    return {
      accountId: tokenAccountId, 
      mail: String.fromCharCode(...tokenMailCharCodes)
    }
  }

  private async setAccount(options: EntitySetOptions<AccountSetFilter, AccountSetProperties>) {
    const {
      id
    } = options?.filter || {}

    const {
      mail,
      username,
      deleteCode,
      password
    } = options?.properties || {}

    this.log("setAccount", options)

    const filter: Partial<AccountTable>= {}
    const properties: Partial<AccountTable> = {}

    if (id) filter.id = id

    if (deleteCode) properties.social_id = deleteCode
    if (password) properties.password = password
    if (username) properties.login = username

    if (mail) properties.ycm2_account_mail = mail

    const accountRepository = Container.get(AccountRepositoryToken)
    return accountRepository.updateAccounts({
      filter: filter,
      entity: properties
    })
  }

  private async setAccountSafeBox(options: EntitySetOptions<AccountSafeBoxSetFilter, AccountSafeBoxSetProperties>) {
    const {
      accountId
    } = options?.filter || {}

    const {
      money,
      size,
      code,
    } = options?.properties || {}

    this.log("setAccountSafeBox", options)
  
    const filter: Partial<SafeBoxTable>= {}
    const properties: Partial<SafeBoxTable> = {}

    if (accountId) filter.account_id = accountId

    if (code) properties.password = code
    if (money) properties.gold = money
    if (size) properties.size = size

    const accountRepository = Container.get(AccountRepositoryToken)
    return accountRepository.updateAccountSafeBox({
      filter: filter,
      entity: properties
    })
  }

}