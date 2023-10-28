import { Container, Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { AccountStatus } from "../interfaces/Account";
import { LogType } from "../interfaces/Log";

import { AccountGroupOptions, AccountServiceToken } from "../services/AccountService";
import { CaptchaServiceToken, CaptchaType } from "../services/CaptchaService";
import { ValidatorServiceToken } from "../services/ValidatorService";
import { PaginationOptions } from "../services/PaginationService";
import { MailServiceToken } from "../services/MailService";
import { HashServiceToken } from "../services/HashService";
import { LogServiceToken } from "../services/LogService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";

import { IAccountGroup } from "../entities/AccountGroup";
import { IAccount } from "../entities/Account";

import { Controller, IController } from "./Controller";
import { randomNumber } from "../helpers/Number";

export const AccountControllerToken = new Token<IAccountController>("AccountController")

export enum AccountAction {
  PASSWORD_CHANGE,
  PASSWORD_RECOVERY_REQUEST,
  PASSWORD_RECOVERY_CONFIRMATION,
  
  USERNAME_CHANGE,
  USERNAME_RECOVERY,

  MAIL_CHANGE_REQUEST,
  MAIL_CHANGE_CONFIRMATION,

  SAFEBOX_CODE_RECOVERY,

  DELETE_CODE_RECOVERY
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
    [action] = getEnumValues(AccountAction, action)

    this.log("handleAccountPostRequest", { action })

    switch (action) {

      case AccountAction.PASSWORD_CHANGE:
        response = await this.handleAccountPasswordChangeRequest(context)
        break

      case AccountAction.PASSWORD_RECOVERY_REQUEST:
        response = await this.handleAccountPasswordRecoveryRequest(context)
        break

      case AccountAction.PASSWORD_RECOVERY_CONFIRMATION:
        response = await this.handleAccountPasswordRecoveryConfirmationRequest(context)
        break

      case AccountAction.USERNAME_CHANGE:
        response = await this.handleAccountUsernameChangeRequest(context)
        break

      case AccountAction.USERNAME_RECOVERY:
        response = await this.handleAccountUsernameRecoveryRequest(context)
        break

      case AccountAction.MAIL_CHANGE_REQUEST:
        response = await this.handleAccountMailChangeRequest(context)
        break

      case AccountAction.MAIL_CHANGE_CONFIRMATION:
        response = await this.handleAccountMailChangeConfirmationRequest(context)
        break

      case AccountAction.SAFEBOX_CODE_RECOVERY:
        response = await this.handleAccountSafeBoxCodeRecoveryRequest(context)
        break

      case AccountAction.DELETE_CODE_RECOVERY:
        response = await this.handleAccountDeleteCodeRecoveryRequest(context)  
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.REQUEST_PARAMETERS_INVALID)

    }

    context.setResponse(response)
  }

  async handleAccountUsernameChangeRequest(context: IHttpRouterContext) {
    const { username, password } = context.body

    this.log("handleAccountUsernameChangeRequest", { username, password })

    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)
    const logService = Container.get(LogServiceToken)

    accountService.isAccountUsername(username)
    accountService.isAccountPassword(password)

    const passwordHash = hashService.mysql41Password(password)

    const auth = context.getAuth()

    const account = await this.getAccountById(auth.accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)
    if (account.password !== passwordHash) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_PASSWORD_INVALID)

    const [usernameAccount] = await context.dataLoaderService.getAccountsByUsername(username)
    if (usernameAccount) throw new HttpRouterError(HttpStatusCode.CONFLICT, ErrorMessage.ACCOUNT_USERNAME_TAKEN)

    await accountService.setAccountById(account.id, {
      username: username
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_USERNAME_CHANGE,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        previousUsername: account.username,
        newUsername: username,
      }
    })

    return {}
  }

  async handleAccountUsernameRecoveryRequest(context: IHttpRouterContext) {
    const { mail, captchaToken, captchaValue } = context.body

    this.log("handleAccountUsernameRecoveryRequest", { mail, captchaToken, captchaValue })

    const validatorService = Container.get(ValidatorServiceToken)
    const captchaService = Container.get(CaptchaServiceToken)
    const mailService = Container.get(MailServiceToken)
    const logService = Container.get(LogServiceToken)

    validatorService.isEmail(mail)

    await captchaService.verifyCaptchaToken({
      type: CaptchaType.ACCOUNT_USERNAME_RECOVERY,
      token: captchaToken,
      value: captchaValue
    })

    const [account] = await context.dataLoaderService.getAccountsByMail(mail)
    if (account?.status === AccountStatus.OK) {
      await mailService.sendAccountUsernameRecovery({
        localeCode: account.localeCode,
        username: account.username,
        to: account.mail,
      })

      logService.createLog({
        typeId: LogType.ACCOUNT_USERNAME_RECOVERY,
        remoteAddress: context.ip,
        accountId: account.id,
      })
    }

    return {}
  }

  async handleAccountPasswordChangeRequest(context: IHttpRouterContext) {
    const { password, newPassword } = context.body

    this.log("handleAccountPasswordChangeRequest", { password, newPassword })

    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)
    const logService = Container.get(LogServiceToken)

    accountService.isAccountPassword(newPassword)
    accountService.isAccountPassword(password)

    const previousPasswordHash = hashService.mysql41Password(password)
    const newPasswordHash = hashService.mysql41Password(newPassword)

    const auth = context.getAuth()

    const account = await this.getAccountById(auth.accountId, context)
    if (account?.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)
    if (account?.password !== previousPasswordHash) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_PASSWORD_INVALID)

    await accountService.setAccountById(account.id, {
      password: newPasswordHash
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_PASSWORD_CHANGE,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        previousPassword: previousPasswordHash,
        newPassword: newPasswordHash,
      }
    })

    return {}
  }

  async handleAccountPasswordRecoveryRequest(context: IHttpRouterContext) {
    const { mail, captchaValue, captchaToken } = context.body

    this.log("handleAccountPasswordRecoveryRequest", { mail, captchaValue, captchaToken })

    const validatorService = Container.get(ValidatorServiceToken)
    const captchaService = Container.get(CaptchaServiceToken)
    const accountService = Container.get(AccountServiceToken)
    const mailService = Container.get(MailServiceToken)
    const logService = Container.get(LogServiceToken)

    validatorService.isEmail(mail)

    await captchaService.verifyCaptchaToken({
      type: CaptchaType.ACCOUNT_PASSWORD_RECOVERY,
      token: captchaToken,
      value: captchaValue
    })

    const [account] = await context.dataLoaderService.getAccountsByMail(mail)
    if (account?.status === AccountStatus.OK) {
      const { token, ttl } = await accountService.createAccountPasswordRecoveryToken({ accountId: account.id })

      await mailService.sendAccountPasswordRecovery({
        localeCode: account.localeCode,
        username: account.username,
        to: account.mail,
        token: token,
        ttl: ttl
      })

      logService.createLog({
        typeId: LogType.ACCOUNT_PASSWORD_RECOVERY_REQUEST,
        remoteAddress: context.ip,
        accountId: account.id,
        data: { token }
      })
    }

    return {}
  }

  async handleAccountPasswordRecoveryConfirmationRequest(context: IHttpRouterContext) {
    const { token, password } = context.body

    this.log("handleAccountPasswordRecoveryConfirmRequest", { token, password })

    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)
    const logService = Container.get(LogServiceToken)

    accountService.isAccountPassword(password)

    const accountId = await accountService.verifyAccountPasswordRecoveryToken(token)

    const account = await this.getAccountById(accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    const previousPasswordHash = account.password
    const newPasswordHash = hashService.mysql41Password(password)

    await accountService.setAccountById(account.id, {
      password: newPasswordHash
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_PASSWORD_RECOVERY_CONFIRMATION,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        token,
        previousPassword: previousPasswordHash,
        newPassword: newPasswordHash,
      }
    })

    return {}
  }

  async handleAccountMailChangeRequest(context: IHttpRouterContext) {
    const { password, mail } = context.body

    const validatorService = Container.get(ValidatorServiceToken)
    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)
    const mailService = Container.get(MailServiceToken)
    const logService = Container.get(LogServiceToken)

    accountService.isAccountPassword(password)
    validatorService.isEmail(mail)
    
    const auth = context.getAuth()
    
    const passwordHash = hashService.mysql41Password(password)

    const account = await this.getAccountById(auth.accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)
    if (account.password !== passwordHash) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_PASSWORD_INVALID)

    const { token, ttl } = await accountService.createAccountMailChangeToken({ accountId: account.id, mail })

    await mailService.sendAccountMailChange({
      localeCode: account.localeCode,
      username: account.username,
      token: token,
      to: mail,
      ttl: ttl
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_MAIL_CHANGE_REQUEST,
      remoteAddress: context.ip,
      accountId: account.id,
      data: { token, mail }
    })

    return {}
  }

  async handleAccountMailChangeConfirmationRequest(context: IHttpRouterContext) {
    const { token } = context.body
    
    const accountService = Container.get(AccountServiceToken)
    const logService = Container.get(LogServiceToken)

    const { accountId, mail } = await accountService.verifyAccountMailChangeToken(token)

    const account = await this.getAccountById(accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    await accountService.setAccountById(account.id, { mail })

    logService.createLog({
      typeId: LogType.ACCOUNT_MAIL_CHANGE_CONFIRMATION,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        token,
        previousMail: account.mail,
        newMail: mail,
      }
    })

    return {}
  }

  async handleAccountSafeBoxCodeRecoveryRequest(context: IHttpRouterContext) {
    const { password } = context.body

    this.log("handleAccountSafeBoxCodeRecoveryRequest", { password })

    const accountService = Container.get(AccountServiceToken)
    const mailService = Container.get(MailServiceToken)
    const hashService = Container.get(HashServiceToken)
    const logService = Container.get(LogServiceToken)

    const auth = context.getAuth()

    const passwordHash = hashService.mysql41Password(password)

    const account = await this.getAccountById(auth.accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)
    if (account.password !== passwordHash) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_PASSWORD_INVALID)

    const safeBoxCode = randomNumber(100_000, 999_999).toString()

    await accountService.setAccountSafeBoxByAccountId(account.id, {
      code: safeBoxCode
    })

    await mailService.sendAccountSafeBoxCodeRecovery({
      localeCode: account.localeCode,
      username: account.username,
      safeBoxCode: safeBoxCode,
      to: account.mail,
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_SAFEBOX_CODE_RECOVERY,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        previousSafeBoxCode: account.safeBoxCode,
        newSafeBoxCode: safeBoxCode
      }
    })

    return {}
  }

  async handleAccountDeleteCodeRecoveryRequest(context: IHttpRouterContext) {
    const { password } = context.body

    this.log("handleAccountDeleteCodeRecoveryRequest", { password })

    const accountService = Container.get(AccountServiceToken)
    const mailService = Container.get(MailServiceToken)
    const hashService = Container.get(HashServiceToken)
    const logService = Container.get(LogServiceToken)

    const auth = context.getAuth()

    const passwordHash = hashService.mysql41Password(password)

    const account = await this.getAccountById(auth.accountId, context)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)
    if (account.password !== passwordHash) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_PASSWORD_INVALID)

    const deleteCode = randomNumber(1_000_000, 9_999_999).toString()

    await accountService.setAccountById(account.id, { deleteCode })

    await mailService.sendAccountDeleteCodeRecovery({
      localeCode: account.localeCode,
      username: account.username,
      deleteCode: deleteCode,
      to: account.mail,
    })

    logService.createLog({
      typeId: LogType.ACCOUNT_DELETE_CODE_RECOVERY,
      remoteAddress: context.ip,
      accountId: account.id,
      data: {
        previousDeleteCode: account.deleteCode,
        newDeleteCode: deleteCode
      }
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