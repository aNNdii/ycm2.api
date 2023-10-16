import { loadFont } from "svg-captcha"
const svgCaptcha = require("svg-captcha")

import { Container, Token } from "../infrastructures/Container"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"
import { ErrorMessage } from "../interfaces/ErrorMessage"

import { HttpRouterError }  from "../entities/HttpRouterError"

import { Service, IService, ServiceOptions } from "./Service"
import { TokenServiceToken, TokenType } from "./TokenService"

export const CaptchaServiceToken = new Token<ICaptchaService>("CaptchaService")

export enum CaptchaType {
  ACCOUNT_USERNAME_RECOVERY = 1,
  ACCOUNT_PASSWORD_RECOVERY,
}

export type CaptchaTokenCreateOptions = {
  type: CaptchaType
  value: number
}

export type CaptchaTokenVerificationOptions = {
  token: string, 
  type: CaptchaType, 
  value: number | string, 
}

export type CaptchaImageCreateOptions = {
  value: number

  fontSize?: number
  inverse?: number
  height?: number
  width?: number
  color?: number
  noise?: number
}

export type CaptchaServiceOptions = ServiceOptions & {
  length: number
  
  tokenObfuscationSalt: string
  tokenTtl: number

  imageFont?: string
  imageFontSize: number
  imageColors: number
  imageNoises: number
  imageWidth: number
  imageHeight: number
  imageInverse: boolean
}

export type ICaptchaService = IService & {
  createCaptchaValue(): Promise<number>
  createCaptchaImage(options: CaptchaImageCreateOptions): Promise<string>
  createCaptchaToken(options: CaptchaTokenCreateOptions): Promise<string>

  verifyCaptchaToken(options: CaptchaTokenVerificationOptions): Promise<boolean>
}

export class CaptchaService extends Service<CaptchaServiceOptions> implements ICaptchaService {

  constructor(options: CaptchaServiceOptions) {
    super(options)
    options.imageFont && loadFont(options.imageFont)
  }

  async createCaptchaValue() {
    this.log("createCaptchaValue")

    const minValue = Math.pow(10, this.options.length - 1)
    const maxValue = Math.pow(10, this.options.length)

    const value = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
    return value
  }

  async createCaptchaToken(options: CaptchaTokenCreateOptions) {
    const {
      type,
      value, 
    } = options

    this.log("createCaptchaToken", { type, value })

    const tokenService = Container.get(TokenServiceToken)
    return tokenService.createToken({
      obfuscationSalt: this.options.tokenObfuscationSalt,
      ttl: this.options.tokenTtl,

      type: TokenType.CAPTCHA,
      values: [ type, value ],
    })
  }

  async createCaptchaImage(options: CaptchaImageCreateOptions) {
    const {
      value,

      fontSize = this.options.imageFontSize,
      inverse = this.options.imageInverse,
      height = this.options.imageHeight,
      width = this.options.imageWidth,
      color = this.options.imageColors,
      noise = this.options.imageNoises,
    } = options

    this.log("createCaptchaImage", options)

    return svgCaptcha(value.toString(), {
      fontSize,
      inverse,
      color,
      noise,
      height,
      width,
    })
  }

  async verifyCaptchaToken(options: CaptchaTokenVerificationOptions) {
    const {
      type, 
      value,
      token, 
    } = options

    this.log("verifyCaptcha", { token, type, value })

    const tokenService = Container.get(TokenServiceToken)
    const [tokenType, tokenTimestamp, tokenCaptchaType, tokenCaptchaValue] = await tokenService.verifyToken({
      obfuscationSalt: this.options.tokenObfuscationSalt,
      ttl: this.options.tokenTtl,
      
      type: TokenType.CAPTCHA,
      token: token,

      errorMessageTokenInvalid: ErrorMessage.CAPTCHA_TOKEN_INVALID,
      errorMessageTokenTypeInvalid: ErrorMessage.CAPTCHA_TOKEN_INVALID,
      errorMessageTokenExpired: ErrorMessage.CAPTCHA_TOKEN_EXPIRED,
    })

    if (!tokenCaptchaValue || tokenCaptchaValue.toString().length !== this.options.length) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_VALUE_INVALID)
    
    if (tokenCaptchaType != type) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_TOKEN_INVALID)
    if (tokenCaptchaValue != value) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_VALUE_INVALID)

    return true
  }

}