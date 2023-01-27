import Container from "../infrastructures/Container";
import { AuthenticationTokenType, AuthorizationAction, AuthorizationAdminId, Authorization } from "../interfaces/Auth";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import { AccountServiceToken } from "../services/AccountService";
import { AuthServiceToken } from "../services/AuthService";

import Entity, { IEntity } from "./Entity";
import HttpRouterError from "./HttpRouterError";

export type AuthorizationVerificationOptions = {
  code?: HttpStatusCode,
  message?: ErrorMessage
}

export type AuthProperties = {
  accountId: number
  authorizationId?: number
}

export type IAuth = IEntity & {
  accountId: number
  accountHashId: string
  
  authorizationId: string
  payload: any

  accessToken: string
  refreshToken: string

  hasAuthorization(entity: Authorization, action: AuthorizationAction): boolean
  verifyAuthorization(entity: Authorization, action: AuthorizationAction, options?: AuthorizationVerificationOptions): void
}

export default class Auth extends Entity<AuthProperties> implements IAuth {

  get accountId() {
    return this.getProperty("accountId")
  }

  get accountHashId() {
    const accountService = Container.get(AccountServiceToken)
    return accountService.obfuscateAccountId(this.accountId)
  }

  get authorizationId() {
    return this.getProperty("authorizationId") || 0
  }

  get payload() {
    return {
      accountId: this.accountHashId,
      authorizationId: this.authorizationId
    }
  }

  get accessToken() {
    const authService = Container.get(AuthServiceToken)

    return authService.getJwtToken({
      ...this.payload,
      typ: AuthenticationTokenType.ACCESS,
    })
  }

  get refreshToken() {
    const authService = Container.get(AuthServiceToken)

    return authService.getJwtToken({
      ...this.payload,
      typ: AuthenticationTokenType.REFRESH,
    })
  }

  hasAuthorization(entity: Authorization, action: AuthorizationAction) {
    let authorizationId = this.authorizationId
    if (authorizationId == AuthorizationAdminId) return true

    authorizationId = authorizationId?.toString().split("").reverse()
    const entityId = ~~(authorizationId[entity] || 0)

    return Boolean(entityId & action)
  }

  verifyAuthorization(entity: Authorization, action: AuthorizationAction, options?: AuthorizationVerificationOptions) {
    const {
      code = HttpStatusCode.FORBIDDEN,
      message = ErrorMessage.AUTH_INSUFFICIENT_PERMISSION
    } = options || {}

    if (!this.hasAuthorization(entity, action)) throw new HttpRouterError(code, message)
  }

}