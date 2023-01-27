import Container, { Token } from "../infrastructures/Container";
import { ValidatorServiceToken } from "../services/ValidatorService";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { AuthenticationMethod, AuthenticationTokenType } from "../interfaces/Auth";
import { AccountStatus } from "../interfaces/Account";

import { HashServiceToken } from "../services/HashService";
import { AuthServiceToken } from "../services/AuthService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import HttpRouterError from "../entities/HttpRouterError";
import { IAuth } from "../entities/Auth";

import Controller, { IController } from "./Controller";

export const AuthControllerToken = new Token<IAuthController>("AuthController")

export type AuthenticationOptions = {
  method: AuthenticationMethod
  username?: string
  password?: string
  token?: string
}

export type IAuthController = IController & {
  authenticate(options: AuthenticationOptions, context: IHttpRouterContext): Promise<IAuth>
}

export default class AuthController extends Controller implements IAuthController {

  async authenticate(options: AuthenticationOptions, context: IHttpRouterContext) {
    const { method } = options
    
    this.log("authenticate", { method })

    switch (method) {

      case AuthenticationMethod.REFRESH_TOKEN:
        return this.authenticateByRefreshToken(options, context)

      case AuthenticationMethod.PASSWORD:
      default:
        return this.authenticateByPassword(options, context)

    }

  }

  async authenticateByPassword(options: AuthenticationOptions, context: IHttpRouterContext) {
    const { username, password } = options

    this.log("authenticateByPassword", { username, password })

    const schema = {
      type: 'object',
      properties: {
        username: { type: 'string', minLength: 2, maxLength: 32 },
        password: { type: 'string', minLength: 2, maxLength: 32 }
      },
      required: ['username', 'password']
    }

    const validator = Container.get(ValidatorServiceToken)
    validator.validate<AuthenticationOptions>(options, schema)

    const hashService = Container.get(HashServiceToken)
    const authService = Container.get(AuthServiceToken)

    const hashPassword = hashService.mysql41Password(password || '')

    const [account] = await context.dataLoaderService.getAccounts({ username })

    if (!account || hashPassword !== account.password) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.ACCOUNT_NOT_FOUND)
    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    return authService.getAuthByAccount(account)
  }

  async authenticateByRefreshToken(options: AuthenticationOptions, context: IHttpRouterContext) {
    const { token } = options

    this.log("authenticateByRefreshToken", { token })

    const validator = Container.get(ValidatorServiceToken)
    validator.validate<AuthenticationOptions>(token, { type: 'string', pattern: '^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$' })

    const authService = Container.get(AuthServiceToken)

    const auth = authService.getAuthByToken(token || '', { types: [AuthenticationTokenType.REFRESH] })
    const [account] = await context.dataLoaderService.getAccountsById(auth.accountId)

    if (account.status !== AccountStatus.OK) throw new HttpRouterError(HttpStatusCode.FORBIDDEN, ErrorMessage.ACCOUNT_BLOCKED)

    return authService.getAuthByAccount(account)
  }

}