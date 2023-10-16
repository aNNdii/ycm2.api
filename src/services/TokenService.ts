import { Container, Token } from "../infrastructures/Container";

import { getCurrentTimestamp } from "../helpers/Date";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import { HttpRouterError }  from "../entities/HttpRouterError";

import { ObfuscationServiceToken } from "./ObfuscationService";

import { Service, IService, ServiceOptions } from "./Service";

export const TokenServiceToken = new Token<ITokenService>("TokenService")

export enum TokenType {
  UNKNOWN,
  CAPTCHA,
  ACCOUNT_PASSWORD_RECOVERY,
}

export type TokenOptions = {
  type?: TokenType,
  obfuscationSalt?: string
  minLength?: number
  ttl?: number
}

export type TokenCreateOptions = TokenOptions & {
  values: number[]
}

export type TokenVerifyOptions = TokenOptions & {
  token: string

  errorCodeTokenInvalid?: number
  errorMessageTokenInvalid?: string

  errorCodeTokenTypeInvalid?: number
  errorMessageTokenTypeInvalid?: string
  
  errorCodeTokenExpired?: number
  errorMessageTokenExpired?: string
}

export type TokenServiceOptions = ServiceOptions & {
  minLength: number
  ttl: number
  
  obfuscationSalt: string
}

export type ITokenService = IService & {
  createToken(options: TokenCreateOptions): Promise<string>
  verifyToken(options: TokenVerifyOptions): Promise<number[]>
}

export class TokenService extends Service<TokenServiceOptions> implements ITokenService {

  async createToken(options: TokenCreateOptions) {
    const {
      values = [],

      type = TokenType.UNKNOWN, 
      obfuscationSalt = this.options.obfuscationSalt,
      minLength = this.options.minLength,
      ttl = this.options.ttl
    } = options || {}

    this.log("createToken", { values, type, obfuscationSalt, minLength, ttl })

    const timestamp = getCurrentTimestamp()

    const obfuscationService = Container.get(ObfuscationServiceToken)
    const token = obfuscationService.obfuscate([type, timestamp, ...values], {
      minLength: minLength,
      salt: obfuscationSalt
    })

    // TODO: Put token into redis cache

    return token
  }

  async verifyToken(options: TokenVerifyOptions) {
    const {
      token, 

      type = TokenType.UNKNOWN,
      obfuscationSalt = this.options.obfuscationSalt,
      minLength = this.options.minLength,
      ttl = this.options.ttl,

      errorCodeTokenInvalid = HttpStatusCode.BAD_REQUEST,
      errorMessageTokenInvalid = ErrorMessage.TOKEN_INVALID,

      errorCodeTokenTypeInvalid = HttpStatusCode.BAD_REQUEST,
      errorMessageTokenTypeInvalid = ErrorMessage.TOKEN_INVALID,
      
      errorCodeTokenExpired = HttpStatusCode.BAD_REQUEST,
      errorMessageTokenExpired = ErrorMessage.TOKEN_EXPIRED,
    } = options 

    this.log("verifyToken", { token, type, obfuscationSalt, minLength, ttl })

    if (!token || token.length !== minLength) throw new HttpRouterError(errorCodeTokenInvalid, errorMessageTokenInvalid)
    const obfuscationService = Container.get(ObfuscationServiceToken)
    const [tokenType, tokenTimestamp, ...tokenValues] = obfuscationService.deobfuscate(token, {
      minLength: minLength,
      salt: obfuscationSalt
    })

    if (tokenType !== type) throw new HttpRouterError(errorCodeTokenTypeInvalid, errorMessageTokenTypeInvalid)
    
    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    if (tokenTimestamp + ttl < currentTimestamp) throw new HttpRouterError(errorCodeTokenExpired, errorMessageTokenExpired)

    // TODO: Check if token is in redis cache and remove

    return [tokenType, tokenTimestamp, ...tokenValues]
  }

  async deleteToken(options: any) {
    const { token } = options

    // TODO: Delete token from redis cache
  }

}