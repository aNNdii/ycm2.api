import { Container, Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { AccountStatus } from "../interfaces/Account";

import { AccountGroupOptions, AccountServiceToken } from "../services/AccountService";
import { CaptchaServiceToken, CaptchaType } from "../services/CaptchaService";
import { ValidatorServiceToken } from "../services/ValidatorService";
import { PaginationOptions } from "../services/PaginationService";
import { MailServiceToken } from "../services/MailService";
import { HashServiceToken } from "../services/HashService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";

import { IAccountGroup } from "../entities/AccountGroup";
import { IAccount } from "../entities/Account";

import { Controller, IController } from "./Controller";

export const AccountControllerToken = new Token<IAccountController>("AccountController")

export enum AccountRequestAction {
  REQUEST_USERNAME_RECOVERY,
  REQUEST_PASSWORD_RECOVERY,
  CONFIRM_PASSWORD_RECOVERY,
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

export class AccountController extends Controller implements IAccountController {

  init() {
    this.post('/account', this.handleAccountPostRequest.bind(this))
  }

  async handleAccountPostRequest(context: IHttpRouterContext) {

    let response = {}
    let { action } = context.body;
    [action] = getEnumValues(AccountRequestAction, action)

    this.log("handleAccountPostRequest", { action })

    switch (action) {

      case AccountRequestAction.REQUEST_USERNAME_RECOVERY:
        response = await this.handleAccountUsernameRecoveryRequest(context)
        break

      case AccountRequestAction.REQUEST_PASSWORD_RECOVERY:
        response = await this.handleAccountPasswordRecoveryRequest(context)
        break

      case AccountRequestAction.CONFIRM_PASSWORD_RECOVERY:
        response = await this.handleAccountPasswordRecoveryConfirmRequest(context)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    }

    context.setResponse(response)
  }

  async handleAccountUsernameRecoveryRequest(context: IHttpRouterContext) {
    const { mail } = context.body

    this.log("handleAccountUsernameRecoveryRequest", { mail })

    const mailService = Container.get(MailServiceToken)
    const validatorService = Container.get(ValidatorServiceToken)

    validatorService.isEmail(mail)

    const [account] = await context.dataLoaderService.getAccountsByMail(mail)
    if (account?.status === AccountStatus.OK) {
      await mailService.sendAccountUsernameRecovery({
        localeCode: account.localeCode,
        username: account.username,
        to: account.mail,
      })
    }

    return {}
  }

  async handleAccountPasswordRecoveryRequest(context: IHttpRouterContext) {
    const { mail, captchaValue, captchaToken } = context.body

    this.log("handleAccountPasswordRecoveryRequest", { mail, captchaValue, captchaToken })

    const validatorService = Container.get(ValidatorServiceToken)
    const captchaService = Container.get(CaptchaServiceToken)
    const accountService = Container.get(AccountServiceToken)
    const mailService = Container.get(MailServiceToken)

    validatorService.isEmail(mail)

    await captchaService.verifyCaptchaToken({
      type: CaptchaType.ACCOUNT_PASSWORD_RECOVERY,
      token: captchaToken,
      value: captchaValue
    })

    const [account] = await context.dataLoaderService.getAccountsByMail(mail)
    if (account?.status === AccountStatus.OK) {
      const { token, ttl } = await accountService.createAccountPasswordRecoveryToken({ id: account.id })

      await mailService.sendAccountPasswordRecovery({
        to: account.mail,
        localeCode: account.localeCode,
        username: account.username,
        token: token,
        ttl: ttl
      })
    }

    return {}
  }

  async handleAccountPasswordRecoveryConfirmRequest(context: IHttpRouterContext) {
    const { token, password } = context.body

    this.log("handleAccountPasswordRecoveryConfirmRequest", { token, password })

    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)

    accountService.isAccountPassword(password)

    const [tokenType, tokenTimestamp, tokenAccountId] = await accountService.verifyAccountPasswordRecoveryToken(token)

    await accountService.setAccountById(tokenAccountId, {
      password: hashService.mysql41Password(password)
    })

    return {}
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

  async getAccountByMail(mail: string, context: IHttpRouterContext) {
    this.log("getAccountByMail", { mail })

    const [account] = await context.dataLoaderService.getAccountsByMail(mail)
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