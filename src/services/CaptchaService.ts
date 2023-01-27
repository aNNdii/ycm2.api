const svgCaptcha = require("svg-captcha")

import Container, { Token } from "../infrastructures/Container"

import { HttpStatusCode } from "../interfaces/HttpStatusCode"
import { ErrorMessage } from "../interfaces/ErrorMessage"

import HttpRouterError from "../entities/HttpRouterError"
import Captcha, { ICaptcha } from "../entities/Captcha"

import { ObfuscationServiceToken } from "./ObfuscationService"
import Service, { IService, ServiceOptions } from "./Service"

export const CaptchaServiceToken = new Token<ICaptchaService>("Captcha")

export type CaptchaServiceOptions = ServiceOptions & {
  tokenSecret: string
  tokenMinLength: number
  tokenTtl: number
  imageColors: number
  imageNoises: number
  length: number
}

export type ICaptchaService = IService & {
  createCaptcha(): ICaptcha
  createCaptchaToken(value: any): string
  createCaptchaImage(value: any): string
  verifyCaptcha(token: string, value: any): boolean
}

export default class CaptchaService extends Service<CaptchaServiceOptions> implements ICaptchaService {

  createCaptcha() {
    this.log("createCaptcha", {})

    const minValue = Math.pow(10, this.options.length - 1)
    const maxValue = Math.pow(10, this.options.length)

    const value = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
    return new Captcha({ value })
  }

  createCaptchaToken(value: any) {
    this.log("createCaptchaToken", { value })

    const timestamp = Math.floor(new Date().getTime() / 1000)

    const obfuscationService = Container.get(ObfuscationServiceToken)
    return obfuscationService.obfuscate([timestamp, value], {
      minLength: this.options.tokenMinLength,
      salt: this.options.tokenSecret
    })
  }

  createCaptchaImage(value: any) {
    this.log("createCaptchaImage", { value })

    return svgCaptcha(value.toString(), {
      color: this.options.imageColors,
      noise: this.options.imageNoises,
    })
  }

  verifyCaptcha(token: string, value: any) {
    this.log("verifyCaptcha", { token, value })

    if (!value || value.length !== this.options.length) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_VALUE_INVALID)
    if (!token || token.length !== this.options.tokenMinLength) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_TOKEN_INVALID)

    const obfuscationService = Container.get(ObfuscationServiceToken)
    const [tokenTimestamp, tokenValue] = obfuscationService.deobfuscate(token, {
      minLength: this.options.tokenMinLength,
      salt: this.options.tokenSecret
    })

    if (!tokenTimestamp || !tokenValue) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_TOKEN_INVALID)

    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    if (tokenTimestamp + this.options.tokenTtl < currentTimestamp) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_TOKEN_EXPIRED)

    if (tokenValue != value) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_VALUE_INVALID)

    return true
  }

}