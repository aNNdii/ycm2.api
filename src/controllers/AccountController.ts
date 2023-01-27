import Container, { Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { AccountStatus } from "../interfaces/Account";

import { AccountServiceToken } from "../services/AccountService";
import { PaginationOptions } from "../services/PaginationService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import HttpRouterError from "../entities/HttpRouterError";

import { IAccount } from "../entities/Account";

import Controller, { IController } from "./Controller";

export const AccountControllerToken = new Token<IAccountController>("AccountController")

export type AccountsOptions = PaginationOptions & {
  status?: AccountStatus
}

export type IAccountController = IController & {
  getAccounts(options: AccountsOptions, context: IHttpRouterContext): Promise<IAccount[]>
  getAccountById(id: number, context: IHttpRouterContext): Promise<IAccount>
  getAccountByHashId(hashId: string, context: IHttpRouterContext): Promise<IAccount>
}

export default class AccountController extends Controller implements IAccountController {

  async getAccounts(options: AccountsOptions, context: IHttpRouterContext) {
    this.log("getAccounts", options)

    const { status } = options || {}

    const accountService = Container.get(AccountServiceToken)
    const paginationOptions = accountService.getAccountPaginationOptions(options)

    return context.dataLoaderService.getAccounts({
      ...paginationOptions,
      status
    })
  }

  async getAccountById(id: number, context: IHttpRouterContext) {
    this.log("getAccountById", { id })

    const [account] = await context.dataLoaderService.getAccountsById(id)
    if (!account) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_NOT_FOUND)

    return account
  }

  getAccountByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getAccountByHashId", { hashId })

    const accountService = Container.get(AccountServiceToken)
    const [id] = accountService.deobfuscateAccountId(hashId)

    return this.getAccountById(id, context)
  }

}