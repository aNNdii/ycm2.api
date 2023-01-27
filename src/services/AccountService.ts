import Container, { Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { AccountStatus } from "../interfaces/Account";
import { EntityFilter } from "../interfaces/Entity";

import { AccountRepositoryToken } from "../repositories/AccountRepository";

import { AccountProperties, IAccount } from "../entities/Account";

import EntityService, { EntityOptions, IEntityService } from "./EntityService";
import { PaginationOptions } from "./PaginationService";
import { HashServiceToken } from "./HashService";
import { randomNumber } from "../helpers/Number";

export const AccountServiceToken = new Token<IAccountService>("AccountService")

export type AccountsOptions = PaginationOptions & {
  id?: EntityFilter<number>
  status?: EntityFilter<AccountStatus>
  username?: EntityFilter<string>
}

export type AccountCreateOptions = {
  username: string
  password: string
  deleteCode?: string
}

export type AccountServiceOptions = EntityOptions & {
  accountObfuscationSalt: string
}

export type IAccountService = IEntityService & {
  obfuscateAccountId(id: any): string
  deobfuscateAccountId(value: string | string[]): number[]
  getAccountPaginationOptions(args: any): PaginationOptions

  getAccounts(options?: AccountsOptions): Promise<IAccount[]>
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

  getAccountPaginationOptions(args: any) {
    return this.getPaginationOptions(args, { offsetHandler: offset => this.deobfuscateAccountId(offset) })
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

  async createAccount(options: AccountCreateOptions) {
    const {
      username, 
      password, 
      deleteCode = randomNumber(1_000_000, 9_999_999)
    } = options

    console.log(this)

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