import jwt, { Algorithm } from "jsonwebtoken";

import { Container, Token } from "../infrastructures/Container";
import { AuthenticationTokenType } from "../interfaces/Auth";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import { HttpRouterError }  from "../entities/HttpRouterError";
import { Auth, IAuth } from "../entities/Auth";
import { IAccount } from "../entities/Account";

import { AccountServiceToken } from "./AccountService";
import { Service, IService, ServiceOptions } from "./Service";

export const AuthServiceToken = new Token<IAuthService>("AuthService")

export type AuthTokenOptions = {
  types?: AuthenticationTokenType[]
}

export type AuthServiceOptions = ServiceOptions & {
  jwtAlgorithm: string
  jwtSecret: string
  jwtTtl: number
}

export type IAuthService = IService & {
  getJsonWebToken(payload: any): string
  getJsonWebTokenPayload(token: string): any

  getAuthByAccount(account: IAccount): Promise<IAuth>
  getAuthByToken(token: string, options?: AuthTokenOptions): IAuth
}

export class AuthService extends Service<AuthServiceOptions> implements IAuthService {

  getJsonWebToken(payload: any) {
    return jwt.sign(payload, this.options.jwtSecret, {
      algorithm: this.options.jwtAlgorithm as Algorithm,
      expiresIn: this.options.jwtTtl,
    })
  }

  getJsonWebTokenPayload(token: string) {
    let payload = null

    try {
      payload = jwt.verify(token, this.options.jwtSecret, {
        algorithms: [this.options.jwtAlgorithm] as Algorithm[]
      })
    } catch (e) {
      throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_TOKEN_INVALID)
    }

    return payload as any
  }

  async getAuthByAccount(account: IAccount) {
    const accountService = Container.get(AccountServiceToken)
    
    // const authorizations = await accountService.getAccountGroupAuthorizations({ accountId: account.id })

    return new Auth({
      accountId: account.id,
      // authorizations: authorizations?.map(authorization => authorization.authorizationId)
    })
  }

  getAuthByToken(token: string, options?: AuthTokenOptions) {
    const {
      types = [AuthenticationTokenType.ACCESS, AuthenticationTokenType.REFRESH]
    } = options || {}

    const accountService = Container.get(AccountServiceToken)

    const payload = this.getJsonWebTokenPayload(token)
    if (!types.includes(payload.typ)) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.AUTH_TOKEN_INVALID)

    const [accountId] = accountService.deobfuscateAccountId(payload.accountId)

    return new Auth({
      accountId: accountId,
    })
  }

}