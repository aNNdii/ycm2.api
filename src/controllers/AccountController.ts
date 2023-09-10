import Container, { Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { AccountStatus } from "../interfaces/Account";

import { AccountGroupOptions, AccountServiceToken } from "../services/AccountService";
import { PaginationOptions } from "../services/PaginationService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import HttpRouterError from "../entities/HttpRouterError";

import { IAccountGroup } from "../entities/AccountGroup";
import { IAccount } from "../entities/Account";

import Controller, { IController } from "./Controller";

export const AccountControllerToken = new Token<IAccountController>("AccountController")

export enum AccountRequestAction {
  REQUEST_USERNAME,
  RESET_PASSWORD,
}

export type AccountsOptions = PaginationOptions & {
  status?: AccountStatus
}

export type IAccountController = IController & {
  getAccounts(options: AccountsOptions, context: IHttpRouterContext): Promise<IAccount[]>
  getAccountById(id: number, context: IHttpRouterContext): Promise<IAccount>
  getAccountByHashId(hashId: string, context: IHttpRouterContext): Promise<IAccount>

  getAccountGroups(options: AccountGroupOptions, context: IHttpRouterContext): Promise<IAccountGroup[]>
  getAccountGroupById(id: number, context: IHttpRouterContext): Promise<IAccountGroup>
  getAccountGroupByHashId(hashId: string, context: IHttpRouterContext): Promise<IAccountGroup>
}

export default class AccountController extends Controller implements IAccountController {

  init() {
    this.post('/account', this.handleAccountPostRequest.bind(this))
  }

  async handleAccountPostRequest(context: IHttpRouterContext) {

    let { action } = context.body;
    [action] = getEnumValues(AccountRequestAction, action)

    this.log("postAccountRequest", { action })

    switch (action) {

      case AccountRequestAction.REQUEST_USERNAME:
        await this.handleAccountRequestUsernameRequest(context)
        break

      case AccountRequestAction.RESET_PASSWORD:
        await this.handleAccountResetPasswordRequest(context)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.INVALID_REQUEST_PARAMETERS)

    }

  }

  async handleAccountRequestUsernameRequest(context: IHttpRouterContext) {

  }

  async handleAccountResetPasswordRequest(context: IHttpRouterContext) {

  }

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


  async getAccountGroups(options: AccountGroupOptions, context: IHttpRouterContext) {
    this.log("getAccountGroups", options)

    const accountService = Container.get(AccountServiceToken)
    const paginationOptions = accountService.getAccountGroupPaginationOptions(options)

    return context.dataLoaderService.getAccountGroups({
      ...paginationOptions,
    })
  }

  async getAccountGroupById(id: number, context: IHttpRouterContext) {
    this.log("getAccountGroupById", { id })

    const [group] = await context.dataLoaderService.getAccountGroupsById(id)
    if (!group) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_GROUP_NOT_FOUND)

    return group
  }

  getAccountGroupByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getAccountGroupByHashId", { hashId })

    const accountService = Container.get(AccountServiceToken)
    const [id] = accountService.deobfuscateAccountGroupId(hashId)

    return this.getAccountGroupById(id, context)
  }


}