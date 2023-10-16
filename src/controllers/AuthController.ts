import { Container, Token } from "../infrastructures/Container";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { AuthenticationTokenType } from "../interfaces/Auth";
import { AccountStatus } from "../interfaces/Account";

import { ValidatorServiceToken } from "../services/ValidatorService";
import { HashServiceToken } from "../services/HashService";
import { AuthServiceToken } from "../services/AuthService";

import { AuthenticationScheme, IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";
import { IAuth } from "../entities/Auth";

import { Controller, IController } from "./Controller";
import { AccountServiceToken } from "../services/AccountService";

export const AuthControllerToken = new Token<IAuthController>("AuthController")

export type AuthenticationOptions = {
  username?: string
  password?: string

  token?: string
  tokenTypes?: AuthenticationTokenType[]
}

export type IAuthController = IController & {}

export class AuthController extends Controller implements IAuthController {

  init() {
    this.get('/auth', this.handleAuthGetRequest.bind(this))
    // this.post('/auth', this.handleAuthPostRequest.bind(this))
  }

  async handleAuthGetRequest(context: IHttpRouterContext) {
    const scheme = context.getAuthenticationScheme()

    let auth: IAuth | undefined

    switch (scheme) {

      case AuthenticationScheme.BASIC:
        const { username, password } = context.getBasicAuthentication()
        auth = await this.getAuthByUsernameAndPassword({ username, password }, context)
        break

      case AuthenticationScheme.BEARER:
        const token = context.getBearerAuthenticationToken()
        auth = await this.getAuthByJsonWebToken({ token, tokenTypes: [AuthenticationTokenType.REFRESH] }, context)
        break

      default:
        throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_INVALID_METHOD)

    }

    const data = {
      accountId: auth?.accountHashId,
      accessToken: auth?.accessToken,
      refreshToken: auth?.refreshToken
    }

    context.setResponse({ data })
  }

  async getAuthByUsernameAndPassword(options: AuthenticationOptions, context: IHttpRouterContext) {
    const { username, password } = options

    this.log("getAuthByUsernameAndPassword", { username, password })

    const accountService = Container.get(AccountServiceToken)
    const hashService = Container.get(HashServiceToken)
    const authService = Container.get(AuthServiceToken)

    accountService.isAccountUsername(username)
    accountService.isAccountPassword(password)

    const [account] = await context.dataLoaderService.getAccounts({ username })
    if (!account) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_NOT_FOUND)

    const hashPassword = hashService.mysql41Password(password || '')
    if (hashPassword !== account?.password) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_NOT_FOUND)

    if (account?.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    return authService.getAuthByAccount(account)
  }

  async getAuthByJsonWebToken(options: AuthenticationOptions, context: IHttpRouterContext) {
    const { token, tokenTypes } = options

    this.log("getAuthByJsonWebToken", { token })

    const validatorService = Container.get(ValidatorServiceToken)
    const authService = Container.get(AuthServiceToken)

    validatorService.isString(token, { pattern: /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/ })

    const auth = authService.getAuthByToken(token || '', { types: tokenTypes })

    const [account] = await context.dataLoaderService.getAccountsById(auth.accountId)
    if (!account) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.ACCOUNT_NOT_FOUND)

    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    return authService.getAuthByAccount(account)
  }

}