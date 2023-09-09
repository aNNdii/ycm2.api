import Container from "../infrastructures/Container";
import { AuthenticationTokenType, Authorization } from "../interfaces/Auth";
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
  authorizations?: Authorization[]
}

export type IAuth = IEntity & {
  accountId: number
  accountHashId: string
  
  authorizations: Authorization[]

  accessToken: string
  refreshToken: string

  hasAuthorization(authorization: Authorization | Authorization[]): boolean
  verifyAuthorization(authorization: Authorization | Authorization[], options?: AuthorizationVerificationOptions): void
}

export default class Auth extends Entity<AuthProperties> implements IAuth {

  get accountId() {
    return this.getProperty("accountId")
  }

  get accountHashId() {
    const accountService = Container.get(AccountServiceToken)
    return accountService.obfuscateAccountId(this.accountId)
  }

  get authorizations() {
    return this.getProperty("authorizations") || []
  }

  get accessToken() {
    const authService = Container.get(AuthServiceToken)

    return authService.getJsonWebToken({
      typ: AuthenticationTokenType.ACCESS,
      accountId: this.accountHashId,
    })
  }

  get refreshToken() {
    const authService = Container.get(AuthServiceToken)

    return authService.getJsonWebToken({
      typ: AuthenticationTokenType.REFRESH,
      accountId: this.accountHashId,
    })
  }

  hasAuthorization(authorization: Authorization | Authorization[]) {
    return true 

    // let authorizationId = this.authorizationId
    // if (authorizationId == AuthorizationAdminId) return true

    // let hasAuthorization = false
    // authorization = [authorization].flat()
    
    // authorization.map(authorization => {
    //   const offset = Math.floor(authorization / 8)
    //   const index = authorization % 8

    //   const authorizationOffset = this.authorizationId[offset] || 0

    //   hasAuthorization = this.authorizationId
    // })

    // authorizationId = authorizationId?.toString().split("").reverse()
    // const entityId = ~~(authorizationId[entity] || 0)

    // return Boolean(entityId & action)
  }

  verifyAuthorization(authorization: Authorization | Authorization[], options?: AuthorizationVerificationOptions) {
    const {
      code = HttpStatusCode.FORBIDDEN,
      message = ErrorMessage.AUTH_INSUFFICIENT_PERMISSION
    } = options || {}

    if (!this.hasAuthorization(authorization)) throw new HttpRouterError(code, message)
  }

}